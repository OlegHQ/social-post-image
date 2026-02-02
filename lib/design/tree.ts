import type { PrimitiveNode } from '@/lib/types';

export type GridChild = PrimitiveNode & { column?: string; row?: string; area?: string };

export type NodeOverride = {
  // Override any node field except `type`
  [key: string]: unknown;
  style?: Record<string, string | number>;
};

export type NodeInsertion = {
  parentId: string;
  index?: number;
  node: PrimitiveNode | GridChild;
};

export type NodeOrderMap = Record<string, string[]>;

export function findParentInfo(
  root: PrimitiveNode,
  nodeId: string
): { parentId: string; index: number } | null {
  if (root.type === 'box') {
    const children = root.children || [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.id === nodeId) return { parentId: root.id || '', index: i };
      const found = findParentInfo(child, nodeId);
      if (found) return found;
    }
  }
  if (root.type === 'stack') {
    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i];
      if (child.id === nodeId) return { parentId: root.id || '', index: i };
      const found = findParentInfo(child, nodeId);
      if (found) return found;
    }
  }
  if (root.type === 'grid') {
    const children = root.children as unknown as GridChild[];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.id === nodeId) return { parentId: root.id || '', index: i };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { column, row, area, ...nodeWithoutGridProps } = child;
      const found = findParentInfo(nodeWithoutGridProps as PrimitiveNode, nodeId);
      if (found) return found;
    }
  }
  return null;
}

export function findNodeById(root: PrimitiveNode, nodeId: string): PrimitiveNode | null {
  if (root.id === nodeId) return root;

  if (root.type === 'box') {
    for (const child of root.children || []) {
      const found = findNodeById(child, nodeId);
      if (found) return found;
    }
  }
  if (root.type === 'stack') {
    for (const child of root.children) {
      const found = findNodeById(child, nodeId);
      if (found) return found;
    }
  }
  if (root.type === 'grid') {
    for (const child of root.children as unknown as GridChild[]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { column, row, area, ...nodeWithoutGridProps } = child;
      const found = findNodeById(nodeWithoutGridProps as PrimitiveNode, nodeId);
      if (found) return found;
    }
  }

  return null;
}

export function applyOverrides(root: PrimitiveNode, overrides: Record<string, NodeOverride>): PrimitiveNode {
  const override = root.id ? overrides[root.id] : undefined;
  let next: PrimitiveNode = root;

  if (override) {
    const rest = { ...override };
    delete (rest as { style?: unknown }).style;
    const mergedStyle = override.style ? { ...(root.style || {}), ...override.style } : root.style;
    next = {
      ...root,
      ...rest,
      ...(mergedStyle ? { style: mergedStyle } : {}),
      type: root.type,
    } as PrimitiveNode;
  }

  if (next.type === 'box') {
    return {
      ...next,
      children: next.children?.map((c) => applyOverrides(c, overrides)),
    };
  }
  if (next.type === 'stack') {
    return {
      ...next,
      children: next.children.map((c) => applyOverrides(c, overrides)),
    };
  }
  if (next.type === 'grid') {
    return {
      ...next,
      children: (next.children as unknown as GridChild[]).map((child) => {
        const { column, row, area, ...rest } = child;
        const nextChild = applyOverrides(rest as PrimitiveNode, overrides);

        const childOverride = child.id ? overrides[child.id] : undefined;
        const oColumn = typeof childOverride?.column === 'string' ? (childOverride.column as string) : undefined;
        const oRow = typeof childOverride?.row === 'string' ? (childOverride.row as string) : undefined;
        const oArea = typeof childOverride?.area === 'string' ? (childOverride.area as string) : undefined;

        return {
          ...nextChild,
          ...((oColumn ?? column) ? { column: oColumn ?? column } : {}),
          ...((oRow ?? row) ? { row: oRow ?? row } : {}),
          ...((oArea ?? area) ? { area: oArea ?? area } : {}),
        };
      }) as unknown as GridChild[],
    };
  }
  return next;
}

export function applyDeletions(root: PrimitiveNode, deletions: Set<string>): PrimitiveNode {
  if (root.type === 'box') {
    const filtered = (root.children || []).filter((c) => !c.id || !deletions.has(c.id));
    return {
      ...root,
      children: filtered.map((c) => applyDeletions(c, deletions)),
    };
  }
  if (root.type === 'stack') {
    const filtered = root.children.filter((c) => !c.id || !deletions.has(c.id));
    return {
      ...root,
      children: filtered.map((c) => applyDeletions(c, deletions)),
    };
  }
  if (root.type === 'grid') {
    const filtered = (root.children as unknown as GridChild[]).filter((c) => {
      const id = c?.id;
      return !id || !deletions.has(id);
    });
    return {
      ...root,
      children: filtered.map((child) => {
        const { column, row, area, ...rest } = child;
        const nextChild = applyDeletions(rest as PrimitiveNode, deletions);
        return { ...nextChild, ...(column ? { column } : {}), ...(row ? { row } : {}), ...(area ? { area } : {}) };
      }) as unknown as GridChild[],
    };
  }

  return root;
}

