// HERMES_DATA — single source of truth for the dashboard.
// This is the only file you should need to touch day to day.
// Edit the values below (or generate them from a script) and refresh dashboard.html.
window.HERMES_DATA = {
  greeting: "Good evening, sir. I trust the day has been kind to you.",

  // Powers "Ask HERMES anything" by voice — free-form questions after "Hey Hermes"
  // are answered by Groq's free LLM API. Fast and free, but no live web search —
  // answers come from the model's training knowledge plus the dashboard's own
  // live context (date, tasks, headlines), not real-time lookups.
  //
  // 1. Get a free key at https://console.groq.com/keys (no credit card needed).
  // 2. Paste it below, replacing the placeholder.
  //
  // IMPORTANT — unlike Google's keys, Groq keys can't be restricted by domain/
  // referrer. This repo is public, so a real key committed here is visible to
  // anyone browsing it on GitHub and could be used against your free-tier quota.
  // NEVER commit a real key: keep this line's value local-only (edit it after
  // pulling, don't push the change), or accept the risk knowingly since the
  // free tier is rate-limited (worst case is your quota gets used up, not billed).
  groq: {
    apiKey: "YOUR_GROQ_API_KEY_HERE",
    model: "llama-3.3-70b-versatile"
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
  // array is ignored. Delete localStorage's "hermes_tasks_v1" key to reseed.
  priorities: [
    "Skim the GPT-5.6 model card before your 10am call",
    "Clear the three flagged emails sitting in Gmail",
    "Block focus time for Thursday's planning session",
    "Two meetings overlap Wednesday afternoon — resolve the clash"
  ],

  headline: "GPT-5.6 rollout begins as OpenAI, Anthropic and Google all ship this week",

  closer: "I remain, as ever, at your service."
};
