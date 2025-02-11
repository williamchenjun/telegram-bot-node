# 🤖 Telegram Bot API in NodeJS

Create your own Telegram bot using the [**Telegram Bot API**](https://core.telegram.org/bots/api) in NodeJS. This module makes bot building intuitive and easy. It supports most recent versions of NodeJS (23 and later) and it allows both long polling and the use of webhooks. It also offers the option to set up a [local bot](https://core.telegram.org/bots/api) and to use a [test environment](https://core.telegram.org/bots/api).

```js
import { App } from "telegram-bot-node/base";
import { CommandHandler } from "telegram-bot-node/handlers";
import { UpdateType } from "telegram-bot-node/constants";
// Define an API_KEY in a .env file.

const app = new App().token(API_KEY).build();

// Either define the callback with an arrow function.
app.addHandler(new CommandHandler("start", async (update, context) => {
    await update.effective_chat.sendMessage({
        text: `Welcome to <b>${update.effective_chat.title}</b>!`,
        parse_mode: "HTML",
    });
}));

// Or define a function and pass it to the Handler.
async function greet(update, context){
    await update.effective_chat.sendMessage({
        text: `Welcome to ${update.effective_chat.title}, ${update.effective_user.mention_html()}`,
    });
}

app.addHandler(new CommandHandler("start", greet));

// Run express server if using a webhook.
app.run({allowed_updates: [UpdateType.ALL], drop_pending_updates: true});

// Otherwise, run polling.
app.run_polling({limit: 100, timeout: 60, allowed_updates: [UpdateType.ALL]});
```

### Disclaimer
This project was inspired by `python-telegram-bot`, hence, a lot of the nomenclature and definitions are very similar or identical to theirs. This was not done with the intention to copy, but for cross-platform flexibility and to make it easier for people to transition from one language to the other.

# General Information
Let's explore together some of the general information about Telegram bots and how to use this module

## How to install
If you want to use this nodeJS module, you can install via `npm`

```bash
npm install github:williamchenjun/telegram-bot-node#latest-release
```

(Note: add the hashtag `#latest-release` to get the most recent release, otherwise, specify the version `vX.X.X`)

Alternatively, you can clone the repository and use it directly in your project

```bash
git clone https://github.com/williamchenjun/telegram-bot-node.git
```

## Information about the structure
The module is composed of the following subdirectories:
- `telegram-bot-node/base`: It includes the foundational instances that represent a Telegram bot and an update request.
- `telegram-bot-node/components`: It contains all the available Telegram Bot API types (e.g. `Message`, `User`, etc.).
- `telegram-bot-node/handlers`: It contains all the different update handlers. Depending on your necessities you will have to use the correct one (e.g. to handle commands, you would use `CommandHandler`).
- `telegram-bot-node/constants`: It has various constants definitions. It is for convenience and to keep your code neat (e.g. `ParseMode.HTML`, `Filters.TEXT`, etc.).
- `telegram-bot-node/utils`: It contains utility functions that can be useful to you, such as `parseCommand` to deal with command arguments and `accessControl` to set up command permissions.

## How to set up a bot
If you don't have a Telegram bot yet, you need to visit @BotFather on Telegram and create a new bot my sending the command `/newbot`.

After you go through the process, BotFather will give you an API token. You should keep that safe and store it somewhere accessible, such as a `.env` file. A `.env` file is useful in nodeJS to store environmental variables that should be kept safe

```dotenv
# Inside .env
API_KEY=123456789:abcdefghijk
```
then in your JS script you should use `dotenv` to import the environment variables

```js
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;

console.log(API_KEY);
// Output: 123456789:abcdefghijk
```

After setting up the basics, you can just initialise the bot

```js
import { App } from "telegram-bot-node";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;
const app = new App().token(API_KEY).build();

// Set up webhook. You can either pass the webhook url here, or you can set the environmental variable `WEBHOOK_URL`.
app.run({url: "https://...", allowed_updates: [UpdateType.MESSAGE, UpdateType.CALLBACK_QUERY]});
```

The environment variables that can be set are:
- `WEBHOOK_URL`: The webhook url.
- `SECRET_TOKEN`: The [secret token](https://core.telegram.org/bots/api#setwebhook) used to confirm incoming bot updates.
- `API_KEY`: Your Telegram bot API token.

You can run this bot locally, on Docker, or on your server.

## Adding custom endpoints
You can add custom webhook endpoints to trigger certain behaviours by using the `App.addEndpoint(method, path, callback)` method

```js
import { App } from "telegram-bot-node";

const app = new App().token(API_KEY).build();

// req is an express Request, res is an express Response.
app.addEndpoint("POST", "/submit", async (req, res) => {
    const data = req.body;
    // do something with the data...
    // e.g. Context.bot.sendMessage({...});

    res.status(200).send("ok");
});

app.run({...});
```

This is useful if you have external sources that interact with your Telegram bot and you want to trigger a bot response after an event. For instance, email or form submissions, new social media or blog posts, etc..