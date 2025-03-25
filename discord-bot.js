// discord-bot.js
// A single-file Discord bot integration for chaosworks.glitch.me
// Dependencies: discord.js, express, body-parser, dotenv
// Add to your Glitch project and configure as described below

const Discord = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");

// Initialize Express app for website-bot communication
const app = express();

// Load environment variables for secure configuration
require("dotenv").config();

// Create a Discord client instance
const client = new Discord.Client();

// Configuration: Replace CHANNEL_ID with your Discord channel ID
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Stored in .env
const CHANNEL_ID = "YOUR_DISCORD_CHANNEL_ID"; // Update this!

// Middleware to parse JSON requests from the website
app.use(bodyParser.json());

// Endpoint: Website can POST to this to send messages to Discord
app.post("/notify-discord", (req, res) => {
  const { message } = req.body;
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
    channel.send(`🔵 **ChaosWorks Alert**: ${message}`);
    res.status(200).send("Message sent to Discord");
  } else {
    res.status(404).send("Channel not found");
  }
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌌 ChaosBot server running on port ${PORT}`);
});

// Bot ready event: Confirms bot is online
client.on("ready", () => {
  console.log(`🤖 ChaosBot logged in as ${client.user.tag}`);
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
    channel.send(
      "🌌 **ChaosBot Online**: Systems initialized. Ready for action."
    );
  }
});

// Bot command handler
client.on("message", (msg) => {
  if (msg.author.bot) return; // Ignore other bots

  // Command: Check website status
  if (msg.content === "!status") {
    msg.channel.send(
      "🌐 **ChaosWorks Status**: Online and operational. All AI systems (Kai, Luna, Amethyst) nominal."
    );
  }

  // Command: Get AI documentation links
  else if (msg.content === "!ai-docs") {
    msg.channel.send(
      "📡 **AI Documentation Links**:\n" +
        "- Kai: <https://chaosworks.glitch.me/kai-ai-docs.html>\n" +
        "- Luna: <https://chaosworks.glitch.me/luna-ai-docs.html>\n" +
        "- Amethyst: <https://chaosworks.glitch.me/amethyst-ai-docs.html>"
    );
  }

  // Command: Show help menu
  else if (msg.content === "!help") {
    msg.channel.send(
      "🔮 **ChaosBot Commands**:\n" +
        "- `!status` - Check website and AI system status\n" +
        "- `!ai-docs` - Retrieve AI documentation links\n" +
        "- `!help` - Display this help menu\n" +
        "Built for chaosworks.glitch.me with 💾 cyberpunk flair."
    );
  }
});

// Login to Discord with the bot token
client.login(BOT_TOKEN);
