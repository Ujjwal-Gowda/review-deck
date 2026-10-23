# Engineering Foundations

Personal curriculum site (React 19 + TypeScript + Vite). 349 chapters across 38 parts, grouped into 15 prerequisite-pure stages, each with practice exercises, 287-term glossary, and 8 learning tracks.

```bash
npm start        # build + preview
npm run dev      # live-reload while editing content
npm run build    # typecheck & bundle
```

### Pedagogical Design & Prerequisite Guarantee
- **15-Stage Natural Progression**: Zero prerequisite inversions. Low-level systems internals and compilers come after foundational programming, terminal, and version control.
- **Rule 3 ("Predict, then run")**: Embedded interactive code predictor challenges where learners predict output before executing.
- **Interactive Knowledge Checks**: End-of-chapter conceptual verification with instant feedback.
- **Spaced Repetition Review Deck (`#/review`)**: Flashcards for active recall on completed chapters based on 1-day, 7-day, and 30-day forgetting curves.

### Interactive Features
- **Executive Bullet-Points Digest**: Embedded on all 349 chapters, providing instant scannability with core mental models, key principles, traps to avoid, and an interactive topic checklist.
- **Scannable "Bullet-Points Mode" (`B` / `•≡`)**: Toggle to convert narrative paragraphs across any chapter into scannable micro-cards with bold concept chips.
- **One-Click Markdown Bullets Export**: Copy complete chapter takeaways formatted as clean Markdown bullet points directly to clipboard.
- **Stage-Themed Bullet Typography**: Custom geometric halo bullets and numbered pill badges harmonized with the active stage's generative color theme.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Instant search and navigation across all 349 chapters, 15 stages, tracks, glossary terms, and UI actions.
- **Zen / Focus Mode (`Z`)**: Distraction-free reading layout with maximized typography.
- **Typography & Font Controls**: Switch between modern sans-serif (`Inter`) and literary serif (`Source Serif 4`), plus size scaling (Normal, Large, Extra Large).
- **Personal Notes & Bookmarking**: Save chapter-specific notes and bookmark topics directly in `localStorage`.
- **Level Filters**: Filter the sidebar between All, Core (must understand), Practical (must build), and Reference (revisit when needed).
- **Generative Artwork (`src/Art.tsx`)**: Generative SVG banners (one motif per stage, one hue per part, seeded per chapter).
- **Stable Content Keys**: Cross-chapter references (`<a class="xref" data-old="...">`) resolve dynamically, so inserting or reordering chapters never breaks links.
