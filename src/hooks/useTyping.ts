import { useCallback, useMemo, useRef, useState } from "react";

export interface TypingMetrics {
  wpm: number;
  accuracy: number;
}

export interface UseTypingResult {
  input: string;
  composing: boolean;
  progress: number;
  currentIndex: number;
  shakeIndex: number | null;
  elapsed: number;
  isFinished: boolean;
  metrics: TypingMetrics | null;
  handleChange: (value: string) => void;
  handleCompositionStart: () => void;
  handleCompositionEnd: (value: string) => void;
  start: () => void;
  tick: (now: number) => void;
  reset: () => void;
}

export function useTyping(text: string): UseTypingResult {
  const [input, setInput] = useState("");
  const [composing, setComposing] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [metrics, setMetrics] = useState<TypingMetrics | null>(null);
  const totalAttemptsRef = useRef(0);
  const correctAttemptsRef = useRef(0);
  const shakeTimerRef = useRef<number | null>(null);
  const composingRef = useRef(false);
  const countedLenRef = useRef(0);

  const progress = useMemo(() => {
    if (text.length === 0) return 0;
    const normInput = input.normalize("NFC");
    const normText = text.normalize("NFC");
    let correct = 0;
    for (let i = 0; i < normInput.length; i++) {
      if (i < normText.length && normInput[i] === normText[i]) correct++;
    }
    return Math.round((correct / normText.length) * 100);
  }, [input, text]);

  const isFinished = metrics !== null;

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

  const triggerShake = useCallback((idx: number) => {
    setShakeIndex(idx);
    if (shakeTimerRef.current !== null) window.clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = window.setTimeout(() => setShakeIndex(null), 400);
  }, []);

  const checkFinish = useCallback(
    (value: string) => {
      if (startTime && value.length === text.length && value === text) {
        const mins = (Date.now() - startTime) / 60000;
        const wpm = mins > 0 ? Math.round(value.length / 5 / mins) : 0;
        const accuracy =
          totalAttemptsRef.current > 0
            ? Math.round((correctAttemptsRef.current / totalAttemptsRef.current) * 100)
            : 0;
        setMetrics({ wpm, accuracy });
      }
    },
    [startTime, text]
  );

  const handleChange = useCallback(
    (value: string) => {
      if (startTime === null) return;
      if (value.length > text.length) return;

      if (composingRef.current) {
        setInput(value);
        return;
      }

      if (value.length < countedLenRef.current) {
        countedLenRef.current = value.length;
      }

      if (value.length > input.length) {
        for (let i = input.length; i < value.length; i++) {
          totalAttemptsRef.current += 1;
          if (value[i] === text[i]) {
            correctAttemptsRef.current += 1;
          } else {
            triggerShake(i);
          }
        }
        countedLenRef.current = value.length;
      }

      setInput(value);
      checkFinish(value);
    },
    [input.length, startTime, text, triggerShake, checkFinish]
  );

  const handleCompositionStart = useCallback(() => {
    composingRef.current = true;
    setComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(
    (value: string) => {
      composingRef.current = false;
      setComposing(false);

      if (startTime === null) return;

      for (let i = countedLenRef.current; i < value.length; i++) {
        if (i >= text.length) break;
        totalAttemptsRef.current += 1;
        if (value[i] === text[i]) {
          correctAttemptsRef.current += 1;
        } else {
          triggerShake(i);
        }
      }
      countedLenRef.current = value.length;

      setInput(value);
      checkFinish(value);
    },
    [startTime, text, triggerShake, checkFinish]
  );

  const reset = useCallback(() => {
    setInput("");
    setComposing(false);
    setShakeIndex(null);
    setStartTime(null);
    setElapsed(0);
    setMetrics(null);
    totalAttemptsRef.current = 0;
    correctAttemptsRef.current = 0;
    countedLenRef.current = 0;
    composingRef.current = false;
  }, []);

  return {
    input,
    composing,
    progress,
    currentIndex: input.length,
    shakeIndex,
    elapsed,
    isFinished,
    metrics,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    start,
    tick,
    reset,
  };
}
