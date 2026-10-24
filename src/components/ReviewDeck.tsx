import { useState, useMemo, useEffect } from "react";
import {
  type CardSchedule,
  type ReviewHistoryEntry,
  type ReviewRating,
  calculateNextReview,
  initCardSchedule,
  selectDueCards,
  toDateString
} from "../utils/spacedRepetition";
import {
  IconTarget,
  IconCards,
  IconCheckCircle,
  IconRotateCcw,
  IconAlertTriangle,
  IconCheck,
  IconZap,
  IconChevronDown,
  IconArrowRight
} from "./Icons";

export interface ReviewCard {
  id: string;
  chapterId: number;
  chapterTitle: string;
  language?: "JavaScript" | "TypeScript" | "Python" | "Go" | "Foundations";
  question: string;
  answer: string;
  tag: string;
  codeSnippet?: string;
}

export const COMPREHENSIVE_REVIEW_CARDS: ReviewCard[] = [
  // ── JavaScript in Depth ──
  {
    id: "card-js-eventloop",
    chapterId: 171,
    chapterTitle: "JavaScript Runtime & Event Loop",
    language: "JavaScript",
    question: "What is the exact execution order of synchronous code, microtasks, and macrotasks (timers)?",
    answer: "1. The call stack runs all synchronous code to completion.\n2. When the call stack empties, the event loop empties the ENTIRE microtask queue (Promise callbacks, queueMicrotask) including any newly queued microtasks.\n3. The browser performs rendering updates if needed.\n4. Exactly ONE macrotask (setTimeout, setInterval, I/O) is dequeued and executed, after which the microtask queue is checked again.",
    tag: "JS Runtime",
    codeSnippet: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Prints: 1, 4, 3, 2`
  },
  {
    id: "card-js-this-binding",
    chapterId: 171,
    chapterTitle: "JavaScript Functions & 'this'",
    language: "JavaScript",
    question: "How is 'this' determined in a regular function vs an arrow function?",
    answer: "In regular functions, 'this' is dynamic and bound at CALL time: obj.method() binds to obj, standalone fn() binds to undefined (in strict mode) or global. In arrow functions, 'this' is lexical: it captures 'this' from the enclosing scope where the arrow function was defined, and cannot be changed by call, apply, or bind.",
    tag: "JS Semantics"
  },
  {
    id: "card-js-prototypes",
    chapterId: 171,
    chapterTitle: "JavaScript Object Model",
    language: "JavaScript",
    question: "How does property lookup traverse the prototype chain, and where does it terminate?",
    answer: "When accessing obj.prop, JavaScript checks obj's own properties. If not found, it follows the internal [[Prototype]] reference (Object.getPrototypeOf(obj)). It walks up the chain: obj → Class.prototype → Object.prototype → null. If null is reached without finding the property, it evaluates to undefined.",
    tag: "JS Objects"
  },

  // ── TypeScript in Depth ──
  {
    id: "card-ts-type-erasure",
    chapterId: 49,
    chapterTitle: "TypeScript Overview & Mental Model",
    language: "TypeScript",
    question: "What is type erasure and why does it mandate runtime validation for API boundaries?",
    answer: "TypeScript types exist solely at compile time. The compiler verifies assignability and then completely erases all interfaces, type aliases, and generic parameters when generating JavaScript. Because no types exist at runtime, external data (HTTP responses, localStorage, form inputs) must be validated with runtime schemas (e.g. Zod, Valibot) before casting.",
    tag: "TS Foundations"
  },
  {
    id: "card-ts-discriminated-unions",
    chapterId: 54,
    chapterTitle: "Interfaces, Classes & Type Modelling",
    language: "TypeScript",
    question: "What is a discriminated union and how does TypeScript ensure exhaustive checking?",
    answer: "A discriminated union is a union of object types that each share a common literal property (the 'discriminant' tag, e.g. status: 'success' | 'error'). TypeScript narrows the type inside switch/if blocks. Exhaustiveness is verified by assigning the default case to the 'never' type (const _exhaustive: never = val), causing a compile-time error if any union member is unhandled.",
    tag: "TS Types"
  },
  {
    id: "card-ts-structural-typing",
    chapterId: 49,
    chapterTitle: "TypeScript Structural Type System",
    language: "TypeScript",
    question: "What is structural typing (duck typing) in TypeScript compared to nominal typing in Java/C#?",
    answer: "In structural typing, type compatibility is determined entirely by the shape/members of the data, not by its declared name or explicit inheritance hierarchy. If object A possesses all the properties required by interface B with compatible types, A is assignable to B even if it never declared an 'implements B' relationship.",
    tag: "TS Typing"
  },

  // ── Python in Depth ──
  {
    id: "card-py-names-vs-objects",
    chapterId: 38,
    chapterTitle: "Python Overview & Object Model",
    language: "Python",
    question: "What is the difference between identity ('is') and equality ('==') in Python?",
    answer: "'==' checks value equality by invoking __eq__(): do these two objects have equivalent content? 'is' checks memory identity (id(a) == id(b)): do both variables point to the exact same object in heap memory? Never use 'is' for integers or strings (small integer caching is a CPython implementation detail); use 'is' only for singletons like None.",
    tag: "Python Objects"
  },
  {
    id: "card-py-mutable-default-args",
    chapterId: 41,
    chapterTitle: "Python Functions & Control Flow",
    language: "Python",
    question: "Why does 'def append_to(item, target=[])' cause unexpected bugs across multiple calls?",
    answer: "In Python, default parameter expressions are evaluated ONCE at function definition time when the module loads, not every time the function is called. The exact same list object is retained and mutated across all subsequent invocations. The idiom is to use sentinel None: def append_to(item, target=None): if target is None: target = [].",
    tag: "Python Functions"
  },
  {
    id: "card-py-gil-concurrency",
    chapterId: 47,
    chapterTitle: "Python Concurrency: asyncio, Threads & Processes",
    language: "Python",
    question: "What is the Global Interpreter Lock (GIL) and when do threads help vs multiprocessing?",
    answer: "The GIL is a mutex in CPython that prevents multiple native threads from executing Python bytecode simultaneously. Multi-threading does NOT speed up CPU-bound operations in Python. However, threads DO release the GIL during blocking I/O (disk, network socket reads). For CPU-bound parallelism, use multiprocessing (separate memory spaces) or ProcessPoolExecutor.",
    tag: "Python Concurrency"
  },

  // ── Go in Depth ──
  {
    id: "card-go-slice-header",
    chapterId: 63,
    chapterTitle: "Go Arrays, Slices, Maps & Strings",
    language: "Go",
    question: "What are the three components of a Go slice header in memory?",
    answer: "A slice header is a 24-byte struct (on 64-bit platforms) containing:\n1. Data *T: pointer to the backing array memory.\n2. Len int: the number of active elements.\n3. Cap int: the capacity (distance from start of slice to end of backing array).\nSub-slices share the exact same backing array until append exceeds capacity, which allocates a new array and severs the link.",
    tag: "Go Memory"
  },
  {
    id: "card-go-nil-interface-trap",
    chapterId: 64,
    chapterTitle: "Go Structs, Methods & Interfaces",
    language: "Go",
    question: "Why can an interface holding a nil pointer evaluate to NOT equal to nil (err != nil is true)?",
    answer: "In Go, an interface value is a two-word pair: (TypeDescriptor, ValuePointer). An interface is only equal to nil if BOTH its type and value are nil. If a function returns a typed pointer (*MyError)(nil) stored in an error interface, the interface's type word is *MyError, so 'err != nil' evaluates to TRUE! Always return untyped nil directly on error-free paths.",
    tag: "Go Interfaces"
  },
  {
    id: "card-go-goroutines-channels",
    chapterId: 66,
    chapterTitle: "Go Goroutines, Channels & Context",
    language: "Go",
    question: "What is the difference between an unbuffered and buffered channel in Go?",
    answer: "An unbuffered channel (make(chan T)) requires synchronous rendezvous: a send blocks until another goroutine is actively receiving, and a receive blocks until another goroutine sends. A buffered channel (make(chan T, n)) allows sends to complete without blocking as long as the internal ring buffer has space. When the buffer is full, sends block.",
    tag: "Go Concurrency"
  },

  // ── Shared Foundations & Computer Science ──
  {
    id: "card-js-coercion-rules",
    chapterId: 24,
    chapterTitle: "JavaScript Fundamentals: Types, Scope & Hoisting",
    language: "JavaScript",
    question: "How does the + operator behave differently from -, *, and / in JavaScript?",
    answer: "The + operator is overloaded: if EITHER operand converts to a string (via ToPrimitive), it performs string concatenation ('5' + 2 === '52'). All other arithmetic operators (-, *, /, %) convert both operands into numbers via ToNumber ('5' - 2 === 3).",
    tag: "JS Coercion",
    codeSnippet: `console.log("5" + 2); // "52"
console.log("5" - 2); // 3
console.log("5" * "2"); // 10
console.log([] + {}); // "[object Object]"`
  },
  {
    id: "card-js-promise-combinators",
    chapterId: 26,
    chapterTitle: "Asynchronous JavaScript: Event Loop, Promises & Timers",
    language: "JavaScript",
    question: "When should you use Promise.all vs Promise.allSettled vs Promise.race vs Promise.any?",
    answer: "• Promise.all: Resolves when ALL fulfill; rejects immediately on FIRST rejection (fail-fast).\n• Promise.allSettled: Resolves when ALL settle (fulfill OR reject); never rejects.\n• Promise.race: Settles as soon as the FIRST promise settles (resolves or rejects); great for timeouts.\n• Promise.any: Resolves as soon as the FIRST promise fulfills; rejects only if ALL reject (AggregateError).",
    tag: "JS Async"
  },
  {
    id: "card-js-streams-backpressure",
    chapterId: 27,
    chapterTitle: "Practical JavaScript: Node.js, Modules, Streams & Projects",
    language: "JavaScript",
    question: "What is backpressure in Node.js streams and why does stream.pipeline prevent memory overflow?",
    answer: "Backpressure occurs when data is read faster than the downstream writer can consume it. If unmanaged, incoming chunks accumulate in RAM until the process crashes with OutOfMemory. stream.pipeline automatically coordinates pause() on the readable source until the writable destination emits 'drain', maintaining constant low heap consumption.",
    tag: "Node.js Streams"
  },
  {
    id: "card-ts-unknown-vs-any",
    chapterId: 30,
    chapterTitle: "TypeScript Foundations: Annotations, Unions & Narrowing",
    language: "TypeScript",
    question: "What is the difference between unknown and any in TypeScript?",
    answer: "'any' completely turns off static type checking; any operation or property access is permitted at compile time, pushing crashes to runtime. 'unknown' is the safe top type: it accepts any value, but the compiler forbids reading properties, indexing, or invoking it until you narrow the type using typeof, instanceof, or a custom type predicate.",
    tag: "TS Safety",
    codeSnippet: `let a: any = "hello";
a.toUpperCase(); // OK
a.nonExistent(); // OK at compile time, crashes at runtime!

let b: unknown = "hello";
// b.toUpperCase(); // Compile error!
if (typeof b === "string") b.toUpperCase(); // Safe!`
  },
  {
    id: "card-ts-type-predicates",
    chapterId: 33,
    chapterTitle: "Interfaces, Classes & Type Modelling",
    language: "TypeScript",
    question: "What is a custom type predicate (val is T) and when is it required?",
    answer: "A type predicate is a function return type annotation in the form 'paramName is TypeName'. When the function returns true, the TypeScript compiler narrows the passed variable to that specific type in subsequent conditional blocks. It is essential for validating complex nested objects or API responses where simple typeof/instanceof checks are insufficient.",
    tag: "TS Narrowing"
  },
  {
    id: "card-py-dunder-protocol",
    chapterId: 43,
    chapterTitle: "Python Classes & the Data Model",
    language: "Python",
    question: "How does Python's Data Model use dunder methods to enable idiomatic language features?",
    answer: "Python features are implemented through special methods ('dunder' methods):\n• Iteration (for x in obj): calls __iter__() and __next__()\n• Indexing (obj[key]): calls __getitem__(key)\n• Length (len(obj)): calls __len__()\n• String representation: calls __repr__() and __str__()\n• Context managers (with obj:): calls __enter__() and __exit__()",
    tag: "Python Data Model"
  },
  {
    id: "card-go-defer-timing",
    chapterId: 62,
    chapterTitle: "Go Control Flow & Functions",
    language: "Go",
    question: "When are arguments to a deferred function evaluated in Go?",
    answer: "Arguments to a deferred function are evaluated IMMEDIATELY when the defer statement is reached, not when the function returns! However, the deferred function body itself executes in LIFO order upon surrounding function exit. If you need late evaluation, pass values through a closure or pointer.",
    tag: "Go Defer",
    codeSnippet: `i := 0
defer fmt.Println("deferred:", i) // i is evaluated NOW (0)
i++
fmt.Println("normal:", i)
// Output:
// normal: 1
// deferred: 0`
  },
  {
    id: "card-foundations-stack-heap",
    chapterId: 21,
    chapterTitle: "Memory & Pointers",
    language: "Foundations",
    question: "What are the fundamental differences between stack memory and heap memory?",
    answer: "Stack memory is organized as contiguous LIFO frames. Allocation/deallocation is a single CPU stack pointer register shift (instantaneous, zero fragmentation, scoped to function return). Heap memory is dynamic, arbitrarily sized, and managed via an allocator (e.g. malloc/free, runtime GC). Allocations require searching free-lists and outlive the allocating function.",
    tag: "Foundations"
  },
  {
    id: "card-foundations-bisection-debug",
    chapterId: 22,
    chapterTitle: "Debugging & Scientific Method",
    language: "Foundations",
    question: "What is the bisection method in systematic debugging?",
    answer: "Bisection isolates a bug by repeatedly dividing the search space in half. In code execution: print state or inspect at the exact midpoint of a workflow to test whether the bug occurred in the first half or second half. In version control: 'git bisect' performs a binary search over commit history to find the exact commit that introduced a failing test in O(log N) steps.",
    tag: "Foundations"
  }
];

