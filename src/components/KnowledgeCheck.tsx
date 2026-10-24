import { useState } from "react";
import type { KnowledgeQuiz } from "../data/learningWidgets";
import { IconCheck, IconX } from "./Icons";

interface Props {
  quizzes: KnowledgeQuiz[];
  chapterId: number;
}

export function KnowledgeCheck({ quizzes }: Props) {
  const [selectedMap, setSelectedMap] = useState<Record<number, number>>({});
  const [revealedMap, setRevealedMap] = useState<Record<number, boolean>>({});

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (revealedMap[qIdx]) return;
    setSelectedMap(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = (qIdx: number) => {
    if (selectedMap[qIdx] === undefined) return;
    setRevealedMap(prev => ({ ...prev, [qIdx]: true }));
  };

  return (
    <section className="knowledge-check-section">
      <div className="kc-header">
        <span className="eyebrow">Concept Check</span>
        <h3>Check Your Understanding</h3>
        <p className="muted">Test your recall on the core mechanics covered in this chapter.</p>
      </div>

      <div className="kc-list">
        {quizzes.map((q, qIdx) => {
          const selected = selectedMap[qIdx];
          const isRevealed = revealedMap[qIdx];
          const isCorrect = selected === q.correct;

          return (
            <div key={qIdx} className="kc-card">
              <h4 className="kc-question"><span className="kc-num">{qIdx + 1}.</span> {q.question}</h4>

              <div className="kc-options">
                {q.options.map((opt, optIdx) => {
                  let cls = "kc-opt-btn";
                  if (selected === optIdx) cls += " chosen";
                  if (isRevealed) {
                    if (optIdx === q.correct) cls += " correct";
                    else if (selected === optIdx) cls += " wrong";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={cls}
                      disabled={isRevealed}
                      onClick={() => handleSelect(qIdx, optIdx)}
                    >
                      <span className="opt-marker">{String.fromCharCode(65 + optIdx)}</span>
                      <span className="opt-label">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!isRevealed ? (
                <button
                  type="button"
                  className="kc-submit-btn"
                  disabled={selected === undefined}
                  onClick={() => handleCheck(qIdx)}
                >
                  Verify Answer
                </button>
              ) : (
                <div className={`kc-feedback ${isCorrect ? "kc-correct" : "kc-wrong"}`}>
                  <div className="feedback-status">
                    {isCorrect ? (
                      <>
                        <IconCheck size={16} />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <IconX size={16} />
                        <span>Not quite</span>
                      </>
                    )}
                  </div>
                  <div className="feedback-explanation">
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
