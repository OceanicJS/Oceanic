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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb25Db21tYW5kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9yb3V0ZXMvQXBwbGljYXRpb25Db21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNERBQW9DO0FBQ3BDLHVEQUF5QztBQWdCekMsMEZBQWtFO0FBSWxFLE1BQXFCLG1CQUFvQixTQUFRLG1CQUFTO0lBQ3REOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ0gsS0FBSyxDQUFDLHNCQUFzQixDQUFDLGFBQXFCLEVBQUUsT0FBK0M7UUFDL0YsTUFBTSxJQUFJLEdBQUcsT0FBMEQsQ0FBQztRQUN4RSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUErQjtZQUMzRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDO1lBQ2xELElBQUksRUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckIsMEJBQTBCLEVBQUUsR0FBRyxDQUFDLHdCQUF3QjtnQkFDeEQsV0FBVyxFQUFpQixHQUFHLENBQUMsV0FBVztnQkFDM0MseUJBQXlCLEVBQUcsR0FBRyxDQUFDLHdCQUF3QjtnQkFDeEQsYUFBYSxFQUFlLEdBQUcsQ0FBQyxZQUFZO2dCQUM1QyxJQUFJLEVBQXdCLEdBQUcsQ0FBQyxJQUFJO2dCQUNwQyxrQkFBa0IsRUFBVSxHQUFHLENBQUMsaUJBQWlCO2dCQUNqRCxPQUFPLEVBQXFCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRixJQUFJLEVBQXdCLEdBQUcsQ0FBQyxJQUFJO2FBQ3ZDLENBQUMsQ0FBQztTQUNOLENBQUMsQ0FB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