# Farcaster Setup (Neynar)

Use this guide to enable Farcaster posting with `--platforms farcaster`.

## Required Keys
- `NEYNAR_API_KEY`
- `FARCASTER_SIGNER_UUID`

## Registration Flow
1. Register at Neynar and create an app to get `NEYNAR_API_KEY`.
2. Create a signer request in Neynar.
3. Open the signer approval URL in Warpcast and approve it.
4. Copy the approved signer UUID as `FARCASTER_SIGNER_UUID`.

## .env Example
```env
NEYNAR_API_KEY=neynar_xxx
FARCASTER_SIGNER_UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Verify
```bash
python3 scripts/publish_sync.py --doctor --platforms farcaster
```

## Publish Test
```bash
python3 scripts/publish_sync.py --text "SyncX Farcaster test post" --platforms farcaster
```
