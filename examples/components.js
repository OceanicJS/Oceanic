const { ButtonStyles, Client, ComponentTypes } = require("oceanic.js");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: ["GUILD_MESSAGES"] // If the message does not start with a mention to or somehow relate to your client, you will need the MESSAGE_CONTENT intent as well
    }
});

client.on("ready", () => console.log("Ready as", client.user.tag));

client.on("messageCreate", async (msg) => {
    if(msg.content.includes("!component")) {
        await client.rest.channels.createMessage(msg.channel.id, {
            content: `Here's some buttons for you, ${msg.author.mention}.`,
            components: [
                {
                    // The top level component must always be an action row.
                    // Full list of types: https://docs.oceanic.ws/latest/enums/Constants.ComponentTypes.html
                    // https://docs.oceanic.ws/latest/interfaces/Types_Channels.MessageActionRow.html
                    type: ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            // https://docs.oceanic.ws/latest/interfaces/Types_Channels.TextButton.html
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.PRIMARY, // The style of button - full list: https://docs.oceanic.ws/latest/enums/Constants.ButtonStyles.html
                            customID: "some-string-you-will-see-later",
                            label: "Click!",
                            disabled: false, // If the button is disabled, false by default.
                            emoji: { // An optional emoji
                                id: "1013346070606123009",
                                name: "oceanic"
                            }
                        },
                        {
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.PRIMARY,
                            customID: "some-other-string",
                            label: "This Is Disabled",
                            disabled: true
                        },
                        {
                            // https://docs.oceanic.ws/latest/interfaces/Types_Channels.URLButton.html
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.LINK,
                            label: "Open Link",
                            url: "https://docs.oceanic.ws"
                        },
                        {
                            // https://docs.oceanic.ws/latest/interfaces/Types_Channels.SelectMenu.html
                            type: ComponentTypes.SELECT_MENU,
                            customID: "select-menu",
                            disabled: false,
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
                    ]
                }
            ]
        });
    }
});

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// Connect to Discord
client.connect();