export function applyInsertions(root: PrimitiveNode, insertions: NodeInsertion[]): PrimitiveNode {
  if (insertions.length === 0) return root;

  const group = new Map<string, NodeInsertion[]>();
  for (const ins of insertions) {
    if (!group.has(ins.parentId)) group.set(ins.parentId, []);
    group.get(ins.parentId)!.push(ins);
  }

  const walk = (node: PrimitiveNode): PrimitiveNode => {
    let next: PrimitiveNode = node;

    const toInsert = node.id ? group.get(node.id) : undefined;
    if (toInsert && (node.type === 'box' || node.type === 'stack' || node.type === 'grid')) {
      const sorted = [...toInsert].sort((a, b) => (a.index ?? 1e9) - (b.index ?? 1e9));

      if (node.type === 'box') {
        const base = [...(node.children || [])];
        for (const ins of sorted) {
          const idx = ins.index ?? base.length;
          base.splice(Math.min(Math.max(idx, 0), base.length), 0, ins.node);
        }
        next = { ...node, children: base };
      }

      if (node.type === 'stack') {
        const base = [...node.children];
        for (const ins of sorted) {
          const idx = ins.index ?? base.length;
          base.splice(Math.min(Math.max(idx, 0), base.length), 0, ins.node);
        }
        next = { ...node, children: base };
      }

      if (node.type === 'grid') {
        const base = [...(node.children as unknown as GridChild[])];
        for (const ins of sorted) {
          const idx = ins.index ?? base.length;
          base.splice(Math.min(Math.max(idx, 0), base.length), 0, ins.node as GridChild);
        }
        next = { ...node, children: base as unknown as GridChild[] };
      }
    }

    if (next.type === 'box') {
      return {
        ...next,
        children: next.children?.map(walk),
      };
    }
    if (next.type === 'stack') {
      return {
        ...next,
        children: next.children.map(walk),
      };
    }
    if (next.type === 'grid') {
      return {
        ...next,
        children: (next.children as unknown as GridChild[]).map((child) => {
          const { column, row, area, ...rest } = child;
          const nextChild = walk(rest as PrimitiveNode);
          return { ...nextChild, ...(column ? { column } : {}), ...(row ? { row } : {}), ...(area ? { area } : {}) };
        }) as unknown as GridChild[],
      };
    }
    return next;
  };

  return walk(root);
}

export function applyOrders(root: PrimitiveNode, orders: NodeOrderMap): PrimitiveNode {
  if (!root.id) return root;

  const order = orders[root.id];
  let next: PrimitiveNode = root;

  const reorder = <T extends { id?: string }>(children: T[]): T[] => {
    if (!order || order.length === 0) return children;
    const map = new Map<string, T>();
    const rest: T[] = [];
    for (const c of children) {
      if (c.id) map.set(c.id, c);
      else rest.push(c);
    }
    const out: T[] = [];
    for (const id of order) {
      const item = map.get(id);
      if (item) {
        out.push(item);
        map.delete(id);
      }
    }
    for (const v of map.values()) out.push(v);
    for (const v of rest) out.push(v);
    return out;
  };

  if (root.type === 'box') {
    next = { ...root, children: root.children ? reorder(root.children) : root.children };
  }
  if (root.type === 'stack') {
    next = { ...root, children: reorder(root.children) };
  }
  if (root.type === 'grid') {
    next = { ...root, children: reorder(root.children as unknown as GridChild[]) as unknown as GridChild[] };
  }

  if (next.type === 'box' && next.children) {
    return { ...next, children: next.children.map((c) => applyOrders(c, orders)) };
  }
  if (next.type === 'stack') {
    return { ...next, children: next.children.map((c) => applyOrders(c, orders)) };
  }
  if (next.type === 'grid') {
    return {
      ...next,
      children: (next.children as unknown as GridChild[]).map((child) => {
        const { column, row, area, ...rest } = child;
        const nextChild = applyOrders(rest as PrimitiveNode, orders);
        return { ...nextChild, ...(column ? { column } : {}), ...(row ? { row } : {}), ...(area ? { area } : {}) };
      }) as unknown as GridChild[],
    };
  }

  return next;
}
