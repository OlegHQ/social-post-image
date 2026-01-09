import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { streamOpenRouter, parseLLMResponse } from '@/lib/openrouter';
import {
  templateSpecs,
  themeReference,
  validateConfig,
  getTemplateIds,
} from '@/schemas/templateSpecs';

// Rate limiting delay between API calls (Groq free tier: 8000 TPM)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const RATE_LIMIT_DELAY_MS = 5000; // 5 seconds between calls to stay within Groq's rate limits

interface GenerateRequest {
  postText: string;
  selectedTemplates: string[];
  preferences?: {
    author?: string;
  };
}

/**
 * Build system prompt for a single template
 */
function buildSingleTemplateSystemPrompt(templateId: string): string {
  const spec = templateSpecs[templateId];
  if (!spec) {
    throw new Error(`Unknown template: ${templateId}`);
  }

  const fields: Record<string, { required: boolean; maxChars?: number; type?: string; description: string }> = {};
  for (const [key, guide] of Object.entries(spec.fieldGuides)) {
    fields[key] = {
      required: guide.required || false,
      ...(guide.maxChars && { maxChars: guide.maxChars }),
      ...(guide.type && { type: guide.type }),
      description: guide.description,
    };
  }

  const templateSpec = {
    id: templateId,
    description: spec.description,
    bestFor: spec.bestFor,
    fields,
    example: spec.exampleConfig,
  };

  const themeSummaries = Object.entries(themeReference)
    .map(([id, info]) => `${id}: ${info.mood}`)
    .join(', ');

  return `You are an expert Swiss design assistant. Create a LinkedIn post illustration using the "${templateId}" template.

TEMPLATE SPECIFICATION:
${JSON.stringify(templateSpec, null, 2)}

AVAILABLE THEMES: ${themeSummaries}

TASK: Generate ONE design configuration for this template. Extract content DIRECTLY from the provided post.

OUTPUT (JSON only):
{
  "templateId": "${templateId}",
  "theme": "theme-id-here",
  "config": { /* all required fields */ },
  "reasoning": "Brief explanation of design choices"
}

RULES:
- Include ALL required fields for this template
- Pick the most appropriate theme for the content
- Extract headlines/quotes from the ACTUAL post content
- For vignelli-quote: emphasisPhrase MUST be exact substring of quote
- Use \\n for line breaks in headlines
- Content must reflect the post's actual topic - DO NOT invent unrelated content
- Focus on quality over speed - make this design excellent`;
}

/**
 * Build user prompt for a single template
 */
function buildSingleTemplateUserPrompt(postText: string, templateId: string, author?: string): string {
  let prompt = `POST CONTENT:
"""
${postText}
"""

Generate a "${templateId}" design that captures the essence of this post.
Extract key phrases and insights directly from the text above.
`;

  if (author) {
    prompt += `Author: ${author}\n`;
  }

  prompt += '\nRespond with JSON only:';

  return prompt;
}

export async function POST(request: NextRequest) {
  // 1. Authenticate
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', code: 'AUTH_ERROR' },
      { status: 401 }
    );
  }

  // 2. Parse and validate input
  let body: GenerateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  const { postText, selectedTemplates, preferences } = body;

  if (!postText || typeof postText !== 'string') {
    return NextResponse.json(
      { success: false, error: 'postText is required', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  if (postText.length < 50) {
    return NextResponse.json(
      {
        success: false,
        error: 'Post text must be at least 50 characters',
        code: 'INVALID_INPUT',
      },
      { status: 400 }
    );
  }

  if (postText.length > 3000) {
    return NextResponse.json(
      {
        success: false,
        error: 'Post text must be less than 3000 characters',
        code: 'INVALID_INPUT',
      },
      { status: 400 }
    );
  }

  // Validate selectedTemplates
  if (!selectedTemplates || !Array.isArray(selectedTemplates) || selectedTemplates.length === 0) {
    return NextResponse.json(
      { success: false, error: 'At least one template must be selected', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  const validTemplateIds = getTemplateIds();
  const invalidTemplates = selectedTemplates.filter((id) => !validTemplateIds.includes(id));
  if (invalidTemplates.length > 0) {
    return NextResponse.json(
      { success: false, error: `Invalid template IDs: ${invalidTemplates.join(', ')}`, code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  // 3. Create SSE stream with per-template LLM calls
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const validatedVariants: Array<{ templateId: string; theme: string; config: Record<string, unknown>; reasoning: string }> = [];
      const errors: string[] = [];

      try {
        // Send start event
        sendEvent('start', { message: 'Starting generation...', total: selectedTemplates.length });

        // Generate each template sequentially for better quality
        for (let i = 0; i < selectedTemplates.length; i++) {
          const templateId = selectedTemplates[i];

          sendEvent('progress', {
            message: `Generating ${templateId}...`,
            current: i + 1,
            total: selectedTemplates.length,
          });

          try {
            // Build prompts for this specific template
            const systemPrompt = buildSingleTemplateSystemPrompt(templateId);
            const userPrompt = buildSingleTemplateUserPrompt(postText, templateId, preferences?.author);

            // Stream LLM response for this template
            let fullContent = '';
            for await (const chunk of streamOpenRouter(systemPrompt, userPrompt)) {
              fullContent += chunk;
            }

            // Parse single variant response
            const variant = parseLLMResponse(fullContent);

            // Verify templateId matches
            if (variant.templateId !== templateId) {
              variant.templateId = templateId;
            }

            // Validate config
            const validation = validateConfig(templateId, variant.config);
            if (!validation.valid) {
              errors.push(`${templateId}: ${validation.errors.join(', ')}`);
              continue;
            }

            validatedVariants.push(variant);

            // Send validated variant immediately
            sendEvent('variant', { index: i, variant });
          } catch (templateError) {
            const errorMsg = templateError instanceof Error ? templateError.message : 'Unknown error';
            errors.push(`${templateId}: ${errorMsg}`);
            console.error(`Error generating ${templateId}:`, templateError);
            // Continue with other templates
          }

          // Rate limiting: wait before next API call to avoid hitting Groq's TPM limit
          if (i < selectedTemplates.length - 1) {
            await delay(RATE_LIMIT_DELAY_MS);
          }
        }

        // Send completion
        if (validatedVariants.length === 0) {
          sendEvent('error', {
            error: `All variants failed: ${errors.join('; ')}`,
            code: 'VALIDATION_ERROR',
          });
        } else {
          sendEvent('complete', {
            success: true,
            variants: validatedVariants,
            errors: errors.length > 0 ? errors : undefined,
          });
        }
      } catch (error) {
        console.error('Generate API error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error occurred';

        let errorCode = 'LLM_ERROR';
        let errorMessage = message;

        if (message.includes('LLM_API_KEY')) {
          errorMessage = 'AI service not configured';
        } else if (message.includes('OpenRouter')) {
          errorMessage = 'AI service temporarily unavailable. Please try again.';
        } else if (message.includes('parse') || message.includes('JSON')) {
          errorCode = 'VALIDATION_ERROR';
          errorMessage = 'Failed to generate valid configuration. Please try again.';
        }

        sendEvent('error', { error: errorMessage, code: errorCode });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
