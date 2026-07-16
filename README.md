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

Open `dashboard.html` directly in a browser and everything works **except the microphone** (voice activation). Browsers refuse mic access on bare `file://` pages.

To get voice control working, serve the folder over localhost instead:

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
- **Spoken briefing** — clicking **BRIEF ME** plays `jarvis_brief.mp3` and pulses the sphere to a synthetic speech envelope (a smoothed random walk, not real audio analysis), so it still reacts even if the mp3 fails to load.

## Editing

Almost everything you'd want to change day to day lives in `jarvis_data.js`:

```js
window.JARVIS_DATA = {
  greeting: "...",
  generatedDate: "...",
  connectors: [ { name, status } ],
  content: { pulse: [ { label, value } ] },
  news: [ { source, headline, time } ],   // fallback only — live fetch overrides this
  priorities: [ "..." ],                   // one-time seed for the to-do list
  headline: "...",
  closer: "..."
};
```

To regenerate the spoken briefing after editing `jarvis_brief.txt`, use any TTS tool of your choice — it was originally generated with [edge-tts](https://github.com/rany2/edge-tts) (`en-GB-RyanNeural`, `--rate=-8% --pitch=-3Hz`).

## Notes

- Built as a single HTML file on purpose — no npm install, no build tooling. Open it and it works.
- The AI PULSE stat panel is a static daily snapshot from `jarvis_data.js`; only the news headlines themselves refresh live.
