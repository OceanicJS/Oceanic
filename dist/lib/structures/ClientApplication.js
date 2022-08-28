"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** A representation of the authorized client's application (typically recieved via gateway). */
class ClientApplication extends Base_1.default {
    /** This application's [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
    flags;
    constructor(data, client) {
        super(data.id, client);
        this.update(data);
    }
    update(data) {
        if (typeof data.flags !== "undefined")
            this.flags = data.flags;
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
    async bulkEditGlobalCommands(options) {
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
    async bulkEditGuildCommands(guildID, options) {
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
    async createGlobalCommand(options) {
        return this._client.rest.applicationCommands.createGlobalCommand(this.id, options);
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
    async createGuildCommand(guildID, options) {
        return this._client.rest.applicationCommands.createGuildCommand(this.id, guildID, options);
    }
    /**
     * Delete a global application command.
     *
     * @param {String} commandID - The id of the command.
     * @returns {Promise<void>}
     */
    async deleteGlobalCommand(commandID) {
        return this._client.rest.applicationCommands.deleteGlobalCommand(this.id, commandID);
    }
    /**
     * Delete a guild application command.
     *
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<void>}
     */
    async deleteGuildCommand(guildID, commandID) {
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
    async editGlobalCommand(commandID, options) {
        return this._client.rest.applicationCommands.editGlobalCommand(this.id, commandID, options);
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
    async editGuildCommand(guildID, commandID, options) {
        return this._client.rest.applicationCommands.editGuildCommand(this.id, guildID, commandID, options);
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
    async editGuildCommandPermissions(guildID, commandID, options) {
        return this._client.rest.applicationCommands.editGuildCommandPermissions(this.id, guildID, commandID, options);
    }
    /**
     * Get a global application command.
     *
     * @param {String} commandID - The id of the command.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand>}
     */
    async getGlobalCommand(commandID, withLocalizations) {
        return this._client.rest.applicationCommands.getGlobalCommand(this.id, commandID, withLocalizations);
    }
    /**
     * Get this application's global commands.
     *
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    async getGlobalCommands(withLocalizations) {
        return this._client.rest.applicationCommands.getGlobalCommands(this.id, withLocalizations);
    }
    /**
     * Get a global application command.
     *
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand>}
     */
    async getGuildCommand(guildID, commandID, withLocalizations) {
        return this._client.rest.applicationCommands.getGuildCommand(this.id, guildID, commandID, withLocalizations);
    }
    /**
     * Get this application's commands in a specific guild.
     *
     * @param {String} guildID - The id of the guild.
     * @param {Boolean} [withLocalizations=false] - If localizations should be included.
     * @returns {Promise<ApplicationCommand[]>}
     */
    async getGuildCommands(guildID, withLocalizations) {
        return this._client.rest.applicationCommands.getGuildCommands(this.id, guildID, withLocalizations);
    }
    /**
     * Get a command's permissions in a guild.
     *
     * @param {String} guildID - The id of the guild.
     * @param {String} commandID - The id of the command.
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    async getGuildPermission(guildID, commandID) {
        return this._client.rest.applicationCommands.getGuildPermission(this.id, guildID, commandID);
    }
    /**
     * Get the permissions for all commands in a guild.
     *
     * @param {String} guildID - The id of the guild.
     * @returns {Promise<RESTGuildApplicationCommandPermissions[]>}
     */
    async getGuildPermissions(guildID) {
        return this._client.rest.applicationCommands.getGuildPermissions(this.id, guildID);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            flags: this.flags
        };
    }
}
exports.default = ClientApplication;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50QXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9DbGllbnRBcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQVMxQixnR0FBZ0c7QUFDaEcsTUFBcUIsaUJBQWtCLFNBQVEsY0FBSTtJQUMvQyx5SUFBeUk7SUFDekksS0FBSyxDQUFTO0lBQ2QsWUFBWSxJQUEwQixFQUFFLE1BQWM7UUFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRVMsTUFBTSxDQUFDLElBQW1DO1FBQ2hELElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVc7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxLQUFLLENBQUMsc0JBQXNCLENBQUMsT0FBK0M7UUFDeEUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCxLQUFLLENBQUMscUJBQXFCLENBQUMsT0FBZSxFQUFFLE9BQXFFO1FBQzlHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxLQUFLLENBQUMsbUJBQW1CLENBQThFLE9BQVU7UUFDN0csT0FBTyxJQUFJ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