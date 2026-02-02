'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import type { PosterDefinition, ThemePreset, CanvasPreset, PrimitiveNode } from '@/lib/types';
import {
  applyDeletions,
  applyInsertions,
  applyOverrides,
  applyOrders,
  type NodeInsertion,
  type NodeOverride,
  type NodeOrderMap,
  findNodeById,
} from '@/lib/design/tree';
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

type NodeTransform = { x: number; y: number };

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function composeTransform(existing: unknown, translate: string): string {
  if (typeof existing === 'string' && existing.trim()) {
    const stripped = existing.replace(/^translate\([^)]*\)\s*/i, '').trim();
    return stripped ? `${translate} ${stripped}` : translate;
  }
  return translate;
}

function withDeterministicNodeIds(node: PrimitiveNode, path: string[] = []): PrimitiveNode {
  const id = node.id || `node:${path.join('.') || 'root'}`;
  const base: PrimitiveNode = { ...node, id };

  if (base.type === 'box') {
    return {
      ...base,
      children: base.children?.map((child, i) => withDeterministicNodeIds(child, [...path, `${base.type}${i}`])),
    };
  }
  if (base.type === 'stack') {
    return {
      ...base,
      children: base.children.map((child, i) => withDeterministicNodeIds(child, [...path, `${base.type}${i}`])),
    };
  }
  if (base.type === 'grid') {
    return {
      ...base,
      children: (base.children as any[]).map((child, i) => {
        const { column, row, area, ...rest } = child as any;
        const nextChild = withDeterministicNodeIds(rest as PrimitiveNode, [...path, `${base.type}${i}`]);
        return { ...nextChild, ...(column ? { column } : {}), ...(row ? { row } : {}), ...(area ? { area } : {}) };
      }) as any,
    };
  }

  return base;
}

function applyTransformsToNode(node: PrimitiveNode, transforms: Record<string, NodeTransform>): PrimitiveNode {
  const t = node.id ? transforms[node.id] : undefined;
  const existingStyle = node.style ? { ...node.style } : undefined;
  const transformStr = t ? `translate(${t.x}px, ${t.y}px)` : undefined;

  const nextStyle = transformStr
    ? {
        ...(existingStyle || {}),
        transform: composeTransform(existingStyle?.transform, transformStr),
      }
    : existingStyle;

  const next: PrimitiveNode = {
    ...node,
    ...(nextStyle ? { style: nextStyle } : {}),
  };

  if (next.type === 'box') {
    return {
      ...next,
      children: next.children?.map((c) => applyTransformsToNode(c, transforms)),
    };
  }
  if (next.type === 'stack') {
    return {
      ...next,
      children: next.children.map((c) => applyTransformsToNode(c, transforms)),
    };
  }
  if (next.type === 'grid') {
    return {
      ...next,
      children: (next.children as any[]).map((child) => {
        const { column, row, area, ...rest } = child as any;
        const nextChild = applyTransformsToNode(rest as PrimitiveNode, transforms);
        return { ...nextChild, ...(column ? { column } : {}), ...(row ? { row } : {}), ...(area ? { area } : {}) };
      }) as any,
    };
  }
  return next;
}

function mergeCanvasPreserveCurrent(next: PosterDefinition, current: PosterDefinition): PosterDefinition {
  return {
    ...next,
    // Preserve user's canvas choice (preset/custom) across any regeneration.
    canvas: { ...next.canvas, ...current.canvas },
  };
}

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
  projectId: string | null;
  designs: DesignDocument[];
  activeDesignId: string;
  previewDefinition: PosterDefinition | null;
  showGrid: boolean;
  previewScale: number;
}

export interface DesignDocument {
  id: string;
  name: string;
  definition: PosterDefinition;
  selectedNodeId: string | null;
  activePreset: string;
  presetOptions: Record<string, unknown>;
  nodeTransforms: Record<string, NodeTransform>;
  nodeOverrides: Record<string, NodeOverride>;
  nodeInsertions: NodeInsertion[];
  nodeDeletions: string[];
  nodeOrders: NodeOrderMap;
  createdAt: string;
  updatedAt: string;
  ai?: {
    reasoning?: string;
  };
}

/**
 * Design actions
 */
type DesignAction =
  | { type: 'LOAD_PROJECT'; projectId: string; designs: DesignDocument[]; activeDesignId: string }
  | { type: 'SET_PROJECT_ID'; projectId: string }
  | { type: 'SET_ACTIVE_DESIGN'; designId: string }
  | { type: 'ADD_DESIGN_FROM_PRESET'; presetId: string; options?: Record<string, unknown>; name?: string }
  | { type: 'DELETE_DESIGN'; designId: string }
  | { type: 'APPLY_AI_VARIANT_AS_DESIGN'; presetId: string; options: Record<string, unknown>; theme: ThemePreset; reasoning?: string }
  | { type: 'SET_THEME'; preset: ThemePreset }
  | { type: 'SET_CANVAS'; preset: CanvasPreset }
  | { type: 'SET_THEME_OVERRIDE'; key: string; value: string }
  | { type: 'TOGGLE_GRID' }
  | { type: 'SET_PREVIEW_SCALE'; scale: number }
  | { type: 'SELECT_NODE'; nodeId: string | null }
  | { type: 'UPDATE_NODE_TRANSFORM'; nodeId: string; dx: number; dy: number }
  | { type: 'UPDATE_NODE_OVERRIDE'; nodeId: string; override: NodeOverride }
  | { type: 'ADD_NODE'; parentId: string; node: PrimitiveNode; index?: number }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'SET_NODE_ORDER'; parentId: string; orderedChildIds: string[] }
  | { type: 'SET_PRESET_OPTIONS'; updates: Record<string, unknown> }
  | { type: 'SET_PREVIEW_DEFINITION'; definition: PosterDefinition | null };

/**
 * Initial preset
 */
const initialPresetId = 'statement-poster';
const initialPresetOptions = presetSchemas[initialPresetId].defaultOptions;

function buildDefinitionFromPreset(presetId: string, options: Record<string, unknown>): PosterDefinition {
  const presetFn = getPresetFunction(presetId);
  const base = presetFn(options);
  return {
    ...base,
    root: withDeterministicNodeIds(base.root),
  };
}

function nowIso() {
  return new Date().toISOString();
}

function createDesignFromPreset(presetId: string, options: Record<string, unknown>, name?: string): DesignDocument {
  const ts = nowIso();
  const definition = buildDefinitionFromPreset(presetId, options);
  const designId = createId();
  return {
    id: designId,
    name: name || presetSchemas[presetId]?.name || 'Untitled Design',
    definition,
    selectedNodeId: null,
    activePreset: presetId,
    presetOptions: options,
    nodeTransforms: {},
    nodeOverrides: {},
    nodeInsertions: [],
    nodeDeletions: [],
    nodeOrders: {},
    createdAt: ts,
    updatedAt: ts,
  };
}

function applyUserEdits(
  definition: PosterDefinition,
  design: Pick<DesignDocument, 'nodeOverrides' | 'nodeInsertions' | 'nodeDeletions' | 'nodeTransforms' | 'nodeOrders'>
): PosterDefinition {
  let root = withDeterministicNodeIds(definition.root);

  root = applyInsertions(root, design.nodeInsertions);
  root = applyDeletions(root, new Set(design.nodeDeletions));
  root = applyOrders(root, design.nodeOrders);
  root = applyOverrides(root, design.nodeOverrides);
  root = applyTransformsToNode(root, design.nodeTransforms);

  return {
    ...definition,
    root,
  };
}

/**
 * Initial state
 */
const initialState: DesignState = {
  projectId: null,
  designs: [
    createDesignFromPreset(initialPresetId, { ...initialPresetOptions, theme: 'swiss-red' }, 'Design 1'),
  ],
  activeDesignId: 'pending',
  previewDefinition: null,
  showGrid: false,
  previewScale: 0.5,
};

initialState.activeDesignId = initialState.designs[0].id;

/**
 * Design reducer
 */
function designReducer(state: DesignState, action: DesignAction): DesignState {
  const activeIndex = state.designs.findIndex((d) => d.id === state.activeDesignId);
  const activeDesign = activeIndex >= 0 ? state.designs[activeIndex] : state.designs[0];

  switch (action.type) {
    case 'LOAD_PROJECT':
      return {
        ...state,
        projectId: action.projectId,
        designs: action.designs,
        activeDesignId: action.activeDesignId,
      };

    case 'SET_PROJECT_ID':
      return { ...state, projectId: action.projectId };

    case 'SET_ACTIVE_DESIGN':
      return { ...state, activeDesignId: action.designId, previewDefinition: null };

    case 'ADD_DESIGN_FROM_PRESET': {
      const schema = presetSchemas[action.presetId];
      const defaultOptions = schema?.defaultOptions || {};
      const options = {
        ...defaultOptions,
        ...(action.options || {}),
        theme: (activeDesign?.definition?.theme?.preset || 'swiss-red') as ThemePreset,
      };

      // Seed new design with the current canvas so the experience is consistent.
      const base = buildDefinitionFromPreset(action.presetId, options);
      const definition = mergeCanvasPreserveCurrent(base, activeDesign.definition);
      const ts = nowIso();
      const newDesign: DesignDocument = {
        id: createId(),
        name: action.name || schema?.name || 'Untitled Design',
        definition,
        selectedNodeId: null,
        activePreset: action.presetId,
        presetOptions: options,
        nodeTransforms: {},
        nodeOverrides: {},
        nodeInsertions: [],
        nodeDeletions: [],
        nodeOrders: {},
        createdAt: ts,
        updatedAt: ts,
      };
      return {
        ...state,
        designs: [...state.designs, newDesign],
        activeDesignId: newDesign.id,
        previewDefinition: null,
      };
    }

    case 'DELETE_DESIGN': {
      // Prevent deleting the last design
      if (state.designs.length <= 1) return state;
      const nextDesigns = state.designs.filter((d) => d.id !== action.designId);
      // If deleting the active design, switch to the first remaining design
      const nextActiveId =
        state.activeDesignId === action.designId ? nextDesigns[0]?.id || state.activeDesignId : state.activeDesignId;
      return {
        ...state,
        designs: nextDesigns,
        activeDesignId: nextActiveId,
        previewDefinition: null,
      };
    }

    case 'APPLY_AI_VARIANT_AS_DESIGN': {
      const options = { ...action.options, theme: action.theme };
      const base = buildDefinitionFromPreset(action.presetId, options);
      const definition = mergeCanvasPreserveCurrent(base, activeDesign.definition);
      const ts = nowIso();
      const newDesign: DesignDocument = {
        id: createId(),
        name: presetSchemas[action.presetId]?.name || 'AI Design',
        definition,
        selectedNodeId: null,
        activePreset: action.presetId,
        presetOptions: options,
        nodeTransforms: {},
        nodeOverrides: {},
        nodeInsertions: [],
        nodeDeletions: [],
        nodeOrders: {},
        createdAt: ts,
        updatedAt: ts,
        ai: action.reasoning ? { reasoning: action.reasoning } : undefined,
      };
      return {
        ...state,
        designs: [...state.designs, newDesign],
        activeDesignId: newDesign.id,
        previewDefinition: null,
      };
    }

    case 'SET_THEME': {
      if (!activeDesign) return state;
      const newOptions = { ...activeDesign.presetOptions, theme: action.preset };
      const base = buildDefinitionFromPreset(activeDesign.activePreset, newOptions);
      const merged = mergeCanvasPreserveCurrent(base, activeDesign.definition);
      const withEdits = applyUserEdits(merged, activeDesign);

      const nextDesign: DesignDocument = {
        ...activeDesign,
        presetOptions: newOptions,
        definition: withEdits,
        updatedAt: nowIso(),
      };
      const designs = [...state.designs];
      designs[activeIndex] = nextDesign;
      return { ...state, designs, previewDefinition: null };
    }

    case 'SET_CANVAS': {
      if (!activeDesign) return state;
      const newDefinition: PosterDefinition = {
        ...activeDesign.definition,
        canvas: { preset: action.preset },
      };
      const nextDesign: DesignDocument = {
        ...activeDesign,
        definition: newDefinition,
        updatedAt: nowIso(),
      };
      const designs = [...state.designs];
      designs[activeIndex] = nextDesign;
      return { ...state, designs };
    }

    case 'SET_THEME_OVERRIDE':
      if (!activeDesign) return state;
      {
        const nextDesign: DesignDocument = {
          ...activeDesign,
          definition: {
            ...activeDesign.definition,
            theme: {
              ...activeDesign.definition.theme,
              overrides: {
                ...activeDesign.definition.theme.overrides,
                [action.key]: action.value,
              },
            },
          },
          updatedAt: nowIso(),
        };
        const designs = [...state.designs];
        designs[activeIndex] = nextDesign;
        return { ...state, designs };
      }

    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid };

    case 'SET_PREVIEW_SCALE':
      return { ...state, previewScale: action.scale };

    case 'SELECT_NODE':
      if (!activeDesign) return state;
      {
        const nextDesign: DesignDocument = {
          ...activeDesign,
          selectedNodeId: action.nodeId,
          updatedAt: nowIso(),
        };
        const designs = [...state.designs];
        designs[activeIndex] = nextDesign;
        return { ...state, designs };
      }

    case 'UPDATE_NODE_TRANSFORM':
      if (!activeDesign) return state;
      {
        const current = activeDesign.nodeTransforms[action.nodeId] || { x: 0, y: 0 };
        const nextTransforms = {
          ...activeDesign.nodeTransforms,
          [action.nodeId]: { x: current.x + action.dx, y: current.y + action.dy },
        };

        // Re-apply transforms to definition.root so export + render stays consistent.
        const withTransforms: PosterDefinition = {
          ...activeDesign.definition,
          root: applyTransformsToNode(activeDesign.definition.root, nextTransforms),
        };

        const nextDesign: DesignDocument = {
          ...activeDesign,
          nodeTransforms: nextTransforms,
          definition: withTransforms,
          updatedAt: nowIso(),
        };

        const designs = [...state.designs];
        designs[activeIndex] = nextDesign;
        return { ...state, designs };
      }

    case 'UPDATE_NODE_OVERRIDE':
      if (!activeDesign) return state;
      {
        const nextOverrides: Record<string, NodeOverride> = {
          ...activeDesign.nodeOverrides,
          [action.nodeId]: {
            ...(activeDesign.nodeOverrides[action.nodeId] || {}),
            ...action.override,
            ...(action.override.style
              ? { style: { ...(activeDesign.nodeOverrides[action.nodeId]?.style || {}), ...action.override.style } }
              : {}),
          },
        };

        const nextDefinition = applyUserEdits(activeDesign.definition, {
          nodeOverrides: nextOverrides,
          nodeInsertions: activeDesign.nodeInsertions,
          nodeDeletions: activeDesign.nodeDeletions,
          nodeTransforms: activeDesign.nodeTransforms,
          nodeOrders: activeDesign.nodeOrders,
        });

        const nextDesign: DesignDocument = {
          ...activeDesign,
          nodeOverrides: nextOverrides,
          definition: nextDefinition,
          updatedAt: nowIso(),
        };
        const designs = [...state.designs];
        designs[activeIndex] = nextDesign;
        return { ...state, designs };
      }

    case 'ADD_NODE':
      if (!activeDesign) return state;
      {
        const baseNode = action.node.id ? action.node : { ...action.node, id: createId() };
        const node = withDeterministicNodeIds(baseNode, [baseNode.id || 'new']);
        const nextInsertions = [...activeDesign.nodeInsertions, { parentId: action.parentId, node, index: action.index }];
        const nextDefinition = applyUserEdits(activeDesign.definition, {
          nodeOverrides: activeDesign.nodeOverrides,
          nodeInsertions: nextInsertions,
          nodeDeletions: activeDesign.nodeDeletions,
          nodeTransforms: activeDesign.nodeTransforms,
          nodeOrders: activeDesign.nodeOrders,
        });
        const nextDesign: DesignDocument = {
          ...activeDesign,
          nodeInsertions: nextInsertions,
          definition: nextDefinition,
          selectedNodeId: node.id || null,
          updatedAt: nowIso(),
        };
        const designs = [...state.designs];
        designs[activeIndex] = nextDesign;
        return { ...state, designs };
      }

    case 'DELETE_NODE':
      if (!activeDesign) return state;
      {
        const nextDeletions = Array.from(new Set([...activeDesign.nodeDeletions, action.nodeId]));
        const nextDefinition = applyUserEdits(activeDesign.definition, {
          nodeOverrides: activeDesign.nodeOverrides,
          nodeInsertions: activeDesign.nodeInsertions,
          nodeDeletions: nextDeletions,
          nodeTransforms: activeDesign.nodeTransforms,
          nodeOrders: activeDesign.nodeOrders,
        });
        const nextDesign: DesignDocument = {
          ...activeDesign,
          nodeDeletions: nextDeletions,
          definition: nextDefinition,
          selectedNodeId: activeDesign.selectedNodeId === action.nodeId ? null : activeDesign.selectedNodeId,
          updatedAt: nowIso(),
        };
        const designs = [...state.designs];
        designs[activeIndex] = nextDesign;
        return { ...state, designs };
      }

    case 'SET_NODE_ORDER':
      if (!activeDesign) return state;
      {
        const nextOrders: NodeOrderMap = {
          ...activeDesign.nodeOrders,
          [action.parentId]: action.orderedChildIds,
        };
        const nextDefinition = applyUserEdits(activeDesign.definition, {
          nodeOverrides: activeDesign.nodeOverrides,
          nodeInsertions: activeDesign.nodeInsertions,
          nodeDeletions: activeDesign.nodeDeletions,
          nodeTransforms: activeDesign.nodeTransforms,
          nodeOrders: nextOrders,
        });

        const nextDesign: DesignDocument = {
          ...activeDesign,
          nodeOrders: nextOrders,
          definition: nextDefinition,
          updatedAt: nowIso(),
        };
        const designs = [...state.designs];
        designs[activeIndex] = nextDesign;
        return { ...state, designs };
      }

    case 'SET_PRESET_OPTIONS': {
      if (!activeDesign) return state;
      const newOptions = { ...activeDesign.presetOptions, ...action.updates };
      const base = buildDefinitionFromPreset(activeDesign.activePreset, newOptions);
      const merged = mergeCanvasPreserveCurrent(base, activeDesign.definition);
      const withEdits = applyUserEdits(merged, activeDesign);

      const nextDesign: DesignDocument = {
        ...activeDesign,
        presetOptions: newOptions,
        definition: withEdits,
        updatedAt: nowIso(),
      };
      const designs = [...state.designs];
      designs[activeIndex] = nextDesign;
      return { ...state, designs, previewDefinition: null };
    }

    case 'SET_PREVIEW_DEFINITION':
      return { ...state, previewDefinition: action.definition };

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
  activeDesign: DesignDocument;
  displayedDefinition: PosterDefinition;
  setActiveDesign: (designId: string) => void;
  addDesignFromPreset: (presetId: string, options?: Record<string, unknown>, name?: string) => void;
  deleteDesign: (designId: string) => void;
  applyAIVariantAsDesign: (presetId: string, options: Record<string, unknown>, theme: ThemePreset, reasoning?: string) => void;
  setTheme: (preset: ThemePreset) => void;
  setCanvas: (preset: CanvasPreset) => void;
  toggleGrid: () => void;
  setPreviewScale: (scale: number) => void;
  updatePresetOption: (key: string, value: unknown) => void;
  updatePresetOptions: (updates: Record<string, unknown>) => void;
  selectNode: (nodeId: string | null) => void;
  nudgeNode: (nodeId: string, dx: number, dy: number) => void;
  updateNodeOverride: (nodeId: string, override: NodeOverride) => void;
  addNode: (parentId: string, node: PrimitiveNode, index?: number) => void;
  deleteNode: (nodeId: string) => void;
  setNodeOrder: (parentId: string, orderedChildIds: string[]) => void;
  getSelectedNode: () => PrimitiveNode | null;
  setPreviewDefinition: (definition: PosterDefinition | null) => void;
}

