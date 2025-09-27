import { describe, expect, it } from 'vitest'

import type { TableColumn } from '@/core/utils/table'
import { formatTable } from '@/core/utils/table'

describe('Table Utilities', () => {
  const sampleData = [
    { name: 'Alice', age: 30, city: 'New York' },
    { name: 'Bob', age: 25, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' },
  ]

  const columns: TableColumn[] = [
    { field: 'name', width: 10, align: 'left' },
    { field: 'age', width: 5, align: 'center' },
    { field: 'city', width: 15, align: 'left' },
  ]

  describe('formatTable', () => {
    it('should format data as a table with default options', () => {
      const result = formatTable(columns, sampleData)
      const lines = result.split('\n')

      expect(lines).toHaveLength(5) // header + separator + 3 data rows
      expect(lines[0]).toContain('Name')
      expect(lines[0]).toContain('Age')
      expect(lines[0]).toContain('City')
      expect(lines[1]).toMatch(/^-+$/) // separator line
      expect(lines[2]).toContain('Alice')
      expect(lines[3]).toContain('Bob')
      expect(lines[4]).toContain('Charlie')
    })

    it('should handle empty data array', () => {
      const result = formatTable(columns, [])
      expect(result).toBe('No data to display')
    })

    it('should respect column alignment', () => {
      const centerColumns: TableColumn[] = [
        { field: 'name', width: 10, align: 'left' },
        { field: 'age', width: 5, align: 'center' },
        { field: 'city', width: 15, align: 'right' },
      ]

      const result = formatTable(centerColumns, sampleData)
      const lines = result.split('\n')

      // Check that age column is centered
      expect(lines[2]).toContain(' 30 ') // centered
      expect(lines[3]).toContain(' 25 ') // centered
      expect(lines[4]).toContain(' 35 ') // centered
    })

    it('should adjust column widths based on content', () => {
      const wideData = [{ name: 'VeryLongName', age: 100, city: 'VeryLongCityName' }]

      const narrowColumns: TableColumn[] = [
        { field: 'name', width: 5, align: 'left' },
        { field: 'age', width: 3, align: 'center' },
        { field: 'city', width: 8, align: 'left' },
      ]

      const result = formatTable(narrowColumns, wideData)
      const lines = result.split('\n')

      // Should expand to accommodate content
      expect(lines[2]).toContain('VeryLongName')
      expect(lines[2]).toContain('VeryLongCityName')
    })

    it('should handle custom border and separator characters', () => {
      const result = formatTable(columns, sampleData, {
        borderChar: '=',
        separatorChar: '|',
      })

      const lines = result.split('\n')
      expect(lines[1]).toContain('=') // separator line should use =
      expect(lines[0]).toContain('|') // header should use |
    })

    it('should handle no separators option', () => {
      const result = formatTable(columns, sampleData, {
        showSeparators: false,
      })

      const lines = result.split('\n')
      expect(lines[0]).not.toContain('|')
      expect(lines[2]).not.toContain('|')
    })

    it('should handle no header separator option', () => {
      const result = formatTable(columns, sampleData, {
        showHeaderSeparator: false,
      })

      const lines = result.split('\n')
      expect(lines).toHaveLength(4) // header + 3 data rows (no separator)
      expect(lines[1]).not.toMatch(/^-+$/) // no separator line
    })

    it('should handle mixed data types', () => {
      const mixedData = [
        { name: 'Alice', age: 30, active: true },
        { name: 'Bob', age: null, active: false },
        { name: 'Charlie', age: undefined, active: true },
      ]

      const mixedColumns: TableColumn[] = [
        { field: 'name', width: 10, align: 'left' },
        { field: 'age', width: 5, align: 'center' },
        { field: 'active', width: 8, align: 'center' },
      ]

      const result = formatTable(mixedColumns, mixedData)
      expect(result).toContain('true')
      expect(result).toContain('false')
      expect(result).toContain('null')
      expect(result).toContain('undefined')
    })
  })
})
