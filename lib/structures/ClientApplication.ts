import Base from "./Base";
import ApplicationCommand from "./ApplicationCommand";
import type Client from "../Client";
import type { RawClientApplication } from "../types/oauth";
import { ApplicationCommandTypes } from "../Constants";
import type { AnyApplicationCommand, CreateApplicationCommandOptions, EditApplicationCommandOptions, EditApplicationCommandPermissionsOptions } from "../types/application-commands";
import { ApplicationCommandPermission, GuildApplicationCommandPermissions } from "../types/application-commands";

/** A representation of the authorized client's application (typically recieved via gateway). */
export default class ClientApplication extends Base {
	/** This application's [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
	flags: number;
	/** @hideconstructor */
	constructor(data: RawClientApplication, client: Client) {
		super(data.id, client);
		this.update(data);
	}

	protected update(data: RawClientApplication): void {
		this.flags = data.flags;
	}

	/**
	 * Overwrite all existing global application commands.
	 *
	 * @param {Object[]} options
	 * @param {String?} [options[].defaultMemberPermissions] - The default member permissions for the command.
	 * @param {String} [options[].description] - The description of the command. `CHAT_INPUT only.
	 * @param {String?} [options[].descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT only.
	 * @param {Boolean?} [options[].dmPermission] - If the command can be used in a DM.
	 * @param {String} options[].name - The name of the command.
	 * @param {Object?} [options[].nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
	 * @param {Object[]} [options[].options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT only.
	 * @param {ApplicationCommandTypes} options.type - The type of the command.
	 * @returns {Promise<ApplicationCommand[]>}
	 */
	async bulkEditGlobalCommands(options: Array<CreateApplicationCommandOptions>) {
		return this._client.rest.applicationCommands.bulkEditGlobalCommands(this.id, options);
	}

	/**
	 * Overwrite all existing application commands in a guild.
	 *
	 * @param {String} applicationID - The id of the application.
	 * @param {String} guildID - The id of the guild.
	 * @param {Object[]} options
	 * @param {String?} [options[].defaultMemberPermissions] - The default member permissions for the command.
	 * @param {String} [options[].description] - The description of the command. `CHAT_INPUT only.
	 * @param {String?} [options[].descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT only.
	 * @param {Boolean?} [options[].dmPermission] - If the command can be used in a DM.
	 * @param {String} options[].name - The name of the command.
	 * @param {Object?} [options[].nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
	 * @param {Object[]} [options[].options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT only.
	 * @param {ApplicationCommandTypes} options.type - The type of the command.
	 * @returns {Promise<ApplicationCommand[]>}
	 */
	async bulkEditGuildCommands(guildID: string, options: Array<Omit<CreateApplicationCommandOptions, "dmPermission">>) {
		return this._client.rest.applicationCommands.bulkEditGuildCommands(this.id, guildID, options);
	}

	/**
	 * Create a global application command.
	 *
	 * @param {Object} options
	 * @param {String?} [options.defaultMemberPermissions] - The default member permissions for the command.
	 * @param {String} [options.description] - The description of the command. `CHAT_INPUT only.
	 * @param {String?} [options.descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT only.
	 * @param {Boolean?} [options.dmPermission] - If the command can be used in a DM.
	 * @param {String} options.name - The name of the command.
	 * @param {Object?} [options.nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
	 * @param {Object[]} [options.options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT only.
	 * @param {ApplicationCommandTypes} options.type - The type of the command.
	 * @returns {Promise<ApplicationCommand>}
	 */
	async createGlobalCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(options: T) {
		return this._client.rest.applicationCommands.createGlobalCommand<T>(this.id, options);
	}

	/**
	 * Create a guild application command.
	 *
	 * @param {String} guildID - The id of the guild.
	 * @param {Object} options
	 * @param {String?} [options.defaultMemberPermissions] - The default member permissions for the command.
	 * @param {String} [options.description] - The description of the command. `CHAT_INPUT only.
	 * @param {String?} [options.descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT only.
	 * @param {Boolean?} [options.dmPermission] - If the command can be used in a DM.
	 * @param {String} options.name - The name of the command.
	 * @param {Object?} [options.nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
	 * @param {Object[]} [options.options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT only.
	 * @param {ApplicationCommandTypes} options.type - The type of the command.
	 * @returns {Promise<ApplicationCommand>}
	 */
	async createGuildCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(guildID: string, options: T) {
		return this._client.rest.applicationCommands.createGuildCommand<T>(this.id, guildID, options);
	}

	/**
	 * Delete a global application command.
	 *
	 * @param {String} commandID - The id of the command.
	 * @returns {Promise<void>}
	 */
	async deleteGlobalCommand(commandID: string) {
		return this._client.rest.applicationCommands.deleteGlobalCommand(this.id, commandID);
	}

	/**
	 * Delete a guild application command.
	 *
	 * @param {String} guildID - The id of the guild.
	 * @param {String} commandID - The id of the command.
	 * @returns {Promise<void>}
	 */
	async deleteGuildCommand(guildID: string, commandID: string) {
		return this._client.rest.applicationCommands.deleteGuildCommand(this.id, guildID, commandID);
	}

	/**
	 * Edit a global application command.
	 *
	 * @param {String} commandID - The id of the command.
	 * @param {Object} options
	 * @param {String?} [options.defaultMemberPermissions] - The default member permissions for the command.
	 * @param {String} [options.description] - The description of the command. `CHAT_INPUT only.
	 * @param {String?} [options.descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT only.
	 * @param {Boolean?} [options.dmPermission] - If the command can be used in a DM.
	 * @param {String} [options.name] - The name of the command.
	 * @param {Object?} [options.nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
	 * @param {Object[]} [options.options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT only.
	 * @returns {Promise<ApplicationCommand>}
	 */
	async editGlobalCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(commandID: string, options: T) {
		return this._client.rest.applicationCommands.editGlobalCommand<T>(this.id, commandID, options);
	}

	/**
	 * Edit a guild application command.
	 *
	 * @param {String} guildID - The id of the guild.
	 * @param {String} commandID - The id of the command.
	 * @param {Object} options
	 * @param {String?} [options.defaultMemberPermissions] - The default member permissions for the command.
	 * @param {String} [options.description] - The description of the command. `CHAT_INPUT only.
	 * @param {String?} [options.descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT only.
	 * @param {Boolean?} [options.dmPermission] - If the command can be used in a DM.
	 * @param {String} [options.name] - The name of the command.
	 * @param {Object?} [options.nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
	 * @param {Object[]} [options.options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT only.
	 * @returns {Promise<ApplicationCommand>}
	 */
	async editGuildCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(guildID: string, commandID: string, options: T) {
		return this._client.rest.applicationCommands.editGuildCommand<T>(this.id, guildID, commandID, options);
	}

	/**
	 * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
	 *
	 * @param {String} guildID - The id of the guild.
	 * @param {String} commandID - The id of the command.
	 * @param {Object} options
	 * @param {String} [options.accessToken] - If the overall authorization of this rest instance is not a bearer token, a bearer token can be supplied via this option.
	 * @param {ApplicationCommandPermission[]} options.permissions - The permissions to set for the command.
	 * @returns {Promise<GuildApplicationCommandPermissions>}
	 */
	async editGuildCommandPermissions(guildID: string, commandID: string, options: EditApplicationCommandPermissionsOptions) {
		return this._client.rest.applicationCommands.editGuildCommandPermissions(this.id, guildID, commandID, options);
	}

	/**
	 * Get a global application command.
	 *
	 * @param {String} commandID - The id of the command.
	 * @param {Boolean} [withLocalizations=false] - If localizations should be included.
	 * @returns {Promise<ApplicationCommand>}
	 */
	async getGlobalCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(commandID: string, withLocalizations?: W) {
		return this._client.rest.applicationCommands.getGlobalCommand<W, T>(this.id, commandID, withLocalizations);
	}

	/**
	 * Get this application's global commands.
	 *
	 * @param {Boolean} [withLocalizations=false] - If localizations should be included.
	 * @returns {Promise<ApplicationCommand[]>}
	 */
	async getGlobalCommands<W extends boolean = false>(withLocalizations?: W) {
		return this._client.rest.applicationCommands.getGlobalCommands<W>(this.id, withLocalizations);
	}

	/**
	 * Get a global application command.
	 *
	 * @param {String} guildID - The id of the guild.
	 * @param {String} commandID - The id of the command.
	 * @param {Boolean} [withLocalizations=false] - If localizations should be included.
	 * @returns {Promise<ApplicationCommand>}
	 */
	async getGuildCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(guildID: string, commandID: string, withLocalizations?: W) {
		return this._client.rest.applicationCommands.getGuildCommand<W, T>(this.id, guildID, commandID, withLocalizations);
	}

	/**
	 * Get this application's commands in a specific guild.
	 *
	 * @param {String} guildID - The id of the guild.
	 * @param {Boolean} [withLocalizations=false] - If localizations should be included.
	 * @returns {Promise<ApplicationCommand[]>}
	 */
	async getGuildCommands<W extends boolean = false>(guildID: string, withLocalizations?: W) {
		return this._client.rest.applicationCommands.getGuildCommands<W>(this.id, guildID, withLocalizations);
	}

	/**
	 * Get a command's permissions in a guild.
	 *
	 * @param {String} guildID - The id of the guild.
	 * @param {String} commandID - The id of the command.
	 * @returns {Promise<GuildApplicationCommandPermissions>}
	 */
	async getGuildPermission(guildID: string, commandID: string) {
		return this._client.rest.applicationCommands.getGuildPermission(this.id, guildID, commandID);
	}

	/**
	 * Get the permissions for all commands in a guild.
	 *
	 * @param {String} guildID - The id of the guild.
	 * @returns {Promise<GuildApplicationCommandPermissions[]>}
	 */
	async getGuildPermissions(guildID: string) {
		return this._client.rest.applicationCommands.getGuildPermissions(this.id, guildID);
	}
}