const DesignContext = createContext<DesignContextValue | null>(null);

/**
 * Design Provider component
 */
export function DesignProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(designReducer, initialState);

  const activeDesign = useMemo(() => {
    const found = state.designs.find((d) => d.id === state.activeDesignId);
    return found || state.designs[0];
  }, [state.designs, state.activeDesignId]);

  const displayedDefinition = state.previewDefinition || activeDesign.definition;

  const loadedFromServerRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);

  // Load or create a project in MongoDB
  useEffect(() => {
    if (loadedFromServerRef.current) return;
    loadedFromServerRef.current = true;

    const run = async () => {
      let storedProjectId: string | null = null;
      try {
        storedProjectId = localStorage.getItem('swiss-project-id');
      } catch {
        storedProjectId = null;
      }

      if (storedProjectId) {
        try {
          const res = await fetch(`/api/projects/${storedProjectId}`);
          if (res.ok) {
            const json = await res.json();
            const project = json?.project;
            if (project?.id && Array.isArray(project?.designs) && typeof project?.activeDesignId === 'string') {
              const normalizedDesigns: DesignDocument[] = (project.designs as any[]).map((d, idx) => {
                const def = (d?.definition || d?.def || d) as PosterDefinition;
                const presetId = typeof d?.activePreset === 'string' ? d.activePreset : initialPresetId;
                const presetOptions = typeof d?.presetOptions === 'object' && d?.presetOptions ? d.presetOptions : {};
                const nodeTransforms = typeof d?.nodeTransforms === 'object' && d?.nodeTransforms ? d.nodeTransforms : {};
                const nodeOverrides = typeof d?.nodeOverrides === 'object' && d?.nodeOverrides ? d.nodeOverrides : {};
                const nodeInsertions = Array.isArray(d?.nodeInsertions) ? d.nodeInsertions : [];
                const nodeDeletions = Array.isArray(d?.nodeDeletions) ? d.nodeDeletions : [];
                const nodeOrders = typeof d?.nodeOrders === 'object' && d?.nodeOrders ? d.nodeOrders : {};
                const baseRoot = def?.root ? withDeterministicNodeIds(def.root) : withDeterministicNodeIds(activeDesign.definition.root);

                const normalizedDef = applyUserEdits(
                  {
                    ...(def || activeDesign.definition),
                    root: baseRoot,
                  },
                  {
                    nodeOverrides,
                    nodeInsertions,
                    nodeDeletions,
                    nodeTransforms,
                    nodeOrders,
                  }
                );
                return {
                  id: typeof d?.id === 'string' ? d.id : createId(),
                  name: typeof d?.name === 'string' ? d.name : `Design ${idx + 1}`,
                  definition: normalizedDef,
                  selectedNodeId: d?.selectedNodeId ?? null,
                  activePreset: presetId,
                  presetOptions,
                  nodeTransforms,
                  nodeOverrides,
                  nodeInsertions,
                  nodeDeletions,
                  nodeOrders,
                  createdAt: typeof d?.createdAt === 'string' ? d.createdAt : nowIso(),
                  updatedAt: typeof d?.updatedAt === 'string' ? d.updatedAt : nowIso(),
                  ai: typeof d?.ai === 'object' ? d.ai : undefined,
                };
              });

              const resolvedActiveId = normalizedDesigns.some((d) => d.id === project.activeDesignId)
                ? project.activeDesignId
                : normalizedDesigns[0]?.id;

              dispatch({
                type: 'LOAD_PROJECT',
                projectId: project.id,
                designs: normalizedDesigns,
                activeDesignId: resolvedActiveId,
              });
              return;
            }
          }
        } catch {
          // fall through to create
        }
      }

      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ designs: state.designs, activeDesignId: state.activeDesignId }),
        });
        if (res.ok) {
          const json = await res.json();
          const project = json?.project;
          if (project?.id) {
            dispatch({ type: 'SET_PROJECT_ID', projectId: project.id });
          }
        }
      } catch {
        // ignore (offline / db not reachable)
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save project (debounced)
  useEffect(() => {
    if (!state.projectId) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(async () => {
      try {
        await fetch(`/api/projects/${state.projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ designs: state.designs, activeDesignId: state.activeDesignId }),
        });
      } catch {
        // ignore
      }
    }, 800);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [state.projectId, state.designs, state.activeDesignId]);

  // Persist project id in localStorage (Mongo persistence is handled by a separate effect in the app layer)
  useEffect(() => {
    if (state.projectId) {
      try {
        localStorage.setItem('swiss-project-id', state.projectId);
      } catch {
        // ignore
      }
    }
  }, [state.projectId]);

  // Initialize activeDesignId if needed
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    if (state.activeDesignId === 'pending' && state.designs[0]) {
      didInitRef.current = true;
      dispatch({ type: 'SET_ACTIVE_DESIGN', designId: state.designs[0].id });
    }
  }, [state.activeDesignId, state.designs]);

  const value: DesignContextValue = {
    state,
    dispatch,
    activeDesign,
    displayedDefinition,
    setActiveDesign: (designId) => dispatch({ type: 'SET_ACTIVE_DESIGN', designId }),
    addDesignFromPreset: (presetId, options, name) => dispatch({ type: 'ADD_DESIGN_FROM_PRESET', presetId, options, name }),
    deleteDesign: (designId) => dispatch({ type: 'DELETE_DESIGN', designId }),
    applyAIVariantAsDesign: (presetId, options, theme, reasoning) =>
      dispatch({ type: 'APPLY_AI_VARIANT_AS_DESIGN', presetId, options, theme, reasoning }),
    setTheme: (preset) => dispatch({ type: 'SET_THEME', preset }),
    setCanvas: (preset) => dispatch({ type: 'SET_CANVAS', preset }),
    toggleGrid: () => dispatch({ type: 'TOGGLE_GRID' }),
    setPreviewScale: (scale) => dispatch({ type: 'SET_PREVIEW_SCALE', scale }),
    updatePresetOption: (key, value) => {
      dispatch({ type: 'SET_PRESET_OPTIONS', updates: { [key]: value } });
    },
    updatePresetOptions: (updates) => {
      dispatch({ type: 'SET_PRESET_OPTIONS', updates });
    },
    selectNode: (nodeId) => dispatch({ type: 'SELECT_NODE', nodeId }),
    nudgeNode: (nodeId, dx, dy) => dispatch({ type: 'UPDATE_NODE_TRANSFORM', nodeId, dx, dy }),
    updateNodeOverride: (nodeId, override) => dispatch({ type: 'UPDATE_NODE_OVERRIDE', nodeId, override }),
    addNode: (parentId, node, index) => dispatch({ type: 'ADD_NODE', parentId, node, index }),
    deleteNode: (nodeId) => dispatch({ type: 'DELETE_NODE', nodeId }),
    setNodeOrder: (parentId, orderedChildIds) => dispatch({ type: 'SET_NODE_ORDER', parentId, orderedChildIds }),
    getSelectedNode: () => {
      const id = activeDesign.selectedNodeId;
      if (!id) return null;
      return findNodeById(activeDesign.definition.root, id);
    },
    setPreviewDefinition: (definition) => dispatch({ type: 'SET_PREVIEW_DEFINITION', definition }),
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
