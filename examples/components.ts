import { ButtonStyles, Client, ComponentTypes } from "../lib";

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: ["GUILD_MESSAGES"] // If the message does not start with a mention to or somehow relate to your client, you will need the MESSAGE_CONTENT intent as well
    }
});

client.on("messageCreate", (msg) => {
    if(msg.content.includes("!button")) {
        client.rest.channels.createMessage(msg.channel.id, {
            content: `Here's some buttons for you, ${msg.author.mention}.`,
            components: [
                {
                    // the top level component must always be an action row.
                    // Full list of types: https://oceanic.owo-whats-this.dev/enums/Constants.ComponentTypes.html
                    type: ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.PRIMARY, // the style of button - full list: https://oceanic.owo-whats-this.dev/enums/Constants.ButtonStyles.html
                            customID: "some-string-you-will-see-later",
                            label: "Click!",
                            disabled: false // If the button is disabled, false by default.
                        }
                    ]
                }
            ]
        });
    }
});
