# gta6-trophy-guide-0xdemon

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/DemonDeployer/gta6-trophy-guide-0xdemon/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/DemonDeployer/gta6-trophy-guide-0xdemon/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Legend** — an offline guide and tracker for all 55 Grand Theft Auto VI PlayStation 5 trophies: the official name, description and grade for every trophy, a guide to each one written in plain words with its sources cited, a six-phase roadmap to the platinum, a flag on the one possibly missable trophy, and a checklist saved in your browser with export and import, filters, and a spoiler setting that hides story trophies until they are earned.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network at runtime — all data is in `app/data/trophies.json`. The grader entrypoint is `main.ts` (Node 22): `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

## What is inside

- `app/index.html` — the guide: hero stats, the platinum roadmap, tracker controls, trophy cards.
- `app/app.js` — checklist in localStorage, export/import as a `.json` file, filters (story / missable / collectibles / activities / online), grade and earned filters, search, spoiler mode.
- `app/style.css` — dark Vice City neon theme, system fonts only, no external assets.
- `app/data/trophies.json` — all 55 trophies with official name, description and grade, kind, tags, missable flag, a guide in this guide's own words, a practical tip, and a source link per trophy.
- `screenshots/` — 4 real renders of the guide running (see `shots.json` for the views).
- `vendor/makefun-frontend.ts` — copied unchanged from the make.fun kit; `main.ts` uses it to write `dossier.json`.

## How the trophy list was verified

Grand Theft Auto VI released 19 November 2026. All 55 names, descriptions and grades were verified on 19 November 2026 against the PlayStation Network data mirrored by Exophase (https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/), cross-checked with Planet GTA 6 (https://www.planetgta6.com/en/gta-6-trophies/, which cross-checks Exophase, PSNProfiles and TrueAchievements) and Push Square (https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap). The split is 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 trophies are hidden, 27 visible; all 55 unlock in single player — there are no online trophies.

Two honest caveats. First, PlayStation.com publishes no public web trophy list for the game, so the guide relies on the PSN data as mirrored by the trackers above and says so on every trophy's source line. Second, one grade disagrees between sources: Push Square's work-in-progress guide lists Maximum Withdrawal as Bronze, while Exophase, Planet GTA 6 and the other lists give it as Silver — this guide follows the majority (Silver) and records the disagreement here and in the app's About section. Four trophies (Personal Best, Actions Speak Louder, Bad Luck, I Guess, The Truth Is Out There) have no confirmed unlock method at launch; their entries say so plainly instead of guessing. The only possibly missable trophy is Positive Mental Attitude (PowerPyx and GTABase), because of Lucia's Chapter 1 balcony meditation — the guide warns about it in the roadmap and on the trophy itself. Difficulty and time come from PowerPyx (4/10, about 200 hours); Push Square estimates 300 hours or more.

## Bounty

Built for make.fun's "Build the best GTA 6 trophy guide" bounty ($250, top 50 paid): https://make.fun/bounty/gta6-trophy-guide-01

---

<sub>Entered on [make.fun](https://make.fun/?ref=qamf9tkx&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
