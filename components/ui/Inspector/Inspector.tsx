'use client';

import { useMemo, useState } from 'react';
import type { PrimitiveNode, TextVariant, SpacingKey } from '@/lib/types';
import { useDesign } from '@/context/DesignContext';
import { findParentInfo, findNodeById } from '@/lib/design/tree';
import styles from './Inspector.module.css';

const textVariants: TextVariant[] = ['hero', 'display', 'headline', 'title', 'subhead', 'body', 'label', 'meta', 'number'];
const seriesNumberSizes = ['sm', 'md', 'lg', 'xl'] as const;
const seriesDotSizes = ['sm', 'md', 'lg'] as const;

function isContainer(node: PrimitiveNode) {
  return node.type === 'box' || node.type === 'stack' || node.type === 'grid';
}

type InsertMode = 'inside-end' | 'before' | 'after';

export function Inspector() {
  const { activeDesign, getSelectedNode, updateNodeOverride, addNode, deleteNode } = useDesign();
  const node = getSelectedNode();
  const [insertMode, setInsertMode] = useState<InsertMode>('inside-end');

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

  if (!node || !node.id) {
    return (
      <div className={styles.inspector}>
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>Inspector</div>
          <div className={styles.emptyBody}>Select a layer to edit properties.</div>
        </div>
      </div>
    );
  }

  const isRoot = node.id === activeDesign.definition.root.id;

  const parentInfo = findParentInfo(activeDesign.definition.root, node.id);
  const parentNode = parentInfo?.parentId ? findNodeById(activeDesign.definition.root, parentInfo.parentId) : null;
  const isGridChild = parentNode?.type === 'grid';
  const positionedNode = node as PrimitiveNode & { column?: string; row?: string; area?: string };

  return (
    <div className={styles.inspector}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Inspector</div>
          <div className={styles.meta}>
            <span className={styles.pill}>{node.type}</span>
            <span className={styles.nodeId}>{node.id}</span>
          </div>
        </div>
        <button
          className={styles.dangerButton}
          type="button"
          onClick={() => deleteNode(node.id!)}
          disabled={isRoot}
          title={isRoot ? 'Root cannot be deleted' : 'Delete layer'}
        >
          Delete
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Add Layer</div>

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

        <div className={styles.row}>
          <button
            type="button"
            className={styles.button}
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
            className={styles.button}
            onClick={() => addNode(insertTarget.parentId, { type: 'divider' }, insertTarget.index)}
          >
            Divider
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => addNode(insertTarget.parentId, { type: 'spacer', size: 6 }, insertTarget.index)}
          >
            Spacer
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => addNode(insertTarget.parentId, { type: 'box', padding: 4, border: true, children: [] }, insertTarget.index)}
          >
            Box
          </button>
        </div>
        <div className={styles.hint}>
          Adds using the selected insert mode.
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Components</div>
        <div className={styles.row}>
          <button
            type="button"
            className={styles.button}
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
            className={styles.button}
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
            className={styles.button}
            onClick={() => addNode(insertTarget.parentId, { type: 'seriesNumber', number: 1, size: 'lg' }, insertTarget.index)}
          >
            Series #
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => addNode(insertTarget.parentId, { type: 'seriesDots', filled: 3, total: 5 }, insertTarget.index)}
          >
            Dots
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => addNode(insertTarget.parentId, { type: 'image', src: 'https://picsum.photos/800/600', alt: 'Image' }, insertTarget.index)}
          >
            Image
          </button>
          <button
            type="button"
            className={styles.button}
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
            2-Column Grid
          </button>
        </div>
      </div>

      {node.type === 'text' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Text</div>

          <label className={styles.label}>Content</label>
          <textarea
            className={styles.textarea}
            value={node.content}
            onChange={(e) => updateNodeOverride(node.id!, { content: e.target.value })}
            rows={3}
          />

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Variant</label>
              <select
                className={styles.select}
                value={node.variant || 'body'}
                onChange={(e) => updateNodeOverride(node.id!, { variant: e.target.value as TextVariant })}
              >
                {textVariants.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Color</label>
              <input
                className={styles.input}
                value={node.color ? String(node.color) : ''}
                onChange={(e) => updateNodeOverride(node.id!, { color: e.target.value })}
                placeholder="foreground / accent / #ff0000"
              />
            </div>
          </div>

          <div className={styles.grid3}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={!!node.uppercase}
                onChange={(e) => updateNodeOverride(node.id!, { uppercase: e.target.checked })}
              />
              Uppercase
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={!!node.italic}
                onChange={(e) => updateNodeOverride(node.id!, { italic: e.target.checked })}
              />
              Italic
            </label>
            <div>
              <label className={styles.label}>Align</label>
              <select
                className={styles.select}
                value={node.align || 'left'}
                onChange={(e) => updateNodeOverride(node.id!, { align: e.target.value as 'left' | 'right' | 'center' })}
              >
                <option value="left">left</option>
                <option value="right">right</option>
                <option value="center">center</option>
              </select>
            </div>
          </div>

          <label className={styles.label}>Max Width</label>
          <input
            className={styles.input}
            value={node.maxWidth || ''}
            onChange={(e) => updateNodeOverride(node.id!, { maxWidth: e.target.value || undefined })}
            placeholder="e.g. 600px or 60%"
          />
        </div>
      )}

      {node.type === 'box' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Box</div>

          <label className={styles.label}>Color</label>
          <input
            className={styles.input}
            value={node.color ? String(node.color) : ''}
            onChange={(e) => updateNodeOverride(node.id!, { color: e.target.value || undefined })}
            placeholder="background / accent / #f00"
          />

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Padding</label>
              <input
                className={styles.input}
                value={node.padding ?? ''}
                onChange={(e) =>
                  updateNodeOverride(node.id!, {
                    padding: e.target.value === '' ? undefined : (Number(e.target.value) as SpacingKey),
                  })
                }
                placeholder="e.g. 4"
              />
            </div>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={!!node.border}
                onChange={(e) => updateNodeOverride(node.id!, { border: e.target.checked })}
              />
              Border
            </label>
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Padding X</label>
              <input
                className={styles.input}
                value={node.paddingX ?? ''}
                onChange={(e) =>
                  updateNodeOverride(node.id!, {
                    paddingX: e.target.value === '' ? undefined : (Number(e.target.value) as SpacingKey),
                  })
                }
                placeholder="e.g. 6"
              />
            </div>
            <div>
              <label className={styles.label}>Padding Y</label>
              <input
                className={styles.input}
                value={node.paddingY ?? ''}
                onChange={(e) =>
                  updateNodeOverride(node.id!, {
                    paddingY: e.target.value === '' ? undefined : (Number(e.target.value) as SpacingKey),
                  })
                }
                placeholder="e.g. 6"
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Border Width</label>
              <select
                className={styles.select}
                value={(node.borderWidth as string) || 'medium'}
                onChange={(e) => updateNodeOverride(node.id!, { borderWidth: e.target.value })}
              >
                <option value="thin">thin</option>
                <option value="medium">medium</option>
                <option value="thick">thick</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Border Color</label>
              <input
                className={styles.input}
                value={node.borderColor ? String(node.borderColor) : ''}
                onChange={(e) => updateNodeOverride(node.id!, { borderColor: e.target.value || undefined })}
                placeholder="foreground / accent / #000"
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Width</label>
              <input
                className={styles.input}
                value={node.width || ''}
                onChange={(e) => updateNodeOverride(node.id!, { width: e.target.value || undefined })}
                placeholder="e.g. 50%"
              />
            </div>
            <div>
              <label className={styles.label}>Height</label>
              <input
                className={styles.input}
                value={node.height || ''}
                onChange={(e) => updateNodeOverride(node.id!, { height: e.target.value || undefined })}
                placeholder="e.g. 200px"
              />
            </div>
          </div>

          <label className={styles.label}>Min Height</label>
          <input
            className={styles.input}
            value={node.minHeight || ''}
            onChange={(e) => updateNodeOverride(node.id!, { minHeight: e.target.value || undefined })}
            placeholder="e.g. 200px"
          />
        </div>
      )}

      {node.type === 'stack' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Stack</div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Direction</label>
              <select
                className={styles.select}
                value={node.direction || 'vertical'}
                onChange={(e) => updateNodeOverride(node.id!, { direction: e.target.value as 'vertical' | 'horizontal' })}
              >
                <option value="vertical">vertical</option>
                <option value="horizontal">horizontal</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Gap</label>
              <input
                className={styles.input}
                value={node.gap ?? ''}
                onChange={(e) =>
                  updateNodeOverride(node.id!, {
                    gap: e.target.value === '' ? undefined : (Number(e.target.value) as SpacingKey),
                  })
                }
                placeholder="e.g. 6"
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Align</label>
              <select
                className={styles.select}
                value={node.align || 'stretch'}
                onChange={(e) => updateNodeOverride(node.id!, { align: e.target.value })}
              >
                <option value="start">start</option>
                <option value="center">center</option>
                <option value="end">end</option>
                <option value="stretch">stretch</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Justify</label>
              <select
                className={styles.select}
                value={node.justify || 'start'}
                onChange={(e) => updateNodeOverride(node.id!, { justify: e.target.value })}
              >
                <option value="start">start</option>
                <option value="center">center</option>
                <option value="end">end</option>
                <option value="between">between</option>
                <option value="around">around</option>
              </select>
            </div>
          </div>

          <div className={styles.grid2}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={!!node.wrap}
                onChange={(e) => updateNodeOverride(node.id!, { wrap: e.target.checked })}
              />
              Wrap
            </label>
            <div>
              <label className={styles.label}>Flex</label>
              <input
                className={styles.input}
                value={node.flex ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { flex: e.target.value === '' ? undefined : e.target.value })}
                placeholder="e.g. 1"
              />
            </div>
          </div>
        </div>
      )}

      {node.type === 'grid' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Grid</div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Columns</label>
              <input
                className={styles.input}
                value={node.columns ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { columns: e.target.value === '' ? undefined : e.target.value })}
                placeholder="e.g. 12 or '1fr 2fr'"
              />
            </div>
            <div>
              <label className={styles.label}>Rows</label>
              <input
                className={styles.input}
                value={node.rows ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { rows: e.target.value || undefined })}
                placeholder="e.g. 'auto 1fr'"
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Gap</label>
              <input
                className={styles.input}
                value={node.gap ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { gap: e.target.value === '' ? undefined : (Number(e.target.value) as SpacingKey) })}
                placeholder="e.g. 6"
              />
            </div>
            <div>
              <label className={styles.label}>Areas</label>
              <input
                className={styles.input}
                value={node.areas ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { areas: e.target.value || undefined })}
                placeholder="e.g. 'a a b b'"
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Column Gap</label>
              <input
                className={styles.input}
                value={node.columnGap ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { columnGap: e.target.value === '' ? undefined : (Number(e.target.value) as SpacingKey) })}
                placeholder="e.g. 6"
              />
            </div>
            <div>
              <label className={styles.label}>Row Gap</label>
              <input
                className={styles.input}
                value={node.rowGap ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { rowGap: e.target.value === '' ? undefined : (Number(e.target.value) as SpacingKey) })}
                placeholder="e.g. 6"
              />
            </div>
          </div>
        </div>
      )}

      {node.type === 'image' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Image</div>
          <label className={styles.label}>Src</label>
          <input className={styles.input} value={node.src} onChange={(e) => updateNodeOverride(node.id!, { src: e.target.value })} />
          <label className={styles.label}>Alt</label>
          <input className={styles.input} value={node.alt || ''} onChange={(e) => updateNodeOverride(node.id!, { alt: e.target.value || undefined })} />

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Fit</label>
              <select className={styles.select} value={node.fit || 'cover'} onChange={(e) => updateNodeOverride(node.id!, { fit: e.target.value })}>
                <option value="cover">cover</option>
                <option value="contain">contain</option>
                <option value="fill">fill</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Width</label>
              <input className={styles.input} value={node.width || ''} onChange={(e) => updateNodeOverride(node.id!, { width: e.target.value || undefined })} />
            </div>
          </div>

          <label className={styles.label}>Height</label>
          <input className={styles.input} value={node.height || ''} onChange={(e) => updateNodeOverride(node.id!, { height: e.target.value || undefined })} />
        </div>
      )}

      {isGridChild && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Grid Placement</div>
          <div className={styles.grid3}>
            <div>
              <label className={styles.label}>Column</label>
              <input
                className={styles.input}
                value={positionedNode.column || ''}
                onChange={(e) => updateNodeOverride(node.id!, { column: e.target.value || undefined })}
                placeholder="e.g. 1 / 7"
              />
            </div>
            <div>
              <label className={styles.label}>Row</label>
              <input
                className={styles.input}
                value={positionedNode.row || ''}
                onChange={(e) => updateNodeOverride(node.id!, { row: e.target.value || undefined })}
                placeholder="e.g. 1 / 2"
              />
            </div>
            <div>
              <label className={styles.label}>Area</label>
              <input
                className={styles.input}
                value={positionedNode.area || ''}
                onChange={(e) => updateNodeOverride(node.id!, { area: e.target.value || undefined })}
                placeholder="e.g. hero"
              />
            </div>
          </div>
        </div>
      )}

      {node.type === 'divider' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Divider</div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Color</label>
              <input
                className={styles.input}
                value={node.color ? String(node.color) : ''}
                onChange={(e) => updateNodeOverride(node.id!, { color: e.target.value || undefined })}
              />
            </div>
            <div>
              <label className={styles.label}>Thickness</label>
              <select
                className={styles.select}
                value={node.thickness || 'medium'}
                onChange={(e) => updateNodeOverride(node.id!, { thickness: e.target.value as 'thin' | 'medium' | 'thick' })}
              >
                <option value="thin">thin</option>
                <option value="medium">medium</option>
                <option value="thick">thick</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {node.type === 'spacer' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Spacer</div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Size</label>
              <input
                className={styles.input}
                value={node.size === 'flex' ? 'flex' : (node.size ?? '')}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  if (v === 'flex') updateNodeOverride(node.id!, { size: 'flex' });
                  else if (v === '') updateNodeOverride(node.id!, { size: undefined });
                  else updateNodeOverride(node.id!, { size: Number(v) as SpacingKey });
                }}
                placeholder="flex or 6"
              />
            </div>
            <div>
              <label className={styles.label}>Direction</label>
              <select
                className={styles.select}
                value={node.direction || 'vertical'}
                onChange={(e) => updateNodeOverride(node.id!, { direction: e.target.value as 'vertical' | 'horizontal' })}
              >
                <option value="vertical">vertical</option>
                <option value="horizontal">horizontal</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {node.type === 'seriesNumber' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Series Number</div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Number</label>
              <input
                className={styles.input}
                value={String(node.number)}
                onChange={(e) => updateNodeOverride(node.id!, { number: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Size</label>
              <select
                className={styles.select}
                value={node.size || 'md'}
                onChange={(e) => updateNodeOverride(node.id!, { size: e.target.value })}
              >
                {seriesNumberSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Color</label>
              <input
                className={styles.input}
                value={node.color ? String(node.color) : ''}
                onChange={(e) => updateNodeOverride(node.id!, { color: e.target.value || undefined })}
                placeholder="accent / foreground / #000"
              />
            </div>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={node.padZero !== false}
                onChange={(e) => updateNodeOverride(node.id!, { padZero: e.target.checked })}
              />
              Pad zero
            </label>
          </div>
        </div>
      )}

      {node.type === 'seriesDots' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Series Dots</div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Filled</label>
              <input
                className={styles.input}
                value={node.filled ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { filled: e.target.value === '' ? undefined : Number(e.target.value) })}
              />
            </div>
            <div>
              <label className={styles.label}>Total</label>
              <input
                className={styles.input}
                value={node.total ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { total: e.target.value === '' ? undefined : Number(e.target.value) })}
              />
            </div>
          </div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Color</label>
              <input
                className={styles.input}
                value={node.color ? String(node.color) : ''}
                onChange={(e) => updateNodeOverride(node.id!, { color: e.target.value || undefined })}
              />
            </div>
            <div>
              <label className={styles.label}>Filled Color</label>
              <input
                className={styles.input}
                value={node.filledColor ? String(node.filledColor) : ''}
                onChange={(e) => updateNodeOverride(node.id!, { filledColor: e.target.value || undefined })}
              />
            </div>
          </div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Size</label>
              <select
                className={styles.select}
                value={node.size || 'md'}
                onChange={(e) => updateNodeOverride(node.id!, { size: e.target.value })}
              >
                {seriesDotSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Gap</label>
              <input
                className={styles.input}
                value={node.gap ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { gap: e.target.value === '' ? undefined : (Number(e.target.value) as SpacingKey) })}
              />
            </div>
          </div>
        </div>
      )}

      {node.type === 'header' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Header</div>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={node.title || ''} onChange={(e) => updateNodeOverride(node.id!, { title: e.target.value || undefined })} />
          <label className={styles.label}>Subtitle</label>
          <input className={styles.input} value={node.subtitle || ''} onChange={(e) => updateNodeOverride(node.id!, { subtitle: e.target.value || undefined })} />
          <label className={styles.label}>Columns (comma separated)</label>
          <input
            className={styles.input}
            value={(node.columns || []).join(', ')}
            onChange={(e) => updateNodeOverride(node.id!, { columns: e.target.value ? e.target.value.split(',').map((s) => s.trim()).filter(Boolean) : [] })}
            placeholder="Meta 1, Meta 2, Meta 3"
          />
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={node.showDivider !== false}
              onChange={(e) => updateNodeOverride(node.id!, { showDivider: e.target.checked })}
            />
            Show divider
          </label>
        </div>
      )}

      {node.type === 'footer' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Footer</div>
          <label className={styles.label}>Author</label>
          <input className={styles.input} value={node.author || ''} onChange={(e) => updateNodeOverride(node.id!, { author: e.target.value || undefined })} />
          <label className={styles.label}>Author Meta</label>
          <input className={styles.input} value={node.authorMeta || ''} onChange={(e) => updateNodeOverride(node.id!, { authorMeta: e.target.value || undefined })} />
          <label className={styles.label}>Topic</label>
          <input className={styles.input} value={node.topic || ''} onChange={(e) => updateNodeOverride(node.id!, { topic: e.target.value || undefined })} />

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Series Number</label>
              <input
                className={styles.input}
                value={node.seriesNumber ?? ''}
                onChange={(e) => updateNodeOverride(node.id!, { seriesNumber: e.target.value === '' ? undefined : e.target.value })}
              />
            </div>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={node.showDots !== false}
                onChange={(e) => updateNodeOverride(node.id!, { showDots: e.target.checked })}
              />
              Show dots
            </label>
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Dots filled</label>
              <input
                className={styles.input}
                value={node.dotsConfig?.filled ?? ''}
                onChange={(e) =>
                  updateNodeOverride(node.id!, {
                    dotsConfig: {
                      ...(node.dotsConfig || {}),
                      filled: e.target.value === '' ? undefined : Number(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div>
              <label className={styles.label}>Dots total</label>
              <input
                className={styles.input}
                value={node.dotsConfig?.total ?? ''}
                onChange={(e) =>
                  updateNodeOverride(node.id!, {
                    dotsConfig: {
                      ...(node.dotsConfig || {}),
                      total: e.target.value === '' ? undefined : Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
