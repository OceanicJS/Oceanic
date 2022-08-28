const { Client } = require("oceanic.js");
const fs = require("fs");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
		// list of intents: https://discord.com/developers/docs/topics/gateway#list-of-intents
		// they roughly map on to events we use
        intents: ["GUILDS", "GUILD_MESSAGES"]
    }
});


client.on("ready", () => console.log("Ready As", client.user.tag));


// an error handler
client.on("error", (error) => {
    console.error("Something Went Wrong", error);
});

// New Guild Joined
// https://oceanic.owo-whats-this.dev/interfaces/types_client.ClientEvents.html#guildCreate
bot.on("guildCreate", (guild) => { 
    console.log("Guild Joined:", guild.name);
});

// Message Sent
// https://oceanic.owo-whats-this.dev/interfaces/types_client.ClientEvents.html#messageCreate
bot.on("messageCreate", (msg) => {
    console.log(`New message: ${msg.cleanContent}`);
});

// This event will never be seen as neither `GUILD_MESSAGE_TYPING` or `DIRECT_MESSAGE_TYPING` were included in the intents
// https://oceanic.owo-whats-this.dev/interfaces/types_client.ClientEvents.html#typingStart
bot.on("typingStart", (channel, user) => { // When a user starts typing
    console.log(`${user.username} is typing in ${channel.name}`);
});

// connect to Discord
client.connect();
