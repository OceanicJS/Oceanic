const { Client } = require("oceanic.js");
const fs = require("fs");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
		// list of intents: https://discord.com/developers/docs/topics/gateway#list-of-intents
		// they roughly map on to events we use
        // most events also list if they require an intent: https://oceanic.owo-whats-this.dev/dev/interfaces/types_events.ClientEvents.html
        intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
        // if you do not have the MESSAGE_CONTENT intent, various fields like `content`, `components`, `embeds` and more will be empty unless your client is specifically addressed.
    }
});

client.on("ready", () => console.log("Ready as ", client.user.tag));

// an error handler
client.on("error", (error) => {
    console.error("Something went wrong: ", error);
});

// New Guild Joined
// https://oceanic.owo-whats-this.dev/dev/interfaces/types_events.ClientEvents.html#guildCreate
bot.on("guildCreate", (guild) => {
    console.log("Guild Joined: ", guild.name);
});

// Message Sent
// https://oceanic.owo-whats-this.dev/dev/interfaces/types_events.ClientEvents.html#messageCreate
bot.on("messageCreate", (msg) => {
    console.log(`New message: ${msg.content}`);
});

// This event will never be seen as neither `GUILD_MESSAGE_TYPING` or `DIRECT_MESSAGE_TYPING` were included in the intents
// https://oceanic.owo-whats-this.dev/dev/interfaces/types_events.ClientEvents.html#typingStart
bot.on("typingStart", (channel, user) => { // When a user starts typing
    console.log(`${user.username} is typing in ${channel.name}`);
});

// connect to Discord
client.connect();
