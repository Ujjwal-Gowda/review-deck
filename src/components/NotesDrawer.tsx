import { useState, useEffect } from "react";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconFileText,
  IconCheck
} from "./Icons";

interface Props {
  chapterId: number;
  chapterTitle: string;
}

export function NotesDrawer({ chapterId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    try {
      const notesObj = JSON.parse(localStorage.getItem("ef-notes") || "{}");
      setNote(notesObj[chapterId] || "");
      const bookmarksArr = JSON.parse(localStorage.getItem("ef-bookmarks") || "[]");
      setBookmarked(bookmarksArr.includes(chapterId));
    } catch {
      // storage disabled
    }
  }, [chapterId]);

  const handleSaveNote = (val: string) => {
    setNote(val);
    try {
      const notesObj = JSON.parse(localStorage.getItem("ef-notes") || "{}");
      notesObj[chapterId] = val;
      localStorage.setItem("ef-notes", JSON.stringify(notesObj));
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 1200);
    } catch {
      // storage disabled
    }
  };

  const toggleBookmark = () => {
    try {
      const bookmarksArr: number[] = JSON.parse(localStorage.getItem("ef-bookmarks") || "[]");
      const next = bookmarksArr.includes(chapterId)
        ? bookmarksArr.filter(id => id !== chapterId)
        : [...bookmarksArr, chapterId];
      localStorage.setItem("ef-bookmarks", JSON.stringify(next));
      setBookmarked(!bookmarked);
    } catch {
      // storage disabled
    }
  };

  return (
    <div className="notes-container">
      <div className="notes-toolbar">
        <button
          type="button"
          className={`note-tool-btn ${bookmarked ? "bookmarked" : ""}`}
          onClick={toggleBookmark}
          title={bookmarked ? "Remove Bookmark" : "Bookmark this chapter"}
        >
          {bookmarked ? (
            <>
              <IconBookmarkFilled size={14} />
              <span>Bookmarked</span>
            </>
          ) : (
            <>
              <IconBookmark size={14} />
              <span>Bookmark</span>
            </>
          )}
        </button>

        <button
          type="button"
          className={`note-tool-btn ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(o => !o)}
          title="Toggle personal chapter notes"
        >
          <IconFileText size={14} />
          <span>Personal Notes</span>
          {note.trim() && <span className="note-indicator-dot" />}
        </button>
      </div>

      {isOpen && (
        <div className="notes-panel">
          <div className="notes-header">
            <b>Your Notes on Chapter {String(chapterId).padStart(2, "0")}</b>
            {savedStatus && (
              <span className="notes-saved">
                <IconCheck size={13} />
                <span>Saved</span>
              </span>
            )}
          </div>
          <textarea
            className="notes-textarea"
            placeholder="Write your mental models, key takeaways, bugs encountered, or questions to revisit..."
            value={note}
            onChange={e => handleSaveNote(e.target.value)}
            rows={4}
          />
        </div>
      )}
    </div>
  );
}
