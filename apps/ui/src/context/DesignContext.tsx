import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { PosterDefinition, ThemePreset, CanvasPreset } from '@swiss/composer';
import {
  createStatementPoster,
  createVignelliQuote,
  createTypographyShowcase,
  // New presets
  createHotTakePoster,
  createAnnouncementPoster,
  // refs2 templates
  createOperaPoster,
  createSeasonPoster,
  createFeatureShowcase,
} from '@swiss/composer';
import { presetSchemas } from '../schemas/presetSchemas';

/**
 * Preset function registry
 */
const presetFunctions: Record<string, (options: Record<string, unknown>) => PosterDefinition> = {
  'vignelli-quote': (options) => createVignelliQuote(options as Parameters<typeof createVignelliQuote>[0]),
  'statement-poster': (options) => createStatementPoster(options as Parameters<typeof createStatementPoster>[0]),
  'typography-showcase': (options) => createTypographyShowcase(options as Parameters<typeof createTypographyShowcase>[0]),
  // New presets
  'hot-take-poster': (options) => createHotTakePoster(options as Parameters<typeof createHotTakePoster>[0]),
  'announcement-poster': (options) => createAnnouncementPoster(options as Parameters<typeof createAnnouncementPoster>[0]),
  // refs2 templates
  'opera-poster': (options) => createOperaPoster(options as Parameters<typeof createOperaPoster>[0]),
  'season-poster': (options) => createSeasonPoster(options as Parameters<typeof createSeasonPoster>[0]),
  'feature-showcase': (options) => createFeatureShowcase(options as Parameters<typeof createFeatureShowcase>[0]),
};

function getPresetFunction(presetId: string) {
  return presetFunctions[presetId] || createStatementPoster;
}

/**
 * Design state interface
 */
interface DesignState {
  /** Current poster definition */
  definition: PosterDefinition;
  /** Show debug grid overlay */
  showGrid: boolean;
  /** Preview scale */
  previewScale: number;
  /** Selected node ID (for editing) */
  selectedNodeId: string | null;
  /** Active preset type */
  activePreset: string | null;
  /** Current preset options */
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
      // Update theme in both definition and presetOptions
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
      // Update canvas in definition
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
      // TODO: Implement deep node update if needed
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
  // Helper actions
  setTheme: (preset: ThemePreset) => void;
  setCanvas: (preset: CanvasPreset) => void;
  setDefinition: (definition: PosterDefinition) => void;
  toggleGrid: () => void;
  setPreviewScale: (scale: number) => void;
  // Preset helpers
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
    // Preset helpers
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
