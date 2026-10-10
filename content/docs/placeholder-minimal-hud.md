---
title: "[PLACEHOLDER] Minimal HUD — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- Any FiveM server (works standalone, no framework needed)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_hud`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Add this line to `server.cfg`:

```cfg
ensure rocky_hud
```

3. Stop any other HUD resource so the two don't overlap.

## 3. Configure

Open `config.lua` to pick which bars are shown and their default positions.

## 4. Restart

Restart your server. Players can type `/hud` to move elements around.

## Troubleshooting

- **Two HUDs on screen:** another HUD resource is still running.
- **Still stuck?** Open a ticket on our Discord.
