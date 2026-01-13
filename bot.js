import { Client, GatewayIntentBits } from 'discord.js';
import hljs from 'highlight.js';
import liquidsoap from 'highlightjs-liquidsoap';

hljs.registerLanguage('liquidsoap', liquidsoap);
hljs.registerLanguage('liq', liquidsoap);

const CODE_BLOCK_REGEX = /```(liquidsoap|liq)\n([\s\S]*?)```/g;

// ANSI color codes for Discord
const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  // Bright foreground
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
};

// Map highlight.js classes to ANSI colors
// Note: hljs uses space-separated classes like "hljs-title function_"
const SCOPE_TO_ANSI = {
  'keyword': ANSI.magenta,
  'built_in': ANSI.cyan,
  'type': ANSI.cyan,
  'literal': ANSI.blue,
  'number': ANSI.brightGreen,
  'string': ANSI.green,
  'subst': ANSI.brightYellow,
  'regexp': ANSI.red,
  'comment': ANSI.gray,
  'doctag': ANSI.gray + ANSI.bold,
  'meta': ANSI.yellow,
  'variable': ANSI.white,
  'variable language_': ANSI.brightCyan,
  'title': ANSI.brightBlue,
  'title function_': ANSI.brightBlue,
  'title function_ invoke__': ANSI.brightBlue,
  'property': ANSI.cyan,
  'symbol': ANSI.brightYellow,
  'operator': ANSI.brightMagenta,
  'punctuation': ANSI.white,
};

function getAnsiForClass(className) {
  // Try exact match first
  if (SCOPE_TO_ANSI[className]) {
    return SCOPE_TO_ANSI[className];
  }
  // Try first part (e.g., "title" from "title function_")
  const firstPart = className.split(' ')[0];
  return SCOPE_TO_ANSI[firstPart] || '';
}

function htmlToAnsi(html) {
  let result = '';
  let i = 0;

  while (i < html.length) {
    if (html[i] === '<') {
      const closeTag = html.indexOf('>', i);
      if (closeTag === -1) break;

      const tag = html.slice(i + 1, closeTag);

      if (tag.startsWith('span class="hljs-')) {
        const classMatch = tag.match(/class="hljs-([^"]+)"/);
        if (classMatch) {
          result += getAnsiForClass(classMatch[1]);
        }
      } else if (tag === '/span') {
        result += ANSI.reset;
      }

      i = closeTag + 1;
    } else if (html[i] === '&') {
      const semiColon = html.indexOf(';', i);
      if (semiColon !== -1) {
        const entity = html.slice(i, semiColon + 1);
        switch (entity) {
          case '&lt;': result += '<'; break;
          case '&gt;': result += '>'; break;
          case '&amp;': result += '&'; break;
          case '&quot;': result += '"'; break;
          case '&#x27;': result += "'"; break;
          default: result += entity;
        }
        i = semiColon + 1;
      } else {
        result += html[i++];
      }
    } else {
      result += html[i++];
    }
  }

  return result;
}

function highlightToAnsi(code) {
  const result = hljs.highlight(code, { language: 'liquidsoap' });
  return htmlToAnsi(result.value);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Watching for liquidsoap code blocks...`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Skip if already in a thread created by us
  if (message.channel.isThread() && message.channel.name === 'Syntax Highlighted') return;

  const matches = [...message.content.matchAll(CODE_BLOCK_REGEX)];
  if (matches.length === 0) return;

  try {
    // Create a thread for the highlighted code
    const thread = await message.startThread({
      name: 'Syntax Highlighted',
      autoArchiveDuration: 60
    });

    for (const match of matches) {
      const code = match[2].trim();
      if (!code) continue;

      const ansiCode = highlightToAnsi(code);

      // Discord has a 2000 char limit, ansi block adds ~10 chars
      if (ansiCode.length > 1980) {
        await thread.send('⚠️ Code block too long to display with highlighting');
        continue;
      }

      await thread.send('```ansi\n' + ansiCode + '\n```');
    }
  } catch (err) {
    console.error('Error highlighting code:', err);
  }
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('DISCORD_TOKEN environment variable is required');
  console.error('Usage: DISCORD_TOKEN=your_token npm start');
  process.exit(1);
}

client.login(token);
