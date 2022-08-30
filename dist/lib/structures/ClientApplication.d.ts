import Base from "./Base";
import ApplicationCommand from "./ApplicationCommand";
import type Client from "../Client";
import type { RawClientApplication } from "../types/oauth";
import { ApplicationCommandTypes } from "../Constants";
import type { AnyApplicationCommand, CreateApplicationCommandOptions, CreateGuildApplicationCommandOptions, EditApplicationCommandOptions, EditApplicationCommandPermissionsOptions, EditGuildApplicationCommandOptions } from "../types/application-commands";
import { RESTGuildApplicationCommandPermissions } from "../types/application-commands";
import type { JSONClientApplication } from "../types/json";
/** A representation of the authorized client's application (typically recieved via gateway). */
export default class ClientApplication extends Base {
    /** This application's [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
    flags: number;
    constructor(data: RawClientApplication, client: Client);
    protected update(data: Partial<RawClientApplication>): void;
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
    bulkEditGlobalCommands(options: Array<CreateApplicationCommandOptions>): Promise<ApplicationCommand<ApplicationCommandTypes>[]>;
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
    bulkEditGuildCommands(guildID: string, options: Array<CreateGuildApplicationCommandOptions>): Promise<ApplicationCommand<ApplicationCommandTypes>[]>;
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
    createGlobalCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(options: T): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<T>>;
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
    createGuildCommand<T extends CreateGuildApplicationCommandOptions = CreateGuildApplicationCommandOptions>(guildID: string, options: T): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<T>>;
    /**
     * Delete a global application command.
     *
     * @param {String} commandID - The id of the command.
     * @returns {Promise<void>}
     */
    deleteGlobalCommand(commandID: string): Promise<void>;
    /**
     * Delete a guild application command.
     *
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<void>}
     */
    deleteGuildCommand(guildID: string, commandID: string): Promise<void>;
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
    editGlobalCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(commandID: string, options: T): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<T>>;
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
    editGuildCommand<T extends EditGuildApplicationCommandOptions = EditGuildApplicationCommandOptions>(guildID: string, commandID: string, options: T): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<T>>;
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
    editGuildCommandPermissions(guildID: string, commandID: string, options: EditApplicationCommandPermissionsOptions): Promise<RESTGuildApplicationCommandPermissions>;
    /**
     * Get a global application command.
     *
     * @param {String} commandID - The id of the command.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand>}
     */
    getGlobalCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(commandID: string, withLocalizations?: W): Promise<T>;
    /**
     * Get this application's global commands.
     *
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    getGlobalCommands<W extends boolean = false>(withLocalizations?: W): Promise<AnyApplicationCommand<W>[]>;
    /**
     * Get a global application command.
     *
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand>}
     */
    getGuildCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(guildID: string, commandID: string, withLocalizations?: W): Promise<T>;
    /**
     * Get this application's commands in a specific guild.
     *
     * @param {String} guildID - The id of the guild.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    getGuildCommands<W extends boolean = false>(guildID: string, withLocalizations?: W): Promise<AnyApplicationCommand<W>[]>;
    /**
     * Get a command's permissions in a guild.
     *
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    getGuildPermission(guildID: string, commandID: string): Promise<RESTGuildApplicationCommandPermissions>;
    /**
     * Get the permissions for all commands in a guild.
     *
     * @param {String} guildID - The id of the guild.
     * @returns {Promise<RESTGuildApplicationCommandPermissions[]>}
     */
    getGuildPermissions(guildID: string): Promise<RESTGuildApplicationCommandPermissions[]>;
    toJSON(): JSONClientApplication;
}
