import { describe, expect, it } from 'vitest'

import { parseMatchupHTML } from '@/services/matchup'

describe('Matchup Service', () => {
  describe('parseMatchupHTML', () => {
    it('should parse completed day HTML with win/loss indicators', () => {
      const completedDayHTML = `
        <table class="mdTable1" id="torikumi_table">
          <tbody>
            <tr>
              <th class="east brLt" colspan="2">東</th>
              <th>決まり手</th>
              <th class="west brRt" colspan="2">西</th>
            </tr>
            <tr>
              <td class="player">
                <div class="data">
                  <div><span class="rank">前頭十八枚目</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/3990/"><span>獅司</span></a></span>
                      <span class="perform">（0勝1敗）</span>
                    </p>
                  </div>
                </div>
              </td>
              <td class="result"><img src="/img/common/result_ic02.gif" width="16" height="16" alt="黒丸"></td>
              <td class="decide"><a onclick="getTechnic(12)" class="technic">上手投げ</a></td>
              <td class="result win"><img src="/img/common/result_ic01.gif" width="16" height="16" alt="白丸"></td>
              <td class="win">
                <div class="data">
                  <div><span class="rank">十両筆頭</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/4116/"><span>大青山</span></a></span>
                      <span class="perform">（1勝0敗）</span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `

      const results = parseMatchupHTML(completedDayHTML, 1)

      expect(results).toHaveLength(1)
      expect(results[0].east.kanji).toBe('獅司')
      expect(results[0].east.result).toBe('L') // Lost
      expect(results[0].east.technique).toBeUndefined() // No technique for loser
      expect(results[0].west.kanji).toBe('大青山')
      expect(results[0].west.result).toBe('W') // Won
      expect(results[0].west.technique).toBe('uwate-nage') // Technique should be extracted and translated
    })

    it('should parse incomplete day HTML without win/loss indicators', () => {
      const incompleteDayHTML = `
        <table class="mdTable1" id="torikumi_table">
          <tbody>
            <tr>
              <th class="east brLt" colspan="2">東</th>
              <th>決まり手</th>
              <th class="west brRt" colspan="2">西</th>
            </tr>
            <tr>
              <td class="player">
                <div class="data">
                  <div><span class="rank">前頭十八枚目</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/3990/"><span>獅司</span></a></span>
                      <span class="perform">（0勝0敗）</span>
                    </p>
                  </div>
                </div>
              </td>
              <td class="result"><img src="/img/common/dummy.gif" width="16" height="16" alt=""></td>
              <td class="decide">&nbsp;<br></td>
              <td class="result"><img src="/img/common/dummy.gif" width="16" height="16" alt=""></td>
              <td class="player">
                <div class="data">
                  <div><span class="rank">十両筆頭</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/4116/"><span>大青山</span></a></span>
                      <span class="perform">（0勝0敗）</span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `

      const results = parseMatchupHTML(incompleteDayHTML, 1)

      expect(results).toHaveLength(1)
      expect(results[0].east.kanji).toBe('獅司')
      expect(results[0].east.result).toBe('') // No result yet
      expect(results[0].west.kanji).toBe('大青山')
      expect(results[0].west.result).toBe('') // No result yet
    })

    it('should handle records with rest days', () => {
      const htmlWithRestDays = `
        <table class="mdTable1" id="torikumi_table">
          <tbody>
            <tr>
              <th class="east brLt" colspan="2">東</th>
              <th>決まり手</th>
              <th class="west brRt" colspan="2">西</th>
            </tr>
            <tr>
              <td class="player">
                <div class="data">
                  <div><span class="rank">序ノ口二十四枚目</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/1234/"><span>佐田の城</span></a></span>
                      <span class="perform">（1勝0敗3休）</span>
                    </p>
                  </div>
                </div>
              </td>
              <td class="result"><img src="/img/common/dummy.gif" width="16" height="16" alt=""></td>
              <td class="decide">&nbsp;<br></td>
              <td class="result"><img src="/img/common/dummy.gif" width="16" height="16" alt=""></td>
              <td class="player">
                <div class="data">
                  <div><span class="rank">序ノ口八枚目</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/5678/"><span>輝の里</span></a></span>
                      <span class="perform">（1勝0敗3休）</span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `

      const results = parseMatchupHTML(htmlWithRestDays, 6)

      expect(results).toHaveLength(1)
      expect(results[0].east.kanji).toBe('佐田の城')
      expect(results[0].east.record).toBe('(1-0-3)') // Should translate rest days
      expect(results[0].west.kanji).toBe('輝の里')
      expect(results[0].west.record).toBe('(1-0-3)') // Should translate rest days
    })

    it('should handle multiple matchups in one table', () => {
      const multipleMatchupsHTML = `
        <table class="mdTable1" id="torikumi_table">
          <tbody>
            <tr>
              <th class="east brLt" colspan="2">東</th>
              <th>決まり手</th>
              <th class="west brRt" colspan="2">西</th>
            </tr>
            <tr>
              <td class="player">
                <div class="data">
                  <div><span class="rank">前頭十八枚目</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/3990/"><span>獅司</span></a></span>
                      <span class="perform">（0勝1敗）</span>
                    </p>
                  </div>
                </div>
              </td>
              <td class="result"><img src="/img/common/result_ic02.gif" width="16" height="16" alt="黒丸"></td>
              <td class="decide"><a onclick="getTechnic(12)" class="technic">上手投げ</a></td>
              <td class="result win"><img src="/img/common/result_ic01.gif" width="16" height="16" alt="白丸"></td>
              <td class="win">
                <div class="data">
                  <div><span class="rank">十両筆頭</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/4116/"><span>大青山</span></a></span>
                      <span class="perform">（1勝0敗）</span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="player">
                <div class="data">
                  <div><span class="rank">前頭十七枚目</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/2890/"><span>竜電</span></a></span>
                      <span class="perform">（1勝0敗）</span>
                    </p>
                  </div>
                </div>
              </td>
              <td class="result"><img src="/img/common/result_ic01.gif" width="16" height="16" alt="白丸"></td>
              <td class="decide"><a onclick="getTechnic(62)" class="technic">叩き込み</a></td>
              <td class="result"><img src="/img/common/result_ic02.gif" width="16" height="16" alt="黒丸"></td>
              <td class="win">
                <div class="data">
                  <div><span class="rank">前頭十六枚目</span></div>
                  <div>
                    <p class="box">
                      <span class="name"><a href="/ResultRikishiData/profile/3818/"><span>友風</span></a></span>
                      <span class="perform">（0勝1敗）</span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `

      const results = parseMatchupHTML(multipleMatchupsHTML, 1)

      expect(results).toHaveLength(2)

      // First matchup: 獅司 (L) vs 大青山 (W)
      expect(results[0].east.kanji).toBe('獅司')
      expect(results[0].east.result).toBe('L')
      expect(results[0].east.technique).toBeUndefined() // No technique for loser
      expect(results[0].west.kanji).toBe('大青山')
      expect(results[0].west.result).toBe('W')
      expect(results[0].west.technique).toBe('uwate-nage') // 上手投げ -> uwate-nage

      // Second matchup: 竜電 (W) vs 友風 (L)
      expect(results[1].east.kanji).toBe('竜電')
      expect(results[1].east.result).toBe('L')
      expect(results[1].east.technique).toBeUndefined() // No technique for loser
      expect(results[1].west.kanji).toBe('友風')
      expect(results[1].west.result).toBe('W')
      expect(results[1].west.technique).toBe('hataki-komi') // 叩き込み -> hataki-komi
    })

    it('should handle empty or malformed HTML gracefully', () => {
      const emptyHTML = '<table class="mdTable1" id="torikumi_table"><tbody></tbody></table>'
      const results = parseMatchupHTML(emptyHTML, 1)
      expect(results).toHaveLength(0)
    })

    it('should handle HTML without torikumi table', () => {
      const noTableHTML = '<div>No table here</div>'
      const results = parseMatchupHTML(noTableHTML, 1)
      expect(results).toHaveLength(0)
    })
  })
})
