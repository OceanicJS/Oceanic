import Base from "./Base";
import Permission from "./Permission";
import type Guild from "./Guild";
import type ClientApplication from "./ClientApplication";
import type Client from "../Client";
import { ApplicationCommandTypes } from "../Constants";
import type { ApplicationCommandOptions, EditApplicationCommandPermissionsOptions, RESTGuildApplicationCommandPermissions, RawApplicationCommand, TypeToEdit } from "../types/application-commands";
import type { Uncached } from "../types/shared";
import type { JSONApplicationCommand } from "../types/json";
export default class ApplicationCommand<T extends ApplicationCommandTypes = ApplicationCommandTypes> extends Base {
    /** The the application this command is for. This can be a partial object with only an `id` property. */
    application: ClientApplication | Uncached;
    /** The default permissions for this command. */
    defaultMemberPermissions: Permission | null;
    /** The description of this command. Empty string for non `CHAT_INPUT` commands. */
    description: T extends ApplicationCommandTypes.CHAT_INPUT ? string : "";
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. */
    descriptionLocalizations?: Record<string, string> | null;
    /** If this command can be used in direct messages (global commands only). */
    dmPermission?: boolean;
    /** The guild this command is in (guild commands only). */
    guild?: Guild;
    /** The id of the guild this command is in (guild commands only). */
    guildID?: string;
    /** The name of this command. */
    name: string;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names. */
    nameLocalizations?: Record<string, string> | null;
    /** The options on this command. Only valid for `CHAT_INPUT`. */
    options?: Array<ApplicationCommandOptions>;
    /** The [type](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types) of this command. */
    type: T;
    /** Autoincrementing version identifier updated during substantial record changes. */
    version: string;
    constructor(data: RawApplicationCommand, client: Client);
    /**
     * Delete this command.
     *
     * @returns {Promise<void>}
     */
    delete(): Promise<void>;
    /**
     * Edit this command.
     *
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
    edit(options: TypeToEdit<T>): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<TypeToEdit<T>>>;
    /**
     * Edit this command's permissions (guild commands only). This requires a bearer token with the `applications.commands.permissions.update` scope.
     *
     * @param {Object} options
     * @param {String} [options.accessToken] - If the overall authorization of this rest instance is not a bearer token, a bearer token can be supplied via this option.
     * @param {ApplicationCommandPermission[]} options.permissions - The permissions to set for the command.
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    editGuildCommandPermissions(options: EditApplicationCommandPermissionsOptions): Promise<RESTGuildApplicationCommandPermissions>;
    /**
     * Get this command's permissions (guild commands only).
     *
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    getGuildPermission(): Promise<RESTGuildApplicationCommandPermissions>;
    /**
     * Get a mention for this command.
     *
     * @param {String[]} sub - The subcommand group and/or subcommand to include (["subcommand"] or ["subcommand-group", "subcommand"]).
     * @returns {String}
     */
    mention(sub?: [subcommand: string] | [subcommandGroup: string, subcommand: string]): string;
    toJSON(): JSONApplicationCommand;
}
