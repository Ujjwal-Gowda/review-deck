// SuperMemo-2 (SM-2) Spaced Repetition Scheduling Engine

export type ReviewRating = 1 | 3 | 4 | 5; // 1 = Again, 3 = Hard, 4 = Good, 5 = Easy

export interface CardSchedule {
  cardId: string;
  repetition: number;
  interval: number; // in days
  easeFactor: number; // minimum 1.3, default 2.5
  dueDate: string; // YYYY-MM-DD
  lastReviewed?: string; // ISO string
  lapses: number; // number of times rated 'Again'
}

export interface ReviewHistoryEntry {
  cardId: string;
  reviewedAt: string;
  rating: ReviewRating;
  previousInterval: number;
  newInterval: number;
  easeFactor: number;
}

export const DEFAULT_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;

/**
 * Returns today's date in YYYY-MM-DD format based on local time or specified date.
 */
export function toDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Adds a given number of days to a base date string.
 */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + Math.max(1, Math.round(days)));
  return toDateString(d);
}

/**
 * Initializes a new schedule entry for a flashcard.
 */
export function initCardSchedule(cardId: string, baseDate: string = toDateString()): CardSchedule {
  return {
    cardId,
    repetition: 0,
    interval: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    dueDate: baseDate,
    lapses: 0
  };
}

/**
 * Computes the updated schedule for a card given a user review rating.
 *
 * Ratings:
 * 1 (Again): Complete recall failure. Reset interval to 1 day, decrease ease factor.
 * 3 (Hard): Successful recall with struggle. Moderate interval growth, decrease ease factor.
 * 4 (Good): Standard successful recall. Normal SM-2 exponential interval growth.
 * 5 (Easy): Instant, effortless recall. Accelerated interval growth, increase ease factor.
 */
export function calculateNextReview(
  current: CardSchedule,
  rating: ReviewRating,
  reviewDate: string = toDateString()
): { nextSchedule: CardSchedule; historyEntry: ReviewHistoryEntry } {
  const prevInterval = current.interval;
  let rep = current.repetition;
  let interval = current.interval;
  let ef = current.easeFactor;
  let lapses = current.lapses;

  // Update Ease Factor using standard SM-2 formula:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const q = rating;
  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < MIN_EASE_FACTOR) ef = MIN_EASE_FACTOR;

  if (rating === 1) {
    // Failure / Lapse
    rep = 0;
    interval = 1;
    lapses += 1;
  } else {
    // Success (ratings 3, 4, 5)
    if (rep === 0) {
      interval = 1;
    } else if (rep === 1) {
      interval = rating === 3 ? 3 : 6;
    } else {
      if (rating === 3) {
        interval = Math.round(interval * 1.2);
      } else if (rating === 4) {
        interval = Math.round(interval * ef);
      } else {
        // rating 5 (Easy) bonus
        interval = Math.round(interval * ef * 1.3);
      }
    }
    rep += 1;
  }

  // Ensure minimum interval is at least 1 day
  if (interval < 1) interval = 1;

  const nextSchedule: CardSchedule = {
    cardId: current.cardId,
    repetition: rep,
    interval,
    easeFactor: Number(ef.toFixed(2)),
    dueDate: addDays(reviewDate, interval),
    lastReviewed: new Date().toISOString(),
    lapses
  };

  const historyEntry: ReviewHistoryEntry = {
    cardId: current.cardId,
    reviewedAt: new Date().toISOString(),
    rating,
    previousInterval: prevInterval,
    newInterval: interval,
    easeFactor: nextSchedule.easeFactor
  };

  return { nextSchedule, historyEntry };
}

/**
 * Filters and returns cards that are due for review on or before the given date.
 */
export function selectDueCards<T extends { id: string }>(
  allCards: T[],
  schedules: Record<string, CardSchedule>,
  currentDate: string = toDateString()
): T[] {
  return allCards.filter(card => {
    const sched = schedules[card.id];
    if (!sched) return true; // Unreviewed card is due immediately
    return sched.dueDate <= currentDate;
  });
}
