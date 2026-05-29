const { readFileSync } = require("fs");
const { ApplicationCommandTypes, ButtonStyles, Client, ComponentTypes, InteractionTypes, MessageFlags, SeparatorSpacingSize } = require("oceanic.js");

const client = new Client({
    token: "[TOKEN]",
    gateway: {
        intents: [] // interactions need no intents
    }
});

const GUILD_ID = "";
client.on("ready", async() => {
    console.log("Ready as", client.user.tag);

    await client.application.bulkEditGuildCommands(GUILD_ID, [
        {
            type: ApplicationCommandTypes.CHAT_INPUT,
            name: "test",
            description: "Test"
        }
    ]);
});

// See the components example for a further explanation of action row, button, and select components

// All usages of Components V2 require the IS_COMPONENTS_V2 flag
// When using Components V2 you cannot use content or embeds
client.on("interactionCreate", async interaction => {
    if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
        if (interaction.data.name === "test") {
            return interaction.createMessage({
                flags: MessageFlags.IS_COMPONENTS_V2,
                components: [
                    {
                        type: ComponentTypes.ACTION_ROW,
                        components: [
                            {
                                type: ComponentTypes.BUTTON,
                                style: ButtonStyles.PRIMARY,
                                label: "Button",
                                customID: "button"
                            }
                        ]
                    },
                    {
                        type: ComponentTypes.ACTION_ROW,
                        components: [
                            {
                                type: ComponentTypes.STRING_SELECT,
                                options: [
                                    {
                                        label: "Option 1",
                                        value: "1"
                                    },
                                    {
                                        label: "Option 2",
                                        value: "2"
                                    }
                                ],
                                customID: "select"
                            }
                        ]
                    },
                    {
                        type: ComponentTypes.CONTAINER,
                        components: [
                            {
                                type: ComponentTypes.ACTION_ROW,
                                components: [
                                    {
                                        type: ComponentTypes.BUTTON,
                                        style: ButtonStyles.PRIMARY,
                                        label: "Button",
                                        customID: "container_button"
                                    }
                                ]
                            },
                            {
                                type: ComponentTypes.ACTION_ROW,
                                components: [
                                    {
                                        type: ComponentTypes.STRING_SELECT,
                                        options: [
                                            {
                                                label: "Option 1",
                                                value: "1"
                                            },
                                            {
                                                label: "Option 2",
                                                value: "2"
                                            }
                                        ],
                                        customID: "container_select"
                                    }
                                ]
                            },
                            {
                                type: ComponentTypes.MEDIA_GALLERY,
                                items: [
                                    {
                                        description: "Oceanic Icon",
                                        media: {
                                            url: "attachment://image.png"
                                        },
                                    },
                                    {
                                        description: "Donovan_DMC's Icon",
                                        media: {
                                            url: "https://i.furry.cool/DonPride.png"
                                        },
                                    }
                                ]
                            },
                            {
                                type: ComponentTypes.TEXT_DISPLAY,
                                content: "Small separator with divider below"
                            },
                            {
                                type: ComponentTypes.SEPARATOR,
                                // determines the spacing between the separator and the next content, large is roughly double small
                                spacing: SeparatorSpacingSize.SMALL,
                                divider: true
                            },
                            {
                                type: ComponentTypes.SECTION,
                                accessory: {
                                    type: ComponentTypes.THUMBNAIL,
                                    media: {
                                        url: "attachment://image.png"
                                    }
                                },
                                components: [
                                    {
                                        type: ComponentTypes.TEXT_DISPLAY,
                                        content: "Section Text"
                                    }
                                ]
                            },
                            {
                                type: ComponentTypes.SEPARATOR,
                                spacing: SeparatorSpacingSize.LARGE,
                                divider: false
                            },
                            {
                                type: ComponentTypes.SECTION,
                                accessory: {
                                    type: ComponentTypes.THUMBNAIL,
                                    media: {
                                        url: "https://i.oceanic.ws/icon.png"
                                    }
                                },
                                components: [
                                    {
                                        type: ComponentTypes.TEXT_DISPLAY,
                                        content: "Large separator with no divider above"
                                    }
                                ]
                            },
                            {
                                type: ComponentTypes.SECTION,
                                accessory: {
                                    type: ComponentTypes.BUTTON,
                                    style: ButtonStyles.PRIMARY,
                                    label: "Button",
                                    customID: "container_section_button"
                                },
                                components: [
                                    {
                                        type: ComponentTypes.TEXT_DISPLAY,
                                        content: "Even More Section Text"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: ComponentTypes.FILE,
                        file: {
                            // this cannot be an external url, it must be an attachment
                            url: "attachment://file.txt"
                        }
                    },
                    {
                        type: ComponentTypes.MEDIA_GALLERY,
                        items: [
                            {
                                description: "Donovan Coffee",
                                media: {
                                    url: "https://i.furry.cool/DonCoffee.png"
                                },
                            }
                        ]
                    }
                ],
                files: [
                    {
                        name: "image.png",
                        contents: readFileSync(`${__dirname}/image.png`)
                    },
                    {
                        name: "file.txt",
                        contents: Buffer.from("Text File")
                    }
                ]
            });
        }
    }
});

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// Connect to Discord
client.connect();
