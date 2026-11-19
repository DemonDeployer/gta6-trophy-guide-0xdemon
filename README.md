# Leonida Legend — GTA VI Trophy Guide & Tracker

[![Leonida Legend — GTA VI Trophy Guide & Tracker](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/DemonDeployer/gta6-trophy-guide-0xdemon/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/DemonDeployer/gta6-trophy-guide-0xdemon/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. It runs in a browser from its own files, fetches nothing over the network, and keeps your progress on your own device.

Competition: [gta6-trophy-guide-01 on make.fun](https://make.fun/bounty/gta6-trophy-guide-01)

## What it does

- **Checklist of all 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze — with the official name, description and grade on every card, plus a “How to unlock” note written in our own words and the source it was checked against.
- **Spoiler mode** — the 28 hidden trophies are masked by default; one toggle reveals their names.
- **Filters and search** — by grade, by missable, by online, by earned/unearned, plus text search across names and descriptions.
- **Roadmap to the Platinum** — five phases in order, with the single missable trophy flagged first so it is never missed by accident.
- **Progress** — earned count, percent, and a per-grade breakdown in the hero, with a progress bar.
- **Export, import, reset** — export earned trophies to a file, import a file to restore them, reset everything back to 0. Progress persists across reloads in local storage.

## The facts that shape the guide

- **55 trophies, 0 online.** Nothing here needs online play; the online filter shows 0 with an empty-state message that says so.
- **Exactly one missable trophy:** Positive Mental Attitude, a Chapter 1 Lucia balcony meditation moment. The missable filter shows exactly that one trophy.
- **Four trophies are UNCONFIRMED:** Personal Best, Actions Speak Louder, “Bad Luck, I Guess” and The Truth Is Out There have no confirmed unlock method at launch, so the guide marks them UNCONFIRMED instead of guessing.
- **One grade disagreement, recorded:** Maximum Withdrawal is Silver according to the PSN-mirroring trackers, while one guide lists it as Bronze. This guide follows Silver and records the disagreement here and in the app’s About section.
- **No public PlayStation list:** PlayStation publishes no public web trophy list for this game, so the guide cites the PSN-mirroring trackers below.

## Sources

Every trophy card names the source its guide note was checked against: Exophase, Planet GTA 6, Push Square, PowerPyx, GTABase, PSNProfiles and TrueAchievements. Sources are cited, never copied — no other guide’s text is reproduced here.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser. Or open `app/index.html` directly from the files. No build step, no network, no account.

To build the submission dossier:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html`, `app/app.js`, `app/style.css` — the guide and tracker app.
- `app/data/trophies.json` — the official trophy list, with our own-words guides, source citations and missable / unconfirmed / hidden flags added for every trophy.
- `screenshots/` — four renders of the app running.
- `shots.json` — what each screenshot shows.
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.
- `serve.ts` — a small static server for local testing.
- `vendor/makefun-frontend.ts` — the make.fun frontend library, as shipped in the kit.

## Licence

MIT — see `LICENSE`. An unofficial, fan-made guide. Not affiliated with, endorsed by, or connected to Rockstar Games or PlayStation. No official artwork, logos, or game screenshots are used.
