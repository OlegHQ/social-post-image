/**
 * Groq API Client
 *
 * Handles communication with Groq API for LLM-powered illustration generation.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryableStatus(status: number) {
  return status === 429 || status === 503 || status === 502 || status === 504;
}

function jitter(ms: number) {
  const factor = 0.2;
  const delta = ms * factor * (Math.random() * 2 - 1);
  return Math.max(0, Math.floor(ms + delta));
}

function parseRetryAfterMs(headers: Headers): number | null {
  const ra = headers.get('retry-after');
  if (!ra) return null;
  const asNum = Number(ra);
  if (Number.isFinite(asNum)) return Math.max(0, Math.floor(asNum * 1000));
  const asDate = Date.parse(ra);
  if (!Number.isFinite(asDate)) return null;
  return Math.max(0, asDate - Date.now());
}

async function fetchWithBackoff(
  input: RequestInfo,
  init: RequestInit,
  opts?: {
    maxAttempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    onRetry?: (info: { attempt: number; delayMs: number; status?: number; message: string }) => void;
  }
): Promise<Response> {
  const maxAttempts = opts?.maxAttempts ?? 6;
  const baseDelayMs = opts?.baseDelayMs ?? 800;
  const maxDelayMs = opts?.maxDelayMs ?? 12000;

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    attempt += 1;
    const res = await fetch(input, init);
    if (res.ok) return res;

    const retryAfter = parseRetryAfterMs(res.headers);
    const isRetryable = isRetryableStatus(res.status);

    let message = res.statusText;
    try {
      const errorData = await res.clone().json();
      message = errorData?.error?.message || errorData?.message || message;
    } catch {
      // ignore
    }

    if (!isRetryable || attempt >= maxAttempts) {
      throw new Error(`Groq API error (${res.status}): ${message}`);
    }

    const exp = Math.min(maxDelayMs, Math.floor(baseDelayMs * 2 ** (attempt - 1)));
    const delayMs = jitter(retryAfter ?? exp);
    opts?.onRetry?.({ attempt, delayMs, status: res.status, message });
    await sleep(delayMs);
  }
}

interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface GenerateResult {
	templateId: string;
	theme: string;
	config: Record<string, unknown>;
	reasoning: string;
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

	const response = await fetchWithBackoff(
		GROQ_API_URL,
		{
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
		},
		{ maxAttempts: 6 }
	);

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

export async function* streamOpenRouterWithRetry(
	systemPrompt: string,
	userPrompt: string,
	opts?: {
		maxAttempts?: number;
		onRetry?: (info: { attempt: number; delayMs: number; message: string }) => void;
	}
): AsyncGenerator<string, void, unknown> {
	const maxAttempts = opts?.maxAttempts ?? 6;
	let attempt = 0;

	while (attempt < maxAttempts) {
		attempt += 1;
		try {
			for await (const chunk of streamOpenRouter(systemPrompt, userPrompt)) {
				yield chunk;
			}
			return;
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unknown error';
			const looksRateLimited = msg.includes('(429)') || msg.toLowerCase().includes('rate');
			if (!looksRateLimited || attempt >= maxAttempts) {
				throw e;
			}
			const delayMs = jitter(Math.min(12000, 800 * 2 ** (attempt - 1)));
			opts?.onRetry?.({ attempt, delayMs, message: msg });
			await sleep(delayMs);
		}
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

