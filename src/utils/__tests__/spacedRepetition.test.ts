import { describe, it, expect } from "vitest";
import {
  initCardSchedule,
  calculateNextReview,
  selectDueCards,
  addDays,
  DEFAULT_EASE_FACTOR,
  MIN_EASE_FACTOR
} from "../spacedRepetition";

describe("Spaced Repetition Engine (SM-2)", () => {
  it("initializes a card schedule with default ease factor and due today", () => {
    const cardId = "card-1";
    const today = "2026-10-23";
    const sched = initCardSchedule(cardId, today);

    expect(sched.cardId).toBe("card-1");
    expect(sched.repetition).toBe(0);
    expect(sched.interval).toBe(0);
    expect(sched.easeFactor).toBe(DEFAULT_EASE_FACTOR);
    expect(sched.dueDate).toBe(today);
    expect(sched.lapses).toBe(0);
  });

  it("handles first successful review (Rating 4: Good) setting interval to 1 day", () => {
    const sched = initCardSchedule("card-1", "2026-10-23");
    const { nextSchedule, historyEntry } = calculateNextReview(sched, 4, "2026-10-23");

    expect(nextSchedule.repetition).toBe(1);
    expect(nextSchedule.interval).toBe(1);
    expect(nextSchedule.dueDate).toBe("2026-10-24");
    expect(historyEntry.rating).toBe(4);
    expect(historyEntry.newInterval).toBe(1);
  });

  it("handles second successful review (Rating 4: Good) setting interval to 6 days", () => {
    let sched = initCardSchedule("card-1", "2026-10-23");
    sched = calculateNextReview(sched, 4, "2026-10-23").nextSchedule;
    const { nextSchedule } = calculateNextReview(sched, 4, "2026-10-24");

    expect(nextSchedule.repetition).toBe(2);
    expect(nextSchedule.interval).toBe(6);
    expect(nextSchedule.dueDate).toBe("2026-10-30");
  });

  it("multiplies interval by ease factor on third review", () => {
    let sched = initCardSchedule("card-1", "2026-10-23");
    sched = calculateNextReview(sched, 4, "2026-10-23").nextSchedule; // rep 1, int 1
    sched = calculateNextReview(sched, 4, "2026-10-24").nextSchedule; // rep 2, int 6
    const { nextSchedule } = calculateNextReview(sched, 4, "2026-10-30"); // rep 3, int 6 * 2.5 = 15

    expect(nextSchedule.repetition).toBe(3);
    expect(nextSchedule.interval).toBe(15);
    expect(nextSchedule.dueDate).toBe(addDays("2026-10-30", 15));
  });

  it("resets repetition and interval to 1 day on lapse (Rating 1: Again)", () => {
    let sched = initCardSchedule("card-1", "2026-10-23");
    sched = calculateNextReview(sched, 4, "2026-10-23").nextSchedule;
    sched = calculateNextReview(sched, 4, "2026-10-24").nextSchedule;
    expect(sched.repetition).toBe(2);

    const { nextSchedule } = calculateNextReview(sched, 1, "2026-10-30");

    expect(nextSchedule.repetition).toBe(0);
    expect(nextSchedule.interval).toBe(1);
    expect(nextSchedule.dueDate).toBe("2026-10-31");
    expect(nextSchedule.lapses).toBe(1);
    // Ease factor should drop
    expect(nextSchedule.easeFactor).toBeLessThan(DEFAULT_EASE_FACTOR);
  });

  it("enforces minimum ease factor threshold", () => {
    let sched = initCardSchedule("card-hard", "2026-10-23");
    // Repeated lapses
    for (let i = 0; i < 10; i++) {
      sched = calculateNextReview(sched, 1, "2026-10-23").nextSchedule;
    }

    expect(sched.easeFactor).toBe(MIN_EASE_FACTOR);
  });

  it("selects due cards accurately based on date comparison", () => {
    const cards = [
      { id: "c1", title: "Card 1" },
      { id: "c2", title: "Card 2" },
      { id: "c3", title: "Card 3" }
    ];

    const schedules = {
      c1: { cardId: "c1", repetition: 1, interval: 1, easeFactor: 2.5, dueDate: "2026-10-22", lapses: 0 }, // overdue
      c2: { cardId: "c2", repetition: 2, interval: 6, easeFactor: 2.5, dueDate: "2026-10-23", lapses: 0 }, // due today
      c3: { cardId: "c3", repetition: 3, interval: 15, easeFactor: 2.5, dueDate: "2026-10-28", lapses: 0 } // future
    };

    const dueToday = selectDueCards(cards, schedules, "2026-10-23");
    expect(dueToday.map(c => c.id)).toEqual(["c1", "c2"]);
  });
});
