/**
 * Render functions
 * Convert poster definitions to PNG images
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { getCanvasConfig, type CanvasPreset } from '@swiss/primitives';
import type { PosterDefinition } from '@swiss/composer';
import { getBrowser, createPage, closeBrowser, waitForFonts } from './browser';
import { generateHTML } from './html-generator';

export interface RenderOptions {
  /** Scale factor for retina output (1, 2, or 3) */
  scale?: number;
  /** Image format */
  format?: 'png' | 'jpeg' | 'webp';
  /** Quality for jpeg/webp (0-100) */
  quality?: number;
}

export interface RenderResult {
  /** Image buffer */
  buffer: Buffer;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Format */
  format: string;
}

/**
 * Render a poster definition to PNG buffer
 */
export async function renderToPNG(
  definition: PosterDefinition,
  options: RenderOptions = {}
): Promise<RenderResult> {
  const { scale = 2, format = 'png', quality = 100 } = options;

  // Resolve canvas dimensions
  const baseConfig = definition.canvas.preset
    ? getCanvasConfig(definition.canvas.preset as CanvasPreset)
    : { width: 1080, height: 1350, padding: 60, columns: 12, gap: 20 };

  const width = definition.canvas.width ?? baseConfig.width;
  const height = definition.canvas.height ?? baseConfig.height;

  // Generate HTML
  const html = generateHTML(definition);

  // Launch browser and render
  const browser = await getBrowser();
  const page = await createPage(browser);

  try {
    // Set viewport with scale factor
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: scale,
    });

    // Set content and wait for load
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Wait for fonts
    await waitForFonts(page);

    // Take screenshot
    const screenshotOptions: Parameters<typeof page.screenshot>[0] = {
      type: format,
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width,
        height,
      },
    };

    if (format !== 'png') {
      screenshotOptions.quality = quality;
    }

    const buffer = (await page.screenshot(screenshotOptions)) as Buffer;

    return {
      buffer,
      width: width * scale,
      height: height * scale,
      format,
    };
  } finally {
    await page.close();
  }
}

/**
 * Render a poster definition directly to a file
 */
export async function renderToFile(
  definition: PosterDefinition,
  outputPath: string,
  options: RenderOptions = {}
): Promise<void> {
  const result = await renderToPNG(definition, options);

  // Ensure output directory exists
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });

  // Write file
  await fs.writeFile(outputPath, result.buffer);
}

/**
 * Render multiple posters in batch
 */
export async function renderBatch(
  items: Array<{
    definition: PosterDefinition;
    outputPath: string;
    options?: RenderOptions;
  }>,
  onProgress?: (completed: number, total: number) => void
): Promise<void> {
  const total = items.length;

  for (let i = 0; i < items.length; i++) {
    const { definition, outputPath, options } = items[i];
    await renderToFile(definition, outputPath, options);
    onProgress?.(i + 1, total);
  }

  // Clean up browser after batch
  await closeBrowser();
}

// Re-export browser management
export { closeBrowser };
