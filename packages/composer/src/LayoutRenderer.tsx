import React from 'react';
import {
  Text,
  Box,
  Stack,
  Grid,
  GridItem,
  Divider,
  Spacer,
  SeriesNumber,
  SeriesDots,
} from '@swiss/primitives';
import type {
  PrimitiveNode,
  PosterDefinition,
  TextNode,
  BoxNode,
  StackNode,
  GridNode,
  DividerNode,
  SpacerNode,
  SeriesNumberNode,
  SeriesDotsNode,
  HeaderNode,
  FooterNode,
} from './types';
import { Canvas } from './Canvas';

/**
 * LayoutRenderer - Renders a PosterDefinition to React components
 */
export interface LayoutRendererProps {
  /** The poster definition to render */
  definition: PosterDefinition;
  /** Show debug grid */
  showGrid?: boolean;
  /** Preview scale factor */
  scale?: number;
  /** Additional className for the canvas */
  className?: string;
}

export function LayoutRenderer({
  definition,
  showGrid = false,
  scale = 1,
  className,
}: LayoutRendererProps) {
  return (
    <Canvas
      canvas={definition.canvas}
      theme={definition.theme}
      showGrid={showGrid}
      scale={scale}
      className={className}
    >
      <NodeRenderer node={definition.root} />
    </Canvas>
  );
}

/**
 * NodeRenderer - Recursively renders primitive nodes
 */
interface NodeRendererProps {
  node: PrimitiveNode;
}

function NodeRenderer({ node }: NodeRendererProps) {
  switch (node.type) {
    case 'text':
      return <TextRenderer node={node} />;
    case 'box':
      return <BoxRenderer node={node} />;
    case 'stack':
      return <StackRenderer node={node} />;
    case 'grid':
      return <GridRenderer node={node} />;
    case 'divider':
      return <DividerRenderer node={node} />;
    case 'spacer':
      return <SpacerRenderer node={node} />;
    case 'seriesNumber':
      return <SeriesNumberRenderer node={node} />;
    case 'seriesDots':
      return <SeriesDotsRenderer node={node} />;
    case 'header':
      return <HeaderRenderer node={node} />;
    case 'footer':
      return <FooterRenderer node={node} />;
    case 'image':
      return <ImageRenderer node={node} />;
    default:
      console.warn('Unknown node type:', (node as PrimitiveNode).type);
      return null;
  }
}

// Individual node renderers

function TextRenderer({ node }: { node: TextNode }) {
  return (
    <Text
      variant={node.variant}
      color={node.color}
      uppercase={node.uppercase}
      italic={node.italic}
      align={node.align}
      maxWidth={node.maxWidth}
      style={node.style as React.CSSProperties}
    >
      {node.content}
    </Text>
  );
}

function BoxRenderer({ node }: { node: BoxNode }) {
  return (
    <Box
      color={node.color}
      padding={node.padding}
      paddingX={node.paddingX}
      paddingY={node.paddingY}
      border={node.border}
      borderWidth={node.borderWidth}
      borderColor={node.borderColor}
      width={node.width}
      height={node.height}
      minHeight={node.minHeight}
      style={node.style as React.CSSProperties}
    >
      {node.children?.map((child, i) => (
        <NodeRenderer key={child.id ?? i} node={child} />
      ))}
    </Box>
  );
}

function StackRenderer({ node }: { node: StackNode }) {
  return (
    <Stack
      direction={node.direction}
      gap={node.gap}
      align={node.align}
      justify={node.justify}
      wrap={node.wrap}
      flex={node.flex}
      style={node.style as React.CSSProperties}
    >
      {node.children.map((child, i) => (
        <NodeRenderer key={child.id ?? i} node={child} />
      ))}
    </Stack>
  );
}

