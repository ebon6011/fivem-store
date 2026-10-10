---
title: "[PLACEHOLDER] Stock Market — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- A FiveM server running **ESX** or **QBCore**
- [oxmysql](https://github.com/overextended/oxmysql)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_stocks`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Import `install.sql` into your database.
3. Add this line to `server.cfg`, **after** your framework and `oxmysql`:

```cfg
ensure rocky_stocks
```

## 3. Configure

Open `config.lua` to add companies, set starting prices and choose how often prices update.

## 4. Restart

Restart your server and check the console for errors.

## Troubleshooting

- **Portfolios don't save:** make sure the SQL file was imported.
- **Still stuck?** Open a ticket on our Discord.
