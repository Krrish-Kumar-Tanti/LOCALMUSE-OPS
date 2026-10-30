"use client";

import { useSyncExternalStore, useMemo } from "react";

export type FeedbackCategory =
  | "Relevant"
  | "Not relevant"
  | "Too expensive"
  | "Difficult to implement"
  | "Other";

export interface OperatorPlanFeedback {
  id: string;
  businessName: string;
  city: string;
  category?: string;
  targetWeek?: string;
  rating: number; // 1 to 5
  categories: FeedbackCategory[];
  note?: string;
  planSummary?: string;
  createdAt: string;
}

const STORAGE_KEY = "localmuse_operator_feedback";
const MAX_FEEDBACK_ITEMS = 50;

// Internal subscription mechanism for cross-component synchrony
let feedbackVersion = 0;
const feedbackListeners = new Set<() => void>();

export function subscribeFeedback(listener: () => void): () => void {
  feedbackListeners.add(listener);
  return () => {
    feedbackListeners.delete(listener);
  };
}

export function getFeedbackVersion(): number {
  return feedbackVersion;
}

function notifyFeedbackListeners(): void {
  feedbackVersion++;
  feedbackListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener error
    }
  });
}

/**
 * Retrieves all saved operator feedback items from localStorage.
 */
export function getSavedFeedback(): OperatorPlanFeedback[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.warn("[LocalMuse Feedback] Failed to read from localStorage:", err);
    return [];
  }
}

/**
 * Saves a new feedback review into local browser memory.
 */
export function savePlanFeedback(
  entry: Omit<OperatorPlanFeedback, "id" | "createdAt">
): OperatorPlanFeedback | null {
  if (typeof window === "undefined") return null;

  try {
    const existing = getSavedFeedback();
    const newFeedback: OperatorPlanFeedback = {
      ...entry,
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    // Prepend newest first, and cap storage to avoid unbounded growth
    const updated = [newFeedback, ...existing].slice(0, MAX_FEEDBACK_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyFeedbackListeners();
    return newFeedback;
  } catch (err) {
    console.warn("[LocalMuse Feedback] Failed to save feedback to localStorage:", err);
    return null;
  }
}

/**
 * Retrieves all feedback entries matching a specific business name (case-insensitive) and optional city.
 */
export function getFeedbackForBusiness(
  businessName: string,
  city?: string
): OperatorPlanFeedback[] {
  const all = getSavedFeedback();
  const normalizedName = (businessName || "").trim().toLowerCase();
  if (!normalizedName) return [];

  return all.filter((item) => {
    const matchName = item.businessName.trim().toLowerCase() === normalizedName;
    if (!city) return matchName;
    const matchCity = item.city.trim().toLowerCase() === city.trim().toLowerCase();
    return matchName && matchCity;
  });
}

/**
 * Retrieves the most recent feedback entry for a business to provide contextual memory in subsequent plan generations.
 */
export function getLatestFeedbackForBusiness(
  businessName: string,
  city?: string
): OperatorPlanFeedback | null {
  const matching = getFeedbackForBusiness(businessName, city);
  return matching[0] || null;
}

/**
 * React hook to reactively subscribe to feedback items for a business venue.
 */
export function useFeedbackHistory(businessName: string, city?: string): {
  history: OperatorPlanFeedback[];
  latest: OperatorPlanFeedback | null;
} {
  const version = useSyncExternalStore(subscribeFeedback, getFeedbackVersion, () => 0);

  const history = useMemo(() => {
    // version dependency triggers re-read when storage updates
    if (version < 0) return [];
    return getFeedbackForBusiness(businessName, city);
  }, [businessName, city, version]);

  return {
    history,
    latest: history[0] || null,
  };
}

/**
 * Deletes a specific feedback item by ID.
 */
export function deleteFeedbackItem(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedFeedback();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    notifyFeedbackListeners();
  } catch (err) {
    console.warn("[LocalMuse Feedback] Failed to delete feedback item:", err);
  }
}

/**
 * Clears all local operator feedback.
 */
export function clearAllFeedback(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyFeedbackListeners();
  } catch (err) {
    console.warn("[LocalMuse Feedback] Failed to clear feedback storage:", err);
  }
}
