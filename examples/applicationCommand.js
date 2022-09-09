// the application command management functions are on ClientApplication (client.application) & client.rest.applicationCommands
// https://oceanic.owo-whats-this.dev/classes/structures_ClientApplication.ClientApplication.html
// https://oceanic.owo-whats-this.dev/classes/routes_ApplicationCommands.ApplicationCommands.html
const { ApplicationCommandOptionTypes, ApplicationCommandTypes, Client } = require("oceanic.js");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: 0 // No intents are needed if you are only using interactions
    }
});

client.on("ready", async() => {
    console.log("Ready as ", client.user.tag);

    // https://oceanic.owo-whats-this.dev/classes/structures_ClientApplication.ClientApplication.html#createGlobalCommand
    // Create a single command
    await client.application.createGlobalCommand({
        type: ApplicationCommandTypes.CHAT_INPUT, // CHAT_INPUT = slash commands - full list: https://oceanic.owo-whats-this.dev/enums/Constants.ApplicationCommandTypes.html
        name: "global-command",
        description: "A global command.",
        options: [
            {
                type: ApplicationCommandOptionTypes.STRING, // A string input - full list: https://oceanic.owo-whats-this.dev/enums/Constants.ApplicationCommandOptionTypes.html
                name: "suspicious",
                nameLocalizations: { // (optional) a dictionary of locales to localized names (see: https://discord.com/developers/docs/reference#locales)
                    "es-ES": "sospechoso"
                },
                description: "Are you sus?",
                descriptionLocalizations: { // same as above
                    "es-ES": "¿Eres sus?"
                },
                choices: [ // a BOOLEAN can also be used instead
                    {
                        name: "Yes",
                        nameLocalizations: {
                            "es-ES": "Sí"
                        },
                        value: "yes"
                    },
                    {
                        name: "No",
                        nameLocalizations: {
                            "es-ES": "No"
                        },
                        value: "no"
                    }
                ]
            }
        ],
        dmPermission: false, // false = usable in guilds only, true = both guild & direct message
        defaultMemberPermissions: "8" // The default permissions required to use this command (8 = Administrator)
    });

    // https://oceanic.owo-whats-this.dev/classes/structures_ClientApplication.ClientApplication.html#bulkEditGlobalCommands
    // Instead of deleting individual commands or creating commands one at a time, you can create them in bulk.
    await client.application.bulkEditGlobalCommands([
        {
            type: ApplicationCommandTypes.USER, // This will display in the `Apps` context menu, when clicking on a user.
            // These commands do not have options, and cannot have a description. They will have a `target` property when received
            name: "User Info",
            nameLocalizations: {
                "es-ES": "Información del usuario"
            }
        },
        {
            type: ApplicationCommandTypes.MESSAGE, // This will display in the `Apps` context menu, when clicking on a message.
            // same as above
            name: "Raw Json",
            nameLocalizations: {
                "es-ES": "json crudo"
            }
        }
    ]);

    // https://oceanic.owo-whats-this.dev/classes/structures_ClientApplication.ClientApplication.html#getGlobalCommands
    // if you need to fetch your commands
    const commands = await client.application.getGlobalCommands();
    console.log(commands); // an array of ApplicationCommand classes

    for(const command of commands) {
        // https://oceanic.owo-whats-this.dev/classes/structures_ApplicationCommand.ApplicationCommand.html#delete
        await command.delete(); // DON'T DO THIS! This is just an example. Use `bulkedit` with an empty array if you want to delete all commands.
    }

    // https://oceanic.owo-whats-this.dev/classes/structures_ClientApplication.ClientApplication.html#createGuildCommand
    // guilds commands are exactly the same thing, but with a guild id included.
    await client.application.createGuildCommand("1005489770278953112", {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: "guild-command",
        nameLocalizations: {
            "es-ES": "comando-del-gremio"
        },
        description: "A guild command.",
        descriptionLocalizations: {
            "es-ES": "Un comando del gremio."
        }
    });
});

// an error handler
client.on("error", (error) => {
    console.error("Something went wrong: ", error);
});

// connect to Discord
client.connect();
