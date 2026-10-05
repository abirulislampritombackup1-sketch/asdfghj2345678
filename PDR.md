# PDR — Smart Escape: Interactive Evacuation Route Simulator

**AI DevFest 2026 — AI Vibe-Coding Contest (Solo)**  
**Daffodil International University**  
**Time limit:** 90 minutes · **Format:** Solo · **Type:** Frontend-only web app

---

## Table of Contents

- [Part A — Pre-Contest Plan](#part-a--pre-contest-plan)
  - [A1. Rule-Compliance Checklist](#a1-rule-compliance-checklist)
  - [A2. Tech Stack](#a2-tech-stack)
  - [A3. Minute-by-Minute Timeline](#a3-minute-by-minute-timeline)
  - [A4. Bilingual i18n Plan](#a4-bilingual-i18n-plan)
  - [A5. Git Commit Message Template](#a5-git-commit-message-template)
  - [A6. Deployment Plan](#a6-deployment-plan)
  - [A7. README.md Template](#a7-readmemd-template)
  - [A8. Risk List and Fallbacks](#a8-risk-list-and-fallbacks)
  - [A9. Reusable AI Prompt Templates](#a9-reusable-ai-prompt-templates)
- [Part B — Problem-Specific Design](#part-b--problem-specific-design)
  - [B1. Problem Summary](#b1-problem-summary)
  - [B2. Main Tasks (Must Do)](#b2-main-tasks-must-do)
  - [B3. Bonus Tasks (Optional)](#b3-bonus-tasks-optional)
  - [B4. Sample Data Format](#b4-sample-data-format)
  - [B5. Feature → Timeline Mapping](#b5-feature--timeline-mapping)
  - [B6. Data Model](#b6-data-model)
  - [B7. Screens / UI Outline](#b7-screens--ui-outline)
  - [B8. Test Checklist](#b8-test-checklist)
- [Part C — Step-by-Step Implementation Guide](#part-c--step-by-step-implementation-guide)
  - [Phase 0: Contest Start (T+0 – T+5)](#phase-0-contest-start-t0--t5)
  - [Phase 1: i18n Foundation (T+5 – T+15)](#phase-1-i18n-foundation-t5--t15)
  - [Phase 2: Import & Map Display (T+15 – T+25)](#phase-2-import--map-display-t15--t25)
  - [Phase 3: Routing Engine (T+25 – T+35)](#phase-3-routing-engine-t25--t35)
  - [Phase 4: Hazard System (T+35 – T+50)](#phase-4-hazard-system-t35--t50)
  - [Phase 5: Animations & Polish (T+50 – T+70)](#phase-5-animations--polish-t50--t70)
  - [Phase 6: Bonus Features (T+70 – T+75)](#phase-6-bonus-features-t70--t75)
  - [Phase 7: Final Deliverables (T+75 – T+90)](#phase-7-final-deliverables-t75--t90)
- [Questions to Ask Organizers (T+0 to T+15)](#questions-to-ask-organizers-t0-to-t15)

---

# Part A — Pre-Contest Plan

---

## A1. Rule-Compliance Checklist

### Before Contest (pre T+0)

- [ ] Read and understand the full Official Rulebook
- [ ] Have a GitHub account ready and logged in
- [ ] Install Node.js (LTS), npm, Git, VS Code
- [ ] Install Vite globally: `npm create vite@latest` ready to run
- [ ] Have Chrome (latest) installed for testing
- [ ] Prepare this PDR.md open in a second monitor/tab (NOT in the contest repo)
- [ ] Prepare AI tool(s) logged in and ready (Cursor, Copilot, ChatGPT, Gemini, etc.)
- [ ] Have a Vercel / Netlify / GitHub Pages account ready for instant deploy
- [ ] Bookmark the submission form URL
- [ ] Prepare the MIT LICENSE text in clipboard or snippet
- [ ] Have Noto Sans Bengali font CDN link ready: `https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali&display=swap`
- [ ] DO NOT create the repo or write any project code before T+0

### During Contest (T+0 to T+90)

- [ ] Create NEW public repo: `devfest-<registration-number>` at T+0
- [ ] Clone repo locally immediately
- [ ] Every commit message = summary + `Prompt: ...` or `Manual edit`
- [ ] Commit #1 by T+25 (scaffold + map display)
- [ ] Commit #2 by T+50 (routing + hazard toggling + deploy)
- [ ] Commit #3 by T+75 (i18n + animations + polish)
- [ ] At least 1 commit every 30 minutes (hard rule)
- [ ] NEVER `git push --force`, `git rebase` pushed commits, or delete the repo
- [ ] NEVER place API keys or secrets in code, repo, or live site
- [ ] NO backend server, serverless function, or remote DB (Firebase, Supabase, etc.)
- [ ] Use only localStorage / sessionStorage / IndexedDB for persistence
- [ ] Main features MUST work without any AI / external API
- [ ] If AI feature added → user enters their own API key in-app
- [ ] Use only provided sample data; no real personal/private data
- [ ] Main tasks first — bonus tasks only after all main tasks work

### Before T+90 (Final Checks)

- [ ] Final commit pushed to GitHub before T+90
- [ ] Live HTTPS deployment updated, matches final commit
- [ ] Open live site in Chrome incognito — everything works without login
- [ ] Repo contains: all source code, README.md, LICENSE (MIT), `screenshots/` folder
- [ ] `screenshots/` contains: baseline route screenshot + rerouting-after-C2-blocked screenshot
- [ ] README.md has all required sections filled
- [ ] Language switch works (Bangla ↔ English) on deployed site
- [ ] No secrets in code, env files, or git history
- [ ] Copy final commit hash (first 7+ chars)

### Submission (by T+90, or T+95 with −10 marks)

- [ ] Submit the official form with:
  - [ ] Full name
  - [ ] Registration number
  - [ ] Public GitHub repo URL
  - [ ] Final commit ID (full hash or first 7 chars)
  - [ ] Public HTTPS live site link
- [ ] Verify all links are accessible (no auth required)

---

## A2. Tech Stack

| Layer | Choice | Justification |
|-------|--------|---------------|
| **Build tool** | **Vite** | Instant dev server, fast HMR, zero-config static build, outputs to `dist/` |
| **Framework** | **React 18** (with hooks) | Component-based UI, fast to scaffold, huge library ecosystem. Alternative: plain HTML/CSS/JS if faster for you |
| **Language** | **JavaScript** (no TypeScript) | Faster to write under time pressure; no compile errors to debug |
| **Styling** | **Tailwind CSS** (CDN or Vite plugin) | Utility-first, no naming overhead, responsive out of the box. Fallback: plain CSS |
| **Graph rendering** | **HTML5 Canvas** or **SVG** (inline) | Draw nodes at supplied (x, y) coordinates; highlight paths with color. No heavy library needed. Alternative: `vis.js` / `cytoscape.js` via CDN if time permits |
| **Pathfinding** | **Dijkstra's algorithm** (hand-written or tiny lib) | Required: lowest-cost route. Simple to implement; ~40 lines of JS |
| **i18n** | **Custom lightweight solution** — single `translations.js` file with `{ en: {...}, bn: {...} }` | No library overhead; fast to set up; covers all labels/buttons/messages |
| **Persistence** | **localStorage** | Store: language preference, last imported graph state, current hazard state. Simple key-value, synchronous |
| **Font** | **Noto Sans Bengali** (Google Fonts CDN) | Best free Bangla font; reliable CDN; no download needed |
| **Hosting** | **Vercel** (primary) or GitHub Pages (backup) | Vercel: auto-deploys from GitHub push, instant HTTPS, no config. GitHub Pages: manual but reliable fallback |
| **AI (optional)** | **User-supplied API key** entered in-app settings | Never in code/env; stored only in sessionStorage; cleared on close |

### Why React + Vite over plain HTML/JS?

- Component reuse (Node, Edge, LanguageSwitch, RoutePanel)
- State management with `useState`/`useReducer` for graph + hazards
- Fast iteration with HMR
- If React feels slow under pressure, fall back to vanilla JS + Vite (still get fast builds)

---

## A3. Minute-by-Minute Timeline

> **Key principle:** Deploy by T+50, not at the end. Ship a working MVP early, polish later.

| Time | Duration | Task | Commit? |
|------|----------|------|---------|
| **T+0 – T+3** | 3 min | Read problem statement. Fill Part B of this PDR. Identify main vs bonus tasks. | — |
| **T+3 – T+5** | 2 min | Create GitHub repo `devfest-<reg-number>`. Clone locally. `npm create vite@latest . -- --template react`. Add MIT LICENSE file. | — |
| **T+5 – T+10** | 5 min | Install dependencies (`npm install`). Set up project structure: `src/`, `public/`, `src/i18n/`, `src/components/`, `src/utils/`. Copy `building.json` to `public/`. | — |
| **T+10 – T+15** | 5 min | Create `translations.js` with en/bn objects. Add language switch component. Add Google Fonts link for Noto Sans Bengali. | — |
| **T+15 – T+25** | 10 min | **Import & Map**: Build JSON loader + validator. Render graph on Canvas/SVG at supplied coordinates. Show nodes (colored by type: room/junction/exit), edges with cost labels, and readable labels. Apply `initial_state` (blocked nodes, edges, closed exits). | — |
| **T+25** | — | **🔴 COMMIT #1**: `"feat: graph import, validation, and map display — Prompt: ..."` | ✅ |
| **T+25 – T+35** | 10 min | **Select & Calculate**: Click a node to select as start. Implement Dijkstra's algorithm with proper cost calculation. Display route highlight, node sequence, exit name, total cost. Handle tie-breaking (lexicographic exit ID, then lexicographic node sequence). | — |
| **T+35 – T+45** | 10 min | **Hazard toggling**: Click to block/unblock rooms/junctions/corridors, close/reopen exits. Visual distinction (red overlay, dashed lines, ✕ icon). Auto-recalculate route on every change. Implement Reset button (restore `initial_state`). | — |
| **T+45 – T+50** | 5 min | **Failure cases**: "No route available" and "Starting location blocked" messages. Wire up i18n for all labels, buttons, error messages. | — |
| **T+50** | — | **🔴 COMMIT #2 + DEPLOY**: `"feat: routing, hazards, failure handling, i18n — Prompt: ..."`. Deploy to Vercel. Verify live link in Chrome incognito. | ✅ 🚀 |
| **T+50 – T+60** | 10 min | **Animations**: Subtle transitions for node selection, hazard toggling, route highlighting. CSS transitions or Canvas animation. Keep brief and non-blocking. | — |
| **T+60 – T+70** | 10 min | **Polish & edge cases**: Test all 5 sample scenarios. Test with unseen graph shapes mentally. Validate input rejection for malformed JSON. Improve UI layout, responsiveness. | — |
| **T+70 – T+75** | 5 min | **Bonus tasks** (only if main tasks are solid): Alternative routes display, high-contrast mode, PNG export, localStorage save/load of hazard state. | — |
| **T+75** | — | **🔴 COMMIT #3**: `"feat: animations, polish, bonus features — Prompt: ..."` | ✅ |
| **T+75 – T+82** | 7 min | Take screenshots (baseline route + rerouting after C2 blocked). Save to `screenshots/`. Write/fill README.md with all required sections. | — |
| **T+82 – T+87** | 5 min | Final code cleanup. Check for exposed secrets. Verify i18n completeness (no missing keys). Final deploy push. | — |
| **T+87** | — | **🔴 COMMIT #4 (safety)**: `"docs: README, screenshots, final cleanup — Prompt: ..."` | ✅ |
| **T+87 – T+90** | 3 min | **Verification**: Open live site in Chrome incognito. Test all 5 sample scenarios. Verify language switch. Copy final commit hash. Fill submission form. | — |
| **T+90** | — | **🛑 STOP. No more commits, pushes, or deploys.** | 🛑 |

### Commit Schedule Summary

| Commit | By | Content |
|--------|----|---------|
| #1 | T+25 | Scaffold + graph import + map display |
| #2 | T+50 | Routing + hazards + i18n + FIRST DEPLOY |
| #3 | T+75 | Animations + polish + bonus |
| #4 | T+87 | README + screenshots + final cleanup |

> 4 commits across 90 minutes satisfies the "≥3 commits, ≥1 every 30 min" rule with margin.

---

## A4. Bilingual i18n Plan

### Translation File Structure

**File:** `src/i18n/translations.js`

```js
const translations = {
  en: {
    appTitle: "Smart Escape — Evacuation Route Simulator",
    selectStart: "Select a starting location",
    routeFound: "Route found",
    noRoute: "No route available",
    startBlocked: "Starting location blocked",
    totalCost: "Total cost",
    routeSequence: "Route",
    exitLabel: "Exit",
    reset: "Reset",
    block: "Block",
    unblock: "Unblock",
    closeExit: "Close exit",
    openExit: "Open exit",
    importFile: "Import building file",
    invalidFile: "Invalid file — please check the format",
    language: "বাংলা",           // shows the OTHER language name
    room: "Room",
    junction: "Junction",
    exit: "Exit",
    blocked: "Blocked",
    closed: "Closed",
    corridor: "Corridor",
    cost: "Cost",
    instructions: "Click a room or junction to set as start. Click nodes/edges to toggle hazards.",
    aiSettings: "AI Settings",
    enterApiKey: "Enter your API key",
    // ... add all UI strings here
  },
  bn: {
    appTitle: "স্মার্ট এস্কেপ — ইভ্যাকুয়েশন রুট সিমুলেটর",
    selectStart: "শুরুর স্থান নির্বাচন করুন",
    routeFound: "রুট পাওয়া গেছে",
    noRoute: "কোনো রুট পাওয়া যায়নি",
    startBlocked: "শুরুর স্থান অবরুদ্ধ",
    totalCost: "মোট খরচ",
    routeSequence: "রুট",
    exitLabel: "বহির্গমন",
    reset: "রিসেট",
    block: "অবরুদ্ধ করুন",
    unblock: "অবরোধ মুক্ত করুন",
    closeExit: "বহির্গমন বন্ধ করুন",
    openExit: "বহির্গমন খুলুন",
    importFile: "বিল্ডিং ফাইল আমদানি করুন",
    invalidFile: "ফাইল সঠিক নয় — ফরম্যাট পরীক্ষা করুন",
    language: "English",
    room: "কক্ষ",
    junction: "সংযোগস্থল",
    exit: "বহির্গমন",
    blocked: "অবরুদ্ধ",
    closed: "বন্ধ",
    corridor: "করিডোর",
    cost: "খরচ",
    instructions: "শুরুর স্থান নির্ধারণ করতে একটি কক্ষ বা সংযোগস্থলে ক্লিক করুন। বিপদ টগল করতে নোড/এজে ক্লিক করুন।",
    aiSettings: "এআই সেটিংস",
    enterApiKey: "আপনার API কী লিখুন",
    // ... mirror all en keys
  },
};
export default translations;
```

### Language Switch Component

```jsx
// src/components/LanguageSwitch.jsx
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage();
  const toggle = () => {
    const next = lang === 'en' ? 'bn' : 'en';
    setLang(next);
    localStorage.setItem('lang', next);
  };
  return <button onClick={toggle}>{t('language')}</button>;
}
```

### Language Context (React)

```jsx
// src/i18n/LanguageContext.jsx
import { createContext, useContext, useState } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || `[${key}]`;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
```

### Bangla Font

Add to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
```

CSS:

```css
body {
  font-family: 'Noto Sans Bengali', 'Segoe UI', system-ui, sans-serif;
}
```

### Avoiding Missing Translations

1. The `t()` function falls back to English if a Bangla key is missing, and shows `[keyName]` if both are missing — making gaps visible during testing.
2. Keep both `en` and `bn` objects side by side in the same file so every key added to one is immediately visible as missing in the other.
3. Before final commit: search for `[` in the rendered UI to catch any fallback markers.
4. **Dataset labels** (node IDs like "R1", "C2", "E1") stay unchanged in both languages per the rules.

---

## A5. Git Commit Message Template

### Template

```
<type>: <short summary of what changed>

Prompt: "<the AI prompt that produced this change>"
```

Or if manually written:

```
<type>: <short summary of what changed>

Manual edit
```

### Type Prefixes

| Prefix | Use |
|--------|-----|
| `feat` | New feature or major functionality |
| `fix` | Bug fix |
| `style` | CSS / visual changes only |
| `docs` | README, LICENSE, screenshots |
| `refactor` | Code restructure with no behavior change |
| `chore` | Config, build, dependency changes |

### 5 Example Commits

1. ```
   feat: scaffold project, import building.json, render graph map with node types and edge costs

   Prompt: "Create a Vite+React project that loads a building.json file, validates its schema, and renders an interactive graph on an SVG canvas. Nodes should be colored by type (room=blue, junction=gray, exit=green) at supplied x,y coordinates. Edges should show their cost label at midpoint."
   ```

2. ```
   feat: implement Dijkstra routing, start selection, route highlighting with cost display

   Prompt: "Add Dijkstra's shortest path algorithm that finds the lowest-cost route from a selected room/junction to the nearest open exit. On cost tie, pick lexicographically smallest exit ID; on path tie, pick lexicographically smallest node sequence. Highlight the path in orange and show the node sequence and total cost in a panel."
   ```

3. ```
   feat: hazard toggling (block/unblock nodes and edges, close/reopen exits) with visual feedback and auto-recalculation

   Prompt: "Add click handlers to toggle blocked state on rooms/junctions and corridors, and closed state on exits. Blocked nodes show a red overlay and dashed incident edges. Closed exits show a red X. After any toggle, immediately recalculate the route. Add a Reset button that restores initial_state from the original JSON."
   ```

4. ```
   feat: add Bangla/English language switch, complete i18n for all UI strings, Noto Sans Bengali font

   Prompt: "Create a language toggle button that switches between English and Bangla. Use a translations object with en and bn keys. Persist the choice in localStorage. Apply Noto Sans Bengali font via Google Fonts. Ensure every button label, status message, error, and instruction has both translations."
   ```

5. ```
   docs: add README with required sections, MIT LICENSE, baseline and rerouting screenshots

   Manual edit
   ```

---

## A6. Deployment Plan

### Recommended Host: Vercel (fastest for Vite + React)

#### Pre-Contest Setup (do now)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Do NOT connect any repo yet (no repo exists before T+0).

#### During Contest (after first working version ~T+50)

1. **Push code to GitHub:**
   ```bash
   git add -A
   git commit -m "feat: MVP with routing, hazards, i18n — Prompt: ..."
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to Vercel dashboard → "Add New" → "Project"
   - Select `devfest-<registration-number>` repo
   - Framework preset: **Vite** (auto-detected)
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click **Deploy**

3. **Get the live URL:**
   - Vercel gives you: `https://devfest-<reg>.vercel.app`
   - This is your submission link

4. **Subsequent deploys:**
   - Every `git push origin main` auto-redeploys on Vercel
   - No manual action needed after initial setup

#### Backup Host: GitHub Pages

If Vercel fails:

1. Install `gh-pages`: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "homepage": "https://<username>.github.io/devfest-<reg>/",
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. Set `base` in `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/devfest-<reg>/',
     // ...
   })
   ```
4. Run `npm run deploy`
5. In GitHub repo → Settings → Pages → Source: `gh-pages` branch

### Deployment Verification Checklist

- [ ] Open live HTTPS URL in Chrome incognito
- [ ] Page loads without errors (check DevTools console)
- [ ] No login or installation required
- [ ] Import `building.json` works
- [ ] Graph renders correctly
- [ ] Route calculation works
- [ ] Hazard toggling works
- [ ] Language switch works (Bangla ↔ English)
- [ ] "No route available" message shows when all exits closed
- [ ] "Starting location blocked" shows when start is blocked
- [ ] Reset button works
- [ ] No API keys or secrets visible in source/network tab
- [ ] Deployed version matches the final commit hash on GitHub
- [ ] URL is HTTPS (not HTTP)

---

## A7. README.md Template

````markdown
# Smart Escape — Interactive Evacuation Route Simulator

## Author
- **Name:** [YOUR FULL NAME]
- **Registration Number:** [YOUR REGISTRATION NUMBER]

## Live Site
🔗 **[https://devfest-<reg>.vercel.app](https://devfest-<reg>.vercel.app)**

## How to Run Locally
1. Clone the repo: `git clone https://github.com/<username>/devfest-<reg>.git`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open `http://localhost:5173` in Chrome

## Main Features Implemented
- [x] Import and validate `building.json`
- [x] Interactive graph map with nodes (rooms, junctions, exits) and weighted edges
- [x] Select starting location (room or junction)
- [x] Dijkstra's shortest path to nearest open exit with cost display
- [x] Tie-breaking: lexicographic exit ID, then lexicographic node sequence
- [x] Block/unblock rooms, junctions, corridors; close/reopen exits
- [x] Visual distinction for blocked/closed elements
- [x] Automatic route recalculation on any change
- [x] Reset to initial state
- [x] "No route available" and "Starting location blocked" messages
- [x] Bangla ↔ English language switch with persistence
- [x] Subtle animations for selection, toggling, and route updates

## Bonus Features
- [ ] Alternative routes display
- [ ] High-contrast / accessible mode
- [ ] PNG export of current map
- [ ] Save/load hazard state (localStorage)

## Known Issues
- [List any known bugs or limitations]

## AI Tools Used
- [Tool name and version, e.g., "GitHub Copilot", "ChatGPT-4o", "Gemini 2.5 Pro"]

## Most Useful Prompt
> "[Paste your single most useful AI prompt here]"

## License
MIT — see [LICENSE](./LICENSE)
````

---

## A8. Risk List and Fallbacks

| # | Risk | Likelihood | Impact | Fallback |
|---|------|-----------|--------|----------|
| 1 | **AI tool rate-limited or down** | Medium | Medium | Have 2+ AI tools ready (Copilot + ChatGPT + Gemini). Write Dijkstra manually (~40 lines). The pathfinding is well-known; don't depend on AI for the algorithm. |
| 2 | **Internet drops** | Low | High | Work offline in VS Code. Dijkstra and graph rendering need no internet. Queue commits locally; push when reconnected. Deploy is needed only once (T+50+). |
| 3 | **External API fails** (if using optional AI feature) | Medium | Low | Main features MUST work without any API. AI feature is bonus-only. Wrap in try/catch; show "AI unavailable" in the UI. |
| 4 | **Deployment fails (Vercel)** | Low | High | Switch to GitHub Pages immediately (backup plan in A6). Or try Netlify drag-and-drop (upload `dist/` folder). Budget 5 min for deployment at T+50, not at T+89. |
| 5 | **Running out of time** | Medium | Critical | Stop bonus tasks immediately at T+75. Focus on: screenshots, README, final commit, submission form. A deployed working MVP with all main tasks > a polished half-finished app. |
| 6 | **Graph rendering looks wrong** | Medium | Medium | Fall back to a simple `<div>`-based layout with absolute positioning using supplied x,y coordinates if Canvas/SVG is struggling. Ugly but functional beats broken. |
| 7 | **Dijkstra implementation has bugs** | Medium | High | Test immediately with the 5 provided sample scenarios (Baseline R1, Block C2, Close E1+E2, Start R2, Block R1). If Dijkstra produces wrong results, the whole app fails. Test early. |
| 8 | **Bangla text not rendering** | Low | Medium | Verify Noto Sans Bengali CDN loads. If CDN fails, the browser's system Bangla font will be used (acceptable). Never block on font loading. |
| 9 | **Forgot to commit on time** | Medium | Critical | Set phone timers: T+25, T+50, T+75. Each alarm = must commit NOW regardless of state. A broken commit is better than no commit. |
| 10 | **building.json has unexpected format** | Low | Medium | Validate strictly per the spec. Show clear error messages for malformed files. Don't crash — show the validation error and let the user try again. |

### Emergency Priorities (if time is running out at T+75)

1. ✅ All main tasks working
2. ✅ Deployed and live
3. ✅ README filled
4. ✅ Screenshots taken
5. ✅ Submission form submitted
6. ❌ Skip: bonus features, extra polish, AI features

---

## A9. Reusable AI Prompt Templates

### 1. Scaffolding

```
Create a Vite + React project for an interactive building evacuation route
simulator. Structure:
- src/components/ — App, GraphCanvas, RoutePanel, LanguageSwitch, HazardControls
- src/utils/ — dijkstra.js, graphValidator.js
- src/i18n/ — translations.js, LanguageContext.jsx
- public/ — building.json (sample data)

Use functional components with hooks. No TypeScript. Add Tailwind CSS via CDN.
Add Noto Sans Bengali Google Font. Create the basic App layout with a header
(title + language switch), main area (graph canvas), and side panel (route info).
```

### 2. i18n Setup

```
Create a bilingual (English/Bangla) i18n system for this React app. Requirements:
- Single translations.js file with en and bn objects
- React context provider (LanguageProvider) with a t(key) function
- Language toggle persisted in localStorage
- Fallback: if bn key missing, use en; if both missing, show [keyName]
- Provide translations for: [list all UI strings from the problem statement]
Include Bangla translations for: app title, select start, route found, no route,
start blocked, total cost, reset, block, unblock, close exit, open exit, import
file, invalid file, room, junction, exit, blocked, closed, corridor, cost,
instructions.
```

### 3. Building a Feature (Pathfinding example)

```
Implement Dijkstra's shortest path algorithm for the Smart Escape app.
Input: a graph object with nodes[] and edges[] (undirected, positive integer costs),
a set of blocked node IDs, blocked edge IDs, and closed exit IDs, and a start
node ID.
Requirements:
- Find the lowest-cost path from start to any open exit
- Blocked nodes and their incident edges are excluded
- Blocked edges are excluded
- Closed exits cannot be destinations
- On cost tie: choose lexicographically smallest exit ID
- On path tie to same exit: choose lexicographically smallest node ID sequence
  (compare element by element)
- Return: { path: [nodeIds], exit: exitId, cost: number } or null if no route
Do not use display coordinates or number of corridors as cost. Cost = sum of
edge costs only.
```

### 4. Fixing a Bug

```
BUG: [describe the exact symptom, e.g., "Route shows cost 11 for R1 baseline
but expected cost is 7"]

Context:
- Using Dijkstra's algorithm in src/utils/dijkstra.js
- Graph loaded from building.json with [X] nodes and [Y] edges
- Start node: [ID], expected route: [sequence], expected cost: [number]
- Actual output: [what you see]

Constraints:
- Cost = sum of edge costs (not coordinates or hop count)
- Edges are undirected
- Blocked nodes exclude all incident edges
- Tie-breaking: lexicographic exit ID, then lexicographic node sequence

Please find and fix the bug. Show me the exact lines that changed.
```

### 5. Writing README

```
Write a README.md for my Smart Escape web app for the AI DevFest 2026 contest.
Required sections:
1. Title and description
2. Author: name = [NAME], registration = [REG]
3. Live site link: [URL]
4. How to run locally (npm install, npm run dev)
5. Main features implemented (check all that apply from this list: ...)
6. Bonus features (list what was done)
7. Known issues
8. AI tools used: [list tools]
9. Most useful prompt: [paste prompt]
10. License: MIT

Keep it clean and scannable. Use checkboxes for feature lists.
```

### 6. Final Cleanup

```
Review this React app for the following issues before final submission:
1. Any API keys, secrets, or tokens in the source code or environment files
2. Any console.log or debugger statements left in
3. Any hardcoded English strings not in the translations file
4. Any missing Bangla translations (search for [keyName] fallback markers)
5. Any React warnings in the console
6. Mobile responsiveness issues
7. Any TODO or FIXME comments that should be resolved

List each issue found with the file and line number. Do not change functionality.
```

---

# Part B — Problem-Specific Design

---

## B1. Problem Summary

**Problem:** Smart Escape — Interactive Evacuation Route Simulator

**Organization/User:** Building safety administrators, facility managers, emergency planners at any organization occupying a multi-room building. The tool lets them simulate corridor blockages, room unavailability, and exit closures to understand evacuation routing under different hazard scenarios.

**Core interaction:** User loads a building graph (rooms, junctions, exits connected by weighted corridors). They select a starting room/junction, and the app finds the lowest-cost evacuation route to an open exit. Users can simulate hazards (block rooms/corridors, close exits) and the route updates immediately. If no route exists, the app says so clearly.

**Important:** This is an educational simulation, NOT a certified evacuation tool. Use only provided sample data.

---

## B2. Main Tasks (Must Do)

| # | Task | Acceptance Criteria |
|---|------|-------------------|
| M1 | **Import & validate** `building.json` | Load JSON file via file input or drag-and-drop. Validate all required fields per spec (building name, nodes with id/label/type/x/y, edges with id/from/to/cost, initial_state). Reject malformed files with clear error message. Apply `initial_state` on load. |
| M2 | **Display interactive map** | Render all nodes at supplied (x, y) coordinates. Distinct visual for room (●), junction (◆), exit (■). Show readable labels on or near nodes. Draw edges between connected nodes with cost labels visible. Blocked/closed elements visually distinct (red overlay, dashed lines, ✕). |
| M3 | **Select start & calculate route** | User clicks an unblocked room or junction to set as start. Run Dijkstra to find lowest-cost route to an open exit. Highlight path (nodes and edges) in a distinct color. Show: node sequence, exit name, total cost in a panel. |
| M4 | **Correct routing rules** | Cost = sum of edge costs only. Exclude blocked nodes + their incident edges, blocked edges, closed exits. On cost tie → smallest exit ID (lexicographic). On path tie to same exit → smallest node ID sequence (lexicographic, element-by-element). |
| M5 | **Toggle hazards** | Click to block/unblock rooms/junctions. Click to block/unblock corridors. Click to close/reopen exits. Each change immediately triggers route recalculation. No reimport needed. |
| M6 | **Reset** | Single "Reset" button restores the file's original `initial_state`. Route recalculates from current start. |
| M7 | **Failure messages** | "No route available" when no open exit is reachable from start. "Starting location blocked" when the selected start node becomes blocked. Both messages in current language. |
| M8 | **Bilingual UI** (Bangla / English) | Toggle between Bangla and English. ALL principal labels, buttons, statuses, errors, and instructions in both languages. Dataset labels (node IDs like R1, C2) may remain unchanged. Language choice persisted in localStorage. |
| M9 | **Subtle animations** | Animate: node selection, hazard toggling, route highlight updates. Transitions must be brief and readable. No flashing or control-blocking delays. |
| M10 | **Screenshots** | `screenshots/` folder with: (a) baseline route from R1, (b) rerouted path after blocking C2. |

---

## B3. Bonus Tasks (Optional)

> Only attempt after ALL main tasks work. Ordered by value-for-effort.

| # | Bonus | Effort | Value | Notes |
|---|-------|--------|-------|-------|
| B1 | **Save/load hazard state** (localStorage) | 10 min | Medium | Persist current hazard config; restore on reload. Low risk, uses existing localStorage pattern. |
| B2 | **High-contrast / accessible mode** | 10 min | Medium | Toggle for larger text, higher contrast colors, keyboard navigation for node selection. Good impression on judges. |
| B3 | **Alternative routes display** | 15 min | High | Show 2nd and 3rd cheapest routes in lighter colors with costs. Requires k-shortest-paths or Yen's algorithm variation. Higher effort but impressive. |
| B4 | **PNG export** | 10 min | Medium | Button to download current map view as PNG (Canvas `toDataURL()` or SVG-to-PNG). |
| B5 | **Advanced route walkthrough** | 15 min | Low | Step-by-step animation showing the route node by node. Fancy but low scoring value for the effort. |
| B6 | **AI-powered suggestions** (optional) | 15 min | Low | User enters their own API key. AI suggests "safest exit" or "explains route." Must degrade gracefully if API fails. Low priority — main features must work without it. |

---

## B4. Sample Data Format

### Schema (`building.json`)

```json
{
  "building": "string (non-empty building name)",
  "nodes": [
    {
      "id": "string (unique, case-sensitive)",
      "label": "string (non-empty)",
      "type": "room | junction | exit",
      "x": "number (display coordinate)",
      "y": "number (display coordinate)"
    }
  ],
  "edges": [
    {
      "id": "string (unique)",
      "from": "string (valid node ID)",
      "to": "string (valid node ID)",
      "cost": "positive integer"
    }
  ],
  "initial_state": {
    "blocked_nodes": ["node IDs — rooms/junctions only"],
    "blocked_edges": ["edge IDs"],
    "closed_exits": ["node IDs — exits only"]
  }
}
```

### Input Limits

- 2–60 nodes, 1–150 undirected edges
- At least one room/junction and one exit
- No self-loops or repeated node pairs
- Disconnected graphs are valid
- Empty `initial_state` arrays are valid

### How Data is Loaded and Stored in the Browser

1. **Load:** User selects `building.json` via `<input type="file">`. Read with `FileReader.readAsText()`, parse with `JSON.parse()`.
2. **Validate:** Check all required fields, types, ID uniqueness, edge endpoint validity, initial_state ID existence and category match.
3. **Store in React state:**
   - `originalData` — immutable copy of parsed JSON (for Reset)
   - `graph` — working copy with current node/edge states
   - `blockedNodes` — `Set<string>` of currently blocked node IDs
   - `blockedEdges` — `Set<string>` of currently blocked edge IDs
   - `closedExits` — `Set<string>` of currently closed exit IDs
   - `startNode` — `string | null` (selected start node ID)
   - `route` — `{ path: string[], exit: string, cost: number } | null`
4. **localStorage** (optional persistence):
   - `lang` — `"en"` or `"bn"`
   - `savedState` (bonus) — JSON of current hazard configuration

---

## B5. Feature → Timeline Mapping

| Timeline Slot | Features Built | Status |
|---------------|---------------|--------|
| **T+0 – T+5** | Repo + scaffold + project structure | Setup |
| **T+5 – T+15** | i18n system + translations + language switch + Bangla font | M8 partial |
| **T+15 – T+25** | JSON import + validation + graph rendering (map display) | M1, M2 |
| **T+25 – T+35** | Start selection + Dijkstra + route display + tie-breaking | M3, M4 |
| **T+35 – T+45** | Hazard toggling + auto-recalculate + Reset | M5, M6 |
| **T+45 – T+50** | Failure messages + complete i18n coverage + DEPLOY | M7, M8 complete |
| **T+50 – T+60** | Animations (selection, toggling, route transitions) | M9 |
| **T+60 – T+70** | Edge case testing + UI polish + input validation hardening | All M tasks verified |
| **T+70 – T+75** | Bonus: save/load state, high-contrast mode | B1, B2 |
| **T+75 – T+87** | Screenshots + README + final cleanup | M10 |
| **T+87 – T+90** | Final verification + submission form | Done |

---

## B6. Data Model

### React State (in-memory, primary)

```
AppState {
  // Original data (immutable after load)
  originalData: BuildingJSON | null

  // Working graph
  nodes: Map<string, Node>         // id → { id, label, type, x, y }
  edges: Map<string, Edge>         // id → { id, from, to, cost }
  adjacency: Map<string, Edge[]>   // nodeId → [edges]

  // Current hazard state
  blockedNodes: Set<string>
  blockedEdges: Set<string>
  closedExits: Set<string>

  // User selection
  startNode: string | null

  // Computed route
  route: {
    path: string[]    // ordered node IDs from start to exit
    exit: string      // exit node ID
    cost: number      // sum of edge costs
  } | null
  routeStatus: 'found' | 'no_route' | 'start_blocked' | 'no_start'

  // UI state
  lang: 'en' | 'bn'
  fileError: string | null
}
```

### localStorage Schema

| Key | Value | Purpose |
|-----|-------|---------|
| `lang` | `"en"` or `"bn"` | Persist language choice across sessions |
| `savedHazardState` (bonus) | `JSON.stringify({ blockedNodes: [...], blockedEdges: [...], closedExits: [...] })` | Restore last hazard config |

### IndexedDB — Not needed

The data is small (≤60 nodes, ≤150 edges). localStorage + React state is sufficient. IndexedDB would add complexity with no benefit.

---

## B7. Screens / UI Outline

### Layout (Single Page App)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER                                                  │
│  [App Title — Smart Escape]     [🌐 English/বাংলা]      │
├──────────────────────────────┬──────────────────────────┤
│                              │  SIDE PANEL              │
│                              │                          │
│  GRAPH CANVAS (SVG/Canvas)   │  📂 Import Building File │
│                              │  ─────────────────────── │
│  • Nodes at (x, y)          │  Selected Start: [R1]    │
│  • Edges with cost labels   │  ─────────────────────── │
│  • Color-coded by type      │  Route:                  │
│  • Highlighted route        │  R1 → C1 → C2 → E1      │
│  • Blocked = red overlay    │  Cost: 7                 │
│  • Click to select/toggle   │  Exit: E1                │
│                              │  ─────────────────────── │
│                              │  Status: Route found ✅  │
│                              │  ─────────────────────── │
│                              │  [🔄 Reset]              │
│                              │  ─────────────────────── │
│                              │  Legend:                 │
│                              │  ● Room  ◆ Junction     │
│                              │  ■ Exit  ━ Corridor     │
│                              │  🔴 Blocked  ✕ Closed   │
├──────────────────────────────┴──────────────────────────┤
│  FOOTER: Smart Escape — AI DevFest 2026                 │
└─────────────────────────────────────────────────────────┘
```

### Interaction Flow

1. **File import** → Validate → Render graph → Apply `initial_state`
2. **Click node** → If room/junction and not blocked → set as start → calculate route
3. **Right-click or shift-click node** → Toggle blocked state → recalculate
4. **Right-click or shift-click edge** → Toggle blocked state → recalculate
5. **Right-click or shift-click exit** → Toggle closed state → recalculate
6. **Reset button** → Restore `initial_state` → recalculate
7. **Language switch** → Toggle all UI text between English and Bangla

### Bilingual Label List

| Key | English | বাংলা |
|-----|---------|------|
| `appTitle` | Smart Escape — Evacuation Route Simulator | স্মার্ট এস্কেপ — ইভ্যাকুয়েশন রুট সিমুলেটর |
| `selectStart` | Select a starting location | শুরুর স্থান নির্বাচন করুন |
| `routeFound` | Route found | রুট পাওয়া গেছে |
| `noRoute` | No route available | কোনো রুট পাওয়া যায়নি |
| `startBlocked` | Starting location blocked | শুরুর স্থান অবরুদ্ধ |
| `totalCost` | Total cost | মোট খরচ |
| `routeSequence` | Route | রুট |
| `exitLabel` | Exit | বহির্গমন |
| `reset` | Reset | রিসেট |
| `block` | Block | অবরুদ্ধ করুন |
| `unblock` | Unblock | অবরোধ মুক্ত করুন |
| `closeExit` | Close exit | বহির্গমন বন্ধ করুন |
| `openExit` | Open exit | বহির্গমন খুলুন |
| `importFile` | Import building file | বিল্ডিং ফাইল আমদানি করুন |
| `invalidFile` | Invalid file — please check the format | ফাইল সঠিক নয় — ফরম্যাট পরীক্ষা করুন |
| `language` | বাংলা (when in EN) | English (when in BN) |
| `room` | Room | কক্ষ |
| `junction` | Junction | সংযোগস্থল |
| `exit` | Exit | বহির্গমন |
| `blocked` | Blocked | অবরুদ্ধ |
| `closed` | Closed | বন্ধ |
| `corridor` | Corridor | করিডোর |
| `cost` | Cost | খরচ |
| `instructions` | Click a room or junction to set as start. Click nodes/edges to toggle hazards. | শুরুর স্থান নির্ধারণ করতে একটি কক্ষ বা সংযোগস্থলে ক্লিক করুন। বিপদ টগল করতে নোড/এজে ক্লিক করুন। |
| `buildingName` | Building | ভবন |
| `noFileLoaded` | No file loaded | কোনো ফাইল লোড করা হয়নি |
| `startLabel` | Start | শুরু |
| `legend` | Legend | কিংবদন্তি |
| `resetConfirm` | Reset to initial state? | প্রাথমিক অবস্থায় ফিরে যেতে চান? |

---

## B8. Test Checklist

### Sample Scenario Tests (from problem statement)

| # | Scenario | Action | Expected Result | ✅ |
|---|----------|--------|-----------------|---|
| T1 | Baseline | Select R1 (initial_state) | Route: R1 → C1 → C2 → E1; cost 7 | [ ] |
| T2 | Blocked junction | Select R1; block C2 | Route: R1 → C1 → C3 → C4 → E2; cost 11 | [ ] |
| T3 | Exits closed | Select R1; close E1 and E2 | "No route available" | [ ] |
| T4 | Different start | Select R2 (initial_state) | Route: R2 → C3 → C4 → E2; cost 7 | [ ] |
| T5 | Blocked start | Select R1; block R1 | "Starting location blocked" | [ ] |

### Functional Tests

| # | Test | Expected | ✅ |
|---|------|----------|---|
| F1 | Load valid `building.json` | Graph renders with correct nodes, edges, costs, labels | [ ] |
| F2 | Load malformed JSON (missing fields) | Clear error message, no crash | [ ] |
| F3 | Load JSON with invalid IDs in initial_state | Clear error message | [ ] |
| F4 | Click a room to select as start | Node highlights, route calculates | [ ] |
| F5 | Click a junction to select as start | Node highlights, route calculates | [ ] |
| F6 | Click an exit (should NOT be selectable as start) | Nothing happens / informative message | [ ] |
| F7 | Block a node → route recalculates | Route avoids blocked node | [ ] |
| F8 | Unblock a node → route recalculates | Route may use unblocked node again | [ ] |
| F9 | Block an edge → route recalculates | Route avoids blocked edge | [ ] |
| F10 | Close an exit → route recalculates | Route avoids closed exit | [ ] |
| F11 | All exits closed → "No route available" | Error message in current language | [ ] |
| F12 | Start blocked → "Starting location blocked" | Error message in current language | [ ] |
| F13 | Reset → initial_state restored | Blocked/closed elements match original JSON | [ ] |
| F14 | Route shows correct cost (sum of edge costs) | Not hop count or coordinate distance | [ ] |
| F15 | Equal-cost exits → lexicographic smallest exit ID chosen | Verify with test case if possible | [ ] |

### i18n Tests

| # | Test | Expected | ✅ |
|---|------|----------|---|
| I1 | Default language loads (English) | All UI in English | [ ] |
| I2 | Switch to Bangla | All labels, buttons, messages switch to Bangla | [ ] |
| I3 | Switch back to English | All text returns to English | [ ] |
| I4 | Reload page → language persists | localStorage preference respected | [ ] |
| I5 | Dataset labels (R1, C2, E1) unchanged in Bangla | Node IDs stay as-is | [ ] |
| I6 | Error messages in Bangla | "কোনো রুট পাওয়া যায়নি", "শুরুর স্থান অবরুদ্ধ" | [ ] |
| I7 | No `[keyName]` fallback markers visible | All keys have translations | [ ] |

### Deployment Tests

| # | Test | Expected | ✅ |
|---|------|----------|---|
| D1 | Live URL opens in Chrome incognito | Page loads, no login | [ ] |
| D2 | HTTPS (not HTTP) | URL starts with https:// | [ ] |
| D3 | No console errors on load | DevTools console clean | [ ] |
| D4 | Deployed version matches final commit | Source matches GitHub | [ ] |
| D5 | No secrets in source/network | No API keys visible | [ ] |

### Animation Tests

| # | Test | Expected | ✅ |
|---|------|----------|---|
| A1 | Selecting a start node | Subtle highlight animation (scale/glow) | [ ] |
| A2 | Toggling a hazard | Smooth transition (fade to red/dashed) | [ ] |
| A3 | Route updates | Path highlight animates (draw-on or fade-in) | [ ] |
| A4 | No flashing or blocking | Transitions are brief, controls remain usable | [ ] |

---

# Part C — Step-by-Step Implementation Guide

> **এই সেকশনটি ধাপে ধাপে পুরো ৯০ মিনিটের কাজ বলে দেবে।**
> প্রতিটি Phase-এ ঠিক কী করতে হবে, কোন command চালাতে হবে, কোন ফাইলে কী লিখতে হবে — সব এখানে।
> সময় নষ্ট না করে এই guide follow করো।

---

## Phase 0: Contest Start (T+0 – T+5)

> **লক্ষ্য:** Repo তৈরি, project scaffold, LICENSE add করা।

### Step 0.1 — Problem পড়ো (2 min)

1. Problem statement ভালো করে পড়ো
2. Main tasks আর bonus tasks চিহ্নিত করো
3. `building.json` sample file download/copy করো

### Step 0.2 — GitHub Repo তৈরি করো (1 min)

1. GitHub-এ যাও → "New repository"
2. Repository name: `devfest-<তোমার-registration-number>`
3. ✅ Public
4. ❌ README, .gitignore, LICENSE add করো না (locally করবে)
5. "Create repository" click করো

### Step 0.3 — Local Setup (2 min)

Terminal-এ একটার পর একটা command চালাও:

```bash
# 1. Repo clone করো
git clone https://github.com/<username>/devfest-<reg>.git
cd devfest-<reg>

# 2. Vite + React project তৈরি করো
npm create vite@latest . -- --template react

# 3. Dependencies install করো
npm install

# 4. Dev server চালু করে দেখো কাজ করে কিনা
npm run dev
# Browser-এ http://localhost:5173 খোলো, React logo দেখলে OK
# Ctrl+C দিয়ে বন্ধ করো

# 5. MIT LICENSE file তৈরি করো
```

### Step 0.4 — LICENSE file তৈরি করো

`LICENSE` নামে root-এ একটা file তৈরি করো, ভেতরে paste করো:

```
MIT License

Copyright (c) 2026 [YOUR NAME]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Step 0.5 — Folder structure তৈরি করো

```bash
# Folders বানাও
mkdir -p src/components src/utils src/i18n public screenshots
```

### Step 0.6 — `building.json` রাখো

প্রাপ্ত `building.json` ফাইলটি `public/` folder-এ copy করো:

```bash
cp building.json public/building.json
```

### ✅ Phase 0 Checklist

- [ ] Repo created and cloned
- [ ] Vite + React running locally
- [ ] LICENSE file added
- [ ] Folder structure ready
- [ ] `building.json` in `public/`

---

## Phase 1: i18n Foundation (T+5 – T+15)

> **লক্ষ্য:** Language switch, translation system, Bangla font — সব আগে ready করো। পরে আর ভাবতে হবে না।

### Step 1.1 — Google Fonts যোগ করো

`index.html` ফাইলটি খোলো। `<head>` section-এ নিচের lines যোগ করো:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
```

### Step 1.2 — CSS-এ Bangla font set করো

`src/index.css` ফাইলে যোগ করো:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans Bengali', 'Segoe UI', system-ui, sans-serif;
  background: #f5f5f5;
  color: #1a1a1a;
}
```

### Step 1.3 — Translation file তৈরি করো

`src/i18n/translations.js` ফাইল তৈরি করো। সব UI text এখানে রাখবে:

```js
const translations = {
  en: {
    appTitle: "Smart Escape — Evacuation Route Simulator",
    selectStart: "Select a starting location",
    routeFound: "Route found",
    noRoute: "No route available",
    startBlocked: "Starting location blocked",
    totalCost: "Total cost",
    routeSequence: "Route",
    exitLabel: "Exit",
    reset: "Reset",
    block: "Block",
    unblock: "Unblock",
    closeExit: "Close exit",
    openExit: "Open exit",
    importFile: "Import building file",
    invalidFile: "Invalid file — please check the format",
    language: "বাংলা",
    room: "Room",
    junction: "Junction",
    exit: "Exit",
    blocked: "Blocked",
    closed: "Closed",
    corridor: "Corridor",
    cost: "Cost",
    instructions: "Click a room or junction to set as start. Right-click to toggle hazards.",
    buildingName: "Building",
    noFileLoaded: "No file loaded",
    startLabel: "Start",
    legend: "Legend",
    noStartSelected: "No start selected",
    clickToBlock: "Click to block/unblock",
    clickToClose: "Click to close/open",
  },
  bn: {
    appTitle: "স্মার্ট এস্কেপ — ইভ্যাকুয়েশন রুট সিমুলেটর",
    selectStart: "শুরুর স্থান নির্বাচন করুন",
    routeFound: "রুট পাওয়া গেছে",
    noRoute: "কোনো রুট পাওয়া যায়নি",
    startBlocked: "শুরুর স্থান অবরুদ্ধ",
    totalCost: "মোট খরচ",
    routeSequence: "রুট",
    exitLabel: "বহির্গমন",
    reset: "রিসেট",
    block: "অবরুদ্ধ করুন",
    unblock: "অবরোধ মুক্ত করুন",
    closeExit: "বহির্গমন বন্ধ করুন",
    openExit: "বহির্গমন খুলুন",
    importFile: "বিল্ডিং ফাইল আমদানি করুন",
    invalidFile: "ফাইল সঠিক নয় — ফরম্যাট পরীক্ষা করুন",
    language: "English",
    room: "কক্ষ",
    junction: "সংযোগস্থল",
    exit: "বহির্গমন",
    blocked: "অবরুদ্ধ",
    closed: "বন্ধ",
    corridor: "করিডোর",
    cost: "খরচ",
    instructions: "শুরুর স্থান নির্ধারণ করতে একটি কক্ষ বা সংযোগস্থলে ক্লিক করুন। বিপদ টগল করতে ডান-ক্লিক করুন।",
    buildingName: "ভবন",
    noFileLoaded: "কোনো ফাইল লোড করা হয়নি",
    startLabel: "শুরু",
    legend: "চিহ্ন তালিকা",
    noStartSelected: "শুরুর স্থান নির্বাচিত হয়নি",
    clickToBlock: "অবরুদ্ধ/মুক্ত করতে ক্লিক করুন",
    clickToClose: "বন্ধ/খুলতে ক্লিক করুন",
  },
};

export default translations;
```

### Step 1.4 — Language Context তৈরি করো

`src/i18n/LanguageContext.jsx` ফাইল তৈরি করো:

```jsx
import { createContext, useContext, useState } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('lang') || 'en'
  );

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  // t() = translate function. Fallback: en → [keyName]
  const t = (key) => {
    return translations[lang]?.[key]
      || translations['en']?.[key]
      || `[${key}]`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
```

### Step 1.5 — LanguageSwitch component তৈরি করো

`src/components/LanguageSwitch.jsx` ফাইল তৈরি করো:

```jsx
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage();

  const toggle = () => {
    setLang(lang === 'en' ? 'bn' : 'en');
  };

  return (
    <button
      onClick={toggle}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
      }}
    >
      🌐 {t('language')}
    </button>
  );
}
```

### Step 1.6 — App.jsx-এ LanguageProvider wrap করো

`src/main.jsx` ফাইলটি update করো:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
```

### Step 1.7 — Basic App layout তৈরি করো

`src/App.jsx` কে replace করো:

```jsx
import { useLanguage } from './i18n/LanguageContext';
import LanguageSwitch from './components/LanguageSwitch';

function App() {
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 24px', background: '#1a56db', color: 'white'
      }}>
        <h1 style={{ fontSize: '20px' }}>{t('appTitle')}</h1>
        <LanguageSwitch />
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', padding: '16px', gap: '16px' }}>
        {/* Left: Graph Canvas (পরে আসবে) */}
        <div style={{ flex: 2, background: 'white', borderRadius: '8px', padding: '16px' }}>
          <p>{t('noFileLoaded')}</p>
        </div>

        {/* Right: Side Panel */}
        <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '16px' }}>
          <p>{t('importFile')}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
```

### Step 1.8 — Test করো

```bash
npm run dev
```

1. Browser-এ দেখো — header, layout, language switch দেখা যাচ্ছে?
2. "বাংলা" button click করো — title কি Bangla-তে বদলাচ্ছে?
3. Page refresh করো — language choice কি মনে রাখছে (localStorage)?
4. ✅ কাজ করলে পরের phase-এ যাও

### ✅ Phase 1 Checklist

- [ ] Noto Sans Bengali font loading
- [ ] translations.js has all en + bn keys
- [ ] LanguageContext working
- [ ] Language switch toggles en ↔ bn
- [ ] Language persists after refresh
- [ ] App basic layout showing

---

## Phase 2: Import & Map Display (T+15 – T+25)

> **লক্ষ্য:** `building.json` load করা, validate করা, graph map আঁকা। **এই phase শেষে COMMIT #1 দেবে।**

### Step 2.1 — JSON Validator তৈরি করো

`src/utils/graphValidator.js` ফাইল তৈরি করো:

```js
export function validateBuildingData(data) {
  const errors = [];

  // 1. Top-level checks
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid JSON object'] };
  }
  if (!data.building || typeof data.building !== 'string') {
    errors.push('Missing or invalid "building" name');
  }
  if (!Array.isArray(data.nodes) || data.nodes.length < 2) {
    errors.push('Need at least 2 nodes');
  }
  if (!Array.isArray(data.edges) || data.edges.length < 1) {
    errors.push('Need at least 1 edge');
  }

  if (errors.length) return { valid: false, errors };

  // 2. Node validation
  const nodeIds = new Set();
  const nodeTypes = {};
  let hasRoomOrJunction = false;
  let hasExit = false;

  for (const node of data.nodes) {
    if (!node.id || typeof node.id !== 'string') {
      errors.push(`Node missing valid id`);
      continue;
    }
    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node id: ${node.id}`);
    }
    nodeIds.add(node.id);
    if (!node.label) errors.push(`Node ${node.id} missing label`);
    if (!['room', 'junction', 'exit'].includes(node.type)) {
      errors.push(`Node ${node.id} invalid type: ${node.type}`);
    }
    if (typeof node.x !== 'number' || typeof node.y !== 'number') {
      errors.push(`Node ${node.id} missing x/y coordinates`);
    }
    nodeTypes[node.id] = node.type;
    if (node.type === 'room' || node.type === 'junction') hasRoomOrJunction = true;
    if (node.type === 'exit') hasExit = true;
  }

  if (!hasRoomOrJunction) errors.push('Need at least one room or junction');
  if (!hasExit) errors.push('Need at least one exit');

  // 3. Edge validation
  const edgeIds = new Set();
  const edgePairs = new Set();
  for (const edge of data.edges) {
    if (!edge.id) { errors.push('Edge missing id'); continue; }
    if (edgeIds.has(edge.id)) errors.push(`Duplicate edge id: ${edge.id}`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.from)) errors.push(`Edge ${edge.id} invalid "from": ${edge.from}`);
    if (!nodeIds.has(edge.to)) errors.push(`Edge ${edge.id} invalid "to": ${edge.to}`);
    if (edge.from === edge.to) errors.push(`Edge ${edge.id} is a self-loop`);
    const pair = [edge.from, edge.to].sort().join('-');
    if (edgePairs.has(pair)) errors.push(`Duplicate edge pair: ${pair}`);
    edgePairs.add(pair);
    if (!Number.isInteger(edge.cost) || edge.cost <= 0) {
      errors.push(`Edge ${edge.id} invalid cost: ${edge.cost}`);
    }
  }

  // 4. initial_state validation
  const state = data.initial_state;
  if (!state || typeof state !== 'object') {
    errors.push('Missing initial_state');
  } else {
    if (!Array.isArray(state.blocked_nodes)) errors.push('initial_state.blocked_nodes must be array');
    if (!Array.isArray(state.blocked_edges)) errors.push('initial_state.blocked_edges must be array');
    if (!Array.isArray(state.closed_exits)) errors.push('initial_state.closed_exits must be array');

    for (const id of (state.blocked_nodes || [])) {
      if (!nodeIds.has(id)) errors.push(`blocked_nodes: unknown id ${id}`);
      else if (nodeTypes[id] === 'exit') errors.push(`blocked_nodes: ${id} is an exit, not room/junction`);
    }
    for (const id of (state.blocked_edges || [])) {
      if (!edgeIds.has(id)) errors.push(`blocked_edges: unknown id ${id}`);
    }
    for (const id of (state.closed_exits || [])) {
      if (!nodeIds.has(id)) errors.push(`closed_exits: unknown id ${id}`);
      else if (nodeTypes[id] !== 'exit') errors.push(`closed_exits: ${id} is not an exit`);
    }
  }

  return { valid: errors.length === 0, errors };
}
```

### Step 2.2 — File import component তৈরি করো

`src/components/FileImport.jsx` ফাইল তৈরি করো:

```jsx
import { useLanguage } from '../i18n/LanguageContext';

export default function FileImport({ onFileLoaded }) {
  const { t } = useLanguage();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        onFileLoaded(data, null);
      } catch (err) {
        onFileLoaded(null, t('invalidFile'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
        📂 {t('importFile')}
      </label>
      <input
        type="file"
        accept=".json"
        onChange={handleFile}
      />
    </div>
  );
}
```

### Step 2.3 — Graph Canvas component তৈরি করো

`src/components/GraphCanvas.jsx` ফাইল তৈরি করো।
SVG ব্যবহার করবো — এটা React-এর সাথে ভালো কাজ করে:

```jsx
import { useLanguage } from '../i18n/LanguageContext';

// Color mapping for node types
const NODE_COLORS = {
  room: '#3b82f6',      // blue
  junction: '#6b7280',  // gray
  exit: '#22c55e',      // green
};
const NODE_SHAPES = {
  room: 'circle',
  junction: 'diamond',
  exit: 'square',
};
const BLOCKED_COLOR = '#ef4444';  // red
const ROUTE_COLOR = '#f59e0b';    // orange/amber
const NODE_RADIUS = 20;

export default function GraphCanvas({
  nodes, edges, blockedNodes, blockedEdges, closedExits,
  startNode, route, onNodeClick, onNodeRightClick, onEdgeRightClick
}) {
  const { t } = useLanguage();

  if (!nodes || nodes.length === 0) {
    return <p style={{ color: '#888', padding: '40px' }}>{t('noFileLoaded')}</p>;
  }

  // Build lookup
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  // Route edges for highlighting
  const routeEdgeSet = new Set();
  const routeNodeSet = new Set();
  if (route?.path) {
    route.path.forEach(id => routeNodeSet.add(id));
    for (let i = 0; i < route.path.length - 1; i++) {
      const pair = [route.path[i], route.path[i + 1]].sort().join('-');
      routeEdgeSet.add(pair);
    }
  }

  // Calculate viewBox from node coordinates
  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const padding = 60;
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + padding;
  const maxY = Math.max(...ys) + padding;

  const isEdgeOnRoute = (edge) => {
    const pair = [edge.from, edge.to].sort().join('-');
    return routeEdgeSet.has(pair);
  };

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    >
      {/* Edges */}
      {edges.map(edge => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;

        const isBlocked = blockedEdges.has(edge.id)
          || blockedNodes.has(edge.from) || blockedNodes.has(edge.to);
        const onRoute = isEdgeOnRoute(edge);
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;

        return (
          <g key={edge.id}
            onContextMenu={(e) => { e.preventDefault(); onEdgeRightClick(edge.id); }}
            style={{ cursor: 'pointer' }}
          >
            <line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={isBlocked ? BLOCKED_COLOR : onRoute ? ROUTE_COLOR : '#94a3b8'}
              strokeWidth={onRoute ? 4 : 2}
              strokeDasharray={isBlocked ? '8,4' : 'none'}
              style={{ transition: 'all 0.3s ease' }}
            />
            {/* Cost label */}
            <text x={midX} y={midY - 8} textAnchor="middle" fontSize="12"
              fill={isBlocked ? BLOCKED_COLOR : '#475569'} fontWeight="bold">
              {edge.cost}
            </text>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const isBlocked = blockedNodes.has(node.id);
        const isClosed = closedExits.has(node.id);
        const isStart = startNode === node.id;
        const onRoute = routeNodeSet.has(node.id);
        const isDisabled = isBlocked || isClosed;

        let fill = NODE_COLORS[node.type] || '#888';
        if (isDisabled) fill = BLOCKED_COLOR;
        if (onRoute) fill = ROUTE_COLOR;
        if (isStart) fill = '#8b5cf6'; // purple for start

        const handleClick = () => {
          if (node.type !== 'exit' && !isBlocked) {
            onNodeClick(node.id);
          }
        };

        const handleRightClick = (e) => {
          e.preventDefault();
          onNodeRightClick(node.id, node.type);
        };

        return (
          <g key={node.id} onClick={handleClick} onContextMenu={handleRightClick}
            style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
            {/* Shape */}
            {node.type === 'room' && (
              <circle cx={node.x} cy={node.y} r={NODE_RADIUS}
                fill={fill} stroke={isStart ? '#4c1d95' : '#1e293b'} strokeWidth="2"
                style={{ transition: 'fill 0.3s ease' }} />
            )}
            {node.type === 'junction' && (
              <rect x={node.x - NODE_RADIUS * 0.7} y={node.y - NODE_RADIUS * 0.7}
                width={NODE_RADIUS * 1.4} height={NODE_RADIUS * 1.4}
                fill={fill} stroke={isStart ? '#4c1d95' : '#1e293b'} strokeWidth="2"
                transform={`rotate(45 ${node.x} ${node.y})`}
                style={{ transition: 'fill 0.3s ease' }} />
            )}
            {node.type === 'exit' && (
              <rect x={node.x - NODE_RADIUS * 0.8} y={node.y - NODE_RADIUS * 0.8}
                width={NODE_RADIUS * 1.6} height={NODE_RADIUS * 1.6}
                fill={fill} stroke="#1e293b" strokeWidth="2" rx="4"
                style={{ transition: 'fill 0.3s ease' }} />
            )}

            {/* Closed X mark */}
            {isClosed && (
              <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="20"
                fill="white" fontWeight="bold">✕</text>
            )}

            {/* Label */}
            <text x={node.x} y={node.y + NODE_RADIUS + 16} textAnchor="middle"
              fontSize="13" fill="#1e293b" fontWeight="600">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
```

### Step 2.4 — App.jsx-এ import + map display যোগ করো

`src/App.jsx` update করো — FileImport আর GraphCanvas যোগ করো:

```jsx
import { useState, useCallback } from 'react';
import { useLanguage } from './i18n/LanguageContext';
import LanguageSwitch from './components/LanguageSwitch';
import FileImport from './components/FileImport';
import GraphCanvas from './components/GraphCanvas';
import { validateBuildingData } from './utils/graphValidator';
// dijkstra পরে import করবে

function App() {
  const { t } = useLanguage();

  // State
  const [originalData, setOriginalData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [blockedNodes, setBlockedNodes] = useState(new Set());
  const [blockedEdges, setBlockedEdges] = useState(new Set());
  const [closedExits, setClosedExits] = useState(new Set());
  const [startNode, setStartNode] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeStatus, setRouteStatus] = useState('no_start');
  const [fileError, setFileError] = useState(null);

  // File load handler
  const handleFileLoaded = (data, error) => {
    if (error) { setFileError(error); return; }

    const result = validateBuildingData(data);
    if (!result.valid) {
      setFileError(result.errors.join('; '));
      return;
    }

    setOriginalData(data);
    setNodes(data.nodes);
    setEdges(data.edges);
    setBlockedNodes(new Set(data.initial_state.blocked_nodes));
    setBlockedEdges(new Set(data.initial_state.blocked_edges));
    setClosedExits(new Set(data.initial_state.closed_exits));
    setStartNode(null);
    setRoute(null);
    setRouteStatus('no_start');
    setFileError(null);
  };

  // Node click → select start (routing Phase 3-তে আসবে)
  const handleNodeClick = (nodeId) => {
    setStartNode(nodeId);
    // TODO: recalculate route (Phase 3)
  };

  // Right-click node → toggle hazard (Phase 4-তে আসবে)
  const handleNodeRightClick = (nodeId, nodeType) => {
    // TODO: toggle block/close (Phase 4)
  };

  // Right-click edge → toggle hazard (Phase 4-তে আসবে)
  const handleEdgeRightClick = (edgeId) => {
    // TODO: toggle block (Phase 4)
  };

  // Reset
  const handleReset = () => {
    if (!originalData) return;
    setBlockedNodes(new Set(originalData.initial_state.blocked_nodes));
    setBlockedEdges(new Set(originalData.initial_state.blocked_edges));
    setClosedExits(new Set(originalData.initial_state.closed_exits));
    // TODO: recalculate route (Phase 3)
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 24px', background: '#1a56db', color: 'white'
      }}>
        <h1 style={{ fontSize: '20px', margin: 0 }}>{t('appTitle')}</h1>
        <LanguageSwitch />
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', padding: '16px', gap: '16px' }}>
        {/* Left: Graph */}
        <div style={{
          flex: 2, background: 'white', borderRadius: '8px',
          padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <GraphCanvas
            nodes={nodes} edges={edges}
            blockedNodes={blockedNodes} blockedEdges={blockedEdges}
            closedExits={closedExits} startNode={startNode} route={route}
            onNodeClick={handleNodeClick}
            onNodeRightClick={handleNodeRightClick}
            onEdgeRightClick={handleEdgeRightClick}
          />
        </div>

        {/* Right: Panel */}
        <div style={{
          flex: 1, background: 'white', borderRadius: '8px',
          padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <FileImport onFileLoaded={handleFileLoaded} />

          {fileError && (
            <div style={{ color: '#dc2626', padding: '8px', background: '#fef2f2', borderRadius: '4px' }}>
              ⚠️ {fileError}
            </div>
          )}

          {startNode && (
            <div>
              <strong>{t('startLabel')}:</strong> {startNode}
            </div>
          )}

          {/* Route info — Phase 3-তে details আসবে */}
          {routeStatus === 'no_start' && nodes.length > 0 && (
            <p style={{ color: '#888' }}>{t('selectStart')}</p>
          )}

          <button onClick={handleReset}
            style={{ padding: '10px', borderRadius: '6px', background: '#e5e7eb', cursor: 'pointer', border: 'none', fontWeight: 600 }}>
            🔄 {t('reset')}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
```

### Step 2.5 — Test করো

```bash
npm run dev
```

1. ✅ `building.json` file select করো → graph দেখা যাচ্ছে?
2. ✅ Nodes সঠিক position-এ আছে? (x, y coordinates)
3. ✅ Room = blue circle, Junction = gray diamond, Exit = green square?
4. ✅ Edge-এ cost label দেখা যাচ্ছে?
5. ✅ Invalid JSON file দিলে error message দেখাচ্ছে?
6. ✅ Language switch এখনও কাজ করছে?

### Step 2.6 — 🔴 COMMIT #1

```bash
git add -A
git commit -m 'feat: project scaffold, JSON import with validation, interactive graph map display

Prompt: "Create a Vite+React app that loads building.json, validates schema (nodes, edges, initial_state), and renders an SVG graph with rooms (blue circles), junctions (gray diamonds), exits (green squares) at supplied coordinates with edge cost labels. Add English/Bangla i18n with localStorage persistence and Noto Sans Bengali font."'

git push origin main
```

> ⏰ **সময় চেক করো — T+25 এর মধ্যে হওয়া উচিত।** দেরি হলে ঘাবড়াও না, commit দাও যতটুকু হয়েছে।

### ✅ Phase 2 Checklist

- [ ] graphValidator.js validates all fields
- [ ] FileImport loads and parses JSON
- [ ] GraphCanvas renders nodes at correct positions
- [ ] Node types visually distinct (colors + shapes)
- [ ] Edge cost labels showing
- [ ] initial_state applied (blocked/closed visuals)
- [ ] Error handling for invalid files
- [ ] COMMIT #1 pushed

---

## Phase 3: Routing Engine (T+25 – T+35)

> **লক্ষ্য:** Dijkstra algorithm implement করা, start select করলে route calculate হবে।

### Step 3.1 — Dijkstra Algorithm তৈরি করো

`src/utils/dijkstra.js` ফাইল তৈরি করো:

```js
/**
 * Dijkstra's shortest path: start → nearest open exit
 *
 * @param {Array} nodes - all nodes
 * @param {Array} edges - all edges (undirected)
 * @param {string} startId - starting node ID
 * @param {Set} blockedNodes - blocked room/junction IDs
 * @param {Set} blockedEdges - blocked edge IDs
 * @param {Set} closedExits - closed exit IDs
 * @returns {{ path: string[], exit: string, cost: number } | null}
 */
export function findShortestPath(nodes, edges, startId, blockedNodes, blockedEdges, closedExits) {
  // 1. Build adjacency list (exclude blocked nodes and edges)
  const adj = {};  // nodeId → [{ neighbor, cost, edgeId }]
  const nodeMap = {};

  for (const node of nodes) {
    nodeMap[node.id] = node;
    if (!blockedNodes.has(node.id)) {
      adj[node.id] = [];
    }
  }

  for (const edge of edges) {
    if (blockedEdges.has(edge.id)) continue;
    if (blockedNodes.has(edge.from) || blockedNodes.has(edge.to)) continue;

    if (adj[edge.from]) adj[edge.from].push({ neighbor: edge.to, cost: edge.cost });
    if (adj[edge.to]) adj[edge.to].push({ neighbor: edge.from, cost: edge.cost });
  }

  // 2. Find all open exits
  const openExits = new Set(
    nodes
      .filter(n => n.type === 'exit' && !closedExits.has(n.id) && !blockedNodes.has(n.id))
      .map(n => n.id)
  );

  if (openExits.size === 0) return null;

  // 3. Dijkstra
  const dist = {};    // nodeId → minimum cost
  const prev = {};    // nodeId → previous nodeId in path
  const visited = new Set();

  // Initialize
  for (const id of Object.keys(adj)) {
    dist[id] = Infinity;
  }
  dist[startId] = 0;

  while (true) {
    // Find unvisited node with smallest distance
    let current = null;
    let currentDist = Infinity;

    for (const id of Object.keys(adj)) {
      if (!visited.has(id) && dist[id] < currentDist) {
        currentDist = dist[id];
        current = id;
      }
    }

    if (current === null) break; // no more reachable nodes
    visited.add(current);

    // Relax neighbors
    for (const { neighbor, cost } of (adj[current] || [])) {
      if (visited.has(neighbor)) continue;

      const newDist = dist[current] + cost;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        prev[neighbor] = current;
      } else if (newDist === dist[neighbor]) {
        // Tie-breaking: choose path with lexicographically smaller sequence
        const existingPath = buildPath(prev, neighbor);
        const newPath = buildPath({ ...prev, [neighbor]: current }, neighbor);
        if (comparePaths(newPath, existingPath) < 0) {
          prev[neighbor] = current;
        }
      }
    }
  }

  // 4. Find best exit (min cost → lexicographic smallest exit ID)
  let bestExit = null;
  let bestCost = Infinity;

  // Sort open exits lexicographically for tie-breaking
  const sortedExits = [...openExits].sort();

  for (const exitId of sortedExits) {
    if (dist[exitId] === undefined || dist[exitId] === Infinity) continue;

    if (dist[exitId] < bestCost) {
      bestCost = dist[exitId];
      bestExit = exitId;
    } else if (dist[exitId] === bestCost) {
      // Same cost → already sorted lexicographically, first one wins
      // but compare paths for same exit cost
      if (exitId < bestExit) {
        bestExit = exitId;
      }
    }
  }

  if (!bestExit) return null;

  // 5. Reconstruct path
  const path = [];
  let node = bestExit;
  while (node !== undefined) {
    path.unshift(node);
    node = prev[node];
  }

  // Verify path starts from startId
  if (path[0] !== startId) return null;

  return { path, exit: bestExit, cost: bestCost };
}

// Helper: build path from prev map
function buildPath(prev, target) {
  const path = [];
  let node = target;
  while (node !== undefined) {
    path.unshift(node);
    node = prev[node];
  }
  return path;
}

// Helper: compare two paths lexicographically
function comparePaths(pathA, pathB) {
  const len = Math.min(pathA.length, pathB.length);
  for (let i = 0; i < len; i++) {
    if (pathA[i] < pathB[i]) return -1;
    if (pathA[i] > pathB[i]) return 1;
  }
  return pathA.length - pathB.length;
}
```

### Step 3.2 — App.jsx-এ routing যোগ করো

`src/App.jsx`-এ import যোগ করো এবং route calculation function লেখো:

**Import line যোগ করো (file-এর উপরে):**

```js
import { findShortestPath } from './utils/dijkstra';
```

**Route calculation function যোগ করো (App function-এর ভেতরে):**

```js
// Route calculation — call this whenever start/hazards change
const recalculateRoute = useCallback((start, bNodes, bEdges, cExits) => {
  if (!start) {
    setRoute(null);
    setRouteStatus('no_start');
    return;
  }
  if (bNodes.has(start)) {
    setRoute(null);
    setRouteStatus('start_blocked');
    return;
  }
  const result = findShortestPath(nodes, edges, start, bNodes, bEdges, cExits);
  if (result) {
    setRoute(result);
    setRouteStatus('found');
  } else {
    setRoute(null);
    setRouteStatus('no_route');
  }
}, [nodes, edges]);
```

**handleNodeClick update করো:**

```js
const handleNodeClick = (nodeId) => {
  setStartNode(nodeId);
  recalculateRoute(nodeId, blockedNodes, blockedEdges, closedExits);
};
```

**handleReset update করো:**

```js
const handleReset = () => {
  if (!originalData) return;
  const bNodes = new Set(originalData.initial_state.blocked_nodes);
  const bEdges = new Set(originalData.initial_state.blocked_edges);
  const cExits = new Set(originalData.initial_state.closed_exits);
  setBlockedNodes(bNodes);
  setBlockedEdges(bEdges);
  setClosedExits(cExits);
  recalculateRoute(startNode, bNodes, bEdges, cExits);
};
```

### Step 3.3 — Route info panel যোগ করো (side panel-এ)

Side panel section-এ route info দেখাও:

```jsx
{/* Route Info */}
{routeStatus === 'found' && route && (
  <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
    <p style={{ fontWeight: 700, color: '#16a34a' }}>✅ {t('routeFound')}</p>
    <p><strong>{t('routeSequence')}:</strong> {route.path.join(' → ')}</p>
    <p><strong>{t('exitLabel')}:</strong> {route.exit}</p>
    <p><strong>{t('totalCost')}:</strong> {route.cost}</p>
  </div>
)}

{routeStatus === 'no_route' && (
  <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fca5a5' }}>
    <p style={{ fontWeight: 700, color: '#dc2626' }}>❌ {t('noRoute')}</p>
  </div>
)}

{routeStatus === 'start_blocked' && (
  <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fca5a5' }}>
    <p style={{ fontWeight: 700, color: '#dc2626' }}>🚫 {t('startBlocked')}</p>
  </div>
)}
```

### Step 3.4 — Test করো (Sample Scenarios)

```
✅ T1: R1 select করো → Route: R1 → C1 → C2 → E1, cost 7
✅ T4: R2 select করো → Route: R2 → C3 → C4 → E2, cost 7
```

> Hazard toggling এখনও কাজ করবে না (Phase 4-এ হবে), কিন্তু baseline routing ঠিক আছে কিনা confirm করো।

### ✅ Phase 3 Checklist

- [ ] Dijkstra algorithm implemented in dijkstra.js
- [ ] Start node selection working (click)
- [ ] Route highlighted on graph (orange path)
- [ ] Route info showing (sequence, exit, cost)
- [ ] T1 test passing (R1 → cost 7)
- [ ] T4 test passing (R2 → cost 7)

---

## Phase 4: Hazard System (T+35 – T+50)

> **লক্ষ্য:** Hazard toggle, failure messages, deploy। **এই phase শেষে COMMIT #2 + FIRST DEPLOY।**

### Step 4.1 — Hazard toggle handlers লেখো

`src/App.jsx`-এ handleNodeRightClick এবং handleEdgeRightClick update করো:

```js
const handleNodeRightClick = (nodeId, nodeType) => {
  if (nodeType === 'exit') {
    // Toggle close/open exit
    const newClosedExits = new Set(closedExits);
    if (newClosedExits.has(nodeId)) {
      newClosedExits.delete(nodeId);
    } else {
      newClosedExits.add(nodeId);
    }
    setClosedExits(newClosedExits);
    recalculateRoute(startNode, blockedNodes, blockedEdges, newClosedExits);
  } else {
    // Toggle block/unblock room or junction
    const newBlockedNodes = new Set(blockedNodes);
    if (newBlockedNodes.has(nodeId)) {
      newBlockedNodes.delete(nodeId);
    } else {
      newBlockedNodes.add(nodeId);
    }
    setBlockedNodes(newBlockedNodes);
    recalculateRoute(startNode, newBlockedNodes, blockedEdges, closedExits);
  }
};

const handleEdgeRightClick = (edgeId) => {
  const newBlockedEdges = new Set(blockedEdges);
  if (newBlockedEdges.has(edgeId)) {
    newBlockedEdges.delete(edgeId);
  } else {
    newBlockedEdges.add(edgeId);
  }
  setBlockedEdges(newBlockedEdges);
  recalculateRoute(startNode, blockedNodes, newBlockedEdges, closedExits);
};
```

### Step 4.2 — Instructions text যোগ করো

Side panel-এ user instructions দেখাও:

```jsx
{nodes.length > 0 && (
  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
    💡 {t('instructions')}
  </p>
)}
```

### Step 4.3 — Test করো (All 5 Scenarios)

```
✅ T1: R1 select → R1-C1-C2-E1, cost 7
✅ T2: R1 select → C2 right-click (block) → R1-C1-C3-C4-E2, cost 11
✅ T3: R1 select → E1 right-click (close) → E2 right-click (close) → "No route available"
✅ T4: R2 select → R2-C3-C4-E2, cost 7
✅ T5: R1 select → R1 right-click (block) → "Starting location blocked"
✅ Reset button → initial_state restored
✅ Language switch → Bangla/English-এ সব message ঠিক আছে
```

> ⚠️ **যদি কোনো test fail করে, এখানেই fix করো। Routing ভুল থাকলে marks হারাবে।**

### Step 4.4 — 🔴 COMMIT #2

```bash
git add -A
git commit -m 'feat: Dijkstra routing, hazard toggling, failure messages, complete i18n

Prompt: "Implement Dijkstra shortest path from selected room/junction to nearest open exit. Add right-click to block/unblock nodes and edges, close/reopen exits. Show No route available and Starting location blocked messages. Auto-recalculate on every change. Add Reset button. All messages bilingual."'

git push origin main
```

### Step 4.5 — 🚀 FIRST DEPLOY (Vercel)

```
1. https://vercel.com → "Add New" → "Project"
2. GitHub repo select করো: devfest-<reg>
3. Framework: Vite (auto-detect হবে)
4. Build: npm run build
5. Output: dist
6. "Deploy" click করো
7. 2-3 minute অপেক্ষা করো
8. Live URL পাবে: https://devfest-<reg>.vercel.app
9. Chrome incognito-তে খুলে test করো
```

> ⏰ **সময় চেক করো — T+50 এর মধ্যে deployed থাকা উচিত।**

> 💡 **Vercel fail হলে:** Netlify-তে যাও → "Add new site" → "Deploy manually" → `npm run build` করে `dist/` folder drag-and-drop করো।

### Step 4.6 — Deploy verification

- [ ] Live URL Chrome incognito-তে খুলেছো?
- [ ] building.json import কাজ করছে?
- [ ] Route calculate হচ্ছে?
- [ ] Hazard toggle কাজ করছে?
- [ ] Language switch কাজ করছে?

### ✅ Phase 4 Checklist

- [ ] Block/unblock rooms and junctions working
- [ ] Block/unblock corridors working
- [ ] Close/reopen exits working
- [ ] Auto-recalculation on every hazard change
- [ ] Reset restores initial_state
- [ ] "No route available" message works
- [ ] "Starting location blocked" message works
- [ ] All 5 sample scenarios passing
- [ ] i18n complete for all messages
- [ ] COMMIT #2 pushed
- [ ] FIRST DEPLOY live and verified

---

## Phase 5: Animations & Polish (T+50 – T+70)

> **লক্ষ্য:** Required animations যোগ করো, UI polish করো, edge cases handle করো।

### Step 5.1 — CSS Transitions যোগ করো (সবচেয়ে সহজ উপায়)

`src/index.css`-তে animation styles যোগ করো:

```css
/* Node selection animation */
@keyframes nodeSelect {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Route highlight animation */
@keyframes routeGlow {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

/* Hazard toggle animation */
@keyframes hazardPulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

/* SVG transitions are already in inline styles via style={{ transition: '...' }} */
/* These are backup animations for more dramatic effects */
```

### Step 5.2 — SVG-তে animation apply করো

GraphCanvas.jsx-এ node element-এ add করো:

- **Selected node:** `scale(1.1)` transform
- **Route edges:** `strokeWidth` transition + glow effect
- **Blocked elements:** `opacity` transition

> 💡 SVG-তে CSS transition সবচেয়ে সহজ। `style={{ transition: 'all 0.3s ease' }}` — এটা আগেই add করা আছে GraphCanvas-এ। Extra animation লাগলে:

```jsx
// Node-এ যোগ করো (isStart হলে):
style={{
  transition: 'all 0.3s ease',
  transform: isStart ? 'scale(1.1)' : 'scale(1)',
  transformOrigin: `${node.x}px ${node.y}px`,
}}
```

### Step 5.3 — Legend যোগ করো

Side panel-এর নিচে legend দেখাও:

```jsx
<div style={{ fontSize: '13px', lineHeight: 1.8 }}>
  <strong>{t('legend')}:</strong>
  <div>🔵 {t('room')} &nbsp; 🔷 {t('junction')} &nbsp; 🟩 {t('exit')}</div>
  <div>🔴 {t('blocked')} &nbsp; ✕ {t('closed')}</div>
  <div>🟠 {t('routeSequence')} &nbsp; 🟣 {t('startLabel')}</div>
</div>
```

### Step 5.4 — Edge case handle করো

1. **Disconnected graph:** Dijkstra naturally handles this (unreachable nodes have Infinity cost)
2. **Empty graph after file load:** Show "Select a starting location" message
3. **Click exit as start:** Ignore (already handled — exits not selectable)
4. **Double-click:** Prevent double-action issues

### Step 5.5 — UI Polish

1. **Responsive layout:** Side panel collapse করো small screen-এ
2. **Better spacing:** Padding/margin ঠিক করো
3. **Hover effects:** Nodes-এ cursor: pointer, slight opacity change on hover
4. **Building name display:** Header-এ বা panel-এ building name দেখাও

### Step 5.6 — Edge case test করো

```
✅ Disconnected graph (if applicable) → "No route available" for unreachable areas
✅ All nodes blocked → "No route available"
✅ Start node selected → then block it → "Starting location blocked"
✅ Rapid clicking → no crash
✅ Language switch during route display → text updates, route stays
```

### ✅ Phase 5 Checklist

- [ ] Node selection animation (subtle scale/glow)
- [ ] Hazard toggle animation (smooth transition)
- [ ] Route update animation (fade-in/draw-on)
- [ ] No flashing or control-blocking delays
- [ ] Legend visible
- [ ] Edge cases handled
- [ ] UI looks polished

---

## Phase 6: Bonus Features (T+70 – T+75)

> **⚠️ শুধুমাত্র যদি সব main task 100% কাজ করে তাহলেই bonus করবে।**
> ⚠️ **সময় না থাকলে এই phase পুরো skip করো — Phase 7 বেশি important!**

### Bonus B1 — Save/Load Hazard State (সবচেয়ে সহজ, 5 min)

Side panel-এ Save/Load button যোগ করো:

```jsx
// Save
const handleSave = () => {
  const state = {
    blockedNodes: [...blockedNodes],
    blockedEdges: [...blockedEdges],
    closedExits: [...closedExits],
    startNode,
  };
  localStorage.setItem('savedState', JSON.stringify(state));
};

// Load
const handleLoad = () => {
  const saved = localStorage.getItem('savedState');
  if (!saved) return;
  const state = JSON.parse(saved);
  const bNodes = new Set(state.blockedNodes);
  const bEdges = new Set(state.blockedEdges);
  const cExits = new Set(state.closedExits);
  setBlockedNodes(bNodes);
  setBlockedEdges(bEdges);
  setClosedExits(cExits);
  setStartNode(state.startNode);
  recalculateRoute(state.startNode, bNodes, bEdges, cExits);
};
```

### Bonus B2 — High-Contrast Mode (5 min)

```jsx
const [highContrast, setHighContrast] = useState(false);

// Toggle button
<button onClick={() => setHighContrast(!highContrast)}>
  {highContrast ? '🌙' : '☀️'} High Contrast
</button>

// Apply via className or inline styles
// Dark background, bright colored nodes, larger text
```

### Bonus B4 — PNG Export (5 min, if using SVG)

```jsx
const handleExport = () => {
  const svgElement = document.querySelector('svg');
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const link = document.createElement('a');
    link.download = 'smart-escape-map.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
};
```

### Step 6.1 — 🔴 COMMIT #3

```bash
git add -A
git commit -m 'feat: animations, UI polish, bonus features (save/load, high-contrast)

Prompt: "Add subtle CSS transitions for node selection (scale), hazard toggling (opacity fade), and route highlighting (stroke-width animation). Add legend component. Add localStorage save/load for hazard state. Add high-contrast toggle."'

git push origin main
```

> ⏰ **সময় চেক করো — T+75 এর মধ্যে হওয়া উচিত।**

### ✅ Phase 6 Checklist

- [ ] Bonus features working (whichever you did)
- [ ] Nothing broken by bonus code
- [ ] COMMIT #3 pushed

---

## Phase 7: Final Deliverables (T+75 – T+90)

> **এই phase সবচেয়ে critical। Miss করলে marks হারাবে!**

### Step 7.1 — Screenshots নাও (T+75 – T+78)

1. **Dev server চালু করো** (বা live site ব্যবহার করো)
2. **Screenshot 1 — Baseline:**
   - `building.json` load করো
   - R1 select করো
   - Route দেখো: R1 → C1 → C2 → E1, cost 7
   - Screenshot নাও (Win+Shift+S বা Snipping Tool)
   - Save করো: `screenshots/baseline-route.png`
3. **Screenshot 2 — Rerouting after blocking C2:**
   - C2 right-click করে block করো
   - Route update হবে: R1 → C1 → C3 → C4 → E2, cost 11
   - Screenshot নাও
   - Save করো: `screenshots/rerouted-after-c2-blocked.png`

### Step 7.2 — README.md লেখো (T+78 – T+83)

Root-এ `README.md` ফাইল তৈরি/update করো (A7 template থেকে copy করে fill করো):

```markdown
# Smart Escape — Interactive Evacuation Route Simulator

## Author
- **Name:** [তোমার পুরো নাম]
- **Registration Number:** [তোমার registration number]

## Live Site
🔗 **[https://devfest-<reg>.vercel.app](https://devfest-<reg>.vercel.app)**

## How to Run Locally
1. Clone: `git clone https://github.com/<username>/devfest-<reg>.git`
2. Install: `npm install`
3. Run: `npm run dev`
4. Open `http://localhost:5173` in Chrome

## Main Features Implemented
- [x] Import and validate building.json
- [x] Interactive graph map (rooms, junctions, exits, weighted corridors)
- [x] Select starting location
- [x] Dijkstra shortest path with correct cost calculation
- [x] Lexicographic tie-breaking (exit ID, then node sequence)
- [x] Block/unblock rooms, junctions, corridors
- [x] Close/reopen exits
- [x] Automatic route recalculation
- [x] Reset to initial state
- [x] "No route available" message
- [x] "Starting location blocked" message
- [x] Bangla ↔ English language switch (persisted)
- [x] Subtle animations

## Bonus Features
[যেগুলো করেছো tick দাও, বাকিগুলো বাদ দাও]
- [ ] Save/load hazard state
- [ ] High-contrast mode
- [ ] PNG export

## Known Issues
- [যদি কোনো bug জানা থাকে লেখো, না থাকলে "None known" লেখো]

## AI Tools Used
- [যেসব AI tool ব্যবহার করেছো, যেমন: "GitHub Copilot, ChatGPT-4o, Gemini"]

## Most Useful Prompt
> "[তোমার সবচেয়ে কাজের prompt টা paste করো]"

## License
MIT — see [LICENSE](./LICENSE)
```

### Step 7.3 — Final code cleanup (T+83 – T+85)

Terminal-এ check করো:

```bash
# 1. কোনো secret আছে কিনা search করো
grep -r "api_key\|apikey\|secret\|password\|token" src/ --include="*.js" --include="*.jsx"

# 2. Console.log বাদ দাও (production-এ দরকার নেই)
grep -r "console.log" src/ --include="*.js" --include="*.jsx"

# 3. Build successful কিনা check করো
npm run build
```

Browser-এ last check:
1. Language switch করো — কোনো `[keyName]` দেখা যাচ্ছে কিনা?
2. All 5 test scenarios আবার চালাও
3. Console-এ কোনো error নেই?

### Step 7.4 — 🔴 COMMIT #4 (Final)

```bash
git add -A
git commit -m 'docs: README, screenshots, final cleanup

Manual edit'

git push origin main
```

### Step 7.5 — Final deploy verify করো (T+85 – T+87)

1. Vercel auto-deploy হবে push-এর পরে (2 min অপেক্ষা)
2. Chrome incognito-তে live URL খোলো
3. Quick test: file import → route → hazard → reset → language switch
4. ✅ সব কাজ করলে → submission-এ যাও

### Step 7.6 — Submit করো (T+87 – T+90)

1. **Final commit hash কপি করো:**
   ```bash
   git log -1 --format="%H"
   ```
   (বা first 7 chars: `git log -1 --format="%h"`)

2. **Submission form fill করো:**
   - Full name: [তোমার নাম]
   - Registration number: [তোমার reg number]
   - GitHub repo: `https://github.com/<username>/devfest-<reg>`
   - Final commit ID: [paste hash]
   - Live URL: `https://devfest-<reg>.vercel.app`

3. **Submit button click করো!**

### Step 7.7 — 🛑 STOP

> **T+90 হয়ে গেলে আর কিছু করবে না।**
> - কোনো commit নয়
> - কোনো push নয়
> - কোনো deploy নয়
> - কোনো code change নয়

### ✅ Phase 7 Checklist

- [ ] Screenshot: baseline route (R1 → E1, cost 7)
- [ ] Screenshot: rerouted (C2 blocked, R1 → E2, cost 11)
- [ ] Screenshots in `screenshots/` folder
- [ ] README.md complete with all sections
- [ ] No secrets in code
- [ ] No console.log left
- [ ] Build successful
- [ ] COMMIT #4 pushed
- [ ] Live site verified in Chrome incognito
- [ ] Submission form filled and submitted
- [ ] STOPPED at T+90

---

## ⏰ Quick Timer Reference

| Alarm | Time | Action |
|-------|------|--------|
| 🔔 1 | T+25 | COMMIT #1 — graph import + display |
| 🔔 2 | T+50 | COMMIT #2 + DEPLOY — routing + hazards + i18n |
| 🔔 3 | T+75 | COMMIT #3 — animations + bonus |
| 🔔 4 | T+85 | STOP coding. Screenshots + README + final commit |
| 🔔 5 | T+90 | 🛑 ABSOLUTE STOP. Submit form. |

> **প্রতিটি alarm-এ যেখানেই থাকো, commit দাও।** অসম্পূর্ণ কাজ commit করা ভালো, commit না করা খারাপ।

---

## Questions to Ask Organizers (T+0 to T+15)

1. **Is `building.json` provided as a downloadable file or pasted into the problem statement?** Need to know if I should include it in `public/` or load it via file picker only.
2. **Can the graph canvas use a library like Cytoscape.js or vis.js, or must rendering be hand-coded?** The rules allow npm/CDN libraries, but confirming is wise.
3. **For tie-breaking "lexicographically smallest sequence of node IDs" — is this comparing the full path arrays element by element (first differing element wins)?** The problem statement implies yes, but clarification prevents bugs.
4. **The rules say "at least one commit every 30 minutes." Does this mean within every 30-minute window (T+0–T+30, T+30–T+60, T+60–T+90), or just that no gap between consecutive commits exceeds 30 minutes?** This affects commit timing strategy.
5. **For the submission form, is the "final commit ID" the full 40-char SHA or is the 7-char prefix sufficient?** The problem statement says "the complete hash or its first seven characters" — confirming.
6. **Does the deployed site need to have `building.json` pre-loaded, or is it acceptable for the user (judge) to upload the file on page load?** This affects whether the sample data is bundled or loaded dynamically.
7. **Are the screenshots required to be from the deployed live site, or can they be from the local dev server?** This affects when to take them.
8. **If using Vercel, is a `vercel.app` subdomain acceptable, or do they expect a custom domain?** Vercel's free tier auto-assigns a subdomain.
9. **What constitutes "subtle animations"? Are CSS transitions sufficient, or do they expect JavaScript-driven canvas animations?** Need to calibrate effort.
10. **Is there a `building.json` sample file provided at T+0, or do I need to create my own test data from the problem statement diagrams?** The problem says "you receive building.json" — confirming delivery method.

---

*End of PDR. This document is a planning artifact only — no application code is included.*

