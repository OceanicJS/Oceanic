const { Client } = require("oceanic.js");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
		// List of intents: https://discord.com/developers/docs/topics/gateway#list-of-intents
		// They change what events our client receives to lower the amount of computer power needed to run it
        // Most events also list if they require an intent: https://oceanic.owo-whats-this.dev/latest/interfaces/types_events.ClientEvents.html
        intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
        // If you do not have the MESSAGE_CONTENT intent, various fields like `content`, `components`, `embeds` and more will be empty unless the message belongs to or mentions your client
    }
});

client.on("ready", () => console.log("Ready as", client.user.tag));

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// New Guild Joined
// https://oceanic.owo-whats-this.dev/latest/interfaces/types_events.ClientEvents.html#guildCreate
bot.on("guildCreate", (guild) => {
    console.log("Guild Joined:", guild.name);
});

// Message Sent
// https://oceanic.owo-whats-this.dev/latest/interfaces/types_events.ClientEvents.html#messageCreate
bot.on("messageCreate", (msg) => {
    console.log(`New message: ${msg.content}`);
});

// This event will never be seen as neither `GUILD_MESSAGE_TYPING` or `DIRECT_MESSAGE_TYPING` were included in the intents
// https://oceanic.owo-whats-this.dev/latest/interfaces/types_events.ClientEvents.html#typingStart
bot.on("typingStart", (channel, user) => { // When a user starts typing
    console.log(`${user.id} is typing in ${channel.id}`); // User or channel are not necessarily complete (Uncached) to retrieve names
});

// Connect to Discord
client.connect();
