import { useCallback, useMemo, useRef, useState } from "react";

export interface TypingMetrics {
  wpm: number;
  accuracy: number;
}

export interface UseTypingResult {
  input: string;
  progress: number; // 0~100
  currentIndex: number;
  shakeIndex: number | null;
  elapsed: number; // seconds (live)
  isFinished: boolean;
  metrics: TypingMetrics | null;
  handleChange: (value: string) => void;
  start: () => void;
  tick: (now: number) => void;
  reset: () => void;
}

/**
 * 타이핑 판정 훅.
 * - 글자 단위 정오 판정
 * - 진행률 계산
 * - WPM / 정확도 계산
 */
export function useTyping(text: string): UseTypingResult {
  const [input, setInput] = useState("");
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [metrics, setMetrics] = useState<TypingMetrics | null>(null);
  const totalAttemptsRef = useRef(0);
  const correctAttemptsRef = useRef(0);
  const shakeTimerRef = useRef<number | null>(null);

  const progress = useMemo(
    () => (text.length === 0 ? 0 : Math.round((input.length / text.length) * 100)),
    [input.length, text.length]
  );

  const isFinished = input.length === text.length && text.length > 0;

  const start = useCallback(() => {
    setStartTime(Date.now());
  }, []);

  const tick = useCallback((now: number) => {
    setStartTime((st) => {
      if (st === null) return st;
      setElapsed(Math.floor((now - st) / 1000));
      return st;
    });
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      if (startTime === null) return;
      if (value.length > text.length) return;

      // 새 글자가 추가된 경우에만 시도 수 증가
      if (value.length > input.length) {
        const newIndex = value.length - 1;
        const lastChar = value[newIndex];
        const expected = text[newIndex];
        totalAttemptsRef.current += 1;
        if (lastChar === expected) {
          correctAttemptsRef.current += 1;
        } else {
          setShakeIndex(newIndex);
          if (shakeTimerRef.current !== null) {
            window.clearTimeout(shakeTimerRef.current);
          }
          shakeTimerRef.current = window.setTimeout(() => setShakeIndex(null), 400);
        }
      }

      setInput(value);

      if (value.length === text.length) {
        const mins = (Date.now() - startTime) / 60000;
        const wpm = mins > 0 ? Math.round(value.length / 5 / mins) : 0;
        const totalAttempts = totalAttemptsRef.current;
        const accuracy =
          totalAttempts > 0
            ? Math.round((correctAttemptsRef.current / totalAttempts) * 100)
            : 0;
        setMetrics({ wpm, accuracy });
      }
    },
    [input.length, startTime, text]
  );

  const reset = useCallback(() => {
    setInput("");
    setShakeIndex(null);
    setStartTime(null);
    setElapsed(0);
    setMetrics(null);
    totalAttemptsRef.current = 0;
    correctAttemptsRef.current = 0;
  }, []);

  return {
    input,
    progress,
    currentIndex: input.length,
    shakeIndex,
    elapsed,
    isFinished,
    metrics,
    handleChange,
    start,
    tick,
    reset,
  };
}
