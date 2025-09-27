import { promises as fs } from 'node:fs'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { CSVHeader } from '@/utils/csv'
import { writeCSV } from '@/utils/csv'

describe('CSV Utility', () => {
  const testHeaders: CSVHeader[] = [
    { id: 'name', title: 'Name' },
    { id: 'age', title: 'Age' },
    { id: 'city', title: 'City' },
  ]

  const testData = [
    { name: 'John Doe', age: '30', city: 'New York' },
    { name: 'Jane Smith', age: '25', city: 'Los Angeles' },
    { name: 'Bob Johnson', age: '35', city: 'Chicago' },
  ]

  describe('writeCSV - String Output', () => {
    it('should return CSV string when no path provided', async () => {
      const result = await writeCSV({
        headers: testHeaders,
        rows: testData,
      })

      expect(typeof result).toBe('string')
      expect(result).toContain('Name\tAge\tCity')
      expect(result).toContain('John Doe\t30\tNew York')
      expect(result).toContain('Jane Smith\t25\tLos Angeles')
    })

    it('should handle empty data', async () => {
      const result = await writeCSV({
        headers: testHeaders,
        rows: [],
      })

      expect(result).toBe('Name\tAge\tCity\n')
    })

    it('should use custom delimiter', async () => {
      const result = await writeCSV({
        headers: testHeaders,
        rows: testData,
        delimiter: ',',
      })

      expect(result).toContain('Name,Age,City')
      expect(result).toContain('John Doe,30,New York')
    })

    it('should use custom newline', async () => {
      const result = await writeCSV({
        headers: testHeaders,
        rows: testData,
        newline: '\r\n',
      })

      expect(result).toContain('\r\n')
      // The result will still contain \n because the data itself has normalized newlines
      // but the line endings between rows should be \r\n
      const lines = (result as string).split('\r\n')
      expect(lines.length).toBeGreaterThan(1)
    })

    it('should handle extra header rows', async () => {
      const extraHeaders: CSVHeader[][] = [
        [
          { id: 'name', title: 'Personal' },
          { id: 'age', title: 'Info' },
          { id: 'city', title: 'Location' },
        ],
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: testData,
        extraHeaderRows: extraHeaders,
      })

      const lines = (result as string).split('\n')
      expect(lines[0]).toBe('Personal\tInfo\tLocation')
      expect(lines[1]).toBe('Name\tAge\tCity')
      expect(lines[2]).toBe('John Doe\t30\tNew York')
    })

    it('should handle multiple extra header rows', async () => {
      const extraHeaders: CSVHeader[][] = [
        [
          { id: 'name', title: 'Personal' },
          { id: 'age', title: 'Info' },
          { id: 'city', title: 'Location' },
        ],
        [
          { id: 'name', title: 'Details' },
          { id: 'age', title: 'Details' },
          { id: 'city', title: 'Details' },
        ],
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: testData,
        extraHeaderRows: extraHeaders,
      })

      const lines = (result as string).split('\n')
      expect(lines[0]).toBe('Personal\tInfo\tLocation')
      expect(lines[1]).toBe('Details\tDetails\tDetails')
      expect(lines[2]).toBe('Name\tAge\tCity')
    })

    it('should disable trailing newline', async () => {
      const result = await writeCSV({
        headers: testHeaders,
        rows: testData,
        ensureTrailingNewline: false,
      })

      expect(result).not.toMatch(/\n$/)
    })
  })

  describe('writeCSV - File Output', () => {
    const testDir = './test-output'
    const testFile = path.join(testDir, 'test.csv')

    beforeEach(async () => {
      // Clean up test directory
      try {
        await fs.rm(testDir, { recursive: true, force: true })
      } catch {
        // Directory doesn't exist, that's fine
      }
    })

    afterEach(async () => {
      // Clean up test directory
      try {
        await fs.rm(testDir, { recursive: true, force: true })
      } catch {
        // Directory doesn't exist, that's fine
      }
    })

    it('should write CSV to file', async () => {
      const result = await writeCSV({
        headers: testHeaders,
        rows: testData,
        path: testFile,
      })

      expect(result).toBeUndefined()

      const content = await fs.readFile(testFile, 'utf8')
      expect(content).toContain('Name\tAge\tCity')
      expect(content).toContain('John Doe\t30\tNew York')
    })

    it('should create directory if it does not exist', async () => {
      const nestedFile = path.join(testDir, 'nested', 'deep', 'test.csv')

      await writeCSV({
        headers: testHeaders,
        rows: testData,
        path: nestedFile,
      })

      const content = await fs.readFile(nestedFile, 'utf8')
      expect(content).toContain('Name\tAge\tCity')
    })

    it('should handle file with extra headers', async () => {
      const extraHeaders: CSVHeader[][] = [
        [
          { id: 'name', title: 'Personal' },
          { id: 'age', title: 'Info' },
          { id: 'city', title: 'Location' },
        ],
      ]

      await writeCSV({
        headers: testHeaders,
        rows: testData,
        path: testFile,
        extraHeaderRows: extraHeaders,
      })

      const content = await fs.readFile(testFile, 'utf8')
      const lines = content.split('\n')
      expect(lines[0]).toBe('Personal\tInfo\tLocation')
      expect(lines[1]).toBe('Name\tAge\tCity')
    })
  })

  describe('CSV Escaping', () => {
    it('should escape cells with delimiters', async () => {
      const dataWithDelimiters = [
        { name: 'John, Doe', age: '30', city: 'New York' },
        { name: 'Jane\tSmith', age: '25', city: 'Los Angeles' },
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: dataWithDelimiters,
        delimiter: '\t',
      })

      // When using tab delimiter, comma should NOT be escaped, but tab SHOULD be escaped
      expect(result).toContain('John, Doe') // comma not escaped with tab delimiter
      expect(result).toContain('"Jane\tSmith"') // tab is escaped
    })

    it('should escape cells with quotes', async () => {
      const dataWithQuotes = [
        { name: 'John "Johnny" Doe', age: '30', city: 'New York' },
        { name: 'Jane Smith', age: '25', city: 'Los "Angeles"' },
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: dataWithQuotes,
      })

      expect(result).toContain('"John ""Johnny"" Doe"')
      expect(result).toContain('"Los ""Angeles"""')
    })

    it('should escape cells with newlines', async () => {
      const dataWithNewlines = [
        { name: 'John\nDoe', age: '30', city: 'New York' },
        { name: 'Jane Smith', age: '25', city: 'Los\r\nAngeles' },
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: dataWithNewlines,
      })

      expect(result).toContain('"John\nDoe"')
      // The \r\n should be normalized to \n in the output, but it appears as separate lines
      expect(result).toContain('"Los')
      expect(result).toContain('Angeles"')
    })

    it('should not escape cells without special characters', async () => {
      const result = await writeCSV({
        headers: testHeaders,
        rows: testData,
      })

      expect(result).toContain('John Doe\t30\tNew York')
      expect(result).not.toContain('"John Doe"')
    })
  })

  describe('Type Safety', () => {
    it('should work with typed headers', async () => {
      type PersonKeys = 'name' | 'age' | 'city'

      const typedHeaders: CSVHeader<PersonKeys>[] = [
        { id: 'name', title: 'Name' },
        { id: 'age', title: 'Age' },
        { id: 'city', title: 'City' },
      ]

      const typedData: Record<PersonKeys, string>[] = [{ name: 'John Doe', age: '30', city: 'New York' }]

      const result = await writeCSV({
        headers: typedHeaders,
        rows: typedData,
      })

      expect(result).toContain('Name\tAge\tCity')
      expect(result).toContain('John Doe\t30\tNew York')
    })

    it('should handle missing data gracefully', async () => {
      const incompleteData: Record<string, string>[] = [
        { name: 'John Doe', age: '30' }, // missing city
        { name: 'Jane Smith', city: 'Los Angeles' }, // missing age
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: incompleteData,
      })

      expect(result).toContain('John Doe\t30\t')
      expect(result).toContain('Jane Smith\t\tLos Angeles')
    })
  })
})
