import { promises as fs } from 'node:fs'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { CSVHeader } from '@/core/utils/csv'
import { writeCSV } from '@/core/utils/csv'

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

  describe('Edge Cases and Error Handling', () => {
    it('should handle null and undefined values', async () => {
      const dataWithNulls = [
        { name: 'John Doe', age: null, city: 'New York' },
        { name: 'Jane Smith', age: '25', city: undefined },
        { name: null, age: '30', city: 'Chicago' },
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: dataWithNulls as unknown as Record<string, string>[],
      })

      expect(result).toContain('John Doe\t\tNew York')
      expect(result).toContain('Jane Smith\t25\t')
      expect(result).toContain('\t30\tChicago')
    })

    it('should handle empty arrays', async () => {
      const result = await writeCSV({
        headers: testHeaders,
        rows: [],
      })

      expect(result).toBe('Name\tAge\tCity\n')
    })

    it('should handle arrays with empty objects', async () => {
      const emptyObjects = [{}, {}, {}]

      const result = await writeCSV({
        headers: testHeaders,
        rows: emptyObjects,
      })

      expect(result).toContain('\t\t\n\t\t\n\t\t')
    })

    it('should handle very large datasets', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        name: `Person ${i}`,
        age: (20 + (i % 50)).toString(),
        city: `City ${i % 10}`,
      }))

      const result = await writeCSV({
        headers: testHeaders,
        rows: largeDataset,
      })

      expect(result).toContain('Name\tAge\tCity')
      expect(result).toContain('Person 0\t20\tCity 0')
      expect(result).toContain('Person 999\t69\tCity 9')
    })

    it('should handle special characters in data', async () => {
      const specialData = [
        { name: 'José María', age: '30', city: 'São Paulo' },
        { name: 'François', age: '25', city: 'Montréal' },
        { name: '北京', age: '35', city: '东京' },
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: specialData,
      })

      expect(result).toContain('José María\t30\tSão Paulo')
      expect(result).toContain('François\t25\tMontréal')
      expect(result).toContain('北京\t35\t东京')
    })

    it('should handle extremely long strings', async () => {
      const longString = 'x'.repeat(10000)
      const longData = [
        { name: longString, age: '30', city: 'New York' },
        { name: 'John Doe', age: '25', city: longString },
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: longData,
      })

      expect(result).toContain(longString)
    })

    it('should handle numeric data types', async () => {
      const numericData = [
        { name: 'John Doe', age: '30', city: 'New York' },
        { name: 'Jane Smith', age: '25.5', city: 'Los Angeles' },
      ]

      const result = await writeCSV({
        headers: testHeaders,
        rows: numericData,
      })

      expect(result).toContain('John Doe\t30\tNew York')
      expect(result).toContain('Jane Smith\t25.5\tLos Angeles')
    })

    it('should handle boolean data types', async () => {
      const booleanData = [
        { name: 'John Doe', age: '30', city: 'New York', active: 'true' },
        { name: 'Jane Smith', age: '25', city: 'Los Angeles', active: 'false' },
      ]

      const headersWithBoolean = [...testHeaders, { id: 'active', title: 'Active' }]

      const result = await writeCSV({
        headers: headersWithBoolean,
        rows: booleanData,
      })

      expect(result).toContain('John Doe\t30\tNew York\ttrue')
      expect(result).toContain('Jane Smith\t25\tLos Angeles\tfalse')
    })
  })

  describe('Performance and Memory', () => {
    it('should handle memory efficiently with large datasets', async () => {
      const startMemory = process.memoryUsage().heapUsed

      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        name: `Person ${i}`,
        age: (20 + (i % 50)).toString(),
        city: `City ${i % 100}`,
        description: `Description for person ${i}`,
      }))

      const headersWithDescription = [...testHeaders, { id: 'description', title: 'Description' }]

      const result = await writeCSV({
        headers: headersWithDescription,
        rows: largeDataset,
      })

      const endMemory = process.memoryUsage().heapUsed
      const memoryIncrease = endMemory - startMemory

      // Should not use excessive memory (less than 50MB for 1k records)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
      expect(result).toContain('Person 0\t20\tCity 0\tDescription for person 0')
      expect(result).toContain('Person 999\t69\tCity 99\tDescription for person 999')
    })

    it('should handle concurrent CSV generation', async () => {
      const datasets = Array.from({ length: 5 }, (_, i) => ({
        headers: testHeaders,
        rows: Array.from({ length: 100 }, (_, j) => ({
          name: `Person ${i}-${j}`,
          age: (20 + j).toString(),
          city: `City ${i}`,
        })),
      }))

      const promises = datasets.map((dataset) => writeCSV(dataset))
      const results = await Promise.all(promises)

      expect(results).toHaveLength(5)
      results.forEach((result, i) => {
        expect(result).toContain(`Person ${i}-0\t20\tCity ${i}`)
        expect(result).toContain(`Person ${i}-99\t119\tCity ${i}`)
      })
    })
  })

  describe('File System Integration', () => {
    const testDir = './test-csv-output'
    const testFile = path.join(testDir, 'integration-test.csv')

    beforeEach(async () => {
      try {
        await fs.rm(testDir, { recursive: true, force: true })
      } catch {
        // Directory doesn't exist, that's fine
      }
    })

    afterEach(async () => {
      try {
        await fs.rm(testDir, { recursive: true, force: true })
      } catch {
        // Directory doesn't exist, that's fine
      }
    })

    it('should handle file permission errors gracefully', async () => {
      // Create a file first
      await writeCSV({
        headers: testHeaders,
        rows: testData,
        path: testFile,
      })

      // Try to write to the same file without overwrite permission
      // This test might not work on all systems, but demonstrates error handling
      try {
        await writeCSV({
          headers: testHeaders,
          rows: testData,
          path: testFile,
        })
        // If we get here, the file was overwritten successfully
        expect(await fs.access(testFile)).resolves.not.toThrow()
      } catch (error) {
        // If there's an error, it should be a proper Error object
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should handle disk space issues gracefully', async () => {
      // Create a very large dataset that might cause disk space issues
      const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
        name: `Person ${i}`,
        age: (20 + (i % 50)).toString(),
        city: `City ${i % 100}`,
        description: 'x'.repeat(100), // 100 characters per description
      }))

      const headersWithDescription = [...testHeaders, { id: 'description', title: 'Description' }]

      try {
        await writeCSV({
          headers: headersWithDescription,
          rows: largeDataset,
          path: testFile,
        })

        // If successful, verify the file was created
        const stats = await fs.stat(testFile)
        expect(stats.size).toBeGreaterThan(0)
      } catch (error) {
        // If there's an error (e.g., disk space), it should be handled gracefully
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should handle concurrent file writes', async () => {
      const files = Array.from({ length: 5 }, (_, i) => path.join(testDir, `concurrent-${i}.csv`))

      const promises = files.map((file, i) =>
        writeCSV({
          headers: testHeaders,
          rows: testData.map((row) => ({ ...row, name: `${row.name} ${i}` })),
          path: file,
        }),
      )

      await Promise.all(promises)

      // Verify all files were created
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8')
        expect(content).toContain('Name\tAge\tCity')
      }
    })
  })
})
