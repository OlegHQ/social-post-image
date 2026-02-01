'use client';

import { useMemo, useState } from 'react';
import type { PrimitiveNode } from '@/lib/types';
import { useDesign } from '@/context/DesignContext';
import styles from './Sidebar.module.css';

type LayerItem = {
  id: string;
  label: string;
  depth: number;
  parentId: string | null;
  index: number;
};

function labelForNode(node: PrimitiveNode): string {
  if (node.type === 'text') {
    const text = node.content.replace(/\s+/g, ' ').trim();
    return `Text: ${text.slice(0, 40) || '(empty)'}`;
  }
  if (node.type === 'image') return `Image: ${node.alt || node.src}`;
  return node.type;
}

function flatten(node: PrimitiveNode, depth = 0, parentId: string | null = null, index = 0, out: LayerItem[] = []): LayerItem[] {
  out.push({ id: node.id || '', label: labelForNode(node), depth, parentId, index });

  if (node.type === 'box' && node.children) {
    node.children.forEach((c, i) => flatten(c, depth + 1, node.id || null, i, out));
  }
  if (node.type === 'stack') {
    node.children.forEach((c, i) => flatten(c, depth + 1, node.id || null, i, out));
  }
  if (node.type === 'grid') {
    (node.children as unknown as PrimitiveNode[]).forEach((c, i) => flatten(c as PrimitiveNode, depth + 1, node.id || null, i, out));
  }
  return out;
}

export function LayersPanel() {
  const { activeDesign, selectNode, setNodeOrder } = useDesign();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const layers = useMemo(() => flatten(activeDesign.definition.root), [activeDesign.definition.root]);

  const layerById = useMemo(() => {
    const map = new Map<string, LayerItem>();
    for (const l of layers) map.set(l.id, l);
    return map;
  }, [layers]);

  const reorderWithinParent = (dragId: string, overId: string) => {
    const a = layerById.get(dragId);
    const b = layerById.get(overId);
    if (!a || !b) return;
    if (!a.parentId || a.parentId !== b.parentId) return;

    const siblings = layers
      .filter((l) => l.parentId === a.parentId)
      .sort((x, y) => x.index - y.index)
      .map((l) => l.id);

    const from = siblings.indexOf(dragId);
    const to = siblings.indexOf(overId);
    if (from < 0 || to < 0 || from === to) return;

    siblings.splice(from, 1);
    siblings.splice(to, 0, dragId);
    setNodeOrder(a.parentId, siblings);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Layers</h3>
      <div className={styles.canvasList}>
        {layers.map((layer) => (
          <button
            key={layer.id}
            type="button"
            draggable={layer.parentId !== null}
            className={`${styles.canvasOption} ${activeDesign.selectedNodeId === layer.id ? styles.canvasOptionActive : ''}`}
            onClick={() => selectNode(layer.id)}
            onDragStart={(e) => {
              setDraggingId(layer.id);
              e.dataTransfer.setData('text/plain', layer.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(e) => {
              if (!draggingId) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const dragId = e.dataTransfer.getData('text/plain') || draggingId;
              if (!dragId) return;
              reorderWithinParent(dragId, layer.id);
              setDraggingId(null);
            }}
            style={{ paddingLeft: 12 + layer.depth * 10, opacity: draggingId === layer.id ? 0.6 : 1 }}
            title={layer.parentId ? 'Drag to reorder within parent' : 'Root'}
          >
            <span className={styles.canvasName}>{layer.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
