'use client';

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { PosterDefinition, ThemePreset, CanvasPreset } from '@/lib/types';
import {
  createStatementPoster,
  createVignelliQuote,
  createTypographyShowcase,
  createHotTakePoster,
  createAnnouncementPoster,
  createShowcasePoster,
  createContentGridPoster,
  createFeatureShowcase,
  // New presets from refs3 designs
  createMinimalQuote,
  createParagraphQuote,
  createSplitWord,
  createVignelliEnhanced,
  createTypeSpecimen,
  createManifestoQuotes,
  createNumberedPrinciples,
  createTwoToneQuote,
  createSplitStatement,
} from '@/components/composer';
import { presetSchemas } from '@/schemas/presetSchemas';

/**
 * Preset function registry
 */
const presetFunctions: Record<string, (options: Record<string, unknown>) => PosterDefinition> = {
  'vignelli-quote': (options) => createVignelliQuote(options as unknown as Parameters<typeof createVignelliQuote>[0]),
  'statement-poster': (options) => createStatementPoster(options as unknown as Parameters<typeof createStatementPoster>[0]),
  'typography-showcase': (options) => createTypographyShowcase(options as unknown as Parameters<typeof createTypographyShowcase>[0]),
  'hot-take-poster': (options) => createHotTakePoster(options as unknown as Parameters<typeof createHotTakePoster>[0]),
  'announcement-poster': (options) => createAnnouncementPoster(options as unknown as Parameters<typeof createAnnouncementPoster>[0]),
  'showcase-poster': (options) => createShowcasePoster(options as unknown as Parameters<typeof createShowcasePoster>[0]),
  'content-grid-poster': (options) => createContentGridPoster(options as unknown as Parameters<typeof createContentGridPoster>[0]),
  'feature-showcase': (options) => createFeatureShowcase(options as unknown as Parameters<typeof createFeatureShowcase>[0]),
  // New presets from refs3 designs
  'minimal-quote': (options) => createMinimalQuote(options as unknown as Parameters<typeof createMinimalQuote>[0]),
  'paragraph-quote': (options) => createParagraphQuote(options as unknown as Parameters<typeof createParagraphQuote>[0]),
  'split-word': (options) => createSplitWord(options as unknown as Parameters<typeof createSplitWord>[0]),
  'vignelli-enhanced': (options) => createVignelliEnhanced(options as unknown as Parameters<typeof createVignelliEnhanced>[0]),
  'type-specimen': (options) => createTypeSpecimen(options as unknown as Parameters<typeof createTypeSpecimen>[0]),
  'manifesto-quotes': (options) => createManifestoQuotes(options as unknown as Parameters<typeof createManifestoQuotes>[0]),
  'numbered-principles': (options) => createNumberedPrinciples(options as unknown as Parameters<typeof createNumberedPrinciples>[0]),
  'two-tone-quote': (options) => createTwoToneQuote(options as unknown as Parameters<typeof createTwoToneQuote>[0]),
  'split-statement': (options) => createSplitStatement(options as unknown as Parameters<typeof createSplitStatement>[0]),
};

function getPresetFunction(presetId: string) {
  return presetFunctions[presetId] || createStatementPoster;
}

/**
 * Design state interface
 */
interface DesignState {
  definition: PosterDefinition;
  showGrid: boolean;
  previewScale: number;
  selectedNodeId: string | null;
  activePreset: string | null;
  presetOptions: Record<string, unknown>;
}

/**
 * Design actions
 */
type DesignAction =
  | { type: 'SET_DEFINITION'; definition: PosterDefinition }
  | { type: 'SET_THEME'; preset: ThemePreset }
  | { type: 'SET_CANVAS'; preset: CanvasPreset }
  | { type: 'SET_THEME_OVERRIDE'; key: string; value: string }
  | { type: 'TOGGLE_GRID' }
  | { type: 'SET_PREVIEW_SCALE'; scale: number }
  | { type: 'SELECT_NODE'; nodeId: string | null }
  | { type: 'UPDATE_NODE'; nodeId: string; updates: Record<string, unknown> }
  | { type: 'SET_PRESET'; presetId: string; options: Record<string, unknown> }
  | { type: 'UPDATE_PRESET_OPTIONS'; updates: Record<string, unknown> };

/**
 * Initial preset
 */
const initialPresetId = 'statement-poster';
const initialPresetOptions = presetSchemas[initialPresetId].defaultOptions;

/**
 * Initial poster definition
 */
