import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DATA_PATHS } from '@/config/data'
import { MatchResult } from '@/constants'
import { processDayMatchups, processDivisionMatchups } from '@/features/matchups/processor'
import * as divisionProcessor from '@/services/division-processor'
import * as matchupService from '@/services/matchup'
import * as divisionIterator from '@/utils/division-iterator'
import * as logger from '@/utils/logger'

import * as csv from './csv'
import * as json from './json'

// Mock dependencies
vi.mock('@/services/division-processor')
vi.mock('@/services/matchup')
vi.mock('@/utils/division-iterator')
vi.mock('@/utils/logger')
vi.mock('./csv')
vi.mock('./json')
vi.mock('@/config/data')

describe('Matchups Processor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('processDivisionMatchups', () => {
    it('should process division matchups successfully', async () => {
      const mockMatchupData = {
        html: '<html>test</html>',
        fromServer: true,
      }
      const mockParsedMatchups = [
        {
          east: {
            name: { english: 'Hakuho', kanji: '白鵬', hiragana: 'はくほう' },
            rank: { division: 'Yokozuna' },
            record: { wins: 1, losses: 0 },
            result: MatchResult.WIN,
          },
          west: {
            name: { english: 'Kisenosato', kanji: '稀勢の里', hiragana: 'きせのさと' },
            rank: { division: 'Yokozuna' },
            record: { wins: 0, losses: 1 },
            result: MatchResult.LOSS,
          },
        },
      ]

      vi.mocked(matchupService.fetchMatchupData).mockResolvedValue(mockMatchupData)
      vi.mocked(matchupService.parseMatchupHTML).mockReturnValue(mockParsedMatchups)
      vi.mocked(csv.saveMatchupCSV).mockResolvedValue()
      vi.mocked(json.saveMatchupJSON).mockResolvedValue()
      vi.mocked(logger.logProcessingStart).mockImplementation(() => {})
      vi.mocked(logger.logProcessingComplete).mockImplementation(() => {})

      await processDivisionMatchups('makuuchi', 1, 5, false, '/output')

      expect(logger.logProcessingStart).toHaveBeenCalledWith('matchups', 'makuuchi day 5')
      expect(matchupService.fetchMatchupData).toHaveBeenCalledWith(1, 5, false)
      expect(matchupService.parseMatchupHTML).toHaveBeenCalledWith(mockMatchupData.html, 1, 5)
      expect(json.saveMatchupJSON).toHaveBeenCalledWith(mockParsedMatchups, 'makuuchi', 1, 5)
      expect(csv.saveMatchupCSV).toHaveBeenCalledWith(mockParsedMatchups, 'makuuchi', 1, 5, '/output')
      expect(logger.logProcessingComplete).toHaveBeenCalledWith('matchups', 1, 'makuuchi day 5')
    })

    it('should handle empty matchups gracefully', async () => {
      const mockMatchupData = {
        html: '<html>test</html>',
        fromServer: true,
      }

      vi.mocked(matchupService.fetchMatchupData).mockResolvedValue(mockMatchupData)
      vi.mocked(matchupService.parseMatchupHTML).mockReturnValue([])
      vi.mocked(logger.logProcessingStart).mockImplementation(() => {})
      vi.mocked(logger.logWarning).mockImplementation(() => {})

      await processDivisionMatchups('makuuchi', 1, 5, false)

      expect(logger.logWarning).toHaveBeenCalledWith(
        'No valid matchups found for makuuchi day 5 - skipping file creation',
      )
      expect(csv.saveMatchupCSV).not.toHaveBeenCalled()
      expect(json.saveMatchupJSON).not.toHaveBeenCalled()
    })

    it('should handle errors and re-throw them', async () => {
      const error = new Error('Fetch error')
      vi.mocked(matchupService.fetchMatchupData).mockRejectedValue(error)
      vi.mocked(logger.logProcessingStart).mockImplementation(() => {})
      vi.mocked(logger.logError).mockImplementation(() => {})

      await expect(processDivisionMatchups('makuuchi', 1, 5, false)).rejects.toThrow('Fetch error')

      expect(logger.logError).toHaveBeenCalledWith('makuuchi day 5', error)
    })
  })

  describe('processDayMatchups', () => {
    beforeEach(() => {
      vi.mocked(DATA_PATHS).OUTPUT_DIR = './output'
    })

    it('should process all divisions for a day successfully', async () => {
      const mockMatchupData = {
        html: '<html>test</html>',
        fromServer: true,
      }
      const mockParsedMatchups = [
        {
          east: {
            name: { english: 'Hakuho', kanji: '白鵬', hiragana: 'はくほう' },
            rank: { division: 'Yokozuna' },
            record: { wins: 1, losses: 0 },
            result: MatchResult.WIN,
          },
          west: {
            name: { english: 'Kisenosato', kanji: '稀勢の里', hiragana: 'きせのさと' },
            rank: { division: 'Yokozuna' },
            record: { wins: 0, losses: 1 },
            result: MatchResult.LOSS,
          },
        },
      ]

      vi.mocked(divisionIterator.processAllDivisions).mockImplementation(async (processor) => {
        const result1 = await processor('makuuchi', 1)
        const result2 = await processor('juryo', 2)
        return [result1, result2]
      })
      vi.mocked(divisionProcessor.processDivision).mockResolvedValue()
      vi.mocked(matchupService.fetchMatchupData).mockResolvedValue(mockMatchupData)
      vi.mocked(matchupService.parseMatchupHTML).mockReturnValue(mockParsedMatchups)
      vi.mocked(csv.saveMatchupCSV).mockResolvedValue()
      vi.mocked(json.saveMatchupJSON).mockResolvedValue()
      vi.mocked(logger.logProcessingStart).mockImplementation(() => {})
      vi.mocked(logger.logDebug).mockImplementation(() => {})
      vi.mocked(logger.logProcessingComplete).mockImplementation(() => {})

      const result = await processDayMatchups(5, false, '/custom/output')

      expect(logger.logProcessingStart).toHaveBeenCalledWith('day matchups', 'day 5')
      expect(logger.logDebug).toHaveBeenCalledWith('Caching division info...')
      expect(logger.logDebug).toHaveBeenCalledWith('Fetching matchup data...')
      expect(divisionIterator.processAllDivisions).toHaveBeenCalledTimes(2)
      expect(result).toEqual({
        outputDir: '/custom/output',
        filesCreated: 2,
      })
    })

    it('should use default output directory when not specified', async () => {
      vi.mocked(divisionIterator.processAllDivisions).mockImplementation(async () => [])
      vi.mocked(logger.logProcessingStart).mockImplementation(() => {})
      vi.mocked(logger.logDebug).mockImplementation(() => {})

      const result = await processDayMatchups(5, false)

      expect(result.outputDir).toBe('./output')
    })

    it('should handle divisions with no matchups', async () => {
      vi.mocked(divisionIterator.processAllDivisions).mockImplementation(async (processor) => {
        const result = await processor('makuuchi', 1)
        return [result]
      })
      vi.mocked(divisionProcessor.processDivision).mockResolvedValue()
      vi.mocked(matchupService.fetchMatchupData).mockResolvedValue({
        html: '<html>test</html>',
        fromServer: true,
      })
      vi.mocked(matchupService.parseMatchupHTML).mockReturnValue([])
      vi.mocked(logger.logProcessingStart).mockImplementation(() => {})
      vi.mocked(logger.logDebug).mockImplementation(() => {})
      vi.mocked(logger.logWarning).mockImplementation(() => {})

      const result = await processDayMatchups(5, false)

      expect(logger.logWarning).toHaveBeenCalledWith(
        'No valid matchups found for makuuchi day 5 - skipping file creation',
      )
      expect(result.filesCreated).toBe(0)
    })

    it('should handle mixed results (some divisions with matchups, some without)', async () => {
      vi.mocked(divisionIterator.processAllDivisions).mockImplementation(async (processor) => {
        const result1 = await processor('makuuchi', 1)
        const result2 = await processor('juryo', 2)
        return [result1, result2]
      })
      vi.mocked(divisionProcessor.processDivision).mockResolvedValue()
      vi.mocked(matchupService.fetchMatchupData)
        .mockResolvedValueOnce({ html: '<html>test</html>', fromServer: true })
        .mockResolvedValueOnce({ html: '<html>test2</html>', fromServer: true })
      vi.mocked(matchupService.parseMatchupHTML)
        .mockReturnValueOnce([
          {
            east: {
              name: { english: 'Test', kanji: 'テスト', hiragana: 'てすと' },
              rank: { division: 'Makuuchi' },
              record: { wins: 1, losses: 0 },
              result: MatchResult.WIN,
            },
            west: {
              name: { english: 'Test2', kanji: 'テスト2', hiragana: 'てすと2' },
              rank: { division: 'Makuuchi' },
              record: { wins: 0, losses: 1 },
              result: MatchResult.LOSS,
            },
          },
        ]) // makuuchi has matchups
        .mockReturnValueOnce([]) // juryo has no matchups
      vi.mocked(csv.saveMatchupCSV).mockResolvedValue()
      vi.mocked(json.saveMatchupJSON).mockResolvedValue()
      vi.mocked(logger.logProcessingStart).mockImplementation(() => {})
      vi.mocked(logger.logDebug).mockImplementation(() => {})
      vi.mocked(logger.logProcessingComplete).mockImplementation(() => {})
      vi.mocked(logger.logWarning).mockImplementation(() => {})

      const result = await processDayMatchups(5, false)

      expect(result.filesCreated).toBe(1)
      expect(logger.logProcessingComplete).toHaveBeenCalledWith('matchups', 1, 'makuuchi day 5')
      expect(logger.logWarning).toHaveBeenCalledWith('No valid matchups found for juryo day 5 - skipping file creation')
    })
  })
})
