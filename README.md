# Rikishi Data

A Node.js application for downloading Rikishi names in Kanji and Hiragana, with support for converting Romaji to English.

## Prerequisites

```sh
npx puppeteer browsers install chrome
```

## Divisions

- Sekitori（関取）
  - Makuuchi（幕内） – I（一）
    - Yokozuna（横綱）
    - Ōzeki（大関）
    - Sekiwake（関脇）
    - Komusubi（小結）
    - Maegashira（前頭）
  - Jūryō（十両） – II（二）
- Non-Sekitori（取的）
  - Makushita（幕下） – III（三）
  - Sandanme（三段目） – IV（四）
  - Jonidan（序二段） – V（五）
  - Jonokuchi（序ノ口） – VI（六）

## Rikishi structure

A `.box` element contains name in Kaji and Hiragana, as well as the profile ID (link) and record.

```html
<div class="box">
  <div>
    <div>
      <img src="/img/sumo_data/rikishi/60x60/20170096.jpg">
    </div>
    <div>
      <a href="/ResultRikishiData/profile/3842/">
        <span style="font-size: large; margin: auto 10px">豊昇龍</span>
      </a>
      <span class="hoshi_br">(ほうしょうりゅう)</span>
    </div>
  </div>
  <p style="text-align: center">
    <span onclick="smKimaritePop(3842,'E','豊昇龍',0)">1勝4敗10休</span>
  </p>
</div>
```

## Data

The table data can be accessed on <sumo.or.jp> via:

```js
console.log([...document.querySelectorAll('#torikumi_table tbody tr')].slice(1).map(tr => [...tr.querySelectorAll('.player')].map(player => [
    player.querySelector('.rank').textContent.trim(),
    player.querySelector('.name').textContent.trim(),
    player.querySelector('.perform').textContent.trim(),
].join('\t')).join('\t')).join('\n'))
```

## Resources

### Official

- English Matches: <https://www.sumo.or.jp/EnHonbashoMain/torikumi/1/15/>
- Japanese Matches: <https://www.sumo.or.jp/ResultData/torikumi/1/15/>
- Japanese Standings: <https://sumo.or.jp/ResultData/hoshitori/1/1/>
- Rikishi Search (EN): <https://www.sumo.or.jp/EnSumoDataRikishi/search/>

### APIs and Databases

- API: <https://www.sumo-api.com/>
- Database: <https://sumodb.sumogames.de/>
