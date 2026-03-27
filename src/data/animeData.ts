import type { Language } from "@/lib/i18n";

export interface Anime {
  id: string;
  title: Record<Language, string>;
  cover: string;
  rating: number;
  episodes: number;
  status: "Airing" | "Completed" | "Upcoming";
  genres: string[];
  synopsis: Record<Language, string>;
  studio: string;
  year: number;
  season: string;
  rank: number;
  popularity: number;
  members: number;
  type: "TV" | "Movie" | "OVA" | "ONA";
}

export const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mecha", "Romance", "Sci-Fi", "Slice of Life",
  "Sports", "Supernatural", "Thriller", "Mystery", "Shounen"
];

export const animeList: Anime[] = [
  // 1. ONE PUNCH MAN SEASON 3
  {
    id: "one-punch-man-s3",
    title: {
      en: "One Punch Man Season 3",
      id: "One Punch Man Season 3",
      ja: "ワンパンマン 第3期",
      ko: "원펀맨 3기",
    },
    cover: "https://files.catbox.moe/ktl9nj.jpg",
    rating: 8.7,
    episodes: 12,
    status: "Airing",
    genres: ["Action", "Comedy", "Sci-Fi", "Superhero"],
    synopsis: {
      en: "Saitama, the hero who can defeat any enemy with a single punch, continues his journey to find worthy opponents. Season 3 introduces new powerful villains from the Monster Association.",
      id: "Saitama, pahlawan yang bisa mengalahkan musuh dengan satu pukulan, melanjutkan perjalanannya mencari lawan yang sepadan. Musim 3 memperkenalkan penjahat kuat baru dari Asosiasi Monster.",
      ja: "どんな敵も一撃で倒すことができるヒーロー、サイタマは、対等な相手を探し続ける。第3期では、怪人協会の新たな強敵たちが登場する。",
      ko: "모든 적을 한 방에 쓰러뜨릴 수 있는 영웅 사이타마는 자신에게 맞서줄 상대를 찾아 계속 여행한다. 3기에서는 괴인협회의 새로운 강력한 적들이 등장한다.",
    },
    studio: "Madhouse",
    year: 2024,
    season: "Fall",
    rank: 1,
    popularity: 1,
    members: 1800000,
    type: "TV",
  },

  // 2. POKEMON 2024
  {
    id: "pokemon-2024",
    title: {
      en: "Pokemon 2024",
      id: "Pokemon 2024",
      ja: "ポケットモンスター 2024",
      ko: "포켓몬스터 2024",
    },
    cover: "https://files.catbox.moe/dcji9n.jpg",
    rating: 7.8,
    episodes: 52,
    status: "Airing",
    genres: ["Adventure", "Fantasy", "Action", "Kids"],
    synopsis: {
      en: "A new generation of trainers embark on an adventure across the Paldea region. Liko and Roy discover new Pokemon and face the mysterious organization Explorers.",
      id: "Generasi baru pelatih memulai petualangan di wilayah Paldea. Liko dan Roy menemukan Pokemon baru dan menghadapi organisasi misterius Explorers.",
      ja: "新世代のトレーナーたちがパルデア地方での冒険に出発する。リコとロイは新しいポケモンに出会い、謎の組織エクスプローラーズと対峙する。",
      ko: "새로운 세대의 트레이너들이 팔데아 지방에서 모험을 시작한다. 리코와 로이는 새로운 포켓몬을 만나고 수수께끼의 조직 익스플로러즈와 맞서게 된다.",
    },
    studio: "OLM",
    year: 2024,
    season: "Spring",
    rank: 2,
    popularity: 2,
    members: 1500000,
    type: "TV",
  },

  // 3. JUJUTSU KAISEN
  {
    id: "jujutsu-kaisen",
    title: {
      en: "Jujutsu Kaisen",
      id: "Jujutsu Kaisen",
      ja: "呪術廻戦",
      ko: "주술회전",
    },
    cover: "https://files.catbox.moe/ass41i.jpg",
    rating: 8.8,
    episodes: 48,
    status: "Airing",
    genres: ["Action", "Supernatural", "Shounen", "Drama"],
    synopsis: {
      en: "Yuji Itadori joins a secret organization of Jujutsu Sorcerers to eliminate a powerful Curse known as Ryomen Sukuna after swallowing one of his cursed fingers.",
      id: "Yuji Itadori bergabung dengan organisasi rahasia Penyihir Jujutsu untuk membasmi Kutukan kuat bernama Ryomen Sukuna setelah menelan salah satu jari terkutuknya.",
      ja: "虎杖悠仁は、両面宿儺の指を飲み込んだ後、強力な呪いを排除するために呪術師の秘密組織に加わる。",
      ko: "이타도리 유지는 저주받은 손가락을 삼킨 후 료멘 스쿠나라는 강력한 저주를 제거하기 위해 주술사의 비밀 조직에 합류합니다.",
    },
    studio: "MAPPA",
    year: 2020,
    season: "Fall",
    rank: 3,
    popularity: 3,
    members: 2500000,
    type: "TV",
  },

  // 4. MAJO NO TABITABI (Wandering Witch)
  {
    id: "majo-no-tabitabi",
    title: {
      en: "Wandering Witch: The Journey of Elaina",
      id: "Majo no Tabitabi",
      ja: "魔女の旅々",
      ko: "마녀의 여행",
    },
    cover: "https://files.catbox.moe/elqlhb.jpg",
    rating: 8.2,
    episodes: 12,
    status: "Completed",
    genres: ["Adventure", "Fantasy", "Slice of Life"],
    synopsis: {
      en: "Elaina, a young witch, travels across the world to see its beauty and meet new people. Each place she visits has its own unique story, both magical and melancholic.",
      id: "Elaina, seorang penyihir muda, berkeliling dunia untuk melihat keindahannya dan bertemu orang-orang baru. Setiap tempat yang dikunjunginya memiliki cerita unik, baik magis maupun melankolis.",
      ja: "若き魔女エレインは、世界の美しさを見て、新しい人々と出会うために旅をする。訪れる場所ごとに、魔法のような、そして哀愁漂う物語が待っている。",
      ko: "젊은 마녀 엘레이나는 세상의 아름다움을 보고 새로운 사람들을 만나기 위해 여행을 떠난다. 방문하는 곳마다 마법 같고 애수 어린 이야기가 펼쳐진다.",
    },
    studio: "C2C",
    year: 2020,
    season: "Fall",
    rank: 4,
    popularity: 4,
    members: 800000,
    type: "TV",
  },

  // 5. KIMI NO NAWA (Your Name)
  {
    id: "kimi-no-nawa",
    title: {
      en: "Your Name",
      id: "Kimi no Nawa",
      ja: "君の名は。",
      ko: "너의 이름은",
    },
    cover: "https://files.catbox.moe/9uic7m.jpg",
    rating: 9.0,
    episodes: 1,
    status: "Completed",
    genres: ["Romance", "Drama", "Fantasy", "Slice of Life"],
    synopsis: {
      en: "Mitsuha and Taki, two strangers who have never met, are inexplicably connected by a mysterious dream. As they begin to search for each other, a fateful disaster threatens to tear them apart.",
      id: "Mitsuha dan Taki, dua orang asing yang belum pernah bertemu, terhubung secara misterius oleh mimpi. Saat mereka mulai mencari satu sama lain, bencana takdir mengancam untuk memisahkan mereka.",
      ja: "三葉と瀧、出会ったことのない二人の高校生は、不思議な夢を通じて結ばれる。互いを探し始めたとき、運命の災害が二人を引き裂こうとする。",
      ko: "미츠하와 타키, 만난 적 없는 두 사람이 신비로운 꿈으로 연결된다. 서로를 찾기 시작할 무렵, 운명적인 재해가 두 사람을 갈라놓으려 한다.",
    },
    studio: "CoMix Wave Films",
    year: 2016,
    season: "Summer",
    rank: 5,
    popularity: 5,
    members: 4200000,
    type: "Movie",
  },
];

// ==================== HELPER FUNCTIONS ====================

export const getAnimeById = (id: string) => animeList.find((a) => a.id === id);

export const getTopRanked = () => [...animeList].sort((a, b) => a.rank - b.rank);

export const getMostPopular = () => [...animeList].sort((a, b) => a.popularity - b.popularity);

export const getByGenre = (genre: string) => animeList.filter((a) => a.genres.includes(genre));

export const getAiring = () => animeList.filter((a) => a.status === "Airing");

export const getUpcoming = () => animeList.filter((a) => a.status === "Upcoming");

export const getAnimeTitle = (anime: Anime, lang: Language) => anime.title[lang] || anime.title.en;

export const getAnimeSynopsis = (anime: Anime, lang: Language) => anime.synopsis[lang] || anime.synopsis.en;