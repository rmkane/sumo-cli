const days = [{
    // 8
    jp: ["叩き込み取組解説","寄り切り取組解説","送り出し取組解説","寄り切り取組解説","引き落とし取組解説","送り出し取組解説","引き落とし取組解説","上手投げ取組解説","叩き込み取組解説","押し出し取組解説","寄り切り取組解説","上手投げ取組解説","上手投げ取組解説","上手出し投げ取組解説","押し出し取組解説","寄り切り取組解説","寄り切り取組解説","寄り切り取組解説","下手投げ取組解説","押し出し取組解説","押し出し取組解説"],
    en: ["hatakikomi","yorikiri","okuridashi","yorikiri","hikiotoshi","okuridashi","hikiotoshi","uwatenage","hatakikomi","oshidashi","yorikiri","uwatenage","uwatenage","uwatedashinage","oshidashi","yorikiri","yorikiri","yorikiri","shitatenage","oshidashi","oshidashi"]
}, {
    // 7
    jp: ["寄り切り取組解説","押し出し取組解説","叩き込み取組解説","押し出し取組解説","上手投げ取組解説","突き落とし取組解説","送り倒し取組解説","掛け投げ取組解説","押し倒し取組解説","押し出し取組解説","上手出し投げ取組解説","叩き込み取組解説","浴せ倒し取組解説","突き倒し取組解説","寄り切り取組解説","押し倒し取組解説","寄り切り取組解説","押し出し取組解説","押し出し取組解説","掬い投げ取組解説","押し倒し取組解説"],
    en: ["yorikiri","oshidashi","hatakikomi","oshidashi","uwatenage","tsukiotoshi","okuritaoshi","kakenage","oshitaoshi","oshidashi","uwatedashinage","hatakikomi","abisetaoshi","tsukitaoshi","yorikiri","oshitaoshi","yorikiri","oshidashi","oshidashi","sukuinage","oshitaoshi"]
},{
    // 6
    jp: ["寄り切り取組解説","押し出し取組解説","叩き込み取組解説","掬い投げ取組解説","叩き込み取組解説","上手投げ取組解説","押し倒し取組解説","寄り倒し取組解説","引き落とし取組解説","上手投げ取組解説","掬い投げ取組解説","押し倒し取組解説","叩き込み取組解説","寄り倒し取組解説","寄り切り取組解説","寄り切り取組解説","突き落とし取組解説","突き出し取組解説","小手投げ取組解説","寄り切り取組解説","下手投げ取組解説"],
    en: ["yorikiri","oshidashi","hatakikomi","sukuinage","hatakikomi","uwatenage","oshitaoshi","yoritaoshi","hikiotoshi","uwatenage","sukuinage","oshitaoshi","hatakikomi","yoritaoshi","yorikiri","yorikiri","tsukiotoshi","tsukidashi","kotenage","yorikiri","shitatenage"]
}, {
    // 5
    jp: ["押し出し取組解説","叩き込み取組解説","寄り切り取組解説","上手投げ取組解説","上手投げ取組解説","押し出し取組解説","寄り切り取組解説","送り出し取組解説","寄り切り取組解説","寄り倒し取組解説","寄り切り取組解説","引き落とし取組解説","寄り切り取組解説","寄り切り取組解説","突き出し取組解説","押し出し取組解説","送り出し取組解説","押し出し取組解説","押し出し取組解説","寄り切り取組解説","突き落とし取組解説"],
    en: ["oshidashi","hatakikomi","yorikiri","uwatenage","uwatenage","oshidashi","yorikiri","okuridashi","yorikiri","yoritaoshi","yorikiri","hikiotoshi","yorikiri","yorikiri","tsukidashi","oshidashi","okuridashi","oshidashi","oshidashi","yorikiri","tsukiotoshi"],
}, {
    // 4
    jp: ["叩き込み取組解説","寄り切り取組解説","寄り切り取組解説","寄り切り取組解説","寄り倒し取組解説","寄り倒し取組解説","上手投げ取組解説","寄り切り取組解説","寄り切り取組解説","突き倒し取組解説","押し出し取組解説","押し出し取組解説","寄り切り取組解説","突き落とし取組解説","寄り切り取組解説","小手投げ取組解説","寄り切り取組解説","上手出し投げ取組解説","突き落とし取組解説","突き落とし取組解説","押し出し取組解説"]    ,
    en: ["hatakikomi","yorikiri","yorikiri","yorikiri","yoritaoshi","yoritaoshi","uwatenage","yorikiri","yorikiri","tsukitaoshi","oshidashi","oshidashi","yorikiri","tsukiotoshi","yorikiri","kotenage","yorikiri","uwatedashinage","tsukiotoshi","tsukiotoshi","oshidashi"]    ,
}, {
    // 3
    jp: ["寄り切り取組解説","寄り切り取組解説","上手投げ取組解説","押し出し取組解説","突き落とし取組解説","押し出し取組解説","寄り切り取組解説","寄り切り取組解説","上手投げ取組解説","押し出し取組解説","押し出し取組解説","寄り切り取組解説","寄り切り取組解説","押し出し取組解説","押し出し取組解説","突き落とし取組解説","寄り切り取組解説","押し出し取組解説","押し出し取組解説","上手投げ取組解説","押し倒し取組解説"]    ,
    en: ["yorikiri","yorikiri","uwatenage","oshidashi","tsukiotoshi","oshidashi","yorikiri","yorikiri","uwatenage","oshidashi","oshidashi","yorikiri","yorikiri","oshidashi","oshidashi","tsukiotoshi","yorikiri","oshidashi","oshidashi","uwatenage","oshitaoshi"],
}, {
    // 2
    jp: ["小手投げ取組解説","押し出し取組解説","寄り切り取組解説","引き落とし取組解説","押し出し取組解説","寄り切り取組解説","上手投げ取組解説","送り出し取組解説","寄り切り取組解説","寄り倒し取組解説","上手投げ取組解説","押し出し取組解説","押し出し取組解説","突き落とし取組解説","押し出し取組解説","寄り切り取組解説","寄り切り取組解説","掬い投げ取組解説","突き落とし取組解説","突き落とし取組解説","寄り切り取組解説"]    ,
    en: ["kotenage","oshidashi","yorikiri","hikiotoshi","oshidashi","yorikiri","uwatenage","okuridashi","yorikiri","yoritaoshi","uwatenage","oshidashi","oshidashi","tsukiotoshi","oshidashi","yorikiri","yorikiri","sukuinage","tsukiotoshi","tsukiotoshi","yorikiri"],
}, {
    // 1
    jp: ["上手投げ取組解説","押し出し取組解説","押し出し取組解説","押し出し取組解説","寄り切り取組解説","押し出し取組解説","寄り切り取組解説","寄り切り取組解説","押し出し取組解説","下手投げ取組解説","押し出し取組解説","寄り切り取組解説","寄り切り取組解説","寄り切り取組解説","叩き込み取組解説","寄り切り取組解説","寄り切り取組解説","押し出し取組解説","押し出し取組解説","渡し込み取組解説","寄り倒し取組解説"]    ,
    en: ["uwatenage","oshidashi","oshidashi","oshidashi","yorikiri","oshidashi","yorikiri","yorikiri","oshidashi","shitatenage","oshidashi","yorikiri","yorikiri","yorikiri","hatakikomi","yorikiri","yorikiri","oshidashi","oshidashi","watashikomi","yoritaoshi"],
}]

const buildDictionary = () => {
    const dict = {}
    days.forEach((day) => {
        day.jp.forEach((jp, index) => {
            const existing = dict[jp]
            const en = day.en[index]
            if (existing != null && existing !== en) {
                // Show warning
                console.warn(`${jp} -> ${en}`)
            }
            dict[jp] = en
        })
    })
    return dict
}

const dictionary = buildDictionary()

console.log(dictionary)
