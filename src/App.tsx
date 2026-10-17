import { useEffect, useMemo, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import c from "highlight.js/lib/languages/c";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import http from "highlight.js/lib/languages/http";
import yaml from "highlight.js/lib/languages/yaml";
import plaintext from "highlight.js/lib/languages/plaintext";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import ini from "highlight.js/lib/languages/ini";
import { CHAPTERS, LEVEL_NAME, PARTS, byId, type Chapter, type Level } from "./curriculum";
import { GLOSSARY } from "./glossary";
import { TRACKS } from "./tracks";
import { Art, partHue } from "./Art";
import { STAGES, stageOf, PART_META } from "./structure";
import { idOf } from "./curriculum";
import { CommandPalette } from "./components/CommandPalette";
import { PredictWidget } from "./components/PredictWidget";
import { KnowledgeCheck } from "./components/KnowledgeCheck";
import { ReviewDeck } from "./components/ReviewDeck";
import { NotesDrawer } from "./components/NotesDrawer";
import { PREDICT_CHALLENGES, KNOWLEDGE_QUIZZES } from "./data/learningWidgets";

Object.entries({ python, c, javascript, typescript, go, rust, bash, sql, http, yaml, plaintext, xml, css, json, ini })
  .forEach(([name, lang]) => hljs.registerLanguage(name, lang));
hljs.registerAliases(["html"], { languageName: "xml" });

/* ── chapter bodies are code-split: each one is fetched the first time it's opened ── */
const LOADERS = import.meta.glob("./content/*.html", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>;
const cache = new Map<string, string>();
async function loadKey(k: string) {
  if (!cache.has(k)) cache.set(k, LOADERS[`./content/${k}.html`] ? await LOADERS[`./content/${k}.html`]() : "");
  return cache.get(k)!;
}
const loadChapter = async (ch: Chapter) => (await Promise.all(ch.content.map(loadKey))).join("\n");
const isGlossary = (ch?: Chapter) => ch?.content[0] === "glossary";

/** Content keys (old guide c00…c39 and nNNN) → the chapter that contains them. */
const KEY_TO_CH = new Map<string, number>();
for (const ch of CHAPTERS) for (const k of ch.content) if (!KEY_TO_CH.has(k)) KEY_TO_CH.set(k, ch.id);

/* ── tiny persisted state (localStorage may be unavailable) ── */
function usePersisted<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode */ } }, [key, v]);
  return [v, setV] as const;
}

/* ── hash routing: #/  #/ch/12  #/glossary  #/search/<query>  #/review ── */
function useRoute() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => { setHash(location.hash); window.scrollTo(0, 0); };
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return hash.replace(/^#\/?/, "");
}

const pad = (n: number) => String(n).padStart(2, "0");
const partIndex = (key: string) => PARTS.findIndex(p => p.key === key);
const partByTitle = (t: string) => PARTS.find(p => p.title === t)!;
const hueOf = (ch: Chapter) => partHue(partIndex(ch.part));
const typing = (e: KeyboardEvent) => !!(e.target as HTMLElement).closest("input, textarea, select");
type Theme = "auto" | "light" | "dark";
type FontSize = "normal" | "large" | "xlarge";
type FontFamily = "sans" | "serif";

