---
title: "[PLACEHOLDER] Delivery Job — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- A FiveM server running **ESX**, **QBCore** or **QBox**
- [ox_lib](https://github.com/overextended/ox_lib)
- [oxmysql](https://github.com/overextended/oxmysql)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_deliveryjob`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Add this line to `server.cfg`, **after** your framework and dependencies:

```cfg
ensure rocky_deliveryjob
```

## 3. Configure

Open `config.lua` to set the depot location, routes and payout per delivery.

## 4. Restart

Restart your server and check the console for errors.

## Troubleshooting

- **The script does not start:** make sure `ox_lib` and `oxmysql` start before it in `server.cfg`.
- **Still stuck?** Open a ticket on our Discord.
