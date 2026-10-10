---
title: "[PLACEHOLDER] Housing System — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- A FiveM server running **QBCore** or **QBox**
- [ox_lib](https://github.com/overextended/ox_lib)
- [oxmysql](https://github.com/overextended/oxmysql)
- [ox_target](https://github.com/overextended/ox_target)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_housing`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Import `install.sql` into your database.
3. Add this line to `server.cfg`, **after** your framework and dependencies:

```cfg
ensure rocky_housing
```

## 3. Configure

Open `config.lua` to add properties, set prices and rent, and connect the real-estate job.

## 4. Restart

Restart your server and check the console for errors.

## Troubleshooting

- **Can't interact with doors:** make sure `ox_target` is running.
- **Still stuck?** Open a ticket on our Discord.
