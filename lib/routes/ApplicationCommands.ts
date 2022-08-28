import BaseRoute from "./BaseRoute";
import * as Routes from "../util/Routes";
import type {
    AnyApplicationCommand,
    ApplicationCommandOptionConversion,
    ApplicationCommandPermission,
    CreateApplicationCommandOptions,
    CreateChatInputApplicationCommandOptions,
    EditApplicationCommandOptions,
    EditApplicationCommandPermissionsOptions,
    EditChatInputApplicationCommandOptions,
    RESTGuildApplicationCommandPermissions,
    RawApplicationCommand,
    RawGuildApplicationCommandPermissions
} from "../types/application-commands";
import ApplicationCommand from "../structures/ApplicationCommand";
import { ApplicationCommandTypes } from "../Constants";
import type { RequestOptions } from "../types/request-handler";

export default class ApplicationCommands extends BaseRoute {
    /**
     * Overwrite all existing global application commands.
     *
     * @param {String} applicationID - The id of the application.
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
    async bulkEditGlobalCommands(applicationID: string, options: Array<CreateApplicationCommandOptions>) {
        const opts = options as Array<CreateChatInputApplicationCommandOptions>;
        return this._manager.authRequest<Array<RawApplicationCommand>>({
            method: "PUT",
            path:   Routes.APPLICATION_COMMANDS(applicationID),
            json:   opts.map(opt => ({
                default_member_permissions: opt.defaultMemberPermissions,
                description:				            opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                options:                    opt.options?.map(o => ApplicationCommand["_convertOption"](o, "raw")),
                type:                       opt.type
            }))
        }).then(data => data.map(d => new ApplicationCommand(d, this._client)));
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
    async bulkEditGuildCommands(applicationID: string, guildID: string, options: Array<Omit<CreateApplicationCommandOptions, "dmPermission">>) {
        const opts = options as Array<CreateChatInputApplicationCommandOptions>;
        return this._manager.authRequest<Array<RawApplicationCommand>>({
            method: "PUT",
            path:   Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            json:   opts.map(opt => ({
                default_member_permissions: opt.defaultMemberPermissions,
                description:				            opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                options:                    opt.options?.map(o => ApplicationCommand["_convertOption"](o, "raw")),
                type:                       opt.type
            }))
        }).then(data => data.map(d => new ApplicationCommand(d, this._client)));
    }

    /**
     * Create a global application command.
     *
     * @param {String} applicationID - The id of the application.
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
    async createGlobalCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(applicationID: string, options: T) {
        const opt = options as CreateChatInputApplicationCommandOptions;
        return this._manager.authRequest<RawApplicationCommand>({
            method: "POST",
            path:   Routes.APPLICATION_COMMANDS(applicationID),
            json:   {
                default_member_permissions: opt.defaultMemberPermissions,
                description:				            opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                options:                    opt.options?.map(o => ApplicationCommand["_convertOption"](o, "raw")),
                type:                       opt.type
            }
        }).then(data => new ApplicationCommand(data, this._client) as ApplicationCommandOptionConversion<T>);
    }

    /**
     * Create a guild application command.
     *
     * @param {String} applicationID - The id of the application.
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
    async createGuildCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(applicationID: string, guildID: string, options: T) {
        const opt = options as CreateChatInputApplicationCommandOptions;
        return this._manager.authRequest<RawApplicationCommand>({
            method: "POST",
            path:   Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            json:   {
                default_member_permissions: opt.defaultMemberPermissions,
                description:				            opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                options:                    opt.options?.map(o => ApplicationCommand["_convertOption"](o, "raw")),
                type:                       opt.type
            }
        }).then(data => new ApplicationCommand(data, this._client) as ApplicationCommandOptionConversion<T>);
    }

    /**
     * Delete a global application command.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<void>}
     */
    async deleteGlobalCommand(applicationID: string, commandID: string) {
        await this._manager.authRequest<RawApplicationCommand>({
            method: "DELETE",
            path:   Routes.APPLICATION_COMMAND(applicationID, commandID)
        });
    }

