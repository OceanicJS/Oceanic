const { ButtonStyles, Client, ComponentTypes } = require("oceanic.js");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: ["GUILD_MESSAGES"] // If the message does not start with a mention to or somehow relate to your client, you will need the MESSAGE_CONTENT intent as well
    }
});

client.on("ready", () => console.log("Ready as", client.user.tag));

client.on("messageCreate", async(msg) => {
    if(msg.content.includes("!component")) {
        await client.rest.channels.createMessage(msg.channel.id, {
            content: `Here's some buttons for you, ${msg.author.mention}.`,
            components: [
                {
                    // the top level component must always be an action row.
                    // Full list of types: https://oceanic.owo-whats-this.dev/enums/Constants.ComponentTypes.html
                    // https://oceanic.owo-whats-this.dev/interfaces/types_channels.MessageActionRow.html
                    type: ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            // https://oceanic.owo-whats-this.dev/interfaces/types_channels.TextButton.html
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.PRIMARY, // the style of button - full list: https://oceanic.owo-whats-this.dev/enums/Constants.ButtonStyles.html
                            customID: "some-string-you-will-see-later",
                            label: "Click!",
                            disabled: false, // If the button is disabled, false by default.
                            emoji: { // an optional emoji
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
                            // https://oceanic.owo-whats-this.dev/interfaces/types_channels.URLButton.html
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.LINK,
                            label: "Open Link",
                            url: "https://oceanic.owo-whats-this.dev"
                        },
                        {
                            // https://oceanic.owo-whats-this.dev/interfaces/types_channels.SelectMenu.html
                            type: ComponentTypes.SELECT_MENU,
                            customID: "select-menu",
                            disabled: false,
                            maxValues: 1, // the maximum number of values that can be selected (default 1)
                            minValues: 1, // the minimum number of values that can be selected (default 1)
                            options: [
                                // https://oceanic.owo-whats-this.dev/interfaces/types_channels.SelectOption.html
                                {
                                    default: true, // if this option is selected by default
                                    description: "The description of the option", // optional description
                                    emoji: { // an optional emoji
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

// an error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// connect to Discord
client.connect();
