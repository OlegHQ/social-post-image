'use client';

import { useMemo, useState } from 'react';
import type { PrimitiveNode } from '@/lib/types';
import { useDesign } from '@/context/DesignContext';
import { findParentInfo } from '@/lib/design/tree';
import styles from './RightSidebar.module.css';

function isContainer(node: PrimitiveNode) {
  return node.type === 'box' || node.type === 'stack' || node.type === 'grid';
}

type InsertMode = 'inside-end' | 'before' | 'after';

export function AddLayerPanel() {
  const { activeDesign, getSelectedNode, addNode } = useDesign();
  const node = getSelectedNode();
  const [insertMode, setInsertMode] = useState<InsertMode>('inside-end');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const insertTarget = useMemo(() => {
    const rootId = activeDesign.definition.root.id || 'node:root';
    if (!node || !node.id) return { parentId: rootId, index: undefined as number | undefined };

    if (isContainer(node)) {
      return { parentId: node.id, index: undefined as number | undefined };
    }

    const parentInfo = findParentInfo(activeDesign.definition.root, node.id);
    const parentId = parentInfo?.parentId || rootId;

    if (insertMode === 'inside-end') {
      return { parentId, index: undefined as number | undefined };
    }

    if (typeof parentInfo?.index !== 'number') {
      return { parentId, index: undefined as number | undefined };
    }

    const idx = insertMode === 'before' ? parentInfo.index : parentInfo.index + 1;
    return { parentId, index: idx };
  }, [activeDesign.definition.root, insertMode, node]);

  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={styles.panelHeader}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className={styles.panelTitle}>Add Layer</span>
        <span className={styles.panelChevron}>{isCollapsed ? '+' : '−'}</span>
      </button>

      {!isCollapsed && (
        <div className={styles.panelContent}>
          <label className={styles.label}>Insert</label>
          <select
            className={styles.select}
            value={insertMode}
            onChange={(e) => setInsertMode(e.target.value as InsertMode)}
          >
            <option value="inside-end">Inside selected (or root)</option>
            <option value="before">Before selected</option>
            <option value="after">After selected</option>
          </select>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                addNode(insertTarget.parentId, {
                  type: 'text',
                  content: 'NEW TEXT',
                  variant: 'title',
                  color: 'foreground',
                }, insertTarget.index)
              }
            >
              Text
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addNode(insertTarget.parentId, { type: 'divider' }, insertTarget.index)}
            >
              Divider
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addNode(insertTarget.parentId, { type: 'spacer', size: 6 }, insertTarget.index)}
            >
              Spacer
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addNode(insertTarget.parentId, { type: 'box', padding: 4, border: true, children: [] }, insertTarget.index)}
            >
              Box
            </button>
          </div>

          <div className={styles.subSection}>
            <label className={styles.label}>Components</label>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.addButton}
                onClick={() =>
                  addNode(
                    insertTarget.parentId,
                    {
                      type: 'header',
                      title: 'SERIES',
                      subtitle: 'Subtitle',
                      columns: ['Meta 1', 'Meta 2', 'Meta 3', 'Meta 4'],
                      showDivider: true,
                    },
                    insertTarget.index
                  )
                }
              >
                Header
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={() =>
                  addNode(
                    insertTarget.parentId,
                    {
                      type: 'footer',
                      author: 'Author',
                      authorMeta: 'Role / Company',
                      topic: 'Topic',
                      seriesNumber: 1,
                    },
                    insertTarget.index
                  )
                }
              >
                Footer
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={() => addNode(insertTarget.parentId, { type: 'seriesNumber', number: 1, size: 'lg' }, insertTarget.index)}
              >
                Series #
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={() => addNode(insertTarget.parentId, { type: 'seriesDots', filled: 3, total: 5 }, insertTarget.index)}
              >
                Dots
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={() => addNode(insertTarget.parentId, { type: 'image', src: 'https://picsum.photos/800/600', alt: 'Image' }, insertTarget.index)}
              >
                Image
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={() =>
                  addNode(
                    insertTarget.parentId,
                    {
                      type: 'grid',
                      columns: 2,
                      gap: 6,
                      children: [
                        { type: 'text', content: 'LEFT', variant: 'title', color: 'foreground' },
                        { type: 'text', content: 'RIGHT', variant: 'title', color: 'foreground' },
                      ],
                    },
                    insertTarget.index
                  )
                }
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
