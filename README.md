# H.E.R.M.E.S. Dashboard

**H**olistic **E**xecutive **R**esponse **M**anagement & **E**ngagement **S**ystem — a cinematic,
self-contained command-center dashboard: a glowing 3D particle sphere on an HTML canvas, a
live-updating HUD, a persistent to-do list, real-time AI/tech news, a spoken daily briefing, and
wake-word voice control. No build step, no backend, no framework — just `dashboard.html` and a
couple of local files next to it.

## Files

| File | Purpose |
|---|---|
| `dashboard.html` | The entire app — HUD, canvas sphere animation, to-do list, voice control, all in one file. |
| `hermes_data.js` | The only file you should need to edit day to day. Sets `window.HERMES_DATA` — greeting, connector status, stats, fallback news, Groq API config, and the seed for your to-do list. |
| `hermes_brief.mp3` | The spoken briefing that plays when you click **BRIEF ME**. Generated with a British-accented neural TTS voice. |
| `hermes_brief.txt` | The plain-text script the mp3 was generated from — edit this and regenerate the audio to change what HERMES says. |

## Running it

**Live on GitHub Pages:** https://joeyhanma69.github.io/hermes-dashboard/ — voice activation works here out of the box, since Pages serves over HTTPS and browsers only allow microphone access on secure origins.

**Locally:** opening `dashboard.html` directly (`file://`) works for everything *except the microphone* — browsers refuse mic access on bare `file://` pages. Double-click **`start-hermes.bat`** to fix that: it starts a local static server and opens the dashboard at `http://localhost:8765/dashboard.html`, which counts as secure. Close the "HERMES local server" console window it opens to stop the server.

Doing it by hand instead:

```bash
python -m http.server 8765
```

Then open `http://localhost:8765/dashboard.html`.

## Features

- **Canvas sphere** — ~680 points in a Fibonacci distribution on a slowly rotating, tilted sphere, with a pulsing core, orbital ring, dashed HUD arcs, and a tick-mark bezel. Runs on `requestAnimationFrame`, retina-aware.
- **To-do list** — top-left TASKS panel. Check items off, delete them, or add new ones in the input box. Seeded once from `priorities` in `hermes_data.js`, then persisted in the browser's `localStorage` (`hermes_tasks_v1`) independent of the data file.
- **Live AI/tech news** — fetches trending AI-related stories from Hacker News' public Algolia search API (no key required, CORS-open) on load and every 10 minutes, ranked by points. Falls back to the static `news` array in `hermes_data.js` if the fetch fails.
- **Voice activation** — click the VOICE pill (top-right) to arm wake-word listening via the Web Speech API. Say **"Hey Hermes"**, then:
  - *"brief me"* — plays the briefing
  - *"what should I handle first"* — reads out your top open task
  - *"add task \<whatever\>"* / *"remember to \<whatever\>"* — adds a task
  - *"stop"* — cancels, and works as a barge-in mid-briefing
  - **anything else** — treated as an open-ended question. Once you pause, it's sent to Groq's free LLM API and the answer is spoken back. No live web search — answers draw on the model's training knowledge plus the dashboard's own context (date, tasks, headlines). See **Ask HERMES setup** below for the one-time setup.
- **Self-aware spoken briefing** — clicking **BRIEF ME** builds a briefing sentence fresh, at click-time, from the real current date, your actual open tasks, and the live-fetched news, then speaks it with the browser's built-in speech synthesis (prefers a British `en-GB` male voice if one is installed). It's never reading stale, pre-recorded content. `hermes_brief.mp3` / `hermes_brief.txt` are kept only as a fallback for browsers with no speech synthesis support.
- **Live date and clock** — the date and time in the top-left/top-right are computed from the browser's real clock on every tick, not read from `hermes_data.js`. Nothing to keep updated by hand.

## Editing

Almost everything you'd want to change day to day lives in `hermes_data.js`:

```js
window.HERMES_DATA = {
  greeting: "...",
  groq: { apiKey: "...", model: "..." },
  connectors: [ { name, status } ],
  content: { pulse: [ { label, value } ] },
  news: [ { source, headline, time } ],   // fallback only — live fetch overrides this
  priorities: [ "..." ],                   // one-time seed for the to-do list
  headline: "...",
  closer: "..."
};
```

Date/time are no longer part of the data file — the dashboard always shows and speaks the real current date and clock.

`hermes_brief.mp3` / `hermes_brief.txt` are legacy fallback assets for browsers without speech synthesis support. To regenerate them after editing `hermes_brief.txt`, use any TTS tool of your choice — they were originally generated with [edge-tts](https://github.com/rany2/edge-tts) (`en-GB-RyanNeural`, `--rate=-8% --pitch=-3Hz`).

## Ask HERMES setup (voice Q&A via Groq)

Free-form voice questions ("Hey Hermes, explain quantum entanglement like I'm five") are answered by
Groq's free, fast LLM API, called directly from the browser (OpenAI-compatible chat completions). One-time
setup:

1. **Get a free API key** at https://console.groq.com/keys — sign up, no credit card required.
2. **Paste the key into `hermes_data.js`**, in the `groq.apiKey` field near the top — replacing the
   `YOUR_GROQ_API_KEY_HERE` placeholder. Change `groq.model` there too if you want a different model
   (see [Groq's model list](https://console.groq.com/docs/models) — models get deprecated/replaced
   over time, so check there if the default stops working).
3. That's it locally — reload the page and Ask HERMES works. **Do not push a real key to GitHub** (see
   security note below); if you want it working on the live GitHub Pages site too, you'll need to accept
   that tradeoff or add a small server-side proxy instead.

**Security note — read this before pushing:** unlike Google's Gemini keys, Groq keys have **no
domain/referrer restriction option**. Since `hermes_data.js` lives in this public GitHub repo, a real key
committed here is visible to anyone browsing the repo or viewing page source, and they could use it
against your free-tier quota (Groq's free tier is rate-limited, not billed, so the worst case is your
quota gets consumed, not a bill). Safest approach: keep the real key as a local, uncommitted edit to
`hermes_data.js` (edit it after every `git pull`, never commit that line), so it works when you open the
dashboard yourself but the public repo only ever shows the placeholder. Never paste an API key into a
chat conversation, issue, or commit message — if one ever leaks that way, revoke and regenerate it
immediately in the Groq console.

Canned commands (brief me, add task, what's first, stop) work by voice with no setup at all — only
open-ended questions need Groq, and they fail gracefully with a spoken apology if the key is missing or a
request fails. Groq's free tier has generous but capped rate limits — see
[Groq pricing/limits](https://console.groq.com/docs/rate-limits) for current numbers.

## Notes

- Built as a single HTML file on purpose — no npm install, no build tooling. Open it and it works.
- The AI PULSE stat panel is a static daily snapshot from `hermes_data.js`; only the news headlines themselves refresh live.
- Voice activation (wake word + microphone) needs a secure context: the GitHub Pages URL, or `http://localhost` via `start-hermes.bat`. Plain `file://` will show "MIC BLOCKED" on the VOICE pill.
- This project was previously named J.A.R.V.I.S. — if you have an old bookmark to `.../jarvis-dashboard/`, update it to `.../hermes-dashboard/`.