const initialDefinition = createStatementPoster({
  headline: initialPresetOptions.headline as string,
  subheadline: initialPresetOptions.subheadline as string,
  author: initialPresetOptions.author as string,
  topic: initialPresetOptions.topic as string,
  theme: 'swiss-red',
});

/**
 * Initial state
 */
const initialState: DesignState = {
  definition: initialDefinition,
  showGrid: false,
  previewScale: 0.5,
  selectedNodeId: null,
  activePreset: initialPresetId,
  presetOptions: { ...initialPresetOptions, theme: 'swiss-red' },
};

/**
 * Design reducer
 */
function designReducer(state: DesignState, action: DesignAction): DesignState {
  switch (action.type) {
    case 'SET_DEFINITION':
      return { ...state, definition: action.definition };

    case 'SET_THEME': {
      const newOptions = { ...state.presetOptions, theme: action.preset };
      if (state.activePreset) {
        const presetFn = getPresetFunction(state.activePreset);
        return {
          ...state,
          presetOptions: newOptions,
          definition: presetFn(newOptions),
        };
      }
      return {
        ...state,
        presetOptions: newOptions,
        definition: {
          ...state.definition,
          theme: { preset: action.preset },
        },
      };
    }

    case 'SET_CANVAS': {
      const newDefinition = {
        ...state.definition,
        canvas: { preset: action.preset },
      };
      return {
        ...state,
        definition: newDefinition,
      };
    }

    case 'SET_THEME_OVERRIDE':
      return {
        ...state,
        definition: {
          ...state.definition,
          theme: {
            ...state.definition.theme,
            overrides: {
              ...state.definition.theme.overrides,
              [action.key]: action.value,
            },
          },
        },
      };

    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid };

    case 'SET_PREVIEW_SCALE':
      return { ...state, previewScale: action.scale };

    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.nodeId };

    case 'UPDATE_NODE':
      return state;

    case 'SET_PRESET': {
      const presetFn = getPresetFunction(action.presetId);
      const optionsWithTheme = {
        ...action.options,
        theme: state.presetOptions.theme || 'swiss-red',
      };
      return {
        ...state,
        activePreset: action.presetId,
        presetOptions: optionsWithTheme,
        definition: presetFn(optionsWithTheme),
      };
    }

    case 'UPDATE_PRESET_OPTIONS': {
      if (!state.activePreset) return state;
      const newOptions = { ...state.presetOptions, ...action.updates };
      const presetFn = getPresetFunction(state.activePreset);
      return {
        ...state,
        presetOptions: newOptions,
        definition: presetFn(newOptions),
      };
    }

    default:
      return state;
  }
}

/**
 * Context
 */
interface DesignContextValue {
  state: DesignState;
  dispatch: React.Dispatch<DesignAction>;
  setTheme: (preset: ThemePreset) => void;
  setCanvas: (preset: CanvasPreset) => void;
  setDefinition: (definition: PosterDefinition) => void;
  toggleGrid: () => void;
  setPreviewScale: (scale: number) => void;
  setPreset: (presetId: string, options?: Record<string, unknown>) => void;
  updatePresetOption: (key: string, value: unknown) => void;
  updatePresetOptions: (updates: Record<string, unknown>) => void;
}

const DesignContext = createContext<DesignContextValue | null>(null);

/**
 * Design Provider component
 */
export function DesignProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(designReducer, initialState);

  const value: DesignContextValue = {
    state,
    dispatch,
    setTheme: (preset) => dispatch({ type: 'SET_THEME', preset }),
    setCanvas: (preset) => dispatch({ type: 'SET_CANVAS', preset }),
    setDefinition: (definition) => dispatch({ type: 'SET_DEFINITION', definition }),
    toggleGrid: () => dispatch({ type: 'TOGGLE_GRID' }),
    setPreviewScale: (scale) => dispatch({ type: 'SET_PREVIEW_SCALE', scale }),
    setPreset: (presetId, options) => {
      const schema = presetSchemas[presetId];
      const defaultOptions = schema?.defaultOptions || {};
      dispatch({
        type: 'SET_PRESET',
        presetId,
        options: options || defaultOptions,
      });
    },
    updatePresetOption: (key, value) => {
      dispatch({ type: 'UPDATE_PRESET_OPTIONS', updates: { [key]: value } });
    },
    updatePresetOptions: (updates) => {
      dispatch({ type: 'UPDATE_PRESET_OPTIONS', updates });
    },
  };

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}

/**
 * Hook to use design context
 */
export function useDesign(): DesignContextValue {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
