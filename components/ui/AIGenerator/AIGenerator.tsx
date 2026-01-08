'use client';

import { useState, useRef, useCallback } from 'react';
import { useDesign } from '@/context/DesignContext';
import { getTemplateIds, templateSpecs } from '@/schemas/templateSpecs';
import { presetSchemas } from '@/schemas/presetSchemas';
import type { ThemePreset } from '@/lib/types';
import styles from './AIGenerator.module.css';

interface GenerateResult {
  templateId: string;
  theme: string;
  config: Record<string, unknown>;
  reasoning: string;
}

type GeneratorState = 'idle' | 'loading' | 'success' | 'error';

interface SavedState {
  activePreset: string | null;
  presetOptions: Record<string, unknown>;
  theme: ThemePreset;
}

const ALL_TEMPLATES = getTemplateIds();

/**
 * Get preview text from a variant config
 */
function getPreviewText(config: Record<string, unknown>): string {
  // Try common text fields in order of preference
  const textFields = ['headline', 'statement', 'quote', 'title', 'keyword', 'eventTitle', 'venueName'];

  for (const field of textFields) {
    if (config[field] && typeof config[field] === 'string') {
      const text = config[field] as string;
      // Replace line breaks with spaces for preview
      return text.replace(/\\n/g, ' ').slice(0, 50);
    }
  }

  return 'Preview';
}

/**
 * Format template ID for display
 */
