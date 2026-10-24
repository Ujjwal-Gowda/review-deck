import { useState, useMemo } from "react";
import { getChapterTakeaways } from "../data/chapterTakeaways";
import {
  IconBookmark,
  IconTarget,
  IconZap,
  IconAlertTriangle,
  IconClipboard,
  IconBullets,
  IconChevronDown,
  IconCheck
} from "./Icons";

interface ChapterDigestProps {
  chapterId: number;
  chapterTitle: string;
  topics: string[];
  checkedTopics: Record<string, boolean>;
  onToggleTopic: (key: string) => void;
  isBulletMode: boolean;
  onToggleBulletMode: () => void;
}

export function ChapterDigest({
  chapterId,
  chapterTitle,
  topics,
  checkedTopics,
  onToggleTopic,
  isBulletMode,
  onToggleBulletMode
}: ChapterDigestProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const digest = useMemo(() => {
    return getChapterTakeaways(chapterId, chapterTitle, topics);
  }, [chapterId, chapterTitle, topics]);

  const masteredCount = useMemo(() => {
    return topics.filter(t => checkedTopics[`${chapterId}:${t}`]).length;
  }, [topics, checkedTopics, chapterId]);

  const copyMarkdown = () => {
    const lines: string[] = [
      `# Chapter ${chapterId}: ${chapterTitle} — Key Bullet Points\n`,
      `## Core Mental Model`,
      ...digest.mentalModel.map(m => `* ${m}`),
      `\n## Essential Rules & Principles`,
      ...digest.keyRules.map(r => `* ${r}`)
    ];

    if (digest.traps && digest.traps.length > 0) {
      lines.push(`\n## Traps to Avoid`);
      lines.push(...digest.traps.map(t => `* ${t}`));
    }

    lines.push(`\n## Topic Checklist (${masteredCount}/${topics.length})`);
    topics.forEach(t => {
      const isChecked = !!checkedTopics[`${chapterId}:${t}`];
      lines.push(`* [${isChecked ? "x" : " "}] ${t}`);
    });

    navigator.clipboard?.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="chapter-digest-card" aria-label="Executive Chapter Digest">
      <header className="digest-header">
        <div className="digest-title-group" onClick={() => setIsExpanded(e => !e)}>
          <span className="digest-icon">
            <IconBookmark size={18} />
          </span>
          <div className="digest-title-text">
            <h3>Executive Takeaways</h3>
            <span className="digest-meta">
              {masteredCount} of {topics.length} topics mastered · Core scannable digest
            </span>
          </div>
          <span className={`digest-chevron ${isExpanded ? "open" : ""}`}>
            <IconChevronDown size={16} />
          </span>
        </div>

        <div className="digest-actions">
          <button
            type="button"
            className={`digest-action-btn mode-btn ${isBulletMode ? "active" : ""}`}
            onClick={onToggleBulletMode}
            title="Toggle full-page Bullet Points Mode (B)"
          >
            <IconBullets size={15} />
            <span>{isBulletMode ? "Bullets: ON" : "Bullets: OFF"}</span>
          </button>

          <button
            type="button"
            className="digest-action-btn copy-btn"
            onClick={copyMarkdown}
            title="Copy takeaways as Markdown bullet points"
          >
            {copied ? (
              <>
                <IconCheck size={14} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <IconClipboard size={14} />
                <span>Copy Bullets</span>
              </>
            )}
          </button>
        </div>
      </header>

      {isExpanded && (
        <div className="digest-body">
          <div className="digest-grid">
            <div className="digest-section">
              <h4 className="digest-section-title">
                <span className="title-icon">
                  <IconTarget size={15} />
                </span>
                Core Mental Model
              </h4>
              <ul className="bullet-takeaways mental-model-list">
                {digest.mentalModel.map((item, idx) => (
                  <li key={idx}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="digest-section">
              <h4 className="digest-section-title">
                <span className="title-icon">
                  <IconZap size={15} />
                </span>
                Essential Rules &amp; Principles
              </h4>
              <ul className="bullet-takeaways rules-list">
                {digest.keyRules.map((item, idx) => (
                  <li key={idx}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {digest.traps && digest.traps.length > 0 && (
            <div className="digest-section digest-traps">
              <h4 className="digest-section-title trap-title">
                <span className="title-icon">
                  <IconAlertTriangle size={15} />
                </span>
                Traps &amp; Common Gotchas
              </h4>
              <ul className="bullet-takeaways traps-list">
                {digest.traps.map((item, idx) => (
                  <li key={idx}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="digest-section digest-topics-checklist">
            <h4 className="digest-section-title">
              <span className="title-icon">
                <IconClipboard size={15} />
              </span>
              Topic Mastery Checklist ({masteredCount}/{topics.length})
            </h4>
            <div className="digest-topic-pills">
              {topics.map(topic => {
                const k = `${chapterId}:${topic}`;
                const isChecked = !!checkedTopics[k];
                return (
                  <label key={topic} className={`digest-topic-pill ${isChecked ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleTopic(k)}
                    />
                    <span className="pill-checkbox">
                      {isChecked && <IconCheck size={12} />}
                    </span>
                    <span className="pill-text">{topic}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
