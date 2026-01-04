/**
 * Swiss Design System - Renderer Package
 *
 * Headless rendering of poster definitions to PNG images using Puppeteer.
 *
 * @packageDocumentation
 */

export {
  renderToPNG,
  renderToFile,
  renderBatch,
  closeBrowser,
  type RenderOptions,
  type RenderResult,
} from './render';

export { generateHTML } from './html-generator';
export { getBrowser, createPage, waitForFonts } from './browser';
