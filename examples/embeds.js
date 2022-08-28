const { Client } = require("oceanic.js");
const fs = require("fs");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: ["GUILD_MESSAGES"] // If the message does not start with a mention to or somehow relate to your client, you will need the MESSAGE_CONTENT intent as well
    }
});


client.on("ready", () => console.log("Ready As", client.user.tag));

client.on("messageCreate", async(msg) => {
    if(msg.content.includes("!embed")) {
		// up to 10 in one message
		await client.rest.channels.createMessage(msg.channel.id, {
			// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedOptions.html
			embeds: [
				{
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedAuthorOptions.html
					author: {
						name: "Author Name",
						// an image url, or attachment://filename.ext
						icon_url: "https://i.furry.cool/DonPride.png", // optional
						url: "https://oceanic.owo-whats-this.dev" // optional
					},
					// array of https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedField.html
					fields: [
						{
							name: "Field One",
							value: "Field One Value",
							inline: true // if this field should be displayed inline (default: true)
						},
						{
							name: "Field Two",
							value: "Field Two Value",
							inline: false
						}
					],
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedFooterOptions.html
					footer: {
						text: "Footer Text",
						// an image url, or attachment://filename.ext
						icon_url: "https://i.furry.cool/DonPride.png" // optional
					},
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedImageOptions.html
					image: {
						// an image url, or attachment://filename.ext
						url: "https://i.furry.cool/DonPride.png"
					},
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedThumbnailOptions.html
					thumbnail: {
						// an image url, or attachment://filename.ext
						url: "https://i.furry.cool/DonPride.png"
					},
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedOptions.html
					color: 0xFFA500, // base-10 color (0x prefix can be used for hex codes)
					description: "My Cool Embed",
					timestamp: new Date().toISOString(), // the current time - ISO 8601 format
					title: "My Amazing Embed",
					url: "https://oceanic.owo-whats-this.dev"
				}
			]
		});
    } else if(msg.content.includes("!file")) {
		await client.rest.channels.createMessage(msg.channel.id, {
			embeds: [
				{
					image: {
						// this can also be used for author & footer images
						url: "attachment://image.png"
					}
				}
			],
			files: [
				{
					name: "image.png",
					contents: fs.readFileSync(`${__dirname}/image.png`)
				}
			]
		});
	}
});

// an error handler
client.on("error", (error) => {
    console.error("Something Went Wrong", error);
});

// connect to Discord
client.connect();
