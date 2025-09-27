import puppeteer, { Browser, Page } from 'puppeteer'

import { logDebug } from '@/utils/logger'

/**
 * Configuration options for HTML fetching operations.
 */
export interface FetchOptions {
  /** Timeout in milliseconds for page load operations */
  timeout?: number
  /** Whether to wait for network to be idle */
  waitForNetworkIdle?: boolean
  /** Custom user agent string */
  userAgent?: string
  /** Additional headers to send with requests */
  headers?: Record<string, string>
  /** Whether to enable JavaScript execution */
  enableJavaScript?: boolean
  /** Viewport dimensions */
  viewport?: { width: number; height: number }
}

/**
 * Default configuration for HTML fetching operations.
 */
const DEFAULT_FETCH_OPTIONS: Required<FetchOptions> = {
  timeout: 30000, // 30 seconds
  waitForNetworkIdle: true,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  headers: {},
  enableJavaScript: true,
  viewport: { width: 1920, height: 1080 },
}

/**
 * Fetches HTML content from a URL using Puppeteer with comprehensive error handling.
 *
 * This function launches a headless browser, navigates to the specified URL,
 * and returns the rendered HTML content. It includes proper resource cleanup
 * and detailed error reporting for debugging purposes.
 *
 * @param url - The URL to fetch HTML from
 * @param options - Configuration options for the fetch operation
 * @returns Promise that resolves to the HTML content as a string
 *
 * @example
 * ```typescript
 * // Basic usage
 * const html = await fetchFromUrl('https://example.com');
 *
 * // With custom options
 * const html = await fetchFromUrl('https://example.com', {
 *   timeout: 60000,
 *   userAgent: 'Custom User Agent',
 *   headers: { 'Accept-Language': 'ja-JP' }
 * });
 * ```
 *
 * @throws {Error} When the URL is invalid or network request fails
 * @since 1.0.0
 */
async function fetchFromUrl(url: string, options: FetchOptions = {}): Promise<string> {
  const config = { ...DEFAULT_FETCH_OPTIONS, ...options }

  logDebug(`Fetching ${url} with Puppeteer...`)

  let browser: Browser | null = null
  let page: Page | null = null

  try {
    // Launch browser with optimized settings
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    }

    browser = await puppeteer.launch(launchOptions)
    page = await browser.newPage()

    // Set viewport and user agent
    await page.setViewport(config.viewport)
    await page.setUserAgent(config.userAgent)

    // Set additional headers if provided
    if (Object.keys(config.headers).length > 0) {
      await page.setExtraHTTPHeaders(config.headers)
    }

    // Disable JavaScript if not needed (faster for static content)
    if (!config.enableJavaScript) {
      await page.setJavaScriptEnabled(false)
    }

    // Navigate to URL with appropriate wait strategy
    const waitUntil = config.waitForNetworkIdle ? 'networkidle0' : 'domcontentloaded'
    await page.goto(url, {
      waitUntil,
      timeout: config.timeout,
    })

    // Get the rendered HTML content
    const html = await page.content()
    return html
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error fetching ${url}:`, errorMessage)
    throw new Error(`Failed to fetch HTML from ${url}: ${errorMessage}`)
  } finally {
    // Ensure proper cleanup
    if (page) {
      try {
        await page.close()
      } catch (error) {
        console.warn('Error closing page:', error)
      }
    }
    if (browser) {
      try {
        await browser.close()
      } catch (error) {
        console.warn('Error closing browser:', error)
      }
    }
  }
}

/**
 * Fetches HTML content from a URL with default configuration.
 *
 * This is a simplified wrapper around fetchFromUrl that uses sensible defaults
 * for most web scraping scenarios. For more control, use fetchFromUrl directly.
 *
 * @param url - The URL to fetch HTML from
 * @returns Promise that resolves to the HTML content as a string
 *
 * @example
 * ```typescript
 * const html = await fetchHTML('https://sumo.or.jp/ResultData/hoshitori/makuuchi/1/');
 * ```
 *
 * @throws {Error} When the URL is invalid or network request fails
 * @since 1.0.0
 */
export async function fetchHTML(url: string): Promise<string> {
  return fetchFromUrl(url)
}

/**
 * Fetches HTML content from a URL with custom configuration options.
 *
 * This function provides full control over the fetching process, allowing
 * customization of timeouts, headers, user agents, and other browser settings.
 *
 * @param url - The URL to fetch HTML from
 * @param options - Configuration options for the fetch operation
 * @returns Promise that resolves to the HTML content as a string
 *
 * @example
 * ```typescript
 * const html = await fetchHTMLWithOptions('https://example.com', {
 *   timeout: 60000,
 *   userAgent: 'Custom Bot/1.0',
 *   headers: { 'Accept-Language': 'ja-JP,ja;q=0.9' },
 *   waitForNetworkIdle: false
 * });
 * ```
 *
 * @throws {Error} When the URL is invalid or network request fails
 * @since 1.0.0
 */
export async function fetchHTMLWithOptions(url: string, options: FetchOptions): Promise<string> {
  return fetchFromUrl(url, options)
}

/**
 * Validates if a string is a valid URL.
 *
 * This function checks if the provided string follows URL format conventions
 * and can be used for web requests.
 *
 * @param url - The string to validate as a URL
 * @returns True if the string is a valid URL, false otherwise
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com')     // returns true
 * isValidUrl('http://localhost:3000')   // returns true
 * isValidUrl('not-a-url')               // returns false
 * isValidUrl('')                        // returns false
 * ```
 *
 * @since 1.0.0
 */
export function isValidUrl(url: string): boolean {
  if (url.length === 0) return false

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Extracts all links (href attributes) from HTML content.
 *
 * This function parses HTML content and extracts all anchor tag href attributes,
 * useful for web scraping scenarios where you need to find all links on a page.
 *
 * @param html - The HTML content to parse
 * @param baseUrl - Optional base URL for resolving relative links
 * @returns Array of absolute URLs found in the HTML
 *
 * @example
 * ```typescript
 * const links = extractLinks(html, 'https://example.com');
 * // Returns: ['https://example.com/page1', 'https://example.com/page2']
 * ```
 *
 * @since 1.0.0
 */
export function extractLinks(html: string, baseUrl?: string): string[] {
  if (html.length === 0) return []

  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi
  const links: string[] = []
  let match

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1]

    if (baseUrl !== undefined && baseUrl !== '' && !href.startsWith('http')) {
      // Resolve relative URLs
      try {
        const absoluteUrl = new URL(href, baseUrl).href
        links.push(absoluteUrl)
      } catch {
        // Skip invalid URLs
        continue
      }
    } else if (href.startsWith('http')) {
      links.push(href)
    }
  }

  return [...new Set(links)] // Remove duplicates
}

/**
 * Extracts text content from HTML, removing all HTML tags.
 *
 * This function provides a simple way to extract plain text from HTML content,
 * useful for text analysis or when you need the content without markup.
 *
 * @param html - The HTML content to extract text from
 * @returns Plain text content with HTML tags removed
 *
 * @example
 * ```typescript
 * const text = extractText('<p>Hello <strong>world</strong>!</p>');
 * // Returns: 'Hello world!'
 * ```
 *
 * @since 1.0.0
 */
export function extractText(html: string): string {
  if (html.length === 0) return ''

  // Simple HTML tag removal (for basic cases)
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags
    .replace(/<[^>]+>/g, '') // Remove all other HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

/**
 * Checks if HTML content contains specific text or patterns.
 *
 * This function is useful for validating that fetched HTML contains expected
 * content, such as checking if a page loaded correctly or contains specific data.
 *
 * @param html - The HTML content to search in
 * @param searchText - The text or pattern to search for
 * @param caseSensitive - Whether the search should be case sensitive
 * @returns True if the text is found in the HTML content
 *
 * @example
 * ```typescript
 * const hasContent = containsText(html, '大関');
 * const hasTitle = containsText(html, '<title>', true);
 * ```
 *
 * @since 1.0.0
 */
export function containsText(html: string, searchText: string, caseSensitive: boolean = false): boolean {
  if (html.length === 0 || searchText.length === 0) return false

  const content = caseSensitive ? html : html.toLowerCase()
  const search = caseSensitive ? searchText : searchText.toLowerCase()

  return content.includes(search)
}
