const { Client, InteractionTypes, MessageFlags, ComponentTypes, ApplicationCommandTypes } = require("oceanic.js");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: 0 // No intents are needed if you are only using interactions
    }
});


client.on("ready", async() => {
    console.log("Ready as", client.user.tag);
});

client.on("interactionCreate", async(interaction) => {
    switch(interaction.type) {
        // https://docs.oceanic.ws/latest/classes/CommandInteraction.CommandInteraction.html
        case InteractionTypes.APPLICATION_COMMAND: {
            // defer interactions as soon as possible, you have three seconds to send any initial response
            // if you wait too long, the interaction may be invalidated
            await interaction.defer();
            // If you want the response to be ephemeral, you can provide the flag to the defer function, like so:
            // await interaction.defer(MessageFlags.EPHEMERAL);

            // data = https://docs.oceanic.ws/latest/interfaces/Types_Interactions.ApplicationCommandInteractionData.html
            switch(interaction.data.type) {
                // Chat Input commands are what you use in the chat, i.e. slash commands
                case ApplicationCommandTypes.CHAT_INPUT: {
                    if(interaction.data.name === "greet") {
                        // assume we have two options, user (called user) then string (called greeting) - first is required, second is not

                        // Get an option named `user` with the type USER - https://docs.oceanic.ws/dev/classes/InteractionOptionsWrapper.InteractionOptionsWrapper.html#getUser
                        // Setting the second parameter to true will throw an error if the option is not present
                        const user = interaction.data.options.getUser("user", true);
                        const greeting = interaction.data.options.getString("greeting", false) || "Hello, ";

                        // since we've already deferred the interaction, we cannot use createMessage (this is an initial response)
                        // we can only have one initial response, so we use createFollowup
                        await interaction.createFollowup({
                            content: `${greeting} ${user.mention}!`,
                            allowedMentions: {
                                users: [user.id]
                            }
                        });
                    }

                // Chat Input application command interactions also have a set of resolved data, which is structured as so:
                // https://docs.oceanic.ws/latest/interfaces/Types_Interactions.ApplicationCommandInteractionResolvedData.html
                // the options wrapper pulls values out of resolved automatically, if you use the right method
                    break;
                }

                // User application commands are shown in the context menu when right-clicking on users
                // `data` will have a target (and targetID) property with the user that the command was executed on
                // These don't have options
                case ApplicationCommandTypes.USER: {
                    if(interaction.data.name === "ping") {
                        await interaction.createFollowup({
                            content: `Pong! ${interaction.data.target.mention}`,
                            allowedMentions: {
                                users: [interaction.data.target.id]
                            }
                        });
                    }
                    break;
                }

                // Message application commands are shown in the context menu when right-clicking on messages
                // `data` will have a target (and targetID) property with the message that the command was executed on
                // Same as user commands, these don't have options
                case ApplicationCommandTypes.MESSAGE: {
                    if(interaction.data.name === "author") {
                        await interaction.createFollowup({
                            content: `${interaction.data.target.author.mention} is the author of that message!`,
                            allowedMentions: {
                                users: [interaction.data.target.author.id]
                            }
                        });
                    }
                    break;
                }
            }
            break;
        }

        // https://docs.oceanic.ws/latest/classes/ComponentInteraction.ComponentInteraction.html
        case InteractionTypes.MESSAGE_COMPONENT: {
            // same spiel as above
            await interaction.defer();
            // when you create a message with components, this will correspond with what you provided as the customID there
            if(interaction.data.componentType === ComponentTypes.BUTTON) {
                if(interaction.data.customID === "edit-message") {
                    // Edits the original message. This has an initial response variant: editParent
                    await interaction.editOriginal({
                        content: `This message was edited by ${interaction.user.mention}!`,
                        allowedMentions: {
                            users: [interaction.user.id]
                        }
                    });
                } else if(interaction.data.customID === "my-amazing-button") {
                    await interaction.createFollowup({
                        content: "You clicked an amazing button!"
                    });
                }
            } else if(interaction.data.componentType === ComponentTypes.SELECT_MENU) {
                // The `values` property under data contains all the selected values
                await interaction.createFollowup({
                    content: `You selected: **${interaction.data.values.join("**, **")}**`
                });
            }
            break;
        }

        // https://docs.oceanic.ws/latest/classes/AutocompleteInteraction.AutocompleteInteraction.html
        case InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE: {
            // Autocomplete Interactions cannot be deferred
            switch(interaction.data.name) {
                case "test-autocomplete": {
                    // Autocomplete interactions data has a partial `options` property, which is the tree of options that are currently being filled in
                    // along with one at the end, which will have focused
                    // Setting the first parameter to true will throw an error if no focused option is present
                    const option = interaction.data.options.getFocused(true);
                    switch(option.name) {
                        case "test-option": {
                            return interaction.result([
                                {
                                    name: "Choice 1",
                                    nameLocalizations: {
                                        "es-ES": "Opción 1"
                                    },
                                    value: "choice-1"
                                },
                                {
                                    name: "Choice 2",
                                    nameLocalizations: {
                                        "es-ES": "Opción 2"
                                    },
                                    value: "choice-2"
                                }
                            ]);
                        }
                    }
                }
            }
            break;
        }

        // https://docs.oceanic.ws/latest/classes/ModalSubmitInteraction.ModalSubmitInteraction.html
        case InteractionTypes.MODAL_SUBMIT: {
            // this will correspond with the customID you provided when creating the modal
            switch(interaction.data.customID) {
                case "test-modal": {
                    // the `components` property under data contains all the components that were submitted
                    // https://docs.oceanic.ws/latest/interfaces/Types_Channels.ModalActionRow.html
                    console.log(interaction.data.components);
                    break;
                }
            }
            break;
        }
    }
});

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// Connect to Discord
client.connect();
