"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = __importDefault(require("./BaseRoute"));
const Routes = __importStar(require("../util/Routes"));
const ApplicationCommand_1 = __importDefault(require("../structures/ApplicationCommand"));
class ApplicationCommands extends BaseRoute_1.default {
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
    async bulkEditGlobalCommands(applicationID, options) {
        const opts = options;
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.APPLICATION_COMMANDS(applicationID),
            json: opts.map(opt => ({
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                options: opt.options?.map(o => this._client.util.optionToRaw(o)),
                type: opt.type
            }))
        }).then(data => data.map(d => new ApplicationCommand_1.default(d, this._client)));
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
    async bulkEditGuildCommands(applicationID, guildID, options) {
        const opts = options;
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            json: opts.map(opt => ({
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                options: opt.options?.map(o => this._client.util.optionToRaw(o)),
                type: opt.type
            }))
        }).then(data => data.map(d => new ApplicationCommand_1.default(d, this._client)));
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
    async createGlobalCommand(applicationID, options) {
        const opt = options;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.APPLICATION_COMMANDS(applicationID),
            json: {
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                options: opt.options?.map(o => this._client.util.optionToRaw(o)),
                type: opt.type
            }
        }).then(data => new ApplicationCommand_1.default(data, this._client));
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
    async createGuildCommand(applicationID, guildID, options) {
        const opt = options;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            json: {
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                options: opt.options?.map(o => this._client.util.optionToRaw(o)),
                type: opt.type
            }
        }).then(data => new ApplicationCommand_1.default(data, this._client));
    }
    /**
     * Delete a global application command.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<void>}
     */
    async deleteGlobalCommand(applicationID, commandID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.APPLICATION_COMMAND(applicationID, commandID)
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
    async deleteGuildCommand(applicationID, guildID, commandID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID)
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
    async editGlobalCommand(applicationID, commandID, options) {
        const opt = options;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.APPLICATION_COMMAND(applicationID, commandID),
            json: {
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                options: opt.options?.map(o => this._client.util.optionToRaw(o))
            }
        }).then(data => new ApplicationCommand_1.default(data, this._client));
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
    async editGuildCommand(applicationID, guildID, commandID, options) {
        const opt = options;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID),
            json: {
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                options: opt.options?.map(o => this._client.util.optionToRaw(o))
            }
        }).then(data => new ApplicationCommand_1.default(data, this._client));
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
    async editGuildCommandPermissions(applicationID, guildID, commandID, options) {
        return (options.accessToken ? this._manager.request.bind(this._manager) : this._manager.authRequest.bind(this._manager))({
            method: "PATCH",
            path: Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID),
            json: {
                permissions: options.permissions
            },
            auth: options.accessToken
        }).then(data => {
            const d = data;
            return {
                applicationID: d.application_id,
                guildID: d.guild_id,
                id: d.id,
                permissions: d.permissions
            };
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
    async getGlobalCommand(applicationID, commandID, withLocalizations) {
        const query = new URLSearchParams();
        if (withLocalizations)
            query.set("with_localizations", "true");
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION_COMMAND(applicationID, commandID),
            query
        }).then(data => new ApplicationCommand_1.default(data, this._client));
    }
    /**
     * Get an application's global commands.
     *
     * @param {String} applicationID - The id of the application.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    async getGlobalCommands(applicationID, withLocalizations) {
        const query = new URLSearchParams();
        if (withLocalizations)
            query.set("with_localizations", "true");
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION_COMMANDS(applicationID),
            query
        }).then(data => data.map(d => new ApplicationCommand_1.default(d, this._client)));
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
    async getGuildCommand(applicationID, guildID, commandID, withLocalizations) {
        const query = new URLSearchParams();
        if (withLocalizations)
            query.set("with_localizations", "true");
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_APPLICATION_COMMAND(applicationID, commandID, guildID),
            query
        }).then(data => new ApplicationCommand_1.default(data, this._client));
    }
    /**
     * Get an application's application commands in a specific guild.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    async getGuildCommands(applicationID, guildID, withLocalizations) {
        const query = new URLSearchParams();
        if (withLocalizations)
            query.set("with_localizations", "true");
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            query
        }).then(data => data.map(d => new ApplicationCommand_1.default(d, this._client)));
    }
    /**
     * Get an application command's permissions in a guild.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    async getGuildPermission(applicationID, guildID, commandID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_APPLICATION_COMMAND_PERMISSION(applicationID, guildID, commandID)
        }).then(data => ({
            applicationID: data.application_id,
            guildID: data.guild_id,
            id: data.id,
            permissions: data.permissions
        }));
    }
    /**
     * Get the permissions for all application commands in a guild.
     *
     * @param {String} applicationID - The id of the application.
     * @param {String} guildID - The id of the guild.
     * @returns {Promise<RESTGuildApplicationCommandPermissions[]>}
     */
    async getGuildPermissions(applicationID, guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_APPLICATION_COMMAND_PERMISSIONS(applicationID, guildID)
        }).then(data => data.map(d => ({
            applicationID: d.application_id,
            guildID: d.guild_id,
            id: d.id,
            permissions: d.permissions
        })));
    }
}
exports.default = ApplicationCommands;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb25Db21tYW5kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9yb3V0ZXMvQXBwbGljYXRpb25Db21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNERBQW9DO0FBQ3BDLHVEQUF5QztBQWN6QywwRkFBa0U7QUFJbEUsTUFBcUIsbUJBQW9CLFNBQVEsbUJBQVM7SUFDdEQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSCxLQUFLLENBQUMsc0JBQXNCLENBQUMsYUFBcUIsRUFBRSxPQUErQztRQUMvRixNQUFNLElBQUksR0FBRyxPQUEwRCxDQUFDO1FBQ3hFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQStCO1lBQzNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUM7WUFDbEQsSUFBSSxFQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQiwwQkFBMEIsRUFBRSxHQUFHLENBQUMsd0JBQXdCO2dCQUN4RCxXQUFXLEVBQWlCLEdBQUcsQ0FBQyxXQUFXO2dCQUMzQyx5QkFBeUIsRUFBRyxHQUFHLENBQUMsd0JBQXdCO2dCQUN4RCxhQUFhLEVBQWUsR0FBRyxDQUFDLFlBQVk7Z0JBQzVDLElBQUksRUFBd0IsR0FBRyxDQUFDLElBQUk7Z0JBQ3BDLGtCQUFrQixFQUFVLEdBQUcsQ0FBQyxpQkFBaUI7Z0JBQ2pELE9BQU8sRUFBcUIsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25GLElBQUksRUFBd0IsR0FBRyxDQUFDLElBQUk7YUFDdkMsQ0FBQyxDQUFDO1NBQ04sQ0FBQyxDQUFD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