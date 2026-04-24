import type { TextType } from "@/types";

/**
 * 한국어 예문 (퍼블릭 도메인)
 * - 애국가 1절
 * - 윤동주 「서시」 (1941, 저작권 만료)
 * - 기타 고전/격언
 */
export const KOREAN_TEXTS: string[] = [
  "동해 물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세. 무궁화 삼천리 화려강산 대한 사람 대한으로 길이 보전하세.",
  "죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를, 잎새에 이는 바람에도 나는 괴로워했다. 별을 노래하는 마음으로 모든 죽어가는 것을 사랑해야지. 그리고 나한테 주어진 길을 걸어가야겠다. 오늘 밤에도 별이 바람에 스치운다.",
  "가는 말이 고와야 오는 말이 곱다. 천리 길도 한 걸음부터 시작된다. 작은 노력이 모여 큰 결실을 이룬다.",
  "세종대왕께서 백성을 어여삐 여기시어 스물여덟 글자를 만드시니, 사람마다 쉽게 익혀 날로 쓰기에 편안하게 하고자 함이라.",
];

/**
 * 영어 예문 (퍼블릭 도메인 / 자주 쓰이는 타자 연습 문장)
 */
export const ENGLISH_TEXTS: string[] = [
  "The quick brown fox jumps over the lazy dog near the riverbank on a sunny afternoon.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
  "To be, or not to be, that is the question: whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune.",
  "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights.",
  "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, I thought I would sail about a little.",
];

export function pickRandomText(type: TextType, customText?: string): string {
  if (type === "custom") {
    return customText?.trim() || ENGLISH_TEXTS[0];
  }
  const pool = type === "korean" ? KOREAN_TEXTS : ENGLISH_TEXTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
