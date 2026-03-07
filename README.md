# SyncX Monorepo

SyncX is a one-stop crypto content sync toolkit.

## Structure
- `skills/syncx` - production skill (config guides, scripts, QA, troubleshooting)
- `apps/web` - Next.js marketing/documentation site for SyncX
- `docs` - PRD and design artifacts
- `references` - cloned third-party references used for implementation research

## Quick Start

### Skill
```bash
cd skills/syncx
python3 scripts/publish_sync.py --init-config
python3 scripts/publish_sync.py --doctor --platforms square,twitter --twitter-mode official
```

### Web App
```bash
cd apps/web
npm install
npm run dev
```

## Quality Checks
```bash
cd apps/web && npm run lint && npm run build
# Optional if skill-creator toolchain is available in your environment:
# python3 <path-to-skill-creator>/scripts/quick_validate.py skills/syncx
```
