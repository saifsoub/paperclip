# paperclip (Seif's fork) — plain-language README

## What this is
This is Seif's copy (a "fork") of **paperclipai/paperclip**, open-source software for running a team of AI agents as if they were a company. Upstream calls it "orchestration for zero-human companies". It is a Node.js server with a React web dashboard.

## Who it's for
People who want several AI agents working together with structure: roles, goals, budgets and oversight.

## What it does today (according to upstream)
- **Org charts:** give agents roles and reporting lines.
- **Goals and tickets:** hand out work and track it, with an audit log (a record of who did what).
- **Budgets:** set cost limits so agents can't overspend.
- **Heartbeats:** agents wake up on a schedule to check for work.
- **Governance:** approvals before important actions.
- **More than one company** in one install.
- Works with agent tools such as OpenClaw, Claude Code, Codex, Cursor, Bash scripts and web (HTTP) hooks.

**Seif's changes vs upstream:** none found. There are no commits by Seif.

## How to run it
You need Node.js 20+ and pnpm 9.15+.
- Quick start: `npx paperclipai onboard --yes`
- From this code: `pnpm install` then `pnpm dev`. The server runs at http://localhost:3100 with a built-in database.
- Other commands: `pnpm build`, `pnpm typecheck`, `pnpm test:run`, `pnpm db:generate`, `pnpm db:migrate`.

## Current status and known gaps
- Why Seif forked it and whether he runs it: not yet confirmed.
- There is 1 open issue on this fork.

## Where things live
| Folder / file | What's in it |
|---|---|
| `README.md` | The upstream readme |
| `package.json` | The commands listed above |
| `LICENSE` | MIT |