export function App() {
  const route = useRoute();
  const [done, setDone] = usePersisted<number[]>("ef-done", []);
  const [topics, setTopics] = usePersisted<Record<string, boolean>>("ef-topics", {});
  const [last, setLast] = usePersisted<number | null>("ef-last", null);
  const [theme, setTheme] = usePersisted<Theme>("ef-theme", "auto");
  const [collapsed, setCollapsed] = usePersisted("ef-side-collapsed", false);
  const [zen, setZen] = usePersisted("ef-zen-mode", false);
  const [fontSize, setFontSize] = usePersisted<FontSize>("ef-font-size", "normal");
  const [fontFamily, setFontFamily] = usePersisted<FontFamily>("ef-font-family", "sans");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const doneSet = useMemo(() => new Set(done), [done]);
  const toggleDone = (id: number) => setDone(d => (d.includes(id) ? d.filter(x => x !== id) : [...d, id]));

  const chMatch = route.match(/^ch\/(\d+)/);
  const current = chMatch ? byId.get(Number(chMatch[1])) : undefined;
  const searchQ = route.startsWith("search/") ? decodeURIComponent(route.slice(7)) : null;

  useEffect(() => { if (current && !isGlossary(current)) setLast(current.id); }, [current, setLast]);
  useEffect(() => {
    if (theme === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
    document.documentElement.dataset.fontFamily = fontFamily;
  }, [fontSize, fontFamily]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
        return;
      }
      if (typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "[") setCollapsed(c => !c);
      else if (e.key === "z" || e.key === "Z") setZen(z => !z);
      else if (e.key === "/") { e.preventDefault(); document.getElementById("find")?.focus(); }
      else if (current && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        const to = byId.get(current.id + (e.key === "ArrowRight" ? 1 : -1));
        if (to) location.hash = `#/ch/${to.id}`;
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [current, setCollapsed, setZen]);

  let view;
  if (isGlossary(current) || route === "glossary" || route.startsWith("glossary?")) view = <GlossaryView />;
  else if (route === "review") view = <ReviewDeck />;
  else if (current) view = <ChapterView key={current.id} ch={current} done={doneSet.has(current.id)} onDone={() => toggleDone(current.id)} topics={topics} setTopics={setTopics} />;
  else if (searchQ !== null) view = <SearchView q={searchQ} />;
  else view = <Home doneSet={doneSet} last={last} />;

  const nextTheme: Record<Theme, Theme> = { auto: "light", light: "dark", dark: "auto" };
  const nextFont: Record<FontSize, FontSize> = { normal: "large", large: "xlarge", xlarge: "normal" };

  return (
    <div className={`shell${collapsed || zen ? " collapsed" : ""}${zen ? " zen" : ""}`}>
      <ReadingProgress />
      <Sidebar current={current?.id} doneSet={doneSet} open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      
      <div className="topbtns">
        <button
          className="iconbtn cmdk-btn"
          onClick={() => setPaletteOpen(true)}
          title="Command Palette (⌘K / Ctrl+K)"
          aria-label="Open command palette"
        >
          <span className="cmdk-kbd">⌘K</span>
        </button>

        <a
          href="#/review"
          className="iconbtn"
          title="Spaced Repetition Review Deck"
          aria-label="Review deck"
        >
          ⚡
        </a>

        <button
          className={`iconbtn${zen ? " active" : ""}`}
          onClick={() => setZen(z => !z)}
          title={zen ? "Exit Zen mode (Z)" : "Enter Zen focus mode (Z)"}
          aria-label="Toggle Zen mode"
        >
          📖
        </button>

        <button
          className="iconbtn"
          onClick={() => setFontFamily(f => f === "sans" ? "serif" : "sans")}
          title={`Font: ${fontFamily} (click to toggle serif/sans)`}
          aria-label="Toggle serif font"
        >
          {fontFamily === "sans" ? "Sans" : "Serif"}
        </button>

        <button
          className="iconbtn"
          onClick={() => setFontSize(nextFont[fontSize])}
          title={`Text Size: ${fontSize} (click to change)`}
          aria-label="Change font size"
        >
          Aa
        </button>

        <button
          className="iconbtn"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? "Show sidebar [" : "Hide sidebar ["}
          aria-label="Toggle sidebar"
        >
          {collapsed ? "☰" : "⟨"}
        </button>

        <button
          className="iconbtn"
          onClick={() => setTheme(nextTheme[theme])}
          title={`Theme: ${theme} (click to change)`}
          aria-label="Change theme"
        >
          {theme === "auto" ? "◐" : theme === "light" ? "☀" : "☾"}
        </button>
      </div>

      <button className="menu" onClick={() => setMenuOpen(o => !o)}>Contents</button>
      <main className="main">{view}</main>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onToggleTheme={() => setTheme(nextTheme[theme])}
        onToggleZen={() => setZen(z => !z)}
        isZen={zen}
      />
    </div>
  );
}

function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setP(max > 0 ? Math.min(1, scrollY / max) : 0);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);
  return <div className="readbar" style={{ transform: `scaleX(${p})` }} />;
}

function Sidebar({ current, doneSet, open, onNavigate }: { current?: number; doneSet: Set<number>; open: boolean; onNavigate: () => void }) {
  const [q, setQ] = useState("");
  const [filterLevel, setFilterLevel] = useState<Level | "ALL">("ALL");
  const [openParts, setOpenParts] = usePersisted<string[]>("ef-open-parts", []);
  const doneCount = CHAPTERS.filter(ch => doneSet.has(ch.id)).length;
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => { activeRef.current?.scrollIntoView({ block: "nearest" }); }, [current]);

  const needle = q.trim().toLowerCase();
  return (
    <nav className={`side${open ? " open" : ""}`} onClick={e => (e.target as HTMLElement).closest("a") && onNavigate()}>
      <a href="#/" className="brand">Engineering Foundations</a>
      <div className="sub">Zero → software engineer → systems &amp; AI</div>
      <div className="bar"><i style={{ width: `${(100 * doneCount) / CHAPTERS.length}%` }} /></div>
      <div className="count">{doneCount} / {CHAPTERS.length} chapters completed</div>

      <input
        id="find"
        className="find"
        type="search"
        placeholder="Find… ( / or ⌘K )"
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && q.trim()) {
            location.hash = `#/search/${encodeURIComponent(q.trim())}`;
            onNavigate();
          }
        }}
      />

      <div className="sidebar-quick-links">
        <a href="#/review" className="quick-chip">⚡ Review Deck</a>
        <a href="#/glossary" className="quick-chip">📚 Glossary</a>
      </div>

      <div className="level-filter-bar">
        {(["ALL", "C", "P", "R"] as const).map(lvl => (
          <button
            key={lvl}
            type="button"
            className={`filter-btn ${filterLevel === lvl ? "active" : ""}`}
            onClick={() => setFilterLevel(lvl)}
          >
            {lvl === "ALL" ? "All" : lvl === "C" ? "Core" : lvl === "P" ? "Practical" : "Ref"}
          </button>
        ))}
      </div>

      {needle.length >= 2 && (
        <a className="navlink" href={`#/search/${encodeURIComponent(q.trim())}`}>
          Search all text for “{q.trim()}” ↵
        </a>
      )}

      {STAGES.map((stage, si) => (
        <div key={stage.name} className="stagegroup">
          {!needle && (
            <div className="stagehead">
              <span className="stagenum">{si}</span>
              {stage.name}
            </div>
          )}
          {stage.parts.map(title => {
            const part = partByTitle(title);
            if (!part) return null;
            const chs = part.chapters.filter(ch => {
              if (filterLevel !== "ALL" && ch.level !== filterLevel) return false;
              if (!needle) return true;
              return ch.title.toLowerCase().includes(needle) || ch.topics.some(t => t.toLowerCase().includes(needle));
            });
            if (!chs.length) return null;
            const isOpen = !!needle || openParts.includes(part.key) || chs.some(ch => ch.id === current);
            const partDone = chs.filter(ch => doneSet.has(ch.id)).length;
            return (
              <div key={part.key} style={{ ["--h" as string]: partHue(partIndex(part.key)) }}>
                <button
                  className={`pt${isOpen ? " open" : ""}`}
                  onClick={() => setOpenParts(o => (o.includes(part.key) ? o.filter(k => k !== part.key) : [...o, part.key]))}
                >
                  <span className="swatch" /><span className="caret">▸</span> {part.title}
                  <span className="pc">{partDone ? `${partDone}/` : ""}{chs.length}</span>
                </button>
                {isOpen && chs.map(ch => (
                  <a
                    key={ch.id}
                    ref={ch.id === current ? activeRef : undefined}
                    href={`#/ch/${ch.id}`}
                    className={[ch.id === current && "active", doneSet.has(ch.id) && "isdone"].filter(Boolean).join(" ")}
                  >
                    <span className="n"><span>{pad(ch.id)}</span></span>
                    <span>{ch.title}</span>
                    <span className={`lv lv-${ch.level}`} title={LEVEL_NAME[ch.level]}>{ch.level}</span>
                  </a>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function ChapterView({ ch, done, onDone, topics, setTopics }: {
  ch: Chapter; done: boolean; onDone: () => void;
  topics: Record<string, boolean>; setTopics: (f: (t: Record<string, boolean>) => Record<string, boolean>) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [body, setBody] = useState<string | null>(null);
  const [heads, setHeads] = useState<string[]>([]);
  const [activeHead, setActiveHead] = useState(0);
  const part = PARTS.find(p => p.key === ch.part)!;
  const prev = byId.get(ch.id - 1), next = byId.get(ch.id + 1);
  const si = stageOf(part.title), meta = PART_META[part.title];
  const isFirst = part.chapters[0].id === ch.id, isLast = part.chapters.at(-1)!.id === ch.id;

  const challenge = PREDICT_CHALLENGES[ch.id];
  const quizzes = KNOWLEDGE_QUIZZES[ch.id];

  useEffect(() => {
    let live = true;
    loadChapter(ch).then(b => { if (live) setBody(b); });
    return () => { live = false; };
  }, [ch]);

  useEffect(() => {
    const el = ref.current;
    if (!el || body === null) return;
    el.querySelectorAll<HTMLAnchorElement>("a.xref").forEach(a => {
      const id = KEY_TO_CH.get(a.dataset.old ?? "");
      if (id !== undefined) {
        a.href = `#/ch/${id}`;
        a.textContent = a.textContent!.replace(/\d+$/, String(id));
      }
    });
    el.querySelectorAll<HTMLElement>("pre").forEach(pre => {
      const code = pre.querySelector<HTMLElement>("code");
      if (!code) return;
      if (!code.dataset.highlighted) hljs.highlightElement(code);
      if (pre.querySelector(".copy")) return;
      const b = document.createElement("button");
      b.className = "copy"; b.type = "button"; b.textContent = "Copy";
      b.onclick = () => navigator.clipboard?.writeText(code.innerText).then(() => {
        b.textContent = "Copied ✓"; setTimeout(() => (b.textContent = "Copy"), 1500);
      });
      pre.appendChild(b);
    });
    el.querySelectorAll<HTMLElement>("details.ex > summary").forEach(sm => {
      const t = sm.firstChild;
      if (t && t.nodeType === Node.TEXT_NODE) t.textContent = t.textContent!.replace(/^\s*\d+\.(\d+)/, `${ch.id}.$1`);
    });
    const hs = [...el.querySelectorAll<HTMLElement>("h3")];
    setHeads(hs.map(h => h.textContent ?? ""));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) setActiveHead(hs.indexOf(e.target as HTMLElement));
    }), { rootMargin: "0px 0px -75% 0px" });
    hs.forEach(h => io.observe(h));
    return () => io.disconnect();
  }, [body]);

  const learned = ch.topics.filter(t => topics[`${ch.id}:${t}`]).length;
  const jump = (i: number) => ref.current?.querySelectorAll("h3")[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  const words = body ? body.replace(/<[^>]+>/g, " ").split(/\s+/).length : 0;

  return (
    <div className={`reader${heads.length > 1 ? "" : " solo"}`} style={{ ["--h" as string]: hueOf(ch) }}>
      <article>
        <Art stage={si} hue={hueOf(ch)} seed={ch.id + 1} className="banner" height={150} />
        <div className="crumbs">
          <span className="stagechip">Stage {si} · {STAGES[si]?.name}</span>
          <span className="eyebrow">Part {part.key} · {part.title}</span>
        </div>
        <h1 className="chtitle"><span className="n">{pad(ch.id)}</span> {ch.title}</h1>
        <div className="meta">
          <span className={`badge lv-${ch.level}`}>{LEVEL_NAME[ch.level]}</span>
          {words > 0 && <span className="muted">~{Math.max(1, Math.round(words / 200))} min read</span>}
          <span className="muted">{learned}/{ch.topics.length} topics checked off</span>
        </div>

        <NotesDrawer chapterId={ch.id} chapterTitle={ch.title} />

        <details className="topics">
          <summary>Topics in this chapter ({learned}/{ch.topics.length})</summary>
          <div className="topic-grid">
            {ch.topics.map(t => {
              const k = `${ch.id}:${t}`;
              return (
                <label key={t}>
                  <input
                    type="checkbox"
                    checked={!!topics[k]}
                    onChange={() => setTopics(s => ({ ...s, [k]: !s[k] }))}
                  /> {t}
                </label>
              );
            })}
          </div>
        </details>

        {isFirst && meta && (
          <div className="partintro">
            <div><b>{STAGES[si]?.question}</b></div>
            {meta.needs.length > 0 && (
              <div className="needs">
                Before this part: {meta.needs.map(t => {
                  const p = partByTitle(t);
                  return p ? <a key={t} href={`#/ch/${p.chapters[0].id}`} className="chip">{t}</a> : <span key={t} className="chip">{t}</span>;
                })}
              </div>
            )}
            <div className="needs">You'll build: <a href={`#/ch/${part.chapters.at(-1)!.id}`} className="chip strong">{meta.project.build}</a></div>
          </div>
        )}

        {challenge && <PredictWidget challenge={challenge} chapterId={ch.id} />}

        {body === null ? (
          <p className="muted">Loading…</p>
        ) : (
          <div ref={ref} className="content" dangerouslySetInnerHTML={{ __html: body }} />
        )}

        {quizzes && quizzes.length > 0 && (
          <KnowledgeCheck quizzes={quizzes} chapterId={ch.id} />
        )}

        {isLast && meta && (
          <section className="projectcard">
            <div className="eyebrow">Part project · {part.title}</div>
            <h3>{meta.project.build}</h3>
            <ol>{meta.project.steps.map(st => <li key={st}>{st}</li>)}</ol>
            <p><b>Done when:</b> {meta.project.done}</p>
            {meta.project.link && <a className="cta small" href={`#/ch/${idOf(meta.project.link)}`}>Full brief: {byId.get(idOf(meta.project.link))!.title} →</a>}
          </section>
        )}

        <button className={`donebtn${done ? " on" : ""}`} onClick={onDone}>
          {done ? "✓ Done" : "Mark chapter done"}
        </button>

        <nav className="pager">
          {prev ? <a href={`#/ch/${prev.id}`}>← {pad(prev.id)} {prev.title}</a> : <span />}
          {next && <a href={`#/ch/${next.id}`}>{pad(next.id)} {next.title} →</a>}
        </nav>
        <p className="muted keyhint">Keys: ← → previous / next chapter · ⌘K search / command · Z zen mode · [ toggle sidebar</p>
      </article>

      {heads.length > 1 && (
        <aside className="otp">
          <div className="otp-t">On this page</div>
          {heads.map((h, i) => (
            <button key={i} className={i === activeHead ? "on" : ""} onClick={() => jump(i)}>
              {h}
            </button>
          ))}
        </aside>
      )}
    </div>
  );
}

/* ── full-text search over every chapter ── */
const plain = new Map<number, string>();
async function allPlainText() {
  await Promise.all(CHAPTERS.filter(c => !isGlossary(c)).map(async ch => {
    if (!plain.has(ch.id)) {
      plain.set(
        ch.id,
        (await loadChapter(ch))
          .replace(/<[^>]+>/g, " ")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/\s+/g, " ")
      );
    }
  }));
  return plain;
}

function SearchView({ q }: { q: string }) {
  const [text, setText] = useState<Map<number, string> | null>(null);
  useEffect(() => { allPlainText().then(setText); }, []);
  const needle = q.toLowerCase();
  const results = useMemo(() => {
    if (!text || needle.length < 2) return [];
    const out: { ch: Chapter; hits: number; snippets: string[] }[] = [];
    for (const ch of CHAPTERS) {
      const t = text.get(ch.id); if (!t) continue;
      const low = t.toLowerCase();
      let i = low.indexOf(needle), hits = 0, lastEnd = -1; const snippets: string[] = [];
      while (i !== -1) {
        hits++;
        if (snippets.length < 3 && i > lastEnd) {
          snippets.push(t.slice(Math.max(0, i - 70), i + needle.length + 90));
          lastEnd = i + needle.length + 90;
        }
        i = low.indexOf(needle, i + needle.length);
      }
      const titleHit = ch.title.toLowerCase().includes(needle) ? 50 : 0;
      if (hits || titleHit) out.push({ ch, hits: hits + titleHit, snippets });
    }
    return out.sort((a, b) => b.hits - a.hits).slice(0, 60);
  }, [text, needle]);

  const mark = (s: string) => {
    const parts = s.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
    return parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p));
  };

  return (
    <article className="searchview">
      <div className="eyebrow">Search</div>
      <h1 className="chtitle">“{q}”</h1>
      {!text ? <p className="muted">Indexing all chapters…</p> : <p className="muted">{results.length} chapters match</p>}
      {results.map(r => (
        <a key={r.ch.id} className="hit" href={`#/ch/${r.ch.id}`}>
          <b><span className="n">{pad(r.ch.id)}</span> {r.ch.title}</b>
          <span className="muted">· {r.hits >= 50 ? "title match" : `${r.hits} mention${r.hits > 1 ? "s" : ""}`}</span>
          {r.snippets.map((s, i) => <div key={i} className="snip">…{mark(s)}…</div>)}
        </a>
      ))}
    </article>
  );
}

function Home({ doneSet, last }: { doneSet: Set<number>; last: number | null }) {
  const resume = last !== null ? byId.get(last) : undefined;
  const firstUndone = CHAPTERS.find(c => !doneSet.has(c.id));
  return (
    <div className="home">
      <header className="hero">
        <Art stage={9} hue={partHue(4)} seed={2026} className="heroart" height={260} />
        <div className="eyebrow">A personal software-engineering university</div>
        <h1>Engineering <em>Foundations</em></h1>
        <p className="lead">
          How a computer works → how programs run → how engineers work → computer science & algorithms → systems programming → modern languages → how networks work → how applications work → shipping & cloud → production & distributed systems → AI systems. Every tool is taught as the answer to a problem you've just hit.
        </p>
        <p className="ctas">
          {resume ? (
            <a className="cta" href={`#/ch/${resume.id}`}>Continue: {pad(resume.id)} {resume.title} →</a>
          ) : (
            <a className="cta" href="#/ch/0">Start with chapter 00 →</a>
          )}
          {resume && firstUndone && firstUndone.id !== resume.id && (
            <a className="cta ghost" href={`#/ch/${firstUndone.id}`}>
              First unfinished: {pad(firstUndone.id)} {firstUndone.title}
            </a>
          )}
          <a className="cta ghost" href="#/review">⚡ Spaced Review</a>
        </p>
        <p className="muted">{doneSet.size} of {CHAPTERS.length} chapters completed · Press ⌘K for search &amp; commands</p>
      </header>

      <h2 className="sectionh">The 15 stages of understanding</h2>
      <p className="muted">Each stage answers one foundational question and strictly guarantees its prerequisites. Every part ends with a build project.</p>
      <ol className="ladder">
        {STAGES.map((st, si) => {
          const parts = st.parts.map(partByTitle).filter(Boolean);
          const total = parts.reduce((n, p) => n + p.chapters.length, 0);
          const d = parts.reduce((n, p) => n + p.chapters.filter(c => doneSet.has(c.id)).length, 0);
          return (
            <li key={st.name} className="rung" style={{ ["--h" as string]: partHue(partIndex(parts[0].key)) }}>
              <div className="rungnum">{si}</div>
              <div className="rungbody">
                <div className="rungtitle">{st.name}</div>
                <div className="rungq">{st.question}</div>
                <div className="rungparts">
                  {parts.map(p => (
                    <a key={p.key} href={`#/ch/${p.chapters[0].id}`} className="partpill" style={{ ["--h" as string]: partHue(partIndex(p.key)) }}>
                      {p.title}<span>{p.chapters.filter(c => doneSet.has(c.id)).length}/{p.chapters.length}</span>
                    </a>
                  ))}
                </div>
                <div className="bar"><i style={{ width: `${(100 * d) / (total || 1)}%` }} /></div>
              </div>
            </li>
          );
        })}
      </ol>

      <h2 className="sectionh">Learning tracks</h2>
      <p className="muted">You don't need all {CHAPTERS.length} chapters at once. Pick a goal; each track lists chapters in sequential reading order.</p>
      <div className="tracks">
        {TRACKS.map(t => {
          const d = t.chapters.filter(id => doneSet.has(id)).length;
          const nextId = t.chapters.find(id => !doneSet.has(id));
          return (
            <details key={t.name} className="track">
              <summary>
                <b>{t.name}</b><span className="muted"> · {t.chapters.length} chapters · {d} done</span>
                <div className="tdesc">{t.desc}</div>
                <div className="bar"><i style={{ width: `${(100 * d) / (t.chapters.length || 1)}%` }} /></div>
              </summary>
              {nextId !== undefined && (
                <p><a className="cta small" href={`#/ch/${nextId}`}>Next: {pad(nextId)} {byId.get(nextId)!.title} →</a></p>
              )}
              <ol className="tlist">
                {t.chapters.map(id => (
                  <li key={id} className={doneSet.has(id) ? "isdone" : ""}>
                    <a href={`#/ch/${id}`}>{pad(id)} {byId.get(id)!.title}</a>
                  </li>
                ))}
              </ol>
            </details>
          );
        })}
      </div>

      <h2 className="sectionh">All parts</h2>
      <div className="legend">
        <span><span className="badge lv-C">Core</span> must understand</span>
        <span><span className="badge lv-P">Practical</span> must build</span>
        <span><span className="badge lv-R">Reference</span> understand, revisit when needed</span>
      </div>
      <div className="parts">
        {PARTS.map((p, pi) => {
          const d = p.chapters.filter(ch => doneSet.has(ch.id)).length;
          return (
            <a key={p.key} className="partcard" href={`#/ch/${p.chapters[0].id}`} style={{ ["--h" as string]: partHue(pi) }}>
              <Art stage={stageOf(p.title)} hue={partHue(pi)} seed={pi * 31 + 7} className="thumb" height={86} />
              <div className="eyebrow">Part {p.key}</div>
              <b>{p.title}</b>
              <span className="muted">{p.chapters.length} chapters · {d} done · builds: {PART_META[p.title]?.project.build}</span>
              <div className="bar"><i style={{ width: `${(100 * d) / p.chapters.length}%` }} /></div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function GlossaryView() {
  const [q, setQ] = useState("");
  const n = q.toLowerCase();
  const rows = GLOSSARY.filter(([t, d]) => !n || t.toLowerCase().includes(n) || d.toLowerCase().includes(n))
    .sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <article>
      <div className="eyebrow">Reference</div>
      <h1 className="chtitle">Glossary</h1>
      <input
        className="find big"
        type="search"
        autoFocus
        placeholder="Search terms… (cache, borrow, epoll, token, closure)"
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      <p className="muted">{rows.length} of {GLOSSARY.length} terms</p>
      <table>
        <thead><tr><th style={{ width: "26%" }}>Term</th><th>Meaning</th><th style={{ width: 60 }}>Ch.</th></tr></thead>
        <tbody>
          {rows.map(([t, d, k]) => {
            const id = KEY_TO_CH.get(k);
            return (
              <tr key={t}>
                <td><b>{t}</b></td>
                <td>{d}</td>
                <td>{id !== undefined && <a href={`#/ch/${id}`}>{pad(id)}</a>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </article>
  );
}
