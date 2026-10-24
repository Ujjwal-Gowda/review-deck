import { useState } from "react";
import type { PredictChallenge } from "../data/learningWidgets";
import { IconCheck, IconX, IconRotateCcw } from "./Icons";

interface Props {
  challenge: PredictChallenge;
  chapterId: number;
}

export function PredictWidget({ challenge }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
    try {
      const statsKey = "ef-predict-stats";
      const raw = localStorage.getItem(statsKey);
      const stats = raw ? JSON.parse(raw) : { total: 0, correct: 0 };
      stats.total += 1;
      if (selected === challenge.correct) stats.correct += 1;
      localStorage.setItem(statsKey, JSON.stringify(stats));
    } catch {
      // storage disabled
    }
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="predict-widget">
      <div className="predict-head">
        <span className="predict-badge">Rule 3 · Predict, Then Run</span>
        <span className="predict-sub">Form a mental model before running code</span>
      </div>

      <div className="predict-prompt">
        <p className="predict-q">{challenge.question}</p>
        <pre className="predict-code" data-lang={challenge.lang}>
          <code>{challenge.code}</code>
        </pre>
      </div>

      <div className="predict-options">
        {challenge.options.map((opt, i) => {
          let btnClass = "predict-opt";
          if (selected === i) btnClass += " chosen";
          if (revealed) {
            if (i === challenge.correct) btnClass += " correct";
            else if (selected === i) btnClass += " wrong";
          }
          return (
            <button
              key={i}
              type="button"
              className={btnClass}
              disabled={revealed}
              onClick={() => handleSelect(i)}
            >
              <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
              <span className="opt-text">{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="predict-actions">
        {!revealed ? (
          <button
            type="button"
            className="predict-submit-btn"
            disabled={selected === null}
            onClick={handleReveal}
          >
            {selected === null ? "Select your prediction above" : "Verify Prediction & Reveal Output"}
          </button>
        ) : (
          <div className="predict-result">
            <div className={`result-banner ${selected === challenge.correct ? "banner-correct" : "banner-wrong"}`}>
              {selected === challenge.correct ? (
                <>
                  <IconCheck size={16} />
                  <span>Correct prediction. Your mental model holds.</span>
                </>
              ) : (
                <>
                  <IconX size={16} />
                  <span>Prediction diverged from reality. That is where real learning happens.</span>
                </>
              )}
            </div>
            <p className="predict-expl"><b>Why: </b>{challenge.explanation}</p>
            <button type="button" className="predict-retry-btn" onClick={handleReset}>
              <IconRotateCcw size={14} />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
