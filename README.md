# Liquidsoap Discord Bot

A Discord bot that provides syntax highlighting for Liquidsoap code blocks using ANSI colors.

## Setup

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - **Message Content Intent** (required to read code blocks)
5. Copy the bot token

### 2. Invite the Bot

1. Go to "OAuth2" > "URL Generator"
2. Select scopes: `bot`
3. Select permissions: `Send Messages`, `Read Message History`
4. Copy the generated URL and open it to invite the bot to your server

### 3. Run the Bot

```bash
npm install
DISCORD_TOKEN=your_token_here npm start
```

Or create a `.env` file:
```
DISCORD_TOKEN=your_token_here
```

Then run with a tool like `dotenv`:
```bash
npx dotenv -- npm start
```

## Usage

Post a code block with `liquidsoap` or `liq` as the language:

````
```liquidsoap
def my_radio() =
  playlist("/path/to/music")
end
```
````

The bot will reply with syntax-highlighted code using Discord's ANSI support.

## Features

- Keywords highlighted in magenta
- Strings in green
- Numbers in bright green
- Comments in gray
- Encoders (`%mp3`, etc.) in bright cyan
- Preprocessor directives in yellow
- Function calls in bright blue

## License

GPL-2.0-or-later
