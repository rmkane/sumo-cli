import puppeteer from 'puppeteer';

// HTTP utilities
async function fetchFromUrl(url: string): Promise<string> {
  console.log(`Fetching ${url} with Puppeteer...`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const html = await page.content();
    return html;
  } finally {
    await browser.close();
  }
}

// Simple fetch function without caching
export async function fetchHTML(url: string): Promise<string> {
  try {
    return await fetchFromUrl(url);
  } catch (error) {
    console.error(
      `Error fetching ${url}:`,
      error instanceof Error ? error.message : 'Unknown error'
    );
    throw error;
  }
}
