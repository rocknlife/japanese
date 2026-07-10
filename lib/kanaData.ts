import type { KanaData } from "./types";

export const kanaData: KanaData = {
  basic: [
    { h: "あ", k: "ア", r: "a", ko: "아", strokes: 3, type: "vowel", food: { name: "あめ", koName: "사탕", romaji: "ame", emoji: "🍬", tag: "디저트", sentence: "あまいあめをたべます。", koSentence: "달콤한 사탕을 먹습니다." } },
    { h: "い", k: "イ", r: "i", ko: "이", strokes: 2, type: "vowel", food: { name: "いちご", koName: "딸기", romaji: "ichigo", emoji: "🍓", tag: "과일", sentence: "いちごはとてもあかいです。", koSentence: "딸기는 매우 빨갛습니다." } },
    { h: "う", k: "ウ", r: "u", ko: "우", strokes: 2, type: "vowel", food: { name: "うどん", koName: "우동", romaji: "udon", emoji: "🍜", tag: "면류", sentence: "あったかいうどんがすきです。", koSentence: "따뜻한 우동을 좋아합니다." } },
    { h: "え", k: "エ", r: "e", ko: "에", strokes: 2, type: "vowel", food: { name: "えだまめ", koName: "풋콩", romaji: "edamame", emoji: "🫛", tag: "채소", sentence: "ビールとえだまめをちゅうもんする。", koSentence: "맥주와 풋콩을 주문한다." } },
    { h: "お", k: "オ", r: "o", ko: "오", strokes: 3, type: "vowel", food: { name: "おにぎり", koName: "주먹밥", romaji: "onigiri", emoji: "🍙", tag: "밥류", sentence: "おにぎりをつくりました。", koSentence: "주먹밥을 만들었습니다." } },

    { h: "か", k: "カ", r: "ka", ko: "카", strokes: 3, type: "consonant", food: { name: "かき", koName: "감", romaji: "kaki", emoji: "🍊", tag: "과일", sentence: "あきにはかきをたべます。", koSentence: "가을에는 감을 먹습니다." } },
    { h: "き", k: "キ", r: "ki", ko: "키", strokes: 4, type: "consonant", food: { name: "きのこ", koName: "버섯", romaji: "kinoko", emoji: "🍄", tag: "채소", sentence: "きのこがたくさんはいったスープ。", koSentence: "버섯이 많이 들어간 스프." } },
    { h: "く", k: "ク", r: "ku", ko: "쿠", strokes: 1, type: "consonant", food: { name: "くしかつ", koName: "꼬치튀김", romaji: "kushikatsu", emoji: "🍢", tag: "튀김", sentence: "くしかつがサクサクでおいしい。", koSentence: "꼬치튀김이 바삭해서 맛있습니다." } },
    { h: "け", k: "ケ", r: "ke", ko: "케", strokes: 3, type: "consonant", food: { name: "けーき", koName: "케이크", romaji: "keeki", emoji: "🍰", tag: "디저트", sentence: "たんじょうびにけーきをたべます。", koSentence: "생일에 케이크를 먹습니다." } },
    { h: "こ", k: "コ", r: "ko", ko: "코", strokes: 2, type: "consonant", food: { name: "こめ", koName: "쌀", romaji: "kome", emoji: "🌾", tag: "곡물", sentence: "にほんのこめはおいしいです。", koSentence: "일본 쌀은 맛있습니다." } },

    { h: "さ", k: "サ", r: "sa", ko: "사", strokes: 3, type: "consonant", food: { name: "さけ", koName: "일본 술", romaji: "sake", emoji: "🍶", tag: "주류", sentence: "さけをのむとげんきになる。", koSentence: "술을 마시면 힘이 난다." } },
    { h: "し", k: "シ", r: "shi", ko: "시", strokes: 1, type: "consonant", food: { name: "しいたけ", koName: "표고버섯", romaji: "shiitake", emoji: "🍄", tag: "채소", sentence: "しいたけをやいてたべます。", koSentence: "표고버섯을 구워서 먹습니다." } },
    { h: "す", k: "ス", r: "su", ko: "스", strokes: 2, type: "consonant", food: { name: "すし", koName: "초밥", romaji: "sushi", emoji: "🍣", tag: "일식", sentence: "すしをたべにいきました。", koSentence: "초밥을 먹으러 갔습니다." } },
    { h: "せ", k: "セ", r: "se", ko: "세", strokes: 3, type: "consonant", food: { name: "せんべい", koName: "전병", romaji: "senbei", emoji: "🍘", tag: "디저트", sentence: "おちゃとせんべいはあいます。", koSentence: "차와 전병은 잘 어울립니다." } },
    { h: "そ", k: "ソ", r: "so", ko: "소", strokes: 1, type: "consonant", food: { name: "そば", koName: "소바", romaji: "soba", emoji: "🍜", tag: "면류", sentence: "あついなつにはそばがいいね。", koSentence: "더운 여름에는 메밀국수가 좋네요." } },

    { h: "た", k: "タ", r: "ta", ko: "타", strokes: 4, type: "consonant", food: { name: "たこやき", koName: "타코야끼", romaji: "takoyaki", emoji: "🐙", tag: "길거리", sentence: "たこやきがとってもあついです。", koSentence: "타코야끼가 엄청 뜨겁습니다." } },
    { h: "ち", k: "チ", r: "chi", ko: "치", strokes: 3, type: "consonant", food: { name: "ちゃわんむし", koName: "계란찜", romaji: "chawanmushi", emoji: "🥚", tag: "요리", sentence: "ちゃわんむしはぷるぷるです。", koSentence: "차완무시는 야들야들합니다." } },
    { h: "つ", k: "ツ", r: "tsu", ko: "츠", strokes: 1, type: "consonant", food: { name: "つくね", koName: "닭 경단", romaji: "tsukune", emoji: "🍢", tag: "꼬치", sentence: "つくねにたれをつけます。", koSentence: "츠쿠네에 양념 소스를 바릅니다." } },
    { h: "て", k: "テ", r: "te", ko: "테", strokes: 1, type: "consonant", food: { name: "てんぷら", koName: "튀김", romaji: "tenpura", emoji: "🍤", tag: "튀김", sentence: "てんぷらはサクサクしています。", koSentence: "튀김은 바삭바삭합니다." } },
    { h: "と", k: "ト", r: "to", ko: "토", strokes: 2, type: "consonant", food: { name: "とんかつ", koName: "돈가스", romaji: "tonkatsu", emoji: "🥩", tag: "육류", sentence: "ひるごはんにとんかつをたべた。", koSentence: "점심으로 돈가스를 먹었다." } },

    { h: "な", k: "ナ", r: "na", ko: "나", strokes: 4, type: "consonant", food: { name: "なす", koName: "가지", romaji: "nasu", emoji: "🍆", tag: "채소", sentence: "なすをやいてたべます。", koSentence: "가지를 구워서 먹습니다." } },
    { h: "に", k: "ニ", r: "ni", ko: "니", strokes: 3, type: "consonant", food: { name: "にく", koName: "고기", romaji: "niku", emoji: "🍖", tag: "육류", sentence: "にくとやさいをバランスよくたべる。", koSentence: "고기와 채소를 균형 있게 먹는다." } },
    { h: "ぬ", k: "ヌ", r: "nu", ko: "누", strokes: 2, type: "consonant", food: { name: "ぬかづけ", koName: "겨절임", romaji: "nukazuke", emoji: "🥒", tag: "반찬", sentence: "ぬかづけはにほんのごはんにあいます。", koSentence: "겨절임은 일본 밥과 잘 어울립니다." } },
    { h: "ね", k: "ネ", r: "ne", ko: "네", strokes: 2, type: "consonant", food: { name: "ねぎ", koName: "대파", romaji: "negi", emoji: "🌱", tag: "채소", sentence: "ラーメンにねぎをたくさんいれる。", koSentence: "라면에 대파를 가득 넣는다." } },
    { h: "の", k: "ノ", r: "no", ko: "노", strokes: 1, type: "consonant", food: { name: "のり", koName: "김", romaji: "nori", emoji: "🍙", tag: "해조류", sentence: "のりでごはんをまいてたべます。", koSentence: "김으로 밥을 싸서 먹습니다." } },

    { h: "は", k: "ハ", r: "ha", ko: "하", strokes: 3, type: "consonant", food: { name: "はちみつ", koName: "꿀", romaji: "hachimitsu", emoji: "🍯", tag: "디저트", sentence: "パンにははちみつが最高。", koSentence: "빵에는 꿀이 최고." } },
    { h: "ひ", k: "ヒ", r: "hi", ko: "히", strokes: 1, type: "consonant", food: { name: "ひやむぎ", koName: "냉국수", romaji: "hiyamugi", emoji: "🍜", tag: "면류", sentence: "ひやむぎはひんやりしておいしい。", koSentence: "냉국수는 차가워서 맛있습니다." } },
    { h: "ふ", k: "フ", r: "fu", ko: "후", strokes: 4, type: "consonant", food: { name: "ふりかけ", koName: "후리카케", romaji: "furikake", emoji: "🍚", tag: "반찬", sentence: "ごはんにふりかけをかける。", koSentence: "밥에 후리카케를 뿌린다." } },
    { h: "へ", k: "ヘ", r: "he", ko: "헤", strokes: 1, type: "consonant", food: { name: "へぎそば", koName: "소바", romaji: "hegisoba", emoji: "🍜", tag: "면류", sentence: "へぎそばをにいがたでたべる。", koSentence: "헤기소바를 니가타에서 먹는다." } },
    { h: "ほ", k: "ホ", r: "ho", ko: "호", strokes: 4, type: "consonant", food: { name: "ほたて", koName: "가리비", romaji: "hotate", emoji: "🦪", tag: "해산물", sentence: "ほたてをバターでやきます。", koSentence: "가리비를 버터로 굽습니다." } },

    { h: "ま", k: "マ", r: "ma", ko: "마", strokes: 3, type: "consonant", food: { name: "まんじゅう", koName: "만쥬", romaji: "manjuu", emoji: "🥮", tag: "디저트", sentence: "まんじゅうはあんこがはいっています。", koSentence: "만쥬는 단팥이 들어있습니다." } },
    { h: "み", k: "ミ", r: "mi", ko: "미", strokes: 2, type: "consonant", food: { name: "みかん", koName: "귤", romaji: "mikan", emoji: "🍊", tag: "과일", sentence: "こたつでみかんをたべます。", koSentence: "코타츠에서 귤을 먹습니다." } },
    { h: "む", k: "ム", r: "mu", ko: "무", strokes: 3, type: "consonant", food: { name: "むぎちゃ", koName: "보리차", romaji: "mugicha", emoji: "🍵", tag: "음료", sentence: "なつにはつめたいむぎちゃをのむ。", koSentence: "여름에는 시원한 보리차를 마신다." } },
    { h: "め", k: "メ", r: "me", ko: "메", strokes: 2, type: "consonant", food: { name: "めろん", koName: "멜론", romaji: "meron", emoji: "🍈", tag: "과일", sentence: "めろんはとてもあまいくだものです。", koSentence: "멜론은 매우 달콤한 과일입니다." } },
    { h: "も", k: "モ", r: "mo", ko: "모", strokes: 3, type: "consonant", food: { name: "もち", koName: "떡", romaji: "mochi", emoji: "🍡", tag: "디저트", sentence: "おしょうがつにもちをたべます。", koSentence: "신정에 떡을 먹습니다." } },

    { h: "や", k: "ヤ", r: "ya", ko: "야", strokes: 3, type: "consonant", food: { name: "やきとり", koName: "닭꼬치", romaji: "yakitori", emoji: "🍢", tag: "꼬치", sentence: "やきとりをいざかやでちゅうもんする。", koSentence: "닭꼬치를 이자카야에서 주문한다." } },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
    { h: "ゆ", k: "ユ", r: "yu", ko: "유", strokes: 2, type: "consonant", food: { name: "ゆず", koName: "유자", romaji: "yuzu", emoji: "🍋", tag: "과일", sentence: "ゆずのおちゃをのみます。", koSentence: "유자차를 마십니다." } },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
    { h: "よ", k: "ヨ", r: "yo", ko: "요", strokes: 3, type: "consonant", food: { name: "ようかん", koName: "양갱", romaji: "youkan", emoji: "🍫", tag: "디저트", sentence: "おばあちゃんはようかんがだいすき。", koSentence: "할머니는 양갱을 정말 좋아하신다." } },

    { h: "わ", k: "ワ", r: "wa", ko: "와", strokes: 2, type: "consonant", food: { name: "わさび", koName: "고추냉이", romaji: "wasabi", emoji: "🌿", tag: "향신료", sentence: "すしにわさびをすこしいれます。", koSentence: "초밥에 고추냉이를 조금 넣습니다." } },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
    { h: "を", k: "ヲ", r: "wo", ko: "오", strokes: 3, type: "consonant", food: { name: "ねぎをたべる", koName: "파를 먹다", romaji: "negi wo taberu", emoji: "🥗", tag: "식사", sentence: "ねぎをたくさんたべましょう。", koSentence: "대파를 많이 먹읍시다!" } },

    { h: "ん", k: "ン", r: "n", ko: "응", strokes: 1, type: "consonant", food: { name: "ぱん", koName: "빵", romaji: "pan", emoji: "🍞", tag: "식료", sentence: "あさごはんにぱんをたべました。", koSentence: "아침밥으로 빵을 먹었습니다." } },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
    { h: null, k: null, r: null, ko: null, strokes: 0, type: "none" },
  ],
  voiced: [
    { h: "が", k: "ガ", r: "ga", ko: "가", strokes: 5, type: "voiced", food: { name: "がむ", koName: "껌", romaji: "gamu", emoji: "🍬", tag: "간식", sentence: "ミントのがむをかみます。", koSentence: "민트 맛 껌을 씹습니다." } },
    { h: "ぎ", k: "ギ", r: "gi", ko: "기", strokes: 6, type: "voiced", food: { name: "ぎゅうにゅう", koName: "우유", romaji: "gyuunyuu", emoji: "🥛", tag: "음료", sentence: "あさにぎゅうにゅうをいっぱいのむ。", koSentence: "아침에 우유를 한 잔 마신다." } },
    { h: "ぐ", k: "グ", r: "gu", ko: "구", strokes: 3, type: "voiced", food: { name: "ぐみ", koName: "젤리", romaji: "gumi", emoji: "🧸", tag: "디저트", sentence: "フルーツのぐみがすきです。", koSentence: "과일 젤리를 좋아합니다." } },
    { h: "げ", k: "ゲ", r: "ge", ko: "게", strokes: 5, type: "voiced", food: { name: "げきからラーメン", koName: "매운 라면", romaji: "gekikara raamen", emoji: "🌶️", tag: "면류", sentence: "げきからラーメンにちょうせんする。", koSentence: "매운 라면에 도전해본다." } },
    { h: "ご", k: "ゴ", r: "go", ko: "고", strokes: 4, type: "voiced", food: { name: "ごはん", koName: "밥", romaji: "gohan", emoji: "🍚", tag: "밥류", sentence: "あたたかいごはんをたべます。", koSentence: "따뜻한 밥을 먹습니다." } },

    { h: "ざ", k: "ザ", r: "za", ko: "자", strokes: 5, type: "voiced", food: { name: "ざるそば", koName: "판메밀국수", romaji: "zarusoba", emoji: "🍜", tag: "면류", sentence: "つめたいざるそばがおいしい。", koSentence: "시원한 판모밀이 맛있습니다." } },
    { h: "じ", k: "ジ", r: "ji", ko: "지", strokes: 3, type: "voiced", food: { name: "じんじゃーえーる", koName: "진저에일", romaji: "jinjaaeeru", emoji: "🥤", tag: "음료", sentence: "じんじゃーえーるをちゅうもんする。", koSentence: "진저에일을 주문합니다." } },
    { h: "ず", k: "ズ", r: "zu", ko: "즈", strokes: 4, type: "voiced", food: { name: "ずわいがに", koName: "대게", romaji: "zuwaigani", emoji: "🦀", tag: "해산물", sentence: "ずわいがにはあまみがあっておいしい。", koSentence: "대게는 단맛이 돌아서 맛있습니다." } },
    { h: "ぜ", k: "ゼ", r: "ze", ko: "제", strokes: 5, type: "voiced", food: { name: "ぜりー", koName: "젤리", romaji: "zerii", emoji: "🍮", tag: "디저트", sentence: "つめたいぜりーがたべたいな。", koSentence: "시원한 푸딩 젤리가 먹고 싶네요." } },
    { h: "ぞ", k: "ゾ", r: "zo", ko: "조", strokes: 3, type: "voiced", food: { name: "ぞうすい", koName: "죽", romaji: "zousui", emoji: "🍲", tag: "요리", sentence: "おなかにやさしいぞうすい。", koSentence: "소화에 좋은 따뜻한 죽." } },

    { h: "だ", k: "ダ", r: "da", ko: "다", strokes: 6, type: "voiced", food: { name: "だんご", koName: "경단 떡", romaji: "dango", emoji: "🍡", tag: "디저트", sentence: "おちゃといっしょにだんごをたべる。", koSentence: "차를 마시면서 경단을 먹는다." } },
    { h: "ぢ", k: "ヂ", r: "di/ji", ko: "지", strokes: 5, type: "voiced", food: { name: "はなぢ", koName: "코피", romaji: "hanadi", emoji: "🩸", tag: "신체", sentence: "はなぢがでました。", koSentence: "코피가 났습니다." } },
    { h: "づ", k: "ヅ", r: "du/zu", ko: "즈", strokes: 3, type: "voiced", food: { name: "おかず", koName: "반찬", romaji: "okazu", emoji: "🍱", tag: "식사", sentence: "おいしいおかずがたくさんある。", koSentence: "맛있는 반찬이 가득 있습니다." } },
    { h: "で", k: "デ", r: "de", ko: "데", strokes: 3, type: "voiced", food: { name: "でんぷら", koName: "튀김", romaji: "denpura", emoji: "🍤", tag: "튀김", sentence: "でんぷらがこうばしい。", koSentence: "덴프라(튀김)가 고소합니다." } },
    { h: "ど", k: "ド", r: "do", ko: "도", strokes: 4, type: "voiced", food: { name: "どーなつ", koName: "도넛", romaji: "doonatsu", emoji: "🍩", tag: "디저트", sentence: "あまいどーなつがすきです。", koSentence: "달콤한 도넛을 좋아해요." } },

    { h: "ば", k: "バ", r: "ba", ko: "바", strokes: 5, type: "voiced", food: { name: "ばなな", koName: "바나나", romaji: "banana", emoji: "🍌", tag: "과일", sentence: "あさごはんにばななをたべます。", koSentence: "아침밥으로 바나나를 먹습니다." } },
    { h: "び", k: "ビ", r: "bi", ko: "비", strokes: 3, type: "voiced", food: { name: "びーる", koName: "맥주", romaji: "biiru", emoji: "🍺", tag: "주류", sentence: "つめたいびーるをのむ。", koSentence: "시원한 맥주를 마신다." } },
    { h: "ぶ", k: "ブ", r: "bu", ko: "부", strokes: 6, type: "voiced", food: { name: "ぶどう", koName: "포도", romaji: "budou", emoji: "🍇", tag: "과일", sentence: "あかいぶどうはおいしいです。", koSentence: "붉은 포도는 맛있습니다." } },
    { h: "べ", k: "ベ", r: "be", ko: "베", strokes: 3, type: "voiced", food: { name: "べんとう", koName: "도시락", romaji: "bentou", emoji: "🍱", tag: "식사", sentence: "べんとうをこうえんでたべる。", koSentence: "도시락을 공원에서 먹는다." } },
    { h: "ぼ", k: "ボ", r: "bo", ko: "보", strokes: 6, type: "voiced", food: { name: "ぼーろ", koName: "과자", romaji: "booro", emoji: "🍪", tag: "과자", sentence: "あかちゃんがぼーろをたべる。", koSentence: "아기가 보로 과자를 먹는다." } },

    { h: "ぱ", k: "パ", r: "pa", ko: "파", strokes: 4, type: "handakuon", food: { name: "ぱすた", koName: "파스타", romaji: "pasuta", emoji: "🍝", tag: "양식", sentence: "トマトぱすたをつくります。", koSentence: "토마토 파스타를 만듭니다." } },
    { h: "ぴ", k: "ピ", r: "pi", ko: "피", strokes: 2, type: "handakuon", food: { name: "ぴーまん", koName: "피망", romaji: "piiman", emoji: "🫑", tag: "채소", sentence: "ぴーまんはにがいからにがてです。", koSentence: "피망은 써서 좋아하지 않습니다." } },
    { h: "ぷ", k: "プ", r: "pu", ko: "푸", strokes: 5, type: "handakuon", food: { name: "ぷりん", koName: "푸딩", romaji: "purin", emoji: "🍮", tag: "디저트", sentence: "ぷりんはぷるぷるしています。", koSentence: "푸딩은 탱글탱글합니다." } },
    { h: "ぺ", k: "ペ", r: "pe", ko: "페", strokes: 2, type: "handakuon", food: { name: "ぺいすとりー", koName: "페이스트리", romaji: "peisutorii", emoji: "🥐", tag: "빵류", sentence: "サクサクぺいすとりーがすき。", koSentence: "바삭한 페이스트리 빵을 좋아해요." } },
    { h: "ぽ", k: "ポ", r: "po", ko: "포", strokes: 5, type: "handakuon", food: { name: "ぽてと", koName: "감자튀김", romaji: "poteto", emoji: "🍟", tag: "튀김", sentence: "ふらいどぽてとがすきです。", koSentence: "감자튀김을 좋아합니다." } },
  ],
  yoon: [
    { h: "きゃ", k: "キャ", r: "kya", ko: "캬", strokes: 6, type: "yoon", food: { name: "きゃべつ", koName: "양배추", romaji: "kyabetsu", emoji: "🥬", tag: "채소", sentence: "きゃべつをせんぎりにする。", koSentence: "양배추를 잘게 채 썬다." } },
    { h: "きゅ", k: "キュ", r: "kyu", ko: "큐", strokes: 6, type: "yoon", food: { name: "きゅうり", koName: "오이", romaji: "kyuuri", emoji: "🥒", tag: "채소", sentence: "きゅうりのあさづけをつくる。", koSentence: "오이 소금절임을 만든다." } },
    { h: "きょ", k: "キョ", r: "kyo", ko: "켜", strokes: 7, type: "yoon", food: { name: "きょうざ", koName: "교자 만두", romaji: "kyouza", emoji: "🥟", tag: "만두", sentence: "きょうざをやきあげました。", koSentence: "교자 만두를 바삭하게 구웠습니다." } },

    { h: "しゃ", k: "シャ", r: "sha", ko: "샤", strokes: 4, type: "yoon", food: { name: "しゃけ", koName: "연어", romaji: "shake", emoji: "🐟", tag: "생선", sentence: "あさごはんにしゃけをやきます。", koSentence: "아침밥으로 연어를 굽습니다." } },
    { h: "しゅ", k: "シュ", r: "shu", ko: "슈", strokes: 3, type: "yoon", food: { name: "しゅうまい", koName: "딤섬", romaji: "shuumai", emoji: "🥟", tag: "중식", sentence: "あついしゅうまいをふうふうする。", koSentence: "뜨거운 슈마이를 후후 불어 먹는다." } },
    { h: "しょ", k: "ショ", r: "sho", ko: "쇼", strokes: 4, type: "yoon", food: { name: "しょうゆ", koName: "간장", romaji: "shouyu", emoji: "🏺", tag: "소스", sentence: "しょうゆをすこしたらします。", koSentence: "간장을 약간 떨어뜨립니다." } },

    { h: "ちゃ", k: "チャ", r: "cha", ko: "챠", strokes: 6, type: "yoon", food: { name: "ちゃ", koName: "녹차", romaji: "cha", emoji: "🍵", tag: "음료", sentence: "あったかいおちゃをのみましょう。", koSentence: "따뜻한 차를 마십시다." } },
    { h: "ちゅ", k: "チュ", r: "chu", ko: "츄", strokes: 5, type: "yoon", food: { name: "ちゅーりっぷ", koName: "닭봉 튀김", romaji: "chuurippuchikin", emoji: "🍗", tag: "육류", sentence: "ちゅーりっぷちきんは大好物。", koSentence: "닭봉 튀김은 아이들이 제일 좋아해요." } },
    { h: "ちょ", k: "チョ", r: "cho", ko: "쵸", strokes: 6, type: "yoon", food: { name: "ちょこれーと", koName: "초콜릿", romaji: "chokoreeto", emoji: "🍫", tag: "디저트", sentence: "ちょこれーとをプレゼントする。", koSentence: "초콜릿을 선물한다." } },

    { h: "りゃ", k: "リャ", r: "rya", ko: "랴", strokes: 5, type: "yoon", food: { name: "りゃくしき", koName: "간이 도시락", romaji: "ryakushikibentou", emoji: "🍱", tag: "도시락", sentence: "りゃくしきべんとうだけどおいしい。", koSentence: "약식 간이 도시락이지만 맛있습니다." } },
    { h: "りゅ", k: "リュ", r: "ryu", ko: "류", strokes: 4, type: "yoon", food: { name: "りゅうきゅう", koName: "생선 무침", romaji: "ryuukyuu", emoji: "🐟", tag: "요리", sentence: "りゅうきゅうをさしみでつくる。", koSentence: "사시미를 이용해 류큐 무침을 만듭니다." } },
    { h: "りょ", k: "リョ", r: "ryo", ko: "료", strokes: 5, type: "yoon", food: { name: "りょくちゃ", koName: "녹차(료쿠차)", romaji: "ryokucha", emoji: "🍵", tag: "음료", sentence: "にほんのりょくちゃはかおりがいい。", koSentence: "일본 녹차는 향이 좋습니다." } },
  ],
};

export const allKanaList = [
  ...kanaData.basic,
  ...kanaData.voiced,
  ...kanaData.yoon,
].filter((item): item is NonNullable<typeof item> & { h: string } => !!item && !!item.h);

export const defaultNotices = [
  { id: "n1", type: "notice" as const, author: "홍길동", content: "안녕하세요! 오이시이 일본어 공부방에 오신 것을 환영합니다.\n매일 5분씩 문자 학습판과 퀴즈를 활용해 일본어 마스터가 되어보세요!", createdAt: "2026-07-10 09:00" },
  { id: "n2", type: "homework" as const, author: "사토 요시", content: "이번 주 과제: 히라가나 [あ, い, う, え, お]단 따라 쓰고, 연상 단어 '우동, 딸기' 등의 발음 3회씩 들으며 복습하기", createdAt: "2026-07-10 10:30" },
  { id: "n3", type: "share" as const, author: "강현우", content: "일본 음식 단어를 공부할 때 글자가 단어 본문 내에서 하이라이트 되니 시각적으로 정말 잘 외워지네요! 추천합니다.", createdAt: "2026-07-10 11:15" },
];

export const defaultUsers = [
  { id: "M001", name: "홍길동", attendance: ["2026-07-06", "2026-07-08", "2026-07-10"] },
  { id: "M002", name: "이지민", attendance: ["2026-07-06", "2026-07-07", "2026-07-09:N", "2026-07-10"] },
  { id: "M003", name: "강현우", attendance: ["2026-07-08", "2026-07-10:N"] },
  { id: "M004", name: "사토 요시", attendance: ["2026-07-06", "2026-07-09"] },
];
