import { invertDict } from '@/utils/object'

/*
  List of Kimarite, or Winning Techniques

  - oshi = push with elbows bent
  - uwate = outer grip on belt
  - otoshi = drop
  - tsuki = push with elbows locked
  - shitate = inner grip on belt
  - hineri = twist
  - yori = lean or force with one’s weight
  - k/gake = trip
  - okuri = send out of the ring
  - nage = throw
  - dashi = send out of the ring
  - soto = outside
  - taoshi = knock down to the ring
  - hiki = pull down
  - uchi = inside

  Source: https://www.sumotalk.com/kimarite.htm
*/

// English to Japanese kimarite dictionary (sorted alphabetically)
// Descriptions from: https://www.sumotalk.com/kimarite.htm
export const kimariteDictionaryEn = {
  'abise-taoshi': '浴せ倒し', // forcing one's opponent down inside the ring with the body
  amiuchi: '網打ち', // forcing the opponent down to the ring by grabbing his arms, spreading the body out, and then pulling him down
  'ashi-tori': '足取り', // lifting the opponent's leg up forcing him to topple to the ring floor off balance
  chongake: '長掛け', // tipping the opponent's opposite side leg by the ankle making it aloft, then pushing opponent down
  fusensho: '不戦勝', // winning by default because your opponent didn't show up for the bout (usually because he is injured)
  'gassho-hineri': '合掌捻り', // gripping the opponent's head with both hands and twisting him down
  hansoku: '反則', // winning by default because your opponent performed an illegal maneuver
  'harima-nage': '張手', // rear-belt throw
  'hataki-komi': '叩き込み', // pulling one's opponent down to the ring by the head, neck, or shoulders
  'hiki-otoshi': '引き落とし', // pulling one's opponent down by the arms
  hikkake: '引っ掛け', // grabbing your opponent's arm from the inside and using the other hand to grab the opponent's other hand or arm and pulling or twisting him down
  'ippon-zeoi': '一本背負い', // dodging an opponent's tsuki, grabbing his stretched arm over the shoulder and hurling him over your body (frequently seen in judo)
  'isami-ashi': '勇み足', // winning because your opponent accidentally stepped outside the ring while on the offensive
  'kake-nage': '掛け投げ', // locking one arm around the opponent while wrapping one leg around his leg, then swinging the off-balance opponent down
  'kake-zori': '掛け反り', // leg-kick sacrifice throw
  'kata-sukashi': '肩透かし', // putting one arm under the opponent's same arm and while pulling forward slapping down on the shoulder with the other hand
  'kawazu-gake': '河津掛け', // in self defense wrapping a leg around the back of the opponent's leg and wrapping the arm around the opponents neck causing both to rikishi to fall back with the counter-attacker on top
  'ke-kaeshi': '蹴返し', // foot-sweeping the opponent's ankle and pulling him down to the ring floor
  'keta-guri': '蹴手繰り', // kicking the opponent's ankle from inside out while he is charging causing him to topple over
  'kime-dashi': '極め出し', // locking both arms around the opponent's outstretched arms and driving him out of the ring
  'kime-taoshi': '極め倒し', // locking both arms around the opponent's outstretched arms and forcing him down to the ring floor
  'kiri-kaeshi': '切り返し', // pressing the leg on the outside of your opponent's thigh and twisting his belt causing him to trip
  'komata-sukui': '小股掬い', // while holding the opponent's belt with one hand, using the other hand to grab his thigh while throwing with the belt hand causing him to lose his balance and topple over
  'koshi-kudake': '腰砕け', // winning because the opponent accidentally loses his balance and falls, usually by the hip being unable to support his shifting weight
  'kosh-inage': '腰投げ', // throwing your opponent after picking him up and mounting him to your waist
  'kote-nage': '小手投げ', // locking you arm around your opponent's arm and throwing him down
  'kubi-hineri': '首捻り', // putting one hand on the opponent's neck and the other on his elbow and twisting the opponent down putting pressure on the neck
  'kubi-nage': '首投げ', // curling your arm around the opponent's neck and throwing him down
  'maki-otoshi': '巻き落とし', // wrapping your arms around the opponent's torso and twisting him down
  'mitokoro-zeme': '三所攻め', // putting your leg against the opponent's inner-thigh and while tripping him grabbing the back of his other knee to throw him off balance
  'nicho-nage': '二丁投げ', // while maintaining an inner-grip on the opponent's belt, planting the leg around the opponent's opposite leg and using this as a pivot to throw him down
  'nimai-geri': '二枚蹴り', // kicking or sweeping the opponent's ankle from the outside to make him fall
  'okuri-dashi': '送り出し', // pushing the turned-around opponent out of the ring from his back side
  'okuri-nage': '送り投げ', // throwing the opponent out of the ring with a grip on the back of his belt
  'okuri-taoshi': '送り倒し', // pushing the turned-around opponent down to the ring floor from his back side
  oomata: '大股', // lifting up the opponents inner thigh to topple him
  'oshi-dashi': '押し出し', // pushing one's opponent out of the ring with both hands
  'oshi-taoshi': '押し倒し', // pushing one's opponent down to the ring floor with both hands
  'saba-ori': '鯖折り', // pulling inward on the opponents belt while leaning forward to bring him to his knees
  'saka-tottari': '逆取ったり', // counter move by escaping the opponent's arm bar and grabbing his arm and elbow in return and twisting him down
  'shitate-dashi-nage': '下手出し投げ', // with inner-grip on opponent's belt, pulling him forward and throwing down
  'shitate-hineri': '下手捻り', // grabbing the opponent's front belt and twisting him down
  'shitate-nage': '下手投げ', // throwing opponent down with an inside grip on his belt
  'shumo-kuzori': '撞木反り', // crouching down, lifting up opponent high, and falling backwards to the ring
  'soto-gake': '外掛け', // wrapping leg around outside of opponent's leg below the knee and tripping him
  'soto-komata': '外小股', // twisting the opponent with a grip on the belt, while scooping the other hand under the opponent's thigh to trip him off balance
  'soto-muso': '外無双', // twisting the opponent with a grip on the belt while placing the other hand behind the opponent's knee to trip him off balance
  'soto-tasuki-zori': '外襷反り', // clutching the opponent's arm and outer thigh, lifting him on your shoulders, and tipping him back to the ring floor
  'sukubi-otoshi': 'すくび落とし', // pushing the opponent to the ring floor by the back of the neck
  'sukui-nage': '掬い投げ', // throwing opponent down without a grip on the belt and usually with a forearm to the armpit
  'suso-harai': '素首払い', // sweeping the opponents feet from under him with the hands from the rear
  'suso-tori': '素首取り', // grabbing the opponent's ankle from the outside causing him to trip
  'tasuki-zori': '襷反り', // clutching the opponent's arm and thigh, lifting him on your shoulders, and tipping him back to the ring floor
  tottari: '取ったり', // grabbing opponents wrist with one hand and elbow with the other, standing to the side of opponent, and twisting his whole body around to topple him down
  tsukaminage: '掴み投げ', // lifting opponent up by the belt and dropping him down
  tsukidashi: '突き出し', // pushing opponent out of the ring with stiff arm thrusts
  tsukiotoshi: '突き落とし', // pushing opponent down to the ring floor from the side with a stiff arm thrust, usually after side-stepping the opponent's charge
  tsukitaoshi: '突き倒し', // pushing opponent to the ring floor with alternating stiff arm thrusts
  'tsuma-tori': '爪取り', // while pushing opponent from the side, grabbing his foot or ankle to cause him to fall forward
  'tsuri-otoshi': '吊り落とし', // picking one's opponent up by the belt and dropping him down inside the ring
  'uchi-gake': '打棄り', // tripping opponent by placing leg below the knee on the inside, and pushing over
  'uchi-mata': '内股', // inner thigh throw (not in SumoTalk list, but common judo technique)
  'uchi-muso': '内無双', // twisting the opponent with a grip on the belt while pushing with the other hand on the opponent's inner-thigh to trip him off balance
  'ude-hineri': '腕捻り', // arm twist throw (not in SumoTalk list, but common technique)
  utchari: 'うっちゃり', // counter move by placing both feet on the edge of the ring's straw, supporting opponent's weight on own torso, and twisting him out of the ring
  'ushiro-gake': '後ろ掛け', // rear leg trip (not in SumoTalk list, but common technique)
  'ushiro-motare': '後ろもたれ', // rear lean (not in SumoTalk list, but common technique)
  'ushiro-nage': '後ろ投げ', // rear throw (not in SumoTalk list, but common technique)
  'ushiro-shita-nage': '後ろ下手投げ', // rear underarm throw (not in SumoTalk list, but common technique)
  'ushiro-zori': '後ろ反り', // rear back bend (not in SumoTalk list, but common technique)
  'uwate-dashi-nage': '上手出し投げ', // with an outer grip on the opponent's belt, simultaneously throwing him over and pushing him down
  'uwate-hineri': '上手捻り', // with an outer grip on the opponents belt, pulling him down to the ring floor in a twisting motion
  'uwate-nage': '上手投げ', // throwing opponent down with an outer grip on his belt
  'wari-dashi': '割り出し', // maintaining an outer grip with one hand, using the other hand to press on opponents upper arm causing him to lean backwards out of the ring
  'watashi-komi': '渡し込み', // pulling the opponent's calf forward with one hand while pushing against his body with the other causing him to topple to the ring floor
  'yagura-nage': '櫓投げ', // maintaining an outer grip on the belt, using the other hand to lift the opponents knee on the same side and twisting him down
  'yobi-modoshi': '呼び戻し', // while retreating, using charging opponent's momentum to push him down
  'yori-kiri': '寄り切り', // forcing the opponent out of the ring from the front while maintaining a grip on the belt
  'yori-taoshi': '寄り倒し', // forcing opponent to fall over backwards at the edge of the ring while maintaining a grip on his belt
  zubuneri: '頭捻り', // with the opponent's head up against your chest, grabbing his elbow and twisting him down
} as const

