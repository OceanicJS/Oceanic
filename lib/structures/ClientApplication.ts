import Base from "./Base";
import ApplicationCommand from "./ApplicationCommand";
import type Client from "../Client";
import type { RawClientApplication } from "../types/oauth";
import { ApplicationCommandTypes } from "../Constants";
import type { AnyApplicationCommand, CreateApplicationCommandOptions, EditApplicationCommandOptions, EditApplicationCommandPermissionsOptions } from "../types/application-commands";
import { ApplicationCommandPermission, RESTGuildApplicationCommandPermissions } from "../types/application-commands";
import type { JSONClientApplication } from "../types/json";

/** A representation of the authorized client's application (typically recieved via gateway). */
export default class ClientApplication extends Base {
    /** This application's [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
    flags: number;
    constructor(data: RawClientApplication, client: Client) {
        super(data.id, client);
        this.update(data);
    }

    protected update(data: Partial<RawClientApplication>): void {
        if (typeof data.flags !== "undefined") this.flags = data.flags;
    }

    /**
     * Overwrite all existing global application commands.
     *
     * @param {Object[]} options
     * @param {String?} [options[].defaultMemberPermissions] - The default member permissions for the command.
     * @param {String} [options[].description] - The description of the command. `CHAT_INPUT` only.
     * @param {String?} [options[].descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT` only.
     * @param {Boolean?} [options[].dmPermission] - If the command can be used in a DM.
     * @param {String} options[].name - The name of the command.
     * @param {Object?} [options[].nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
     * @param {Object[]} [options[].options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT` only.
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
     * @param {String} [options[].description] - The description of the command. `CHAT_INPUT` only.
     * @param {String?} [options[].descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT` only.
     * @param {Boolean?} [options[].dmPermission] - If the command can be used in a DM.
     * @param {String} options[].name - The name of the command.
     * @param {Object?} [options[].nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
     * @param {Object[]} [options[].options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT` only.
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
     * @param {String} [options.description] - The description of the command. `CHAT_INPUT` only.
     * @param {String?} [options.descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT` only.
     * @param {Boolean?} [options.dmPermission] - If the command can be used in a DM.
     * @param {String} options.name - The name of the command.
     * @param {Object?} [options.nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
     * @param {Object[]} [options.options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT` only.
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
     * @param {String} [options.description] - The description of the command. `CHAT_INPUT` only.
     * @param {String?} [options.descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT` only.
     * @param {Boolean?} [options.dmPermission] - If the command can be used in a DM.
     * @param {String} options.name - The name of the command.
     * @param {Object?} [options.nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
     * @param {Object[]} [options.options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT` only.
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
     * @param {String} [options.description] - The description of the command. `CHAT_INPUT` only.
     * @param {String?} [options.descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT` only.
     * @param {Boolean?} [options.dmPermission] - If the command can be used in a DM.
     * @param {String} [options.name] - The name of the command.
     * @param {Object?} [options.nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
     * @param {Object[]} [options.options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT` only.
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
     * @param {String} [options.description] - The description of the command. `CHAT_INPUT` only.
     * @param {String?} [options.descriptionLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. `CHAT_INPUT` only.
     * @param {Boolean?} [options.dmPermission] - If the command can be used in a DM.
     * @param {String} [options.name] - The name of the command.
     * @param {Object?} [options.nameLocalizations] - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
     * @param {Object[]} [options.options] - See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. `CHAT_INPUT` only.
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
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
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
    async getGlobalCommand(commandID: string, withLocalizations: true): Promise<AnyApplicationCommand<true>>;
    async getGlobalCommand(commandID: string, withLocalizations?: false): Promise<AnyApplicationCommand<false>>;
    async getGlobalCommand(commandID: string, withLocalizations?: boolean) {
        return this._client.rest.applicationCommands.getGlobalCommand(this.id, commandID, withLocalizations as true);
    }

    /**
     * Get this application's global commands.
     *
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    async getGlobalCommands(withLocalizations: true): Promise<Array<AnyApplicationCommand<true>>>;
    async getGlobalCommands(withLocalizations?: false): Promise<Array<AnyApplicationCommand<false>>>;
    async getGlobalCommands(withLocalizations?: boolean) {
        return this._client.rest.applicationCommands.getGlobalCommands(this.id, withLocalizations as true);
    }

    /**
     * Get a global application command.
     *
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand>}
     */
    async getGuildCommand(guildID: string, commandID: string, withLocalizations: true): Promise<AnyApplicationCommand<true>>;
    async getGuildCommand(guildID: string, commandID: string, withLocalizations?: false): Promise<AnyApplicationCommand<false>>;
    async getGuildCommand(guildID: string, commandID: string, withLocalizations?: boolean) {
        return this._client.rest.applicationCommands.getGuildCommand(this.id, guildID, commandID, withLocalizations as true);
    }

    /**
     * Get this application's commands in a specific guild.
     *
     * @param {String} guildID - The id of the guild.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    async getGuildCommands(guildID: string, withLocalizations: true): Promise<Array<AnyApplicationCommand<true>>>;
    async getGuildCommands(guildID: string, withLocalizations?: false): Promise<Array<AnyApplicationCommand<false>>>;
    async getGuildCommands(guildID: string, withLocalizations?: boolean) {
        return this._client.rest.applicationCommands.getGuildCommands(this.id, guildID, withLocalizations as true);
    }

    /**
     * Get a command's permissions in a guild.
     *
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    async getGuildPermission(guildID: string, commandID: string) {
        return this._client.rest.applicationCommands.getGuildPermission(this.id, guildID, commandID);
    }

    /**
     * Get the permissions for all commands in a guild.
     *
     * @param {String} guildID - The id of the guild.
     * @returns {Promise<RESTGuildApplicationCommandPermissions[]>}
     */
    async getGuildPermissions(guildID: string) {
        return this._client.rest.applicationCommands.getGuildPermissions(this.id, guildID);
    }

    override toJSON(): JSONClientApplication {
        return {
            ...super.toJSON(),
            flags: this.flags
        };
    }
}
