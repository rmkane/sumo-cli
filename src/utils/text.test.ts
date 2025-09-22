import { describe, expect, it } from 'vitest'

import { centerText, centerTextWithDecorations, createHorizontalLine } from './text'

describe('Text Utilities', () => {
  describe('centerText', () => {
    it('should center text within default width', () => {
      const result = centerText('Hello')
      expect(result).toBe('                                     Hello')
      expect(result.length).toBe(42) // 42 characters after trimming trailing spaces
    })

    it('should center text within custom width', () => {
      const result = centerText('Hello', 20)
      expect(result).toBe('       Hello')
      expect(result.length).toBe(12) // 12 characters after trimming trailing spaces
    })

    it('should handle text longer than width', () => {
      const longText = 'This is a very long text that exceeds the width'
      const result = centerText(longText, 20)
      expect(result).toBe(longText)
    })

    it('should use custom padding character', () => {
      const result = centerText('Hello', 20, '*')
      expect(result).toBe('*******Hello********')
      expect(result.length).toBe(20) // 20 characters total, no trimming needed
    })

    it('should trim trailing spaces only', () => {
      const result = centerText('Hello', 20)
      expect(result).not.toMatch(/\s+$/)
      expect(result).toMatch(/^\s+/) // Should still have leading spaces
    })
  })

  describe('centerTextWithDecorations', () => {
    it('should center text with decorations', () => {
      const result = centerTextWithDecorations('Hello', 20, '[', ']')
      expect(result).toBe('      [Hello]')
      expect(result.length).toBe(13) // 13 characters after trimming trailing spaces
    })

    it('should center text with emoji decorations', () => {
      const result = centerTextWithDecorations('SUMO CLI', 30, '🥋 ', ' 🥋')
      expect(result).toBe('        🥋 SUMO CLI 🥋')
      expect(result.length).toBe(22) // 22 characters after trimming trailing spaces
    })
  })

  describe('createHorizontalLine', () => {
    it('should create horizontal line with default settings', () => {
      const result = createHorizontalLine()
      expect(result).toBe('════════════════════════════════════════════════════════════════════════════════')
      expect(result.length).toBe(80)
    })

    it('should create horizontal line with custom width', () => {
      const result = createHorizontalLine(20)
      expect(result).toBe('════════════════════')
      expect(result.length).toBe(20)
    })

    it('should create horizontal line with decorations', () => {
      const result = createHorizontalLine(20, '═', '🏛️  ', '')
      expect(result).toBe('🏛️  ═══════════════')
      expect(result.length).toBe(20) // 20 characters total
    })

    it('should create horizontal line with different character', () => {
      const result = createHorizontalLine(20, '-', '', '')
      expect(result).toBe('--------------------')
      expect(result.length).toBe(20)
    })
  })
})