export const kimariteDictionaryJp = invertDict(kimariteDictionaryEn)

export type KimariteJapanese = keyof typeof kimariteDictionaryJp
export type KimariteEnglish = (typeof kimariteDictionaryJp)[KimariteJapanese]

/**
 * Lookup English kimarite from Japanese text
 */
export function lookupKimarite(japanese: string): KimariteEnglish | undefined {
  return kimariteDictionaryJp[japanese as KimariteJapanese]
}

/**
 * Lookup Japanese kimarite from English text
 */
export function lookupKimariteEn(english: string): KimariteJapanese | undefined {
  return kimariteDictionaryEn[english as keyof typeof kimariteDictionaryEn]
}

/**
 * Check if a Japanese text is a valid kimarite
 */
export function isValidKimarite(japanese: string): japanese is KimariteJapanese {
  return japanese in kimariteDictionaryJp
}

/**
 * Check if an English text is a valid kimarite
 */
export function isValidKimariteEn(english: string): english is keyof typeof kimariteDictionaryEn {
  return english in kimariteDictionaryEn
}

/**
 * Get all Japanese kimarite terms
 */
export function getAllJapaneseKimarite(): KimariteJapanese[] {
  return Object.keys(kimariteDictionaryJp) as KimariteJapanese[]
}

/**
 * Get all English kimarite terms (sorted alphabetically)
 */
export function getAllEnglishKimarite(): (keyof typeof kimariteDictionaryEn)[] {
  return Object.keys(kimariteDictionaryEn) as (keyof typeof kimariteDictionaryEn)[]
}
