---
name: syncx
description: One-stop crypto creator autopost workflow for syncing the same text post to Binance Square and X/Twitter (plus optional Telegram and Threads) in a single command. Use when user asks to "sync post", "cross-post", "一键同步", "同时发推和广场", "发到 TG/Threads", or needs setup/troubleshooting for Binance Square API key, X API credentials, X browser-cookie mode, Telegram bot/channel posting, and multi-platform posting automation.
---

# SyncX｜加密信息一站式同步器

## Overview
Use this skill as an interaction-first autopost operator for crypto creators.
Guide user through setup, verification, and publishing with clear branch routing, with Binance Square + X as the default target pair.

## Core Workflow
1. Route intent first.
- `publish-now`: user already has content and wants immediate sync.
- `setup`: user asks how to configure API/token.
- `troubleshoot`: user has failure codes or partial success.
2. Confirm target platforms.
- Default to `square,twitter` when user says "同步" but does not specify.
3. Select X mode as a normal branch.
- Branch A: `official` (X developer credentials path).
- Branch B: `browser` (session cookie path: `auth_token + ct0`).
4. Ensure config exists.
- Run `python3 scripts/publish_sync.py --init-config` if `.env` is missing.
- Or copy `.env.example` to `.env`.
5. Fill config safely.
- Never print full secret values back to user.
- If user shares keys in chat, persist only to local `.env` and mask in output.
6. Validate before posting.
- Run `python3 scripts/publish_sync.py --doctor --platforms <...> --twitter-mode <...>`.
7. Publish and return structured result.
- Run `python3 scripts/publish_sync.py --text "..." --platforms <...> --twitter-mode <...>`.
- Return success/failure per platform with URL/ID when available.

## Interactive Routing Rules
Apply this branch logic in every conversation:

1. If user says "直接发" and provided text:
- Run doctor first.
- If doctor fails, ask only for missing keys and provide the exact reference file.
- Once doctor passes, execute publish.

2. If user asks "怎么配":
- Route by platform and mode.
- For X: ask whether they want `official` or `browser` path.
- Return copy-ready `.env` keys and exact command sequence.

3. If user says "报错了":
- Ask for raw JSON output or error code.
- Route to `references/troubleshooting.md`.
- Retry with single-platform test, then fan-out test.

4. If environment is missing (`python` not found, command not found):
- Route to `references/environment.md`.
- Complete environment checks first, then continue normal flow.

## Command Patterns
Use these exact command shapes.

### 1) Initialize local config
```bash
python3 scripts/publish_sync.py --init-config
```

### 2) Validate config only
```bash
python3 scripts/publish_sync.py \
  --doctor \
  --platforms square,twitter \
  --twitter-mode official
```

### 3) Publish to Binance Square + X (default MVP)
```bash
python3 scripts/publish_sync.py \
  --text "BTC 回踩后继续上攻，关注 4h 结构" \
  --platforms square,twitter \
  --twitter-mode official
```

### 4) Publish to X browser-session mode + Square
```bash
python3 scripts/publish_sync.py \
  --text "今日策略更新：严格风控" \
  --platforms square,twitter \
  --twitter-mode browser
```

### 5) Publish to Square + X + Telegram
```bash
python3 scripts/publish_sync.py \
  --text "晚间复盘：BTC 关键位 68k" \
  --platforms square,twitter,tg \
  --twitter-mode official
```

### 6) Dry run for safe pre-check
```bash
python3 scripts/publish_sync.py \
  --text "test" \
  --platforms square,twitter,tg,threads \
  --twitter-mode official \
  --dry-run
```

## Platform Matrix
- `square`: Binance Square OpenAPI text publishing.
- `twitter` (`official`): X API v2 `/2/tweets` with OAuth1 user credentials.
- `twitter` (`browser`): X web-session mode using `auth_token + ct0` cookies.
- `tg`: Telegram Bot API `sendMessage` to channel/group/chat.
- `threads`: Optional Graph API two-step publish.

## Setup References
Load only the file you need:
- Quick start: `references/get-started.md`
- Environment and runtime checks: `references/environment.md`
- Binance Square setup: `references/setup-square.md`
- X official API setup: `references/setup-twitter-official.md`
- X browser mode setup: `references/setup-twitter-browser.md`
- Telegram setup: `references/setup-telegram.md`
- Threads setup: `references/setup-threads.md`
- Troubleshooting: `references/troubleshooting.md`
- Q&A script: `references/qa.md`
- Source links: `references/sources.md`

## Behavior Rules
1. Prefer execution over explanation.
- If user gave text and asked to sync, run doctor then post.
2. Fail partially, report fully.
- One platform failure must not block others.
- Return per-platform status with error details.
3. Keep secrets safe.
- Never echo full tokens.
- Use masked format like `abc12...9xyz` in summaries.
4. Respect content limitations.
- Binance Square API currently supports text-only posts in this flow.
5. Ask only when truly blocked.
- Missing required key/token should trigger a concise request for exactly the missing item.
6. Keep interactions stepwise.
- Ask one blocking question at a time.
- Always provide the next executable command, not generic advice.

## Practical Defaults
- Default `platforms`: `square,twitter`
- Default `twitter-mode`: `official`
- Default config path: `skills/syncx/.env`
- Timeout: `25s`

## Quick Troubleshooting Hooks
When publish fails, run these in order:
1. `python3 scripts/publish_sync.py --doctor --platforms <...> --twitter-mode <...>`
2. `python3 scripts/publish_sync.py --text "ping" --platforms <...> --dry-run`
3. Re-run publish and inspect platform-specific error in JSON output.

## Local Validation
Run smoke test before release changes:
```bash
python3 scripts/smoke_test.py
```
