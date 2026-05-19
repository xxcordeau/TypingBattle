import type { TextType } from "@/types";

/**
 * 한국어 예문 (퍼블릭 도메인)
 * 충분한 분량으로 5줄 이상 타이핑되도록 구성.
 */
export const KOREAN_TEXTS: string[] = [
  // 애국가 1~4절
  "동해 물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세. 무궁화 삼천리 화려 강산 대한 사람 대한으로 길이 보전하세. 남산 위에 저 소나무 철갑을 두른 듯 바람 서리 불변함은 우리 기상일세. 가을 하늘 공활한데 높고 구름 없이 밝은 달은 우리 가슴 일편단심일세. 이 기상과 이 맘으로 충성을 다하여 괴로우나 즐거우나 나라 사랑하세.",
  // 윤동주 서시
  "죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를, 잎새에 이는 바람에도 나는 괴로워했다. 별을 노래하는 마음으로 모든 죽어가는 것을 사랑해야지. 그리고 나한테 주어진 길을 걸어가야겠다. 오늘 밤에도 별이 바람에 스치운다.",
  // 훈민정음 서문 + 풀이
  "나랏말싸미 듕귁에 달아 문자와로 서로 사맛디 아니할쎄, 이런 전차로 어린 백성이 니르고져 홀 배 이셔도 마참내 제 뜨들 시러 펴디 못할 놈이 하니라. 내 이를 위하야 어엿비 너겨 새로 스물여듧 자를 맹가노니 사람마다 해여 수비 니겨 날로 쑤메 뼌한킈 하고져 할 따라미니라.",
  // 김소월 진달래꽃
  "나 보기가 역겨워 가실 때에는 말없이 고이 보내 드리오리다. 영변에 약산 진달래꽃 아름 따다 가실 길에 뿌리오리다. 가시는 걸음 걸음 놓인 그 꽃을 사뿐히 즈려밟고 가시옵소서. 나 보기가 역겨워 가실 때에는 죽어도 아니 눈물 흘리오리다.",
  // 한용운 님의 침묵 (일부)
  "님은 갔습니다. 아아, 사랑하는 나의 님은 갔습니다. 푸른 산빛을 깨치고 단풍나무 숲을 향하여 난 작은 길을 걸어서 차마 떨치고 갔습니다. 황금의 꽃같이 굳고 빛나던 옛 맹세는 차디찬 티끌이 되어서 한숨의 미풍에 날아갔습니다. 우리는 만날 때에 떠날 것을 염려하는 것과 같이, 떠날 때에 다시 만날 것을 믿습니다.",
];

/**
 * 영어 예문 (퍼블릭 도메인)
 */
export const ENGLISH_TEXTS: string[] = [
  "The quick brown fox jumps over the lazy dog near the riverbank on a sunny afternoon. A journey of a thousand miles begins with a single step, and every small effort brings us closer to the summit. Practice makes perfect, so keep typing with steady hands and a calm mind.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
  "To be, or not to be, that is the question: whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. To die, to sleep, no more; and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to.",
  "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness. That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed.",
  "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.",
];

export function pickRandomText(type: TextType, customText?: string): string {
  if (type === "custom") {
    return customText?.trim() || ENGLISH_TEXTS[0];
  }
  const pool = type === "korean" ? KOREAN_TEXTS : ENGLISH_TEXTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