export function ReviewDeck() {
  const [schedules, setSchedules] = useState<Record<string, CardSchedule>>(() => {
    try {
      const stored = localStorage.getItem("ef-deck-schedules");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [history, setHistory] = useState<ReviewHistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem("ef-deck-history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [filterMode, setFilterMode] = useState<"due" | "all">("due");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedToday, setReviewedToday] = useState(0);

  // Sync schedules & history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ef-deck-schedules", JSON.stringify(schedules));
    } catch { /* private mode */ }
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem("ef-deck-history", JSON.stringify(history));
    } catch { /* private mode */ }
  }, [history]);

  const todayStr = useMemo(() => toDateString(), []);

  // Filter cards by language and due date
  const filteredCards = useMemo(() => {
    let pool = COMPREHENSIVE_REVIEW_CARDS;
    if (selectedLanguage !== "All") {
      pool = pool.filter(c => c.language === selectedLanguage);
    }
    if (filterMode === "due") {
      return selectDueCards(pool, schedules, todayStr);
    }
    return pool;
  }, [selectedLanguage, filterMode, schedules, todayStr]);

  const currentCard = filteredCards[currentIndex] ?? filteredCards[0];

  const currentSchedule = useMemo(() => {
    if (!currentCard) return null;
    return schedules[currentCard.id] ?? initCardSchedule(currentCard.id, todayStr);
  }, [currentCard, schedules, todayStr]);

  // Projected interval calculations for the 4 rating buttons
  const projections = useMemo(() => {
    if (!currentSchedule) return null;
    return {
      again: calculateNextReview(currentSchedule, 1, todayStr).nextSchedule.interval,
      hard: calculateNextReview(currentSchedule, 3, todayStr).nextSchedule.interval,
      good: calculateNextReview(currentSchedule, 4, todayStr).nextSchedule.interval,
      easy: calculateNextReview(currentSchedule, 5, todayStr).nextSchedule.interval,
    };
  }, [currentSchedule, todayStr]);

  const handleRate = (rating: ReviewRating) => {
    if (!currentCard || !currentSchedule) return;

    const { nextSchedule, historyEntry } = calculateNextReview(currentSchedule, rating, todayStr);

    setSchedules(prev => ({
      ...prev,
      [currentCard.id]: nextSchedule
    }));

    setHistory(prev => [historyEntry, ...prev.slice(0, 99)]);
    setReviewedToday(c => c + 1);
    setFlipped(false);

    if (filterMode === "due") {
      // In due mode, the card was answered and will drop out of due list
      setCurrentIndex(0);
    } else {
      setCurrentIndex(i => (i + 1) % Math.max(1, filteredCards.length));
    }
  };

  const totalDueCount = useMemo(() => {
    return selectDueCards(COMPREHENSIVE_REVIEW_CARDS, schedules, todayStr).length;
  }, [schedules, todayStr]);

  return (
    <article className="review-deck-view">
      <div className="crumbs">
        <span className="stagechip">Spaced Repetition</span>
        <span className="eyebrow">Active Recall Engine (SM-2)</span>
      </div>

      <h1 className="chtitle">Spaced Repetition Review Deck</h1>
      <p className="lead">
        Active recall with mathematical spaced repetition. Reviewing at 1-day, 6-day, and exponential intervals prevents cognitive decay and builds permanent language fluency.
      </p>

      {/* Control Toolbar */}
      <div className="deck-controls-bar">
        <div className="deck-mode-tabs">
          <button
            type="button"
            className={`deck-tab-btn ${filterMode === "due" ? "active" : ""}`}
            onClick={() => { setFilterMode("due"); setCurrentIndex(0); setFlipped(false); }}
          >
            <IconTarget size={15} />
            <span>Due Today ({totalDueCount})</span>
          </button>
          <button
            type="button"
            className={`deck-tab-btn ${filterMode === "all" ? "active" : ""}`}
            onClick={() => { setFilterMode("all"); setCurrentIndex(0); setFlipped(false); }}
          >
            <IconCards size={15} />
            <span>All Cards ({COMPREHENSIVE_REVIEW_CARDS.length})</span>
          </button>
        </div>

        <div className="deck-lang-filters">
          {["All", "JavaScript", "TypeScript", "Python", "Go", "Foundations"].map(lang => (
            <button
              key={lang}
              type="button"
              className={`lang-filter-chip ${selectedLanguage === lang ? "active" : ""}`}
              onClick={() => { setSelectedLanguage(lang); setCurrentIndex(0); setFlipped(false); }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="deck-progress">
        <span>
          Card {filteredCards.length > 0 ? currentIndex + 1 : 0} of {filteredCards.length}
        </span>
        <span className="muted">· {reviewedToday} cards completed this session</span>
        {currentSchedule && (
          <span className="deck-meta-chip">
            Rep: {currentSchedule.repetition} · Interval: {currentSchedule.interval}d · Ease: {currentSchedule.easeFactor}
          </span>
        )}
      </div>

      {filteredCards.length === 0 ? (
        <div className="deck-empty-state">
          <div className="empty-icon">
            <IconCheckCircle size={44} />
          </div>
          <h3>All caught up for today!</h3>
          <p className="muted">
            You have reviewed all cards currently due. Switch to <b>"All Cards"</b> above to practice in free-study mode, or come back tomorrow for your next scheduled interval.
          </p>
          <button
            type="button"
            className="cta small"
            onClick={() => setFilterMode("all")}
          >
            <span>Browse All Cards in Free Study Mode</span>
            <IconArrowRight size={14} />
          </button>
        </div>
      ) : (
        currentCard && (
          <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(f => !f)}>
            <div className="card-top">
              <span className="card-tag">{currentCard.language ?? currentCard.tag}</span>
              <span className="card-ch">Ch. {String(currentCard.chapterId).padStart(2, "0")}: {currentCard.chapterTitle}</span>
            </div>

            <div className="card-body">
              <h3 className="card-prompt">{currentCard.question}</h3>

              {currentCard.codeSnippet && !flipped && (
                <pre className="card-code"><code className="language-javascript">{currentCard.codeSnippet}</code></pre>
              )}

              {flipped ? (
                <div className="card-answer">
                  <hr className="card-divider" />
                  <p><b>Model Answer &amp; Mental Model:</b></p>
                  <p style={{ whiteSpace: "pre-line" }}>{currentCard.answer}</p>
                </div>
              ) : (
                <div className="card-hint">
                  <span className="hint-pill">
                    Click to reveal answer <IconChevronDown size={13} />
                  </span>
                </div>
              )}
            </div>

            <div className="card-actions" onClick={e => e.stopPropagation()}>
              {!flipped ? (
                <button type="button" className="cta" onClick={() => setFlipped(true)}>
                  Reveal Answer
                </button>
              ) : (
                <div className="sm2-rating-grid">
                  <button
                    type="button"
                    className="sm2-btn btn-again"
                    onClick={() => handleRate(1)}
                    title="Incorrect recall. Resets interval to 1 day."
                  >
                    <span className="btn-rating-title">
                      <IconRotateCcw size={14} /> Again
                    </span>
                    <span className="btn-interval">{projections?.again ?? 1}d</span>
                  </button>

                  <button
                    type="button"
                    className="sm2-btn btn-hard"
                    onClick={() => handleRate(3)}
                    title="Recalled with significant difficulty."
                  >
                    <span className="btn-rating-title">
                      <IconAlertTriangle size={14} /> Hard
                    </span>
                    <span className="btn-interval">{projections?.hard ?? 3}d</span>
                  </button>

                  <button
                    type="button"
                    className="sm2-btn btn-good"
                    onClick={() => handleRate(4)}
                    title="Correct response with normal hesitation."
                  >
                    <span className="btn-rating-title">
                      <IconCheck size={14} /> Good
                    </span>
                    <span className="btn-interval">{projections?.good ?? 6}d</span>
                  </button>

                  <button
                    type="button"
                    className="sm2-btn btn-easy"
                    onClick={() => handleRate(5)}
                    title="Effortless, perfect recall. Increases ease factor."
                  >
                    <span className="btn-rating-title">
                      <IconZap size={14} /> Easy
                    </span>
                    <span className="btn-interval">{projections?.easy ?? 8}d</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Spaced Repetition Reference Footer */}
      <div className="review-tips">
        <h4>The SuperMemo-2 (SM-2) Spaced Repetition Formula</h4>
        <p className="muted">
          Your card intervals expand exponentially according to: <code>Interval(n) = Interval(n-1) × EaseFactor</code>. Rating <b>Good</b> or <b>Easy</b> cements memories right before the forgetting curve triggers decay, while rating <b>Again</b> resets the card for reinforcement tomorrow.
        </p>
      </div>
    </article>
  );
}
