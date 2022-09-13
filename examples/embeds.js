const { Client } = require("oceanic.js");
const fs = require("fs");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: ["GUILD_MESSAGES"] // If the message does not start with a mention to or somehow relate to your client, you will need the MESSAGE_CONTENT intent as well
    }
});

client.on("ready", () => console.log("Ready as", client.user.tag));

client.on("messageCreate", async (msg) => {
    if(msg.content.includes("!embed")) {
		await client.rest.channels.createMessage(msg.channel.id, {
			// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedOptions.html
			// Up to 10 in one message
			embeds: [
				{
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedAuthorOptions.html
					author: {
						name: "Author Name",
						// An image url, or attachment://filename.ext
						iconURL: "https://i.furry.cool/DonPride.png", // Optional
						url: "https://oceanic.owo-whats-this.dev" // Optional
					},
					// Array of https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedField.html
					// Up to 25 in one message
					fields: [
						{
							name: "Field One",
							value: "Field One Value",
							inline: true // If this field should be displayed inline (default: to false)
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
						// An image url, or attachment://filename.ext
						iconURL: "https://i.furry.cool/DonPride.png" // Optional
					},
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedImageOptions.html
					image: {
						// An image url, or attachment://filename.ext
						url: "https://i.furry.cool/DonPride.png"
					},
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedThumbnailOptions.html
					thumbnail: {
						// An image url, or attachment://filename.ext
						url: "https://i.furry.cool/DonPride.png"
					},
					// https://oceanic.owo-whats-this.dev/interfaces/types_channels.EmbedOptions.html
					color: 0xFFA500, // Base-10 color (0x prefix can be used for hex codes)
					description: "My Cool Embed",
					timestamp: new Date().toISOString(), // The current time - ISO 8601 format
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
						// This can also be used for author & footer images
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

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// Connect to Discord
client.connect();