function formatTemplateId(id: string): string {
  return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function AIGenerator() {
  const [postText, setPostText] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [generatorState, setGeneratorState] = useState<GeneratorState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<GenerateResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [progressMessage, setProgressMessage] = useState<string>('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const savedStateRef = useRef<SavedState | null>(null);
  const isPreviewingRef = useRef(false);

  const { state: designState, setPreset, updatePresetOptions, setTheme } = useDesign();

  // Handle hover preview - show template's default example in main canvas
  const handleTemplateHover = useCallback((templateId: string) => {
    // Don't preview during loading
    if (generatorState === 'loading') return;

    // Save current state if not already previewing
    if (!isPreviewingRef.current) {
      savedStateRef.current = {
        activePreset: designState.activePreset,
        presetOptions: { ...designState.presetOptions },
        theme: (designState.definition?.theme?.preset || 'swiss-red') as ThemePreset,
      };
      isPreviewingRef.current = true;
    }

    // Get the template's default config and theme
    const templateSpec = templateSpecs[templateId];
    const presetSchema = presetSchemas[templateId];

    if (presetSchema) {
      const defaultOptions = presetSchema.defaultOptions;
      const defaultTheme = (templateSpec?.exampleConfig?.theme || defaultOptions.theme || 'swiss-red') as ThemePreset;

      // Temporarily show the preview
      setPreset(templateId, defaultOptions);
      setTheme(defaultTheme);
    }
  }, [generatorState, designState.activePreset, designState.presetOptions, designState.definition?.theme?.preset, setPreset, setTheme]);

  const handleTemplateLeave = useCallback(() => {
    // Restore saved state
    if (isPreviewingRef.current && savedStateRef.current) {
      const { activePreset, presetOptions, theme } = savedStateRef.current;

      if (activePreset) {
        setPreset(activePreset, presetOptions);
        setTheme(theme);
      }

      savedStateRef.current = null;
      isPreviewingRef.current = false;
    }
  }, [setPreset, setTheme]);

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleGenerate = async () => {
    if (!postText.trim() || postText.length < 50) {
      setError('Please enter at least 50 characters');
      return;
    }

    if (selectedTemplates.length === 0) {
      setError('Please select at least one template');
      return;
    }

    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setGeneratorState('loading');
    setError(null);
    setVariants([]);
    setSelectedIndex(null);
    setProgressMessage('Starting generation...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postText,
          selectedTemplates,
          preferences: {},
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const receivedVariants: GenerateResult[] = [];
      let isDone = false;

      while (!isDone) {
        const { done, value } = await reader.read();
        if (done) {
          isDone = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          // Skip event type lines (we parse data directly)
          if (line.startsWith('event: ')) {
            continue;
          }
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);

              // Get event type from previous line (stored in closure)
              if (parsed.message) {
                setProgressMessage(parsed.message);
              }

              if (parsed.variant) {
                receivedVariants.push(parsed.variant);
                setVariants([...receivedVariants]);

                // Auto-select first variant when it arrives
                if (receivedVariants.length === 1) {
                  handleSelectVariant(0, receivedVariants);
                }
              }

              if (parsed.error) {
                throw new Error(parsed.error);
              }

              if (parsed.success) {
                setGeneratorState('success');
                setProgressMessage('');
              }
            } catch (e) {
              if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
                if (!e.message.includes('success')) {
                  throw e;
                }
              }
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer) {
        const lines = buffer.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.variant) {
                receivedVariants.push(parsed.variant);
                setVariants([...receivedVariants]);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch {
              // Ignore parse errors at end
            }
          }
        }
      }

      if (receivedVariants.length > 0) {
        setGeneratorState('success');
        setProgressMessage('');
      } else {
        throw new Error('No valid designs generated');
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled
      }
      setError(err instanceof Error ? err.message : 'Unknown error');
      setGeneratorState('error');
      setProgressMessage('');
    }
  };

  const handleSelectVariant = (index: number, variantsList?: GenerateResult[]) => {
    const list = variantsList || variants;
    const variant = list[index];
    if (!variant) return;

    setSelectedIndex(index);

    // Apply to design context
    setPreset(variant.templateId);
    updatePresetOptions(variant.config);
    setTheme(variant.theme as ThemePreset);
  };

  const handleClear = () => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPostText('');
    setSelectedTemplates([]);
    setGeneratorState('idle');
    setError(null);
    setVariants([]);
    setSelectedIndex(null);
    setProgressMessage('');
  };

  return (
    <div className={styles.generator}>
      <button
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <span className={styles.headerIcon}>AI</span>
        <span className={styles.headerText}>Generate from Post</span>
        <span className={styles.expandIcon}>{isExpanded ? '-' : '+'}</span>
      </button>

      {isExpanded && (
        <div className={styles.content}>
          <textarea
            className={styles.textarea}
            placeholder="Paste your LinkedIn post text here..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={4}
            disabled={generatorState === 'loading'}
          />

          <div className={styles.charCount}>
            {postText.length} / 3000 characters
            {postText.length > 0 && postText.length < 50 && (
              <span className={styles.charWarning}> (min 50)</span>
            )}
          </div>

          <div className={styles.templateSelector}>
            <div className={styles.templateLabel}>
              Select templates ({selectedTemplates.length} selected)
            </div>
            <div
              className={styles.templateGrid}
              onMouseLeave={handleTemplateLeave}
            >
              {ALL_TEMPLATES.map((templateId) => (
                <button
                  key={templateId}
                  type="button"
                  className={`${styles.templateChip} ${selectedTemplates.includes(templateId) ? styles.templateChipSelected : ''}`}
                  onClick={() => toggleTemplate(templateId)}
                  onMouseEnter={() => handleTemplateHover(templateId)}
                  disabled={generatorState === 'loading'}
                  title={templateSpecs[templateId]?.description || ''}
                >
                  {formatTemplateId(templateId)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.generateButton}
              onClick={handleGenerate}
              disabled={generatorState === 'loading' || postText.length < 50 || selectedTemplates.length === 0}
              type="button"
            >
              {generatorState === 'loading' ? (
                <>
                  <span className={styles.spinner} />
                  {progressMessage || `Generating ${selectedTemplates.length} design${selectedTemplates.length !== 1 ? 's' : ''}...`}
                </>
              ) : (
                `Generate ${selectedTemplates.length || 0} Design${selectedTemplates.length !== 1 ? 's' : ''}`
              )}
            </button>

            {(postText || variants.length > 0 || selectedTemplates.length > 0) && (
              <button
                className={styles.clearButton}
                onClick={handleClear}
                type="button"
              >
                Clear
              </button>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {/* Show variants as they arrive during loading, or after success */}
          {variants.length > 0 && (
            <div className={styles.variantsSection}>
              <div className={styles.variantsLabel}>
                {generatorState === 'loading'
                  ? `Received ${variants.length} of ${selectedTemplates.length}...`
                  : `Click to preview (${variants.length} design${variants.length !== 1 ? 's' : ''})`
                }
              </div>
              <div className={styles.variantsGrid}>
                {variants.map((variant, index) => (
                  <button
                    key={index}
                    className={`${styles.variantCard} ${selectedIndex === index ? styles.selected : ''}`}
                    onClick={() => handleSelectVariant(index)}
                    type="button"
                  >
                    <div className={styles.variantNumber}>{index + 1}</div>
                    <div className={styles.variantContent}>
                      <div className={styles.variantLabel}>
                        {formatTemplateId(variant.templateId)}
                      </div>
                      <div className={styles.variantPreview}>
                        {getPreviewText(variant.config)}
                      </div>
                    </div>
                    <div className={styles.variantTheme}>{variant.theme}</div>
                  </button>
                ))}
              </div>
              {selectedIndex !== null && variants[selectedIndex] && (
                <div className={styles.reasoning}>
                  {variants[selectedIndex].reasoning}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
