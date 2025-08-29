"use client";

import { useEffect, useState } from "react";

type UseFeedbackOptions<T> = {
  /** Delay before opening (ms). Default 2000. */
  delayMs?: number;
  /** Custom rule to decide when to open. Default: Boolean(value). */
  predicate?: (value: T) => boolean;
};

export default function useFeedback<T>(
  successTrigger: T,
  options: UseFeedbackOptions<T> = {}
) {
  const { delayMs = 2000, predicate } = options;
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const shouldOpen = predicate ? predicate(successTrigger) : Boolean(successTrigger);
    if (shouldOpen) {
      const timer = setTimeout(() => setFeedbackOpen(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [successTrigger, delayMs, predicate]);

  return { feedbackOpen, setFeedbackOpen };
}