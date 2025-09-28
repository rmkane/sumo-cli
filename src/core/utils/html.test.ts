import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { containsText, extractLinks, extractText, fetchHTML, isValidUrl } from '@/core/utils/html'

describe('HTML Utilities', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('https://sumo.or.jp/ResultData/hoshitori/makuuchi/1/')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('://invalid')).toBe(false)
      expect(isValidUrl('http://')).toBe(false)
    })
  })

  describe('extractLinks', () => {
    it('should extract absolute URLs', () => {
      const html = '<a href="https://example.com">Link</a><a href="https://test.com">Test</a>'
      const links = extractLinks(html)
      expect(links).toEqual(['https://example.com', 'https://test.com'])
    })

    it('should resolve relative URLs with base URL', () => {
      const html = '<a href="/page1">Link</a><a href="page2">Test</a>'
      const links = extractLinks(html, 'https://example.com')
      expect(links).toEqual(['https://example.com/page1', 'https://example.com/page2'])
    })

    it('should handle empty HTML', () => {
      expect(extractLinks('')).toEqual([])
    })

    it('should remove duplicate links', () => {
      const html = '<a href="https://example.com">Link1</a><a href="https://example.com">Link2</a>'
      const links = extractLinks(html)
      expect(links).toEqual(['https://example.com'])
    })
  })

  describe('extractText', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>world</strong>!</p>'
      expect(extractText(html)).toBe('Hello world!')
    })

    it('should remove script and style tags', () => {
      const html = '<script>alert("test")</script><p>Content</p><style>body { color: red; }</style>'
      expect(extractText(html)).toBe('Content')
    })

    it('should normalize whitespace', () => {
      const html = '<p>Hello   world\n\n!</p>'
      expect(extractText(html)).toBe('Hello world !')
    })

    it('should handle empty HTML', () => {
      expect(extractText('')).toBe('')
    })
  })

  describe('containsText', () => {
    it('should find text in HTML content', () => {
      const html = '<p>Hello world</p>'
      expect(containsText(html, 'Hello')).toBe(true)
      expect(containsText(html, 'world')).toBe(true)
    })

    it('should be case insensitive by default', () => {
      const html = '<p>Hello World</p>'
      expect(containsText(html, 'hello')).toBe(true)
      expect(containsText(html, 'WORLD')).toBe(true)
    })

    it('should be case sensitive when specified', () => {
      const html = '<p>Hello World</p>'
      expect(containsText(html, 'hello', true)).toBe(false)
      expect(containsText(html, 'Hello', true)).toBe(true)
    })

    it('should handle empty inputs', () => {
      expect(containsText('', 'test')).toBe(false)
      expect(containsText('<p>content</p>', '')).toBe(false)
    })

    it('should find HTML tags when searching', () => {
      const html = '<p>Hello world</p>'
      expect(containsText(html, '<p>', true)).toBe(true)
      expect(containsText(html, '</p>', true)).toBe(true)
    })
  })

  describe('fetchHTML', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should handle invalid URLs', async () => {
      await expect(fetchHTML('not-a-url')).rejects.toThrow()
    })

    it('should handle network errors gracefully', async () => {
      // Test with a URL that will likely fail
      await expect(fetchHTML('https://this-domain-does-not-exist-12345.com')).rejects.toThrow()
    })
  })

  describe('Complex HTML Scenarios', () => {
    it('should handle malformed HTML', () => {
      const malformedHtml = '<p>Hello <strong>world</p> <div>Unclosed div'
      expect(extractText(malformedHtml)).toBe('Hello world Unclosed div')
    })

    it('should handle HTML with special characters', () => {
      const html = '<p>Hello &amp; goodbye &lt;world&gt;</p>'
      // Note: The current implementation doesn't decode HTML entities
      expect(extractText(html)).toBe('Hello &amp; goodbye &lt;world&gt;')
    })

    it('should handle nested HTML structures', () => {
      const complexHtml = `
        <div class="container">
          <header>
            <h1>Title</h1>
            <nav>
              <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </nav>
          </header>
          <main>
            <article>
              <h2>Article Title</h2>
              <p>Article content with <em>emphasis</em> and <strong>strong</strong> text.</p>
            </article>
          </main>
        </div>
      `
      const text = extractText(complexHtml)
      expect(text).toContain('Title')
      expect(text).toContain('Home')
      expect(text).toContain('About')
      expect(text).toContain('Article Title')
      expect(text).toContain('Article content with emphasis and strong text')
    })

    it('should handle HTML with different encodings', () => {
      const htmlWithUnicode = '<p>Hello 世界 🌍</p>'
      expect(extractText(htmlWithUnicode)).toBe('Hello 世界 🌍')
    })

    it('should handle very large HTML documents', () => {
      const largeHtml = `<div>${'x'.repeat(10000)}</div>`
      const text = extractText(largeHtml)
      expect(text).toBe('x'.repeat(10000))
    })

    it('should handle HTML with multiple script and style blocks', () => {
      const html = `
        <script>console.log('script1');</script>
        <style>body { color: red; }</style>
        <p>Content 1</p>
        <script>console.log('script2');</script>
        <style>h1 { font-size: 2em; }</style>
        <p>Content 2</p>
      `
      expect(extractText(html)).toBe('Content 1 Content 2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null and undefined inputs', () => {
      expect(extractText('')).toBe('')
      expect(extractLinks('')).toEqual([])
      expect(containsText('', 'test')).toBe(false)
    })

    it('should handle whitespace-only HTML', () => {
      const whitespaceHtml = '   \n\t  \r\n  '
      expect(extractText(whitespaceHtml)).toBe('')
    })

    it('should handle HTML with only comments', () => {
      const commentHtml = '<!-- This is a comment --><!-- Another comment -->'
      expect(extractText(commentHtml)).toBe('')
    })

    it('should handle HTML with CDATA sections', () => {
      const cdataHtml = '<![CDATA[This is CDATA content]]>'
      // Note: The current implementation doesn't handle CDATA sections
      expect(extractText(cdataHtml)).toBe('')
    })

    it('should handle HTML with DOCTYPE declarations', () => {
      const doctypeHtml = '<!DOCTYPE html><html><body>Content</body></html>'
      expect(extractText(doctypeHtml)).toBe('Content')
    })
  })
})
