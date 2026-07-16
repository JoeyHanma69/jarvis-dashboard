# J.A.R.V.I.S. Dashboard

A cinematic, self-contained command-center dashboard in the style of Iron Man's J.A.R.V.I.S. — a glowing 3D particle sphere on an HTML canvas, a live-updating HUD, a persistent to-do list, real-time AI/tech news, a spoken daily briefing, and wake-word voice control. No build step, no backend, no framework — just `dashboard.html` and a couple of local files next to it.

## Files

| File | Purpose |
|---|---|
| `dashboard.html` | The entire app — HUD, canvas sphere animation, to-do list, voice control, all in one file. |
| `jarvis_data.js` | The only file you should need to edit day to day. Sets `window.JARVIS_DATA` — greeting, date, connector status, stats, fallback news, and the seed for your to-do list. |
| `jarvis_brief.mp3` | The spoken briefing that plays when you click **BRIEF ME**. Generated with a British-accented neural TTS voice. |
| `jarvis_brief.txt` | The plain-text script the mp3 was generated from — edit this and regenerate the audio to change what JARVIS says. |

## Running it

**Live on GitHub Pages:** https://joeyhanma69.github.io/jarvis-dashboard/ — voice activation works here out of the box, since Pages serves over HTTPS and browsers only allow microphone access on secure origins.

**Locally:** opening `dashboard.html` directly (`file://`) works for everything *except the microphone* — browsers refuse mic access on bare `file://` pages. Double-click **`start-jarvis.bat`** to fix that: it starts a local static server and opens the dashboard at `http://localhost:8765/dashboard.html`, which counts as secure. Close the "JARVIS local server" console window it opens to stop the server.

Doing it by hand instead:

```bash
python -m http.server 8765
```

Then open `http://localhost:8765/dashboard.html`.

## Features

- **Canvas sphere** — ~680 points in a Fibonacci distribution on a slowly rotating, tilted sphere, with a pulsing core, orbital ring, dashed HUD arcs, and a tick-mark bezel. Runs on `requestAnimationFrame`, retina-aware.
- **To-do list** — top-left TASKS panel. Check items off, delete them, or add new ones in the input box. Seeded once from `priorities` in `jarvis_data.js`, then persisted in the browser's `localStorage` (`jarvis_tasks_v1`) independent of the data file.
- **Live AI/tech news** — fetches trending AI-related stories from Hacker News' public Algolia search API (no key required, CORS-open) on load and every 10 minutes, ranked by points. Falls back to the static `news` array in `jarvis_data.js` if the fetch fails.
- **Voice activation** — click the VOICE pill (top-right) to arm wake-word listening via the Web Speech API. Say **"Hey JARVIS"**, then:
  - *"brief me"* — plays the briefing
  - *"what should I handle first"* — reads out your top open task
  - *"add task \<whatever\>"* / *"remember to \<whatever\>"* — adds a task
  - *"stop"* — cancels, and works as a barge-in mid-briefing
  - **anything else** — treated as an open-ended question. Once you pause, it's sent straight to a local [Ollama](https://ollama.com) server on this machine and the answer is spoken back — no API key, no cloud, nothing leaves your computer. See **Ask JARVIS setup** below for the one-time setup.
- **Self-aware spoken briefing** — clicking **BRIEF ME** builds a briefing sentence fresh, at click-time, from the real current date, your actual open tasks, and the live-fetched news, then speaks it with the browser's built-in speech synthesis (prefers a British `en-GB` male voice if one is installed). It's never reading stale, pre-recorded content. `jarvis_brief.mp3` / `jarvis_brief.txt` are kept only as a fallback for browsers with no speech synthesis support.
- **Live date and clock** — the date and time in the top-left/top-right are computed from the browser's real clock on every tick, not read from `jarvis_data.js`. Nothing to keep updated by hand.

## Editing

Almost everything you'd want to change day to day lives in `jarvis_data.js`:

```js
window.JARVIS_DATA = {
  greeting: "...",
  connectors: [ { name, status } ],
  content: { pulse: [ { label, value } ] },
  news: [ { source, headline, time } ],   // fallback only — live fetch overrides this
  priorities: [ "..." ],                   // one-time seed for the to-do list
  headline: "...",
  closer: "..."
};
```

Date/time are no longer part of the data file — the dashboard always shows and speaks the real current date and clock.

`jarvis_brief.mp3` / `jarvis_brief.txt` are legacy fallback assets for browsers without speech synthesis support. To regenerate them after editing `jarvis_brief.txt`, use any TTS tool of your choice — they were originally generated with [edge-tts](https://github.com/rany2/edge-tts) (`en-GB-RyanNeural`, `--rate=-8% --pitch=-3Hz`).

## Ask JARVIS setup (voice Q&A via Ollama)

Free-form voice questions ("Hey JARVIS, what's the weather like for a Mars launch window") are answered
by a local [Ollama](https://ollama.com) server on your own machine — no API key, no cloud, nothing ever
leaves your computer. One-time setup:

1. **Install Ollama** (if you haven't already) from https://ollama.com and pull a model:
   ```
   ollama pull llama3
   ```
   `dashboard.html` is set to `OLLAMA_MODEL = "llama3"` near the top of the `<script>` block — change
   that constant if you'd rather use a different model you've pulled (`mistral`, `phi3`, etc).

2. **Allow the dashboard's origin to talk to Ollama.** By default Ollama only accepts requests from a
   short allowlist of origins, which doesn't include GitHub Pages or `start-jarvis.bat`'s localhost port.
   Set the `OLLAMA_ORIGINS` environment variable yourself (Settings → search "environment variables" →
   Edit environment variables for your account → New):
   - **Name:** `OLLAMA_ORIGINS`
   - **Value:** `http://localhost:8765,https://joeyhanma69.github.io`

   Then fully quit Ollama (right-click its tray icon → Quit) and reopen it so it picks up the change.

3. Make sure Ollama is running (its tray icon, or `ollama serve`) whenever you want to ask JARVIS
   something — it listens on `http://localhost:11434`.

Canned commands (brief me, add task, what's first, stop) work by voice with no setup at all — only
open-ended questions need Ollama, and they fail gracefully with a spoken apology if it's unreachable.

Because Ollama only listens on your own machine, this only works when you're physically at this
computer with Ollama running — visiting the GitHub Pages URL from elsewhere won't have anything to
talk to.

## Notes

- Built as a single HTML file on purpose — no npm install, no build tooling. Open it and it works.
- The AI PULSE stat panel is a static daily snapshot from `jarvis_data.js`; only the news headlines themselves refresh live.
- Voice activation (wake word + microphone) needs a secure context: the GitHub Pages URL, or `http://localhost` via `start-jarvis.bat`. Plain `file://` will show "MIC BLOCKED" on the VOICE pill.
