# Todo

Integrate the `scripts/basho.js` login into `src/index.ts`. All the logic should either exist, or explained here.

I want to turn this into a CLI:

- I want the script to take a day (`--day` or `-d`) value
- The first thing that should happen in download/cache the division info like already done
- Then I want to grab the Japanese matchup data here:
  - `https://www.sumo.or.jp/ResultData/torikumi/<division>/<day>/`
- Each matchup should be cached as: `html/day_<day>_<division_index>_<division_name>.html`
- With each cached HTML page, it should be parsed as defiend in the following section.

The 6 divisions as defined in `src/constants.ts` (`Division`)

## Sample matchup HTML parsing

Here is an example of the Makuuchi table.

1. The first row should be skipped
2. The `.name` is in Kanji, will be used to lookup the rikishi data
3. The `.rank` should be translated with the `RankMapping`
4. The performace should be translated:
   1. `（6勝2敗）`-> `(6-2)`

```html
<table class="mdTable1" id="torikumi_table" style="">
  <colgroup>
    <col span="1" class="colSp1" />
    <col span="1" class="colSp2" />
    <col span="1" class="colSp3" />
    <col span="1" class="colSp2" />
    <col span="1" class="colSp1" />
  </colgroup>
  <tbody>
    <tr>
      <th class="east brLt" colspan="2">東</th>
      <th>決まり手</th>
      <th class="west brRt" colspan="2">西</th>
    </tr>
    <tr>
      <td class="player">
        <div class="data">
          <div style="width: 100%"><span class="rank">前頭十八枚目</span></div>
          <div style="text-align: right; width: 100%">
            <p class="box">
              <span class="name"
                ><a href="/ResultRikishiData/profile/3990/"
                  ><span style="font-weight: bold">獅司</span></a
                ></span
              ><span class="perform">（6勝2敗）</span>
            </p>
          </div>
        </div>
      </td>
      <td class="result" style="vertical-align: middle">
        <img src="/img/common/dummy.gif" width="16" height="16" alt="" />
      </td>
      <td class="decide">&nbsp;<br /></td>
      <td class="result" style="vertical-align: middle">
        <img src="/img/common/dummy.gif" width="16" height="16" alt="" />
      </td>
      <td class="player">
        <div class="data">
          <div style="width: 100%"><span class="rank">前頭十四枚目</span></div>
          <div style="text-align: right; width: 100%">
            <p class="box">
              <span class="name"
                ><a href="/ResultRikishiData/profile/4101/"
                  ><span style="font-weight: bold">朝紅龍</span></a
                ></span
              ><span class="perform">（3勝5敗）</span>
            </p>
          </div>
        </div>
      </td>
    </tr>
    <!-- More rows -->
  </tbody>
</table>
```

The matchup data should be converted to the expected CSV format as seen in `basho.js`.