function GridRenderer({ node }: { node: GridNode }) {
  return (
    <Grid
      columns={node.columns}
      rows={node.rows}
      gap={node.gap}
      columnGap={node.columnGap}
      rowGap={node.rowGap}
      areas={node.areas}
      style={node.style as React.CSSProperties}
    >
      {node.children.map((child, i) => {
        const { column, row, area, ...childNode } = child;
        if (column || row || area) {
          return (
            <GridItem key={child.id ?? i} column={column} row={row} area={area}>
              <NodeRenderer node={childNode as PrimitiveNode} />
            </GridItem>
          );
        }
        return <NodeRenderer key={child.id ?? i} node={childNode as PrimitiveNode} />;
      })}
    </Grid>
  );
}

function DividerRenderer({ node }: { node: DividerNode }) {
  return (
    <Divider
      color={node.color}
      thickness={node.thickness}
      margin={node.margin}
      style={node.style as React.CSSProperties}
    />
  );
}

function SpacerRenderer({ node }: { node: SpacerNode }) {
  return (
    <Spacer
      size={node.size}
      direction={node.direction}
      style={node.style as React.CSSProperties}
    />
  );
}

function SeriesNumberRenderer({ node }: { node: SeriesNumberNode }) {
  return (
    <SeriesNumber
      number={node.number}
      size={node.size}
      color={node.color}
      padZero={node.padZero}
      style={node.style as React.CSSProperties}
    />
  );
}

function SeriesDotsRenderer({ node }: { node: SeriesDotsNode }) {
  return (
    <SeriesDots
      filled={node.filled}
      total={node.total}
      color={node.color}
      filledColor={node.filledColor}
      size={node.size}
      gap={node.gap}
      style={node.style as React.CSSProperties}
    />
  );
}

/**
 * Header compound component renderer
 */
function HeaderRenderer({ node }: { node: HeaderNode }) {
  return (
    <Stack direction="vertical" gap={4}>
      {(node.title || node.subtitle) && (
        <Stack direction="horizontal" gap={2} align="center">
          {node.title && (
            <Text variant="meta" color="foreground">
              {node.title}
            </Text>
          )}
          {node.subtitle && (
            <Text variant="meta" color="foreground" italic>
              {node.subtitle}
            </Text>
          )}
        </Stack>
      )}
      {node.columns && node.columns.length > 0 && (
        <Grid columns={node.columns.length} gap={5}>
          {node.columns.map((col, i) => (
            <Text key={i} variant="meta" color="foreground">
              {col}
            </Text>
          ))}
        </Grid>
      )}
      {node.showDivider !== false && <Divider />}
    </Stack>
  );
}

/**
 * Footer compound component renderer
 */
function FooterRenderer({ node }: { node: FooterNode }) {
  const dots = node.dotsConfig || { filled: 3, total: 5 };

  return (
    <Stack direction="vertical" gap={4}>
      <Divider />
      <Stack direction="horizontal" justify="between" align="end">
        <Stack direction="horizontal" gap={8}>
          {node.showDots !== false && (
            <Stack direction="vertical" gap={2}>
              <SeriesDots filled={dots.filled} total={dots.total} />
              {node.author && (
                <Stack direction="vertical" gap={1}>
                  <Text variant="meta" color="foreground" style={{ fontWeight: 700 }}>
                    {node.author}
                  </Text>
                  {node.authorMeta && (
                    <Text variant="meta" color="muted">
                      {node.authorMeta}
                    </Text>
                  )}
                </Stack>
              )}
            </Stack>
          )}
          {node.topic && (
            <Stack direction="vertical" gap={2}>
              <SeriesDots filled={2} total={2} />
              <Text variant="meta" color="muted">
                {node.topic}
              </Text>
            </Stack>
          )}
        </Stack>
        {node.seriesNumber !== undefined && (
          <SeriesNumber number={node.seriesNumber} size="lg" />
        )}
      </Stack>
    </Stack>
  );
}

/**
 * Image renderer
 */
function ImageRenderer({ node }: { node: { src: string; alt?: string; fit?: string; width?: string; height?: string; style?: Record<string, string | number> } }) {
  return (
    <img
      src={node.src}
      alt={node.alt || ''}
      style={{
        objectFit: (node.fit as React.CSSProperties['objectFit']) || 'cover',
        width: node.width || '100%',
        height: node.height || 'auto',
        ...node.style,
      }}
    />
  );
}

export { NodeRenderer };
