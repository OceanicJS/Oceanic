// The application command management functions are on ClientApplication (client.application) & client.rest.applications
// https://docs.oceanic.ws/latest/classes/ClientApplication.html
// https://docs.oceanic.ws/latest/classes/REST_Applications.html
const { ApplicationCommandTypes, ApplicationIntegrationTypes, Client, InteractionContextTypes } = require("oceanic.js");

// This example is a slightly modified copy of the applicationCommand example

const client = new Client({
    token: "[TOKEN]",
    gateway: {
        intents: 0 // No intents are needed if you are only using interactions
    }
});

client.on("ready", async() => {
    console.log("Ready as", client.user.tag);

    // https://docs.oceanic.ws/classes/ClientApplication.html#createGlobalCommand
    // Create a single command
    await client.application.createGlobalCommand({
        type: ApplicationCommandTypes.CHAT_INPUT, // CHAT_INPUT = slash commands - full list: https://docs.oceanic.ws/latest/enums/Constants.ApplicationCommandTypes.html
        name: "global-command",
        description: "A global command.",
        // in which install types this command will be usable, defaults to only GUILD_INSTALL
        // https://docs.oceanic.ws/latest/enums/Constants.ApplicationIntegrationTypes.html
        integrationTypes: [ApplicationIntegrationTypes.USER_INSTALL],
        // in which contexts this command will be usable, defaults to all
        // https://docs.oceanic.ws/latest/enums/Constants.InteractionContextTypes.html
        contexts: [InteractionContextTypes.BOT_DM, InteractionContextTypes.PRIVATE_CHANNEL]
    });

    // https://docs.oceanic.ws/latest/classes/ClientApplication.html#bulkEditGlobalCommands
    // Instead of deleting individual commands or creating commands one at a time, you can create them in bulk.
    await client.application.bulkEditGlobalCommands([
        {
            type: ApplicationCommandTypes.USER, // This will display in the `Apps` context menu, when clicking on a user.
            // These commands do not have options, and cannot have a description. They will have a `target` property when received
            name: "User Info",
            nameLocalizations: {
                "es-ES": "Información del usuario"
            },
            // Same as above
            integrationTypes: [ApplicationIntegrationTypes.USER_INSTALL],
            contexts: [InteractionContextTypes.BOT_DM, InteractionContextTypes.PRIVATE_CHANNEL]
        },
        {
            type: ApplicationCommandTypes.MESSAGE, // This will display in the `Apps` context menu, when clicking on a message.
            // Same as above
            name: "Raw Json",
            nameLocalizations: {
                "es-ES": "json crudo"
            },
            // Same as above
            integrationTypes: [ApplicationIntegrationTypes.USER_INSTALL],
            contexts: [InteractionContextTypes.BOT_DM, InteractionContextTypes.PRIVATE_CHANNEL]
        }
    ]);

    // https://docs.oceanic.ws/latest/classes/ClientApplication.html#getGlobalCommands
    // if you need to fetch your commands
    const commands = await client.application.getGlobalCommands();
    console.log(commands); // An array of ApplicationCommand classes

    for (const command of commands) {
        // https://docs.oceanic.ws/latest/classes/ApplicationCommand.html#delete
        await command.delete(); // DON'T DO THIS! This is just an example. Use `bulkEdit` with an empty array if you want to delete all commands
    }
});

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// Connect to Discord
client.connect();
