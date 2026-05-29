const { Client, DefaultDispatchEvents } = require("oceanic.js");

const client = new Client({
    token: "[TOKEN]",
    gateway: {
        dispatcher: {
            // A list of dispatch events to disable. This takes precedence over whitelist.
            // Disable the "TYPING_START" dispatch event (which emits the "typingStart" client event)
            blacklist: ["TYPING_START"],
            // A list of the ONLY dispatch events to enable. This is ignored if blacklist is set.
            // READY & RESUMED should always be enabled or have a replacement set up as they are required for core functionality,
            // I'd recommend just disabling what you don't need with the blacklist option.
            // Enable some basic events as well as MESSAGE_CREATE
            whitelist: ["READY", "RESUMED", "GUILD_CREATE", "GUILD_MEMBERS_CHUNK", "MESSAGE_CREATE"]
        }
    }
});

client.on("ready", () => console.log("Ready as", client.user.tag));

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// Since we disabled this, we will never get this event
client.on("typingStart", (channel, user) => {
    console.log("How did we get one of these?");
});

// you can manually register handlers (the data parameter is the raw packet `d` from discord)
// you can provide true as the third parameter to replace any existing handlers
client.shards.dispatcher.register("MESSAGE_CREATE", (data, shard) => {
    console.log("New message on shard #%d:", shard.id, data);
});

// you can also manually unregister handlers, we provide an object of all defaults for convinence
// if no function is provided, all handlers for that event are removed
client.shards.dispatcher.unregister("MESSAGE_CREATE", DefaultDispatchEvents.MESSAGE_CREATE);

// Connect to Discord
client.connect();

// You can see all of the dispatch events and what client events they emit in the source code on github
// https://github.com/OceanicJS/Oceanic/blob/dev/lib/gateway/events.ts
