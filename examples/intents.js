const { Client } = require("oceanic.js");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
		// List of intents: https://discord.com/developers/docs/topics/gateway#list-of-intents
		// They change what events our client receives to lower the amount of computer power needed to run it
        // Most events also list if they require an intent: https://docs.oceanic.ws/latest/interfaces/Events.ClientEvents.html
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
// https://docs.oceanic.ws/latest/interfaces/Events.ClientEvents.html#guildCreate
client.on("guildCreate", (guild) => {
    console.log("Guild Joined:", guild.name);
});

// Message Sent
// https://docs.oceanic.ws/latest/interfaces/Events.ClientEvents.html#messageCreate
client.on("messageCreate", (msg) => {
    console.log(`New message: ${msg.content}`);
});

// This event will never be seen as neither `GUILD_MESSAGE_TYPING` or `DIRECT_MESSAGE_TYPING` were included in the intents
// https://docs.oceanic.ws/latest/interfaces/Events.ClientEvents.html#typingStart
client.on("typingStart", (channel, user) => { // When a user starts typing
    console.log(`${user.id} is typing in ${channel.id}`); // User or channel are not necessarily complete (Uncached) to retrieve names
});

// Connect to Discord
client.connect();
