---
title: "[PLACEHOLDER] Admin Toolkit — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- Any FiveM server (ESX, QBCore, QBox or standalone)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_admin`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Add this line to `server.cfg`:

```cfg
ensure rocky_admin
add_ace group.admin rocky_admin.use allow
```

## 3. Configure

Open `config.lua` to set permission levels and paste your Discord webhook link for action logs.

## 4. Restart

Restart your server. Admins open the menu with `/admin`.

## Troubleshooting

- **"No permission":** check that your account is in `group.admin`.
- **Still stuck?** Open a ticket on our Discord.
