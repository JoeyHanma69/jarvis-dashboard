// JARVIS_DATA — single source of truth for the dashboard.
// This is the only file you should need to touch day to day.
// Edit the values below (or generate them from a script) and refresh dashboard.html.
window.JARVIS_DATA = {
  greeting: "Good evening, sir. I trust the day has been kind to you.",

  // Powers "Ask JARVIS anything" by voice — free-form questions after "Hey JARVIS"
  // are answered by the Gemini API with Google Search grounding, so JARVIS can
  // speak with real up-to-date information, not just a frozen training cutoff.
  //
  // 1. Get a key at https://aistudio.google.com/apikey
  // 2. In Google Cloud Console, restrict that key by HTTP referrer to your site
  //    (e.g. https://joeyhanma69.github.io/*) so a copied key is useless elsewhere.
  // 3. Paste the restricted key below, replacing the placeholder.
  //
  // NEVER paste a key into a chat, issue, or commit message — only here, in a
  // file that stays local to you (this repo is public, so a real key here would
  // still be visible to anyone browsing it on GitHub; keep this file untracked
  // or swap in a restricted key you're comfortable being public-but-limited).
  gemini: {
    apiKey: "YOUR_GEMINI_API_KEY_HERE",
    model: "gemini-3.5-flash"
  },
  // NOTE: date/time are no longer read from here — the dashboard always
  // shows and speaks the real current date and clock, computed live in
  // the browser, so there's nothing to keep updated by hand.

  // your tool integrations — shown top-right
  connectors: [
    { name: "Gmail",     status: "online"  },
    { name: "Calendar",  status: "online"  },
    { name: "Slack",     status: "offline" },
    { name: "GitHub",    status: "online"  },
    { name: "News Feed", status: "online"  },
    { name: "Notion",    status: "offline" }
  ],

  // quick counts describing today's briefing itself — drives the stats bars + big figures
  content: {
    pulse: [
      { label: "Headlines Tracked",     value: 6 },
      { label: "Labs Shipped This Week",value: 3 },
      { label: "Market Movers",         value: 3 },
      { label: "Sectors In Play",       value: 4 }
    ]
  },

  // fallback seed only — the dashboard fetches real trending AI/tech stories
  // live from Hacker News every 10 minutes and replaces this on success.
  // Only shown if that fetch fails (offline, blocked, etc). Keep newest-first.
  news: [
    { source: "OpenAI",    headline: "GPT-5.6 rollout begins — Sol, Terra and Luna, plus a new Ultra reasoning mode", time: "Jul 14" },
    { source: "CNBC",      headline: "Alibaba jumps 5% as Qwen is tapped to power Apple Intelligence in China", time: "Jul 15" },
    { source: "CNBC",      headline: "Mitsubishi Heavy Industries up 4.9% on AI data-centre cooling deal with Nvidia", time: "Jul 15" },
    { source: "Anthropic", headline: "Claude Sonnet 5 ships; Claude Fable 5 redeployed after export-control order lifted", time: "Jul 1" },
    { source: "AI Weekly", headline: "Meta expands AI-generated ad disclosure labels across Facebook and Instagram", time: "Jul 10" },
    { source: "AI Weekly", headline: "Google opens an Applied AI Lab for African researchers and founders in Accra", time: "Jul 8" }
  ],

  // one-time seed for the to-do list on the dashboard's very first load.
  // After that, the list lives in the browser's localStorage — check things
  // off, delete them, or add new ones on the page (or by voice) and this
  // array is ignored. Delete localStorage's "jarvis_tasks_v1" key to reseed.
  priorities: [
    "Skim the GPT-5.6 model card before your 10am call",
    "Clear the three flagged emails sitting in Gmail",
    "Block focus time for Thursday's planning session",
    "Two meetings overlap Wednesday afternoon — resolve the clash"
  ],

  headline: "GPT-5.6 rollout begins as OpenAI, Anthropic and Google all ship this week",

  closer: "I remain, as ever, at your service."
};
