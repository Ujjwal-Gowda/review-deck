import { useState } from "react";

interface ReviewCard {
  id: string;
  chapterId: number;
  chapterTitle: string;
  question: string;
  answer: string;
  tag: string;
}

const DEFAULT_REVIEW_CARDS: ReviewCard[] = [
  {
    id: "card-ai-1",
    chapterId: 349,
    chapterTitle: "AI Integration Overview",
    question: "What are the three core architectural models for integrating AI in apps, and when do you use each?",
    answer: "1) Direct Synchronous Proxy: for fast, sub-second tasks. 2) Server-Sent Events (SSE) Streaming: for conversational/text generation to drop Time-To-First-Token. 3) Asynchronous Background Worker Queue: for slow, GPU-bound tasks (images, large document indexing) returning 202 Accepted.",
    tag: "AI Architecture",
  },
  {
    id: "card-ai-2",
    chapterId: 355,
    chapterTitle: "Building an AI Search Bar",
    question: "How does Reciprocal Rank Fusion (RRF) work and why is it preferred over weighted score averaging?",
    answer: "RRF calculates score as sum(1 / (60 + rank)) for each document across semantic and keyword retrieval lists. It operates strictly on ordinal ranks rather than raw similarity scores, making it immune to incompatible score distributions between BM25 and vector cosine similarity.",
    tag: "AI Search",
  },
  {
    id: "card-pay-1",
    chapterId: 364,
    chapterTitle: "Stripe Integration",
    question: "Why must payment idempotency keys be deterministic rather than timestamp-based?",
    answer: "Timestamp-based keys (like Date.now()) generate a brand-new key if a network drops and a client or worker retries 2 seconds later, leading to double-charges. Deterministic keys derived from the cart/order ID guarantee that retries return the exact original PaymentIntent without charging twice.",
    tag: "Payments",
  },
  {
    id: "card-pay-2",
    chapterId: 367,
    chapterTitle: "Webhooks for Payments",
    question: "How do you defend a payment webhook handler against replay attacks and concurrent duplicate delivery?",
    answer: "1) Verify the gateway HMAC signature and reject timestamps older than 300 seconds. 2) Process events inside an atomic database transaction with a UNIQUE constraint on event_id (or Redis SETNX lock), discarding duplicate deliveries before fulfilling orders.",
    tag: "Payments Security",
  },
  {
    id: "card-pay-3",
    chapterId: 371,
    chapterTitle: "Multi-currency and Tax",
    question: "What is a zero-decimal currency in payment processing (e.g. Stripe, Razorpay)?",
    answer: "Currencies like Japanese Yen (JPY) and Korean Won (KRW) do not have fractional sub-units (cents/paise). Passing amount: 1000 in JPY charges ¥1,000, whereas in USD it charges $10.00. Failing to account for this charges customers 100x too much or too little.",
    tag: "Payments",
  },
  {
    id: "card-saas-1",
    chapterId: 376,
    chapterTitle: "SaaS Architecture Patterns",
    question: "What is PostgreSQL Row-Level Security (RLS) and why is it the gold standard for multi-tenant SaaS?",
    answer: "RLS enforces tenant isolation at the database engine level via security policies. Even if application code contains a bug or omits a WHERE tenant_id = ... filter, the database guarantees that queries can never read or overwrite another tenant's data.",
    tag: "SaaS Architecture",
  },
  {
    id: "card-saas-2",
    chapterId: 381,
    chapterTitle: "Usage Metering and Limits",
    question: "Why are Redis atomic counters used for SaaS rate limiting and quota enforcement instead of SQL row updates?",
    answer: "Redis INCR and sliding window operations execute in-memory in sub-millisecond time. Relational databases running row locks on every incoming HTTP hit cause connection pool exhaustion and catastrophic transaction lock contention under scale.",
    tag: "SaaS Metering",
  },

  {
    id: "card-c00-1",
    chapterId: 0,
    chapterTitle: "Learning to Program in the AI Era",
    question: "What is the psychological phenomenon known as 'desirable difficulty' and how does AI bypass it?",
    answer: "Desirable difficulty refers to effortful retrieval and struggle, which encodes neural pathways into long-term memory. When AI outputs code directly, you only experience passive recognition (which is effortless) rather than generative recall (which creates lasting skill).",
    tag: "Methodology",
  },
  {
    id: "card-c01-1",
    chapterId: 1,
    chapterTitle: "What a Computer Actually Is",
    question: "Explain the CPU Fetch-Decode-Execute cycle and what happens to the Program Counter (PC).",
    answer: "The CPU reads an instruction from memory at the address held in the Program Counter (Fetch), translates the opcode into control signals (Decode), performs the ALU/register operation (Execute), and automatically increments the Program Counter to point to the next sequential instruction.",
    tag: "Hardware",
  },
  {
    id: "card-n02-1",
    chapterId: 2,
    chapterTitle: "Binary, Bytes & Number Representation",
    question: "Why does two's complement simplify computer arithmetic hardware?",
    answer: "In two's complement, addition and subtraction use the exact same digital adder circuitry. Subtraction A - B is simply performed as A + (~B + 1). There is also only one zero, preventing negative zero anomalies.",
    tag: "Representation",
  },
  {
    id: "card-n03-1",
    chapterId: 3,
    chapterTitle: "Memory & Data Representation",
    question: "What is struct padding and memory alignment, and why do modern CPUs require it?",
    answer: "CPUs access memory in word-sized chunks (e.g. 64-bit / 8-byte aligned). If a 4-byte integer is stored across a word boundary, the CPU must make two memory read cycles and stitch them together. Compilers insert padding bytes between struct fields so every type is placed at a memory address divisible by its size.",
    tag: "Memory",
  },
  {
    id: "card-c02-1",
    chapterId: 5,
    chapterTitle: "Variables & Types",
    question: "What is the key difference between static vs dynamic typing and strong vs weak typing?",
    answer: "Static vs Dynamic is about WHEN types are checked: compile-time (C, Rust, TS) vs runtime (Python, JS). Strong vs Weak is about whether types are silently coerced: Python is strongly dynamic (1 + '2' raises TypeError), while JavaScript is weakly dynamic (1 + '2' coerces to '12').",
    tag: "Programming",
  },
  {
    id: "card-n20-1",
    chapterId: 19,
    chapterTitle: "Big-O",
    question: "What does amortized time complexity mean, and how does it apply to dynamic array resizing?",
    answer: "Amortized time is the average cost per operation over a long sequence of operations. When a dynamic array doubles capacity (costing O(n) to copy), that expensive resize only happens once every n operations. Spreading that cost across all appends gives an amortized cost of O(1) per append.",
    tag: "Algorithms",
  },
  {
    id: "card-c10-1",
    chapterId: 21,
    chapterTitle: "Memory & Pointers",
    question: "What are the core differences between stack allocation and heap allocation?",
    answer: "The Stack stores local variables and call frames; allocation is a single pointer decrement and cleanup is automatic on return (ultra-fast, fixed size). The Heap stores dynamic, arbitrarily-sized data that outlives the current function; allocation requires finding free blocks, and cleanup requires manual free, reference counting, or garbage collection.",
    tag: "Computer Science",
  },
];

