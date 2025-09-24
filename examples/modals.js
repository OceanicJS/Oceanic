const { Client, ComponentTypes, ApplicationCommandTypes, InteractionTypes, ChannelTypes } = require("oceanic.js");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: [] // modals need no intents
    }
});

const GUILD_ID = "";
client.on("ready", async () => {
    console.log("Ready as", client.user.tag);

    await client.application.bulkEditGuildCommands(GUILD_ID, [
        {
            type: ApplicationCommandTypes.CHAT_INPUT,
            name: "test",
            description: "Test"
        }
    ]);
});

client.on("interactionCreate", async (interaction) => {
    switch (interaction.type) {
        // https://docs.oceanic.ws/latest/classes/CommandInteraction.html
        case InteractionTypes.APPLICATION_COMMAND: {
            if (interaction.data.name === "test") {
                // Modals are an initial response, so we cannot defer before creating one
                await interaction.createModal({
                    customID: "modal",
                    title: "Example Modal",
                    components: [
                        {
                            // Only labels and text displays can be used as top-level modal components.
                            // Full list of types: https://docs.oceanic.ws/latest/enums/Constants.ComponentTypes.html
                            // https://docs.oceanic.ws/latest/interfaces/Types_Channels.ModalLabel.html
                            type: ComponentTypes.LABEL,
                            label: "Label 1",
                            description: "Label description",
                            component: {
                                // https://docs.oceanic.ws/latest/interfaces/Types_Channels.SelectMenu.html
                                type: ComponentTypes.STRING_SELECT,
                                customID: "string-select",
                                required: true,
                                maxValues: 1, // The maximum number of values that can be selected (default 1)
                                minValues: 1, // The minimum number of values that can be selected (default 1)
                                options: [
                                    // https://docs.oceanic.ws/latest/interfaces/Types_Channels.SelectOption.html
                                    {
                                        default: true, // If this option is selected by default
                                        description: "The description of the option", // Optional description
                                        emoji: { // An optional emoji
                                            id: "1013346070606123009",
                                            name: "oceanic"
                                        },
                                        label: "Option One",
                                        value: "value-1"
                                    },
                                    {
                                        label: "Option Two",
                                        value: "option-2"
                                    }
                                ],
                                placeholder: "Some Placeholder Text"
                            }
                        },
                        {
                            // https://docs.oceanic.ws/latest/interfaces/Types_Channels.TextDisplayComponent.html
                            type: ComponentTypes.TEXT_DISPLAY,
                            content: "Example Text Display"
                        },
                        {
                            // https://docs.oceanic.ws/latest/interfaces/Types_Channels.ModalLabel.html
                            type: ComponentTypes.LABEL,
                            label: "Label 2",
                            description: "Another label description",
                            component: {
                                // https://docs.oceanic.ws/latest/interfaces/Types_Channels.SelectMenu.html
                                type: ComponentTypes.CHANNEL_SELECT,
                                channelTypes: [ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_VOICE], // The types of channels that can be selected
                                customID: "channel-select",
                                required: false,
                                maxValues: 1, // The maximum number of values that can be selected (default 1)
                                minValues: 1, // The minimum number of values that can be selected (default 1)
                                placeholder: "Some Placeholder Text"
                            }
                        }
                    ]
                });
            }
            break;
        }

        // https://docs.oceanic.ws/latest/classes/ModalSubmitInteraction.html
        case InteractionTypes.MODAL_SUBMIT: {
            // this will correspond with the customID you provided when creating the modal
            switch(interaction.data.customID) {
                case "test-modal": {
                    // the `components` property under data contains all the components that were submitted
                    // https://docs.oceanic.ws/latest/interfaces/Types_Channels.ModalComponent.html
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
