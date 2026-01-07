/**
 * Groq API Client
 *
 * Handles communication with Groq API for LLM-powered illustration generation.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

interface OpenRouterChoice {
	message: {
		content: string;
	};
}

interface OpenRouterResponse {
	choices: OpenRouterChoice[];
	error?: {
		message: string;
		code?: string;
	};
}

export interface GenerateResult {
	templateId: string;
	theme: string;
	config: Record<string, unknown>;
	reasoning: string;
}

/**
 * Call Groq API with system and user prompts
 */
export async function callOpenRouter(
	systemPrompt: string,
	userPrompt: string
): Promise<string> {
	const apiKey = process.env.LLM_API_KEY;
	if (!apiKey) {
		throw new Error('LLM_API_KEY environment variable not set');
	}

	const messages: ChatMessage[] = [
		{ role: 'system', content: systemPrompt },
		{ role: 'user', content: userPrompt },
	];

	const response = await fetch(GROQ_API_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model: MODEL,
			messages,
			max_tokens: 4000,
			temperature: 0.4,
		}),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			`Groq API error: ${errorData.error?.message || response.statusText}`
		);
	}

	const data: OpenRouterResponse = await response.json();

	if (data.error) {
		throw new Error(`Groq API error: ${data.error.message}`);
	}

	if (!data.choices?.[0]?.message?.content) {
		throw new Error('No response content from Groq API');
	}

	return data.choices[0].message.content;
}

/**
 * Stream response from Groq API
 * Yields chunks of text as they arrive
 */
export async function* streamOpenRouter(
	systemPrompt: string,
	userPrompt: string
): AsyncGenerator<string, void, unknown> {
	const apiKey = process.env.LLM_API_KEY;
	if (!apiKey) {
		throw new Error('LLM_API_KEY environment variable not set');
	}

	const messages: ChatMessage[] = [
		{ role: 'system', content: systemPrompt },
		{ role: 'user', content: userPrompt },
	];

	const response = await fetch(GROQ_API_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model: MODEL,
			messages,
			max_tokens: 4000,
			temperature: 0.4,
			stream: true,
		}),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			`Groq API error: ${errorData.error?.message || response.statusText}`
		);
	}

	if (!response.body) {
		throw new Error('No response body for streaming');
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value, { stream: true });
			const lines = chunk.split('\n');

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = line.slice(6);
					if (data === '[DONE]') continue;

					try {
						const parsed = JSON.parse(data);
						const content = parsed.choices?.[0]?.delta?.content;
						if (content) {
							yield content;
						}
					} catch {
						// Skip malformed JSON chunks
					}
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}

/**
 * Parse LLM response to extract JSON
 */
export function parseLLMResponse(content: string): GenerateResult {
	// Try to extract JSON from the response
	// The LLM might wrap it in markdown code blocks
	let jsonStr = content;

	// Remove markdown code blocks if present
	const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
	if (jsonMatch) {
		jsonStr = jsonMatch[1].trim();
	}

	// Try to find JSON object in the response
	const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
	if (objectMatch) {
		jsonStr = objectMatch[0];
	}

	try {
		const parsed = JSON.parse(jsonStr);

		// Validate required fields
		if (!parsed.templateId || typeof parsed.templateId !== 'string') {
			throw new Error('Missing or invalid templateId');
		}
		if (!parsed.theme || typeof parsed.theme !== 'string') {
			throw new Error('Missing or invalid theme');
		}
		if (!parsed.config || typeof parsed.config !== 'object') {
			throw new Error('Missing or invalid config');
		}

		return {
			templateId: parsed.templateId,
			theme: parsed.theme,
			config: parsed.config,
			reasoning: parsed.reasoning || 'No reasoning provided',
		};
	} catch (e) {
		throw new Error(
			`Failed to parse LLM response as JSON: ${e instanceof Error ? e.message : 'Unknown error'}`
		);
	}
}

/**
 * Parse LLM response to extract multiple variants
 */
export function parseLLMVariants(content: string): GenerateResult[] {
	// Try to extract JSON from the response
	let jsonStr = content;

	// Remove markdown code blocks if present
	const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
	if (jsonMatch) {
		jsonStr = jsonMatch[1].trim();
	}

	// Try to find JSON object in the response
	const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
	if (objectMatch) {
		jsonStr = objectMatch[0];
	}

	try {
		const parsed = JSON.parse(jsonStr);

		// Handle both { variants: [...] } and direct array
		const variantsArray = parsed.variants || parsed;

		if (!Array.isArray(variantsArray)) {
			throw new Error('Expected variants array');
		}

		if (variantsArray.length < 1) {
			throw new Error('No variants in response');
		}

		// Validate and map each variant
		const results: GenerateResult[] = variantsArray.map((variant: unknown, index: number) => {
			const v = variant as Record<string, unknown>;

			if (!v.templateId || typeof v.templateId !== 'string') {
				throw new Error(`Variant ${index + 1}: Missing or invalid templateId`);
			}
			if (!v.theme || typeof v.theme !== 'string') {
				throw new Error(`Variant ${index + 1}: Missing or invalid theme`);
			}
			if (!v.config || typeof v.config !== 'object') {
				throw new Error(`Variant ${index + 1}: Missing or invalid config`);
			}

			return {
				templateId: v.templateId,
				theme: v.theme,
				config: v.config as Record<string, unknown>,
				reasoning: (v.reasoning as string) || `Variant ${index + 1}`,
			};
		});

		return results;
	} catch (e) {
		throw new Error(
			`Failed to parse LLM variants: ${e instanceof Error ? e.message : 'Unknown error'}`
		);
	}
}