export function ReviewDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const cards = DEFAULT_REVIEW_CARDS;
  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    setReviewedCount(c => c + 1);
    setCurrentIndex(i => (i + 1) % cards.length);
  };

  return (
    <article className="review-deck-view">
      <div className="eyebrow">Active Recall & Spaced Repetition</div>
      <h1 className="chtitle">Spaced Repetition Review Deck</h1>
      <p className="lead">
        Recall builds retention. Read the prompt, formulate your answer out loud or in your mind before flipping the card, and test your mental model.
      </p>

      <div className="deck-progress">
        <span>Card {currentIndex + 1} of {cards.length}</span>
        <span className="muted">· {reviewedCount} cards reviewed this session</span>
      </div>

      {currentCard && (
        <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(f => !f)}>
          <div className="card-top">
            <span className="card-tag">{currentCard.tag}</span>
            <span className="card-ch">Ch. {String(currentCard.chapterId).padStart(2, "0")}: {currentCard.chapterTitle}</span>
          </div>

          <div className="card-body">
            <h3 className="card-prompt">{currentCard.question}</h3>
            {flipped ? (
              <div className="card-answer">
                <hr className="card-divider" />
                <p><b>Model Answer:</b></p>
                <p>{currentCard.answer}</p>
              </div>
            ) : (
              <div className="card-hint">
                <span className="hint-pill">Click to reveal answer ▾</span>
              </div>
            )}
          </div>

          <div className="card-actions" onClick={e => e.stopPropagation()}>
            {!flipped ? (
              <button type="button" className="cta" onClick={() => setFlipped(true)}>
                Reveal Answer
              </button>
            ) : (
              <div className="flip-feedback-btns">
                <button type="button" className="review-btn review-again" onClick={handleNext}>
                  🔄 Review Soon
                </button>
                <button type="button" className="review-btn review-good" onClick={handleNext}>
                  ✓ Mastered
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="review-tips">
        <h4>Spaced Repetition Intervals</h4>
        <p className="muted">
          According to the Ebbinghaus forgetting curve, reviewing a concept after <b>1 day</b>, <b>1 week</b>, and <b>1 month</b> cements it into long-term recall for years.
        </p>
      </div>
    </article>
  );
}
