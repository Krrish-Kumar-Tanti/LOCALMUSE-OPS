"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  savePlanFeedback,
  useFeedbackHistory,
  deleteFeedbackItem,
  type FeedbackCategory,
  type OperatorPlanFeedback,
} from "@/lib/feedback";
import type { WeeklyCulturalPlanData } from "@/types";

export interface PlanFeedbackCardProps {
  planData: WeeklyCulturalPlanData;
  onFeedbackSaved?: (feedback: OperatorPlanFeedback) => void;
  className?: string;
}

const CATEGORY_OPTIONS: FeedbackCategory[] = [
  "Relevant",
  "Not relevant",
  "Too expensive",
  "Difficult to implement",
  "Other",
];

export function PlanFeedbackCard({
  planData,
  onFeedbackSaved,
  className = "",
}: PlanFeedbackCardProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<FeedbackCategory[]>(["Relevant"]);
  const [note, setNote] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const { history } = useFeedbackHistory(planData.businessName, planData.locality);

  const toggleCategory = (cat: FeedbackCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (rating < 1 || rating > 5) {
      setErrorMsg("Please select a rating between 1 and 5 stars.");
      return;
    }

    const saved = savePlanFeedback({
      businessName: planData.businessName,
      city: planData.locality,
      targetWeek: planData.targetWeek,
      rating,
      categories: selectedCategories,
      note: note.trim() || undefined,
      planSummary: planData.executiveStrategy?.slice(0, 120),
    });

    if (saved) {
      setSavedSuccess(true);
      onFeedbackSaved?.(saved);
      setTimeout(() => setSavedSuccess(false), 4000);
      setNote("");
    } else {
      setErrorMsg("Unable to save feedback to local browser storage.");
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    deleteFeedbackItem(id);
  };

  return (
    <Card className={cn("border-border bg-surface text-left shadow-xs transition-all", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="neutral" size="sm">
                Step 14 Operator Review
              </Badge>
              <span className="text-[11px] font-mono text-accent-muted font-semibold">
                Local Device Memory
              </span>
            </div>
            <CardTitle className="font-serif text-lg sm:text-xl text-text-primary pt-1">
              Rate This Operations Plan &amp; Store Shift Memory
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Record operator feasibility feedback for <strong>{planData.businessName}</strong>. Previous feedback informs subsequent plan synthesis on this device.
            </CardDescription>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs font-mono text-primary hover:underline cursor-pointer self-start sm:self-center"
            >
              {showHistory ? "Hide Past Reviews" : `View Past Reviews (${history.length})`}
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Success Confirmation Toast */}
        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">✓</span>
              <span>
                Shift review saved to local device memory! Context will be referenced in future plan generations for <strong>{planData.businessName}</strong>.
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase font-bold shrink-0">Saved</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Star Rating */}
            <div className="p-4 rounded-2xl border border-border bg-surface-secondary/30 space-y-2">
              <label className="block text-xs font-semibold text-text-primary">
                Operational Feasibility Rating:
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                      aria-label={`Rate ${star} stars`}
                    >
                      <span className={cn(active ? "text-amber-500" : "text-border")}>
                        ★
                      </span>
                    </button>
                  );
                })}
                <span className="ml-2 font-mono text-xs font-bold text-text-primary">
                  {rating} of 5 Stars
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                How well does this plan balance cultural appeal with your venue&apos;s staffing and budget?
              </p>
            </div>

            {/* 2. Feedback Categories */}
            <div className="p-4 rounded-2xl border border-border bg-surface-secondary/30 space-y-2">
              <label className="block text-xs font-semibold text-text-primary">
                Operational Feasibility Tags:
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border",
                        isSelected
                          ? "bg-primary text-surface border-primary font-semibold shadow-2xs"
                          : "bg-surface text-text-secondary border-border hover:border-primary/40 hover:text-text-primary"
                      )}
                    >
                      {isSelected ? `✓ ${cat}` : cat}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Select one or more tags describing implementation hurdles or strengths.
              </p>
            </div>
          </div>

          {/* 3. Written Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="feedback-note" className="font-semibold text-text-primary">
                Optional Operator Shift Note (Max 280 chars):
              </label>
              <span className="text-[11px] font-mono text-accent-muted">
                {note.length} / 280
              </span>
            </div>
            <textarea
              id="feedback-note"
              rows={2}
              maxLength={280}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Cascara spritz is a hit on Wednesdays, but need lighter prep on Saturday mornings due to solo barista staffing."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans leading-relaxed"
            />
          </div>

          {/* Actions & Disclosures */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="p-2.5 rounded-xl bg-surface-secondary/50 border border-border text-[11px] text-text-secondary leading-relaxed flex-1">
              <strong>Local Memory Disclosure:</strong> Stored locally in your browser for this device. This provides historical memory for your venue and is never transmitted as individual customer data.
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="shrink-0 self-end sm:self-center"
            >
              <span>Save Local Feedback</span>
              <span>&rarr;</span>
            </Button>
          </div>
        </form>

        {/* Existing Feedback History Accordion */}
        {showHistory && history.length > 0 && (
          <div className="pt-3 border-t border-border space-y-2">
            <h5 className="font-serif text-sm font-semibold text-text-primary">
              Prior Shift Reviews for {planData.businessName}
            </h5>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-surface-secondary/40 border border-border text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500 font-bold">
                        {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                      </span>
                      <span className="font-mono text-[10px] text-accent-muted">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.categories.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] font-mono text-text-primary"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-text-secondary italic pt-0.5">
                      &ldquo;{item.note}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PlanFeedbackCard;
