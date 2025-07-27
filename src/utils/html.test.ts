import { describe, it, expect } from 'vitest'
import { isValidUrl, extractLinks, extractText, containsText } from './html'

describe('HTML Utilities', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(
        isValidUrl('https://sumo.or.jp/ResultData/hoshitori/makuuchi/1/'),
      ).toBe(true)
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
      const html =
        '<a href="https://example.com">Link</a><a href="https://test.com">Test</a>'
      const links = extractLinks(html)
      expect(links).toEqual(['https://example.com', 'https://test.com'])
    })

    it('should resolve relative URLs with base URL', () => {
      const html = '<a href="/page1">Link</a><a href="page2">Test</a>'
      const links = extractLinks(html, 'https://example.com')
      expect(links).toEqual([
        'https://example.com/page1',
        'https://example.com/page2',
      ])
    })

    it('should handle empty HTML', () => {
      expect(extractLinks('')).toEqual([])
    })

    it('should remove duplicate links', () => {
      const html =
        '<a href="https://example.com">Link1</a><a href="https://example.com">Link2</a>'
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
      const html =
        '<script>alert("test")</script><p>Content</p><style>body { color: red; }</style>'
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
})
