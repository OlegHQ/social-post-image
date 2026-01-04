/**
 * Puppeteer browser management
 * Handles browser lifecycle for headless rendering
 */

import puppeteer, { Browser, Page } from 'puppeteer';

let browserInstance: Browser | null = null;

/**
 * Get or create browser instance (singleton pattern)
 */
export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        '/Users/snowbear/.cache/puppeteer/chrome/mac_arm-127.0.6533.88/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
      timeout: 60000,
    });
  }
  return browserInstance;
}

/**
 * Close browser instance
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

/**
 * Create a new page with preloaded fonts
 */
export async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();

  // Disable animations and transitions for consistent screenshots
  await page.evaluateOnNewDocument(() => {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  });

  return page;
}

/**
 * Wait for fonts to be loaded
 */
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluateHandle('document.fonts.ready');
  // Additional wait to ensure font rendering is complete
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 100)));
}
