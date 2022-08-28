const { ApplicationCommandOptionTypes, ApplicationCommandTypes, Client } =  require("oceanic.js");

const client = new Client({
	auth: "Bot [TOKEN]",
	gateway: {
		intents: 0 // No intents are needed if you are only using interactions
	}
});

client.on("ready", async() => {
	console.log("Ready as", client.user.id);

	// Create a single command
	await client.application.createGlobalCommand({
		type: ApplicationCommandTypes.CHAT_INPUT, // CHAT_INPUT = slash commands
		name: "global-command",
		description: "A global command.",
		options: [
			{
				type: ApplicationCommandOptionTypes.STRING,
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
						}
					},
					{
						name: "No",
						nameLocalizations: {
							"es-ES": "No"
						}
					}
				]
			}
		],
		dmPermission: false, // false = usable in guilds only, true = both guild & direct message
		defaultMemberPermissions: "8" // The default permissions required to use this command (8 = Administrator)
	});

	// Instead of deleting individual commands or creating commands one at a time, you can create them in bulk.
	await client.application.bulkEditGlobalCommands([
		{
			type: ApplicationCommandTypes.USER, // This will display in the `Apps` context menu, when clicking on a user.
			// These commands do not have options, and cannot have a description. They will have a `target` property when recieved
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

	// if you need to fetch your commands
	const commands = await client.application.getGlobalCommands();
	console.log(commands); // an array of ApplicationCommand classes

	for(const command of commands) {
		await command.delete(); // DON'T DO THIS! This is just an example. Use `bulkedit` with an empty array if you want to delete all commands.
	}

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