    /**
     * Delete a guild application command.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<void>}
     */
    async deleteGuildCommand(applicationID: string, guildID: string, commandID: string) {
        await this._manager.authRequest<RawApplicationCommand>({
            method: "DELETE",
            path:   Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID)
        });
    }

    /**
     * Edit a global application command.
     *
     * @param {String} applicationID - The id of the application.
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
    async editGlobalCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(applicationID: string, commandID: string, options: T) {
        const opt = options as EditChatInputApplicationCommandOptions;
        return this._manager.authRequest<RawApplicationCommand>({
            method: "PATCH",
            path:   Routes.APPLICATION_COMMAND(applicationID, commandID),
            json:   {
                default_member_permissions: opt.defaultMemberPermissions,
                description:				            opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                options:                    opt.options?.map(o => ApplicationCommand["_convertOption"](o, "raw"))
            }
        }).then(data => new ApplicationCommand(data, this._client) as ApplicationCommandOptionConversion<T>);
    }

    /**
     * Edit a guild application command.
     *
     * @param {String} applicationID - The id of the application.
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
    async editGuildCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(applicationID: string, guildID: string, commandID: string, options: T) {
        const opt = options as EditChatInputApplicationCommandOptions;
        return this._manager.authRequest<RawApplicationCommand>({
            method: "PATCH",
            path:   Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID),
            json:   {
                default_member_permissions: opt.defaultMemberPermissions,
                description:				            opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                options:                    opt.options?.map(o => ApplicationCommand["_convertOption"](o, "raw"))
            }
        }).then(data => new ApplicationCommand(data, this._client) as ApplicationCommandOptionConversion<T>);
    }

    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @param {Object} options
     * @param {String} [options.accessToken] - If the overall authorization of this rest instance is not a bearer token, a bearer token can be supplied via this option.
     * @param {ApplicationCommandPermission[]} options.permissions - The permissions to set for the command.
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    async editGuildCommandPermissions(applicationID: string, guildID: string, commandID: string, options: EditApplicationCommandPermissionsOptions) {
        return (options.accessToken ? this._manager.request.bind(this._manager) : this._manager.authRequest.bind(this._manager))({
            method: "PATCH",
            path:   Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID),
            json:   {
                permissions: options.permissions
            },
            auth: options.accessToken
        } as Omit<RequestOptions, "auth">).then(data => {
            const d = data as RawGuildApplicationCommandPermissions;
            return {
                applicationID: d.application_id,
                guildID:       d.guild_id,
                id:            d.id,
                permissions:   d.permissions
            } as RESTGuildApplicationCommandPermissions;
        });
    }

    /**
     * Get a global application command.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} commandID - The id of the command.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand>}
     */
    async getGlobalCommand(applicationID: string, commandID: string, withLocalizations: true): Promise<AnyApplicationCommand<true>>;
    async getGlobalCommand(applicationID: string, commandID: string, withLocalizations?: false): Promise<AnyApplicationCommand<false>>;
    async getGlobalCommand(applicationID: string, commandID: string, withLocalizations?: boolean) {
        const query = new URLSearchParams();
        if (withLocalizations) query.set("with_localizations", "true");
        return this._manager.authRequest<RawApplicationCommand>({
            method: "GET",
            path:   Routes.APPLICATION_COMMAND(applicationID, commandID),
            query
        }).then(data => new ApplicationCommand(data, this._client) as never);
    }

    /**
     * Get an application's global commands.
     *
     * @param {String} applicationID - The id of the application.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    async getGlobalCommands(applicationID: string, withLocalizations: true): Promise<Array<AnyApplicationCommand<true>>>;
    async getGlobalCommands(applicationID: string, withLocalizations?: false): Promise<Array<AnyApplicationCommand<false>>>;
    async getGlobalCommands(applicationID: string, withLocalizations?: boolean) {
        const query = new URLSearchParams();
        if (withLocalizations) query.set("with_localizations", "true");
        return this._manager.authRequest<Array<RawApplicationCommand>>({
            method: "GET",
            path:   Routes.APPLICATION_COMMANDS(applicationID),
            query
        }).then(data => data.map(d => new ApplicationCommand(d, this._client) as unknown as AnyApplicationCommand));
    }

    /**
     * Get a global application command.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand>}
     */
    async getGuildCommand(applicationID: string, guildID: string, commandID: string, withLocalizations: true): Promise<AnyApplicationCommand<true>>;
    async getGuildCommand(applicationID: string, guildID: string, commandID: string, withLocalizations?: false): Promise<AnyApplicationCommand<false>>;
    async getGuildCommand(applicationID: string, guildID: string, commandID: string, withLocalizations?: boolean) {
        const query = new URLSearchParams();
        if (withLocalizations) query.set("with_localizations", "true");
        return this._manager.authRequest<RawApplicationCommand>({
            method: "GET",
            path:   Routes.GUILD_APPLICATION_COMMAND(applicationID, commandID, guildID),
            query
        }).then(data => new ApplicationCommand(data, this._client) as never);
    }

    /**
     * Get an application's application commands in a specific guild.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    async getGuildCommands(applicationID: string, guildID: string, withLocalizations: true): Promise<Array<AnyApplicationCommand<true>>>;
    async getGuildCommands(applicationID: string, guildID: string, withLocalizations?: false): Promise<Array<AnyApplicationCommand<false>>>;
    async getGuildCommands(applicationID: string, guildID: string, withLocalizations?: boolean) {
        const query = new URLSearchParams();
        if (withLocalizations) query.set("with_localizations", "true");
        return this._manager.authRequest<Array<RawApplicationCommand>>({
            method: "GET",
            path:   Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            query
        }).then(data => data.map(d => new ApplicationCommand(d, this._client) as never));
    }

    /**
     * Get an application command's permissions in a guild.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    async getGuildPermission(applicationID: string, guildID: string, commandID: string) {
        return this._manager.authRequest<RawGuildApplicationCommandPermissions>({
            method: "GET",
            path:   Routes.GUILD_APPLICATION_COMMAND_PERMISSION(applicationID, guildID, commandID)
        }).then(data => ({
            applicationID: data.application_id,
            guildID:       data.guild_id,
            id:            data.id,
            permissions:   data.permissions
        }) as RESTGuildApplicationCommandPermissions);
    }

    /**
     * Get the permissions for all application commands in a guild.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @returns {Promise<RESTGuildApplicationCommandPermissions[]>}
     */
    async getGuildPermissions(applicationID: string, guildID: string) {
        return this._manager.authRequest<Array<RawGuildApplicationCommandPermissions>>({
            method: "GET",
            path:   Routes.GUILD_APPLICATION_COMMAND_PERMISSIONS(applicationID, guildID)
        }).then(data => data.map(d => ({
            applicationID: d.application_id,
            guildID:       d.guild_id,
            id:            d.id,
            permissions:   d.permissions
        }) as RESTGuildApplicationCommandPermissions));
    }
}
