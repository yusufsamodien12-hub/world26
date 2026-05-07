
import { test, expect } from '@playwright/test';

test('check for console errors and app mounting', async ({ page }) => {
  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
    console.log(`BROWSER: [${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    logs.push(`[ERROR] ${err.message}`);
    console.log(`BROWSER ERROR: ${err.message}`);
  });

  await page.goto('http://localhost:4173'); // Default vite preview port

  // Wait for a bit to let things load
  await page.waitForTimeout(5000);

  const rootContent = await page.innerHTML('#root');
  console.log('Root content length:', rootContent.length);

  // Take a screenshot
  await page.screenshot({ path: 'debug_screenshot.png' });

  // Check if "Loading Architect-OS..." is still there
  const loadingVisible = await page.isVisible('text=Loading Architect-OS...');
  console.log('Is loading visible?', loadingVisible);

  expect(logs.some(l => l.includes('ReferenceError: module is not defined'))).toBe(false);
});
