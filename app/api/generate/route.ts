import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { streamOpenRouter, parseLLMVariants } from '@/lib/openrouter';
import {
  templateSpecs,
  themeReference,
  validateConfig,
  getTemplateIds,
} from '@/schemas/templateSpecs';

interface GenerateRequest {
  postText: string;
  selectedTemplates: string[];
  preferences?: {
    author?: string;
  };
}

/**
 * Build system prompt for selected templates
 */
function buildSystemPrompt(selectedTemplates: string[]): string {
  // Build compact JSON specs for each selected template
  const templateJsonSpecs = selectedTemplates
    .filter((id) => templateSpecs[id])
    .map((id) => {
      const spec = templateSpecs[id];
      const fields: Record<string, { required: boolean; maxChars?: number; type?: string; description: string }> = {};

      for (const [key, guide] of Object.entries(spec.fieldGuides)) {
        fields[key] = {
          required: guide.required || false,
          ...(guide.maxChars && { maxChars: guide.maxChars }),
          ...(guide.type && { type: guide.type }),
          description: guide.description,
        };
      }

      return {
        id,
        description: spec.description,
        bestFor: spec.bestFor.slice(0, 2),
        fields,
        example: spec.exampleConfig,
      };
    });

  const themeSummaries = Object.entries(themeReference)
    .map(([id, info]) => `${id}: ${info.mood}`)
    .join(', ');

  const variantCount = templateJsonSpecs.length;

  return `You are an expert Swiss design assistant. Create LinkedIn post illustrations.

TEMPLATES (JSON spec):
${JSON.stringify(templateJsonSpecs, null, 2)}

THEMES: ${themeSummaries}

TASK: Generate ${variantCount} design${variantCount !== 1 ? 's' : ''}, one for each template listed above. Extract content DIRECTLY from the post.

OUTPUT (JSON only):
{
  "variants": [
${templateJsonSpecs.map((t) => `    { "templateId": "${t.id}", "theme": "...", "config": {...}, "reasoning": "..." }`).join(',\n')}
  ]
}

RULES:
- Generate exactly ONE design per template listed above
- Include ALL required fields for each template
- Pick the most appropriate theme for each template
- Extract headlines/quotes from the ACTUAL post content
- For vignelli-quote: emphasisPhrase MUST be exact substring of quote
- Use \\n for line breaks in headlines
- Content must reflect the post's actual topic - DO NOT invent unrelated content`;
}

/**
 * Build user prompt with post content and preferences
 */
function buildUserPrompt(postText: string, selectedTemplates: string[], author?: string): string {
  let prompt = `POST CONTENT:
"""
${postText}
"""

IMPORTANT: Generate content that reflects THIS post's actual topic and message.
Extract key phrases and insights directly from the text above.
`;

  if (author) {
    prompt += `Author: ${author}\n`;
  }

  prompt += `\nGenerate ${selectedTemplates.length} design${selectedTemplates.length !== 1 ? 's' : ''} as JSON:`;

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

  // 3. Build prompts
  const systemPrompt = buildSystemPrompt(selectedTemplates);
  const userPrompt = buildUserPrompt(postText, selectedTemplates, preferences?.author);

  // 4. Create SSE stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Send start event
        sendEvent('start', { message: 'Starting generation...', total: selectedTemplates.length });

        // Stream LLM response
        let fullContent = '';
        let chunkCount = 0;

        for await (const chunk of streamOpenRouter(systemPrompt, userPrompt)) {
          fullContent += chunk;
          chunkCount++;

          // Send progress every 5 chunks to reduce overhead
          if (chunkCount % 5 === 0) {
            sendEvent('progress', {
              message: 'Generating designs...',
              chars: fullContent.length
            });
          }
        }

        // Parse complete response
        sendEvent('progress', { message: 'Parsing response...' });

        const variants = parseLLMVariants(fullContent);

        // Validate each variant
        const validatedVariants = [];
        const errors: string[] = [];

        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i];

          // Check template was requested
          if (!selectedTemplates.includes(variant.templateId)) {
            errors.push(`Variant ${i + 1}: Template ${variant.templateId} was not requested`);
            continue;
          }

          // Validate config
          const validation = validateConfig(variant.templateId, variant.config);
          if (!validation.valid) {
            errors.push(`Variant ${i + 1}: ${validation.errors.join(', ')}`);
            continue;
          }

          validatedVariants.push(variant);

          // Send each validated variant immediately
          sendEvent('variant', { index: i, variant });
        }

        // Send completion
        if (validatedVariants.length === 0) {
          sendEvent('error', {
            error: `All variants invalid: ${errors.join('; ')}`,
            code: 'VALIDATION_ERROR'
          });
        } else {
          sendEvent('complete', {
            success: true,
            variants: validatedVariants,
            errors: errors.length > 0 ? errors : undefined
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
