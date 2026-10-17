import { useEffect, useState, useMemo, useRef } from "react";
import { CHAPTERS, type Chapter } from "../curriculum";
import { GLOSSARY } from "../glossary";
import { TRACKS } from "../tracks";
import { STAGES } from "../structure";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  onToggleZen: () => void;
  isZen: boolean;
}

interface PaletteItem {
  id: string;
  category: "Chapter" | "Stage" | "Track" | "Glossary" | "Action";
  title: string;
  subtitle?: string;
  badge?: string;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose, onToggleTheme, onToggleZen, isZen }: Props) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allItems: PaletteItem[] = useMemo(() => {
    const items: PaletteItem[] = [
      {
        id: "action-home",
        category: "Action",
        title: "Go to Overview / Home",
        subtitle: "Return to the main curriculum ladder",
        badge: "Nav",
        action: () => { location.hash = "#/"; onClose(); }
      },
      {
        id: "action-review",
        category: "Action",
        title: "Open Spaced Repetition Review Deck",
        subtitle: "Review concepts due according to 1d / 7d / 30d schedule",
        badge: "Study",
        action: () => { location.hash = "#/review"; onClose(); }
      },
      {
        id: "action-zen",
        category: "Action",
        title: isZen ? "Exit Zen Focus Mode" : "Enter Zen Focus Mode",
        subtitle: "Maximize reading view and hide distracting UI (Shortcut: Z)",
        badge: "View",
        action: () => { onToggleZen(); onClose(); }
      },
      {
        id: "action-theme",
        category: "Action",
        title: "Toggle Light / Dark / Auto Theme",
        subtitle: "Switch color theme",
        badge: "Theme",
        action: () => { onToggleTheme(); onClose(); }
      },
      {
        id: "action-glossary",
        category: "Action",
        title: "Open Glossary Directory",
        subtitle: `Browse all ${GLOSSARY.length} software engineering terms`,
        badge: "Ref",
        action: () => { location.hash = "#/glossary"; onClose(); }
      }
    ];

    // Add Stages
    STAGES.forEach((stage, idx) => {
      items.push({
        id: `stage-${idx}`,
        category: "Stage",
        title: `Stage ${idx}: ${stage.name}`,
        subtitle: stage.question,
        badge: `${stage.parts.length} parts`,
        action: () => {
          const firstPart = stage.parts[0];
          const ch = CHAPTERS.find(c => c.part === firstPart);
          if (ch) location.hash = `#/ch/${ch.id}`;
          onClose();
        }
      });
    });

    // Add Tracks
    TRACKS.forEach((track) => {
      items.push({
        id: `track-${track.name}`,
        category: "Track",
        title: `Track: ${track.name}`,
        subtitle: track.desc,
        badge: `${track.chapters.length} ch`,
        action: () => {
          location.hash = `#/ch/${track.chapters[0]}`;
          onClose();
        }
      });
    });

    // Add Chapters
    CHAPTERS.forEach((ch: Chapter) => {
      items.push({
        id: `ch-${ch.id}`,
        category: "Chapter",
        title: `${String(ch.id).padStart(2, "0")} ${ch.title}`,
        subtitle: ch.topics.slice(0, 4).join(" · "),
        badge: ch.level === "C" ? "Core" : ch.level === "P" ? "Practical" : "Ref",
        action: () => {
          location.hash = `#/ch/${ch.id}`;
          onClose();
        }
      });
    });

    // Add Glossary
    GLOSSARY.forEach(([term, desc]) => {
      items.push({
        id: `glossary-${term}`,
        category: "Glossary",
        title: term,
        subtitle: desc,
        badge: "Glossary",
        action: () => {
          location.hash = `#/glossary?q=${encodeURIComponent(term)}`;
          onClose();
        }
      });
    });

    return items;
  }, [isZen, onClose, onToggleTheme, onToggleZen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 40);
    return allItems
      .filter(item =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [query, allItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette-modal" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="palette-searchbar">
          <span className="palette-icon">⌘</span>
          <input
            ref={inputRef}
            type="search"
            className="palette-input"
            placeholder="Type a chapter, stage, topic, term or action... (↑ ↓ Enter)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="palette-esc" onClick={onClose}>Esc</kbd>
        </div>

        <div className="palette-results">
          {filtered.length === 0 ? (
            <div className="palette-empty">No matching chapters, terms, or actions found for "{query}".</div>
          ) : (
            filtered.map((item, index) => (
              <div
                key={item.id}
                className={`palette-item ${index === selectedIndex ? "selected" : ""}`}
                onClick={() => item.action()}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="palette-item-left">
                  <span className={`palette-cat cat-${item.category.toLowerCase()}`}>{item.category}</span>
                  <div className="palette-item-texts">
                    <span className="palette-item-title">{item.title}</span>
                    {item.subtitle && <span className="palette-item-sub">{item.subtitle}</span>}
                  </div>
                </div>
                {item.badge && <span className="palette-badge">{item.badge}</span>}
              </div>
            ))
          )}
        </div>

        <div className="palette-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>Esc</kbd> Close</span>
          <span><kbd>Cmd</kbd> + <kbd>K</kbd> anywhere</span>
        </div>
      </div>
    </div>
  );
}
