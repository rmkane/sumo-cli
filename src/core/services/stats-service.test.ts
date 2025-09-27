import { describe, expect, it } from 'vitest'

import { parseRikishiFromHTML } from '@/core/parsers'

describe('Stats Service', () => {
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
                <tr>
                  <td>
                    <div class="box">
                      <a href="/rikishi/123">力士名</a>
                      <span class="hoshi_br">りきしめい</span>
                    </div>
                  </td>
                  <td class="hoshihaba back_color">横綱</td>
                  <td>
                    <div class="box">
                      <a href="/rikishi/456">大関名</a>
                      <span class="hoshi_br">おおぜきめい</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="box">
                      <a href="/rikishi/789">前頭名</a>
                      <span class="hoshi_br">まえがしらめい</span>
                    </div>
                  </td>
                  <td class="hoshihaba back_color">前頭六枚目</td>
                  <td>
                    <div class="box">
                      <a href="/rikishi/101">十両名</a>
                      <span class="hoshi_br">じゅうりょうめい</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `

      const results = parseRikishiFromHTML(testHTML, 1) // Pass division 1 (Makuuchi)

      expect(results).toHaveLength(4)

      // Test first rikishi (should have Yokozuna division with no position, East side)
      expect(results[0]?.rank?.division).toBe('Yokozuna')
      expect(results[0]?.rank?.position).toBeUndefined()
      expect(results[0]?.rank?.side).toBe('East')

      // Test second rikishi (should also have Yokozuna division with no position, West side)
      expect(results[1]?.rank?.division).toBe('Yokozuna')
      expect(results[1]?.rank?.position).toBeUndefined()
      expect(results[1]?.rank?.side).toBe('West')

      // Test third rikishi (should have Makuuchi division with position from rank text, East side)
      expect(results[2]?.rank?.division).toBe('Maegashira')
      expect(results[2]?.rank?.position).toBe(6)
      expect(results[2]?.rank?.side).toBe('East')

      // Test fourth rikishi (should also have Makuuchi division with position from rank text, West side)
      expect(results[3]?.rank?.division).toBe('Maegashira')
      expect(results[3]?.rank?.position).toBe(6)
      expect(results[3]?.rank?.side).toBe('West')
    })

    it('should handle edge cases in rank parsing', () => {
      const testHTML = `
        <html>
          <body>
            <table id="ew_table_sm">
              <tbody>
                <tr>
                  <td>
                    <div class="box">
                      <a href="/rikishi/123">力士名</a>
                      <span class="hoshi_br">りきしめい</span>
                    </div>
                  </td>
                  <td class="hoshihaba back_color">前頭一枚目</td>
                  <td>
                    <div class="box">
                      <a href="/rikishi/456">力士名</a>
                      <span class="hoshi_br">りきしめい</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="box">
                      <a href="/rikishi/789">力士名</a>
                      <span class="hoshi_br">りきしめい</span>
                    </div>
                  </td>
                  <td class="hoshihaba back_color">前頭十枚目</td>
                  <td>
                    <div class="box">
                      <a href="/rikishi/999">力士名</a>
                      <span class="hoshi_br">りきしめい</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `

      const results = parseRikishiFromHTML(testHTML, 1) // Pass division 1 (Makuuchi)

      expect(results).toHaveLength(4)

      // Test first rikishi (should have Maegashira division with position from rank text, East side)
      expect(results[0]?.rank?.division).toBe('Maegashira')
      expect(results[0]?.rank?.position).toBe(1)
      expect(results[0]?.rank?.side).toBe('East')

      // Test second rikishi (should also have Maegashira division with position from rank text, West side)
      expect(results[1]?.rank?.division).toBe('Maegashira')
      expect(results[1]?.rank?.position).toBe(1)
      expect(results[1]?.rank?.side).toBe('West')

      // Test third rikishi (should have Maegashira division with position from rank text, East side)
      expect(results[2]?.rank?.division).toBe('Maegashira')
      expect(results[2]?.rank?.position).toBe(10)
      expect(results[2]?.rank?.side).toBe('East')

      // Test fourth rikishi (should also have Maegashira division with position from rank text, West side)
      expect(results[3]?.rank?.division).toBe('Maegashira')
      expect(results[3]?.rank?.position).toBe(10)
      expect(results[3]?.rank?.side).toBe('West')
    })

    it('should parse rikishi data correctly', () => {
      const testHTML = `
        <html>
          <body>
            <table id="ew_table_sm">
              <tbody>
                <tr>
                  <td>
                    <div class="box">
                      <a href="/rikishi/123">白鵬</a>
                      <span class="hoshi_br">はくほう</span>
                    </div>
                  </td>
                  <th class="hoshihaba back_color">横綱</th>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `

      const results = parseRikishiFromHTML(testHTML, 1) // Pass division 1 (Makuuchi)

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        id: 123,
        name: {
          kanji: '白鵬',
          hiragana: 'はくほう',
          romaji: 'Hakuhō',
          english: 'Hakuho',
        },
        rank: {
          division: 'Yokozuna',
          side: 'East',
        },
      })
    })

    it('should parse real-world stats HTML structure', () => {
      const realWorldHTML = `
        <html>
          <body>
            <table class="mdTable5 colorType1 type3 map rwTable1" id="ew_table_sm">
              <tbody>
                <tr>
                  <th>東</th>
                  <th></th>
                  <th>西</th>
                </tr>
                <tr>
                  <td>
                    <div class="box">
                      <div>
                        <div><img alt="" src="/img/sumo_data/rikishi/60x60/20230048.jpg"></div>
                        <div>
                          <a href="/ResultRikishiData/profile/4227/"><span>大の里</span></a>
                          <span class="hoshi_br">(おおのさと)</span>
                        </div>
                      </div>
                      <p>
                        <span onclick="smKimaritePop(4227,'E','大の里',0)">7勝1敗</span>
                      </p>
                    </div>
                  </td>
                  <th class="tate">
                    <span>横綱</span>
                  </th>
                  <td>
                    <div class="box">
                      <div>
                        <div><img alt="" src="/img/sumo_data/rikishi/60x60/20170096.jpg"></div>
                        <div>
                          <a href="/ResultRikishiData/profile/3842/"><span>豊昇龍</span></a>
                          <span class="hoshi_br">(ほうしょうりゅう)</span>
                        </div>
                      </div>
                      <p>
                        <span onclick="smKimaritePop(3842,'W','豊昇龍',0)">6勝2敗</span>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="box">
                      <div>
                        <div><img alt="" src="/img/sumo_data/rikishi/60x60/20180023.jpg"></div>
                        <div>
                          <a href="/ResultRikishiData/profile/3990/"><span>獅司</span></a>
                          <span class="hoshi_br">(しし)</span>
                        </div>
                      </div>
                      <p>
                        <span onclick="smKimaritePop(3990,'E','獅司',0)">0勝1敗</span>
                      </p>
                    </div>
                  </td>
                  <th class="tate">
                    <span>前頭十八枚目</span>
                  </th>
                  <td>
                    <div class="box">
                      <div>
                        <div><img alt="" src="/img/sumo_data/rikishi/60x60/20190045.jpg"></div>
                        <div>
                          <a href="/ResultRikishiData/profile/4116/"><span>大青山</span></a>
                          <span class="hoshi_br">(だいせいざん)</span>
                        </div>
                      </div>
                      <p>
                        <span onclick="smKimaritePop(4116,'W','大青山',0)">1勝0敗</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `

      const results = parseRikishiFromHTML(realWorldHTML)

      expect(results).toHaveLength(4)

      // Test Yokozuna (大の里) - should have Yokozuna division with position from rank text, East side
      expect(results[0]).toEqual({
        id: 4227,
        name: {
          kanji: '大の里',
          hiragana: 'おおのさと',
          romaji: 'Ōnosato',
          english: 'Onosato',
        },
        rank: {
          division: 'Yokozuna',
          side: 'East',
        },
      })

      // Test Yokozuna (豊昇龍) - should have Yokozuna division with position from rank text, West side
      expect(results[1]).toEqual({
        id: 3842,
        name: {
          kanji: '豊昇龍',
          hiragana: 'ほうしょうりゅう',
          romaji: 'Hōshōryū',
          english: 'Hoshoryu',
        },
        rank: {
          division: 'Yokozuna',
          side: 'West',
        },
      })

      // Test Maegashira #18 (獅司) - should have Maegashira division with position from rank text, East side
      expect(results[2]).toEqual({
        id: 3990,
        name: {
          kanji: '獅司',
          hiragana: 'しし',
          romaji: 'Shishi',
          english: 'Shishi',
        },
        rank: {
          division: 'Maegashira',
          position: 18,
          side: 'East',
        },
      })

      // Test Maegashira (大青山) - should have Maegashira division with position from rank text, West side
      expect(results[3]).toEqual({
        id: 4116,
        name: {
          kanji: '大青山',
          hiragana: 'だいせいざん',
          romaji: 'Daisēzan',
          english: 'Daisezan',
        },
        rank: {
          division: 'Maegashira',
          position: 18,
          side: 'West',
        },
      })
    })

    it('should handle records with rest days in stats HTML', () => {
      const htmlWithRestDays = `
        <html>
          <body>
            <table id="ew_table_sm">
              <tbody>
                <tr>
                  <td>
                    <div class="box">
                      <div>
                        <div><img alt="" src="/img/sumo_data/rikishi/60x60/12345678.jpg"></div>
                        <div>
                          <a href="/ResultRikishiData/profile/1234/"><span>佐田の城</span></a>
                          <span class="hoshi_br">(さだのじょう)</span>
                        </div>
                      </div>
                      <p>
                        <span onclick="smKimaritePop(1234,'E','佐田の城',0)">1勝0敗3休</span>
                      </p>
                    </div>
                  </td>
                  <th class="tate">
                    <span>序ノ口二十四枚目</span>
                  </th>
                  <td>
                    <div class="box">
                      <div>
                        <div><img alt="" src="/img/sumo_data/rikishi/60x60/87654321.jpg"></div>
                        <div>
                          <a href="/ResultRikishiData/profile/5678/"><span>輝の里</span></a>
                          <span class="hoshi_br">(きのさと)</span>
                        </div>
                      </div>
                      <p>
                        <span onclick="smKimaritePop(5678,'W','輝の里',0)">1勝0敗3休</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `

      const results = parseRikishiFromHTML(htmlWithRestDays)

      expect(results).toHaveLength(2)
      expect(results[0]?.name.kanji).toBe('佐田の城')
      expect(results[0]?.name.hiragana).toBe('さだのじょう')
      expect(results[0]?.rank).toEqual({
        division: 'Jonokuchi',
        position: 24,
        side: 'East',
      })

      expect(results[1]?.name.kanji).toBe('輝の里')
      expect(results[1]?.name.hiragana).toBe('きのさと')
      expect(results[1]?.rank).toEqual({
        division: 'Jonokuchi',
        position: 24,
        side: 'West',
      })
    })

    it('should handle empty or malformed stats HTML gracefully', () => {
      const emptyHTML = '<table id="ew_table_sm"><tbody></tbody></table>'
      const results = parseRikishiFromHTML(emptyHTML)
      expect(results).toHaveLength(0)
    })

    it('should handle HTML without stats table', () => {
      const noTableHTML = '<div>No table here</div>'
      const results = parseRikishiFromHTML(noTableHTML)
      expect(results).toHaveLength(0)
    })
  })
})
