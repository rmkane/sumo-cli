import { describe, it, expect } from 'vitest'
import { parseRikishiFromHTML } from './parser'

describe('Parser Service', () => {
  describe('parseRank', () => {
    // We need to test the parseRank function indirectly through parseRikishiFromHTML
    // since it's not exported. Let's create a simple test HTML structure.

    it('should parse various rank formats correctly', () => {
      // Create a simple HTML structure to test rank parsing
      const testHTML = `
        <html>
          <body>
            <table id="ew_table_sm">
              <tbody>
                <tr class="box">
                  <td class="rank">横綱</td>
                  <td><a href="/rikishi/123">力士名</a></td>
                  <td class="hoshi_br">りきしめい</td>
                </tr>
                <tr class="box">
                  <td class="rank">大関</td>
                  <td><a href="/rikishi/456">大関名</a></td>
                  <td class="hoshi_br">おおぜきめい</td>
                </tr>
                <tr class="box">
                  <td class="rank">前頭六枚目</td>
                  <td><a href="/rikishi/789">前頭名</a></td>
                  <td class="hoshi_br">まえがしらめい</td>
                </tr>
                <tr class="box">
                  <td class="rank">十両</td>
                  <td><a href="/rikishi/101">十両名</a></td>
                  <td class="hoshi_br">じゅうりょうめい</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `

      const results = parseRikishiFromHTML(testHTML)

      expect(results).toHaveLength(4)

      // Test Yokozuna
      expect(results[0].rank!.division).toBe('Yokozuna')
      expect(results[0].rank!.position).toBe(0)

      // Test Ozeki
      expect(results[1].rank!.division).toBe('Ozeki')
      expect(results[1].rank!.position).toBe(0)

      // Test Maegashira #6 (前頭六枚目)
      expect(results[2].rank!.division).toBe('Maegashira')
      expect(results[2].rank!.position).toBe(6)

      // Test Juryo
      expect(results[3].rank!.division).toBe('Juryo')
      expect(results[3].rank!.position).toBe(0)
    })

    it('should handle edge cases in rank parsing', () => {
      const testHTML = `
        <html>
          <body>
            <table id="ew_table_sm">
              <tbody>
                <tr class="box">
                  <td class="rank">前頭一枚目</td>
                  <td><a href="/rikishi/123">力士名</a></td>
                  <td class="hoshi_br">りきしめい</td>
                </tr>
                <tr class="box">
                  <td class="rank">前頭十枚目</td>
                  <td><a href="/rikishi/456">力士名</a></td>
                  <td class="hoshi_br">りきしめい</td>
                </tr>
                <tr class="box">
                  <td class="rank">前頭十五枚目</td>
                  <td><a href="/rikishi/789">力士名</a></td>
                  <td class="hoshi_br">りきしめい</td>
                </tr>
                <tr class="box">
                  <td class="rank">不明な階級</td>
                  <td><a href="/rikishi/999">力士名</a></td>
                  <td class="hoshi_br">りきしめい</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `

      const results = parseRikishiFromHTML(testHTML)

      expect(results).toHaveLength(4)

      // Test Maegashira #1 (前頭一枚目)
      expect(results[0].rank!.division).toBe('Maegashira')
      expect(results[0].rank!.position).toBe(1)

      // Test Maegashira #10 (前頭十枚目)
      expect(results[1].rank!.division).toBe('Maegashira')
      expect(results[1].rank!.position).toBe(10)

      // Test Maegashira #15 (前頭十五枚目)
      expect(results[2].rank!.division).toBe('Maegashira')
      expect(results[2].rank!.position).toBe(15)

      // Test unknown rank
      expect(results[3].rank?.division).toBe(undefined)
      expect(results[3].rank?.position).toBe(undefined)
    })

    it('should parse rikishi data correctly', () => {
      const testHTML = `
        <html>
          <body>
            <table id="ew_table_sm">
              <tbody>
                <tr class="box">
                  <td class="rank">横綱</td>
                  <td><a href="/rikishi/123">白鵬</a></td>
                  <td class="hoshi_br">はくほう</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `

      const results = parseRikishiFromHTML(testHTML)

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        id: 123,
        kanji: '白鵬',
        hiragana: 'はくほう',
        romaji: 'Hakuhō',
        english: 'Hakuho',
        rank: {
          division: 'Yokozuna',
          position: 0,
        },
      })
    })
  })
})
