"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Permission_1 = __importDefault(require("./Permission"));
const Constants_1 = require("../Constants");
class ApplicationCommand extends Base_1.default {
    /** The the application this command is for. This can be a partial object with only an `id` property. */
    application;
    /** The default permissions for this command. */
    defaultMemberPermissions;
    /** The description of this command. Empty string for non `CHAT_INPUT` commands. */
    description;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. */
    descriptionLocalizations;
    /** If this command can be used in direct messages (global commands only). */
    dmPermission;
    /** The guild this command is in (guild commands only). */
    guild;
    /** The id of the guild this command is in (guild commands only). */
    guildID;
    /** The name of this command. */
    name;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names. */
    nameLocalizations;
    /** The options on this command. Only valid for `CHAT_INPUT`. */
    options;
    /** The [type](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types) of this command. */
    type;
    /** Autoincrementing version identifier updated during substantial record changes. */
    version;
    constructor(data, client) {
        super(data.id, client);
        this.application = this._client.application?.id === data.application_id ? this._client.application : { id: data.application_id };
        this.defaultMemberPermissions = data.default_member_permissions ? new Permission_1.default(data.default_member_permissions) : null;
        this.description = data.description;
        this.descriptionLocalizations = data.description_localizations;
        this.dmPermission = data.dm_permission;
        this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
        this.guildID = !data.guild_id ? undefined : data.guild_id;
        this.name = data.name;
        this.nameLocalizations = data.name_localizations;
        this.options = data.options?.map(o => ApplicationCommand._convertOption(o, "parsed"));
        this.type = (data.type || Constants_1.ApplicationCommandTypes.CHAT_INPUT);
        this.version = data.version;
    }
    static _convertOption(option, to) {
        if (to === "raw") {
            const opt = option;
            return {
                autocomplete: opt.autocomplete,
                channel_types: opt.channelTypes,
                choices: opt.choices,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                max_length: opt.maxLength,
                max_value: opt.maxValue,
                min_length: opt.minLength,
                min_value: opt.minValue,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                options: opt.options?.map(o => this._convertOption(o, "raw")),
                required: opt.required,
                type: opt.type
            };
        }
        else if (to === "parsed") {
            const opt = option;
            return {
                autocomplete: opt.autocomplete,
                channelTypes: opt.channel_types,
                choices: opt.choices,
                description: opt.description,
                descriptionLocalizations: opt.description_localizations,
                max_length: opt.max_length,
                max_value: opt.max_value,
                min_length: opt.min_length,
                min_value: opt.min_value,
                name: opt.name,
                nameLocalizations: opt.name_localizations,
                options: opt.options?.map(o => this._convertOption(o, "parsed")),
                required: opt.required,
                type: opt.type
            };
        }
    }
    /**
     * Delete this command.
     *
     * @returns {Promise<void>}
     */
    async delete() {
        return this.guild ? this._client.rest.applicationCommands.deleteGuildCommand(this.application.id, this.guild.id, this.id) : this._client.rest.applicationCommands.deleteGlobalCommand(this.application.id, this.id);
    }
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
    async edit(options) {
        return this.guild ? this._client.rest.applicationCommands.editGuildCommand(this.application.id, this.guild.id, this.id, options) : this._client.rest.applicationCommands.editGlobalCommand(this.application.id, this.id, options);
    }
    /**
     * Edit this command's permissions (guild commands only). This requires a bearer token with the `applications.commands.permissions.update` scope.
     *
     * @param {Object} options
     * @param {String} [options.accessToken] - If the overall authorization of this rest instance is not a bearer token, a bearer token can be supplied via this option.
     * @param {ApplicationCommandPermission[]} options.permissions - The permissions to set for the command.
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    async editGuildCommandPermissions(options) {
        if (!this.guild)
            throw new Error("editGuildCommandPermissions cannot be used on global commands.");
        return this._client.rest.applicationCommands.editGuildCommandPermissions(this.application.id, this.guild.id, this.id, options);
    }
    /**
     * Get this command's permissions (guild commands only).
     *
     * @returns {Promise<RESTGuildApplicationCommandPermissions>}
     */
    async getGuildPermission() {
        if (!this.guild)
            throw new Error("getGuildPermission cannot be used on global commands.");
        return this._client.rest.applicationCommands.getGuildPermission(this.application.id, this.guild.id, this.id);
    }
    /**
     * Get a mention for this command.
     *
     * @param {String[]} sub - The subcommand group and/or subcommand to include (["subcommand"] or ["subcommand-group", "subcommand"]).
     * @returns {String}
     */
    mention(sub) {
        let text = `${this.name}`;
        if (sub?.length)
            text += ` ${sub.slice(0, 2).join(" ")}`;
        return `<${text}:${this.id}>`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            application: this.application.id,
            defaultMemberPermissions: this.defaultMemberPermissions?.toJSON(),
            description: this.description,
            descriptionLocalizations: this.descriptionLocalizations,
            dmPermission: this.dmPermission,
            guild: this.guildID,
            name: this.name,
            nameLocalizations: this.nameLocalizations,
            options: this.options,
            type: this.type,
            version: this.version
        };
    }
}
exports.default = ApplicationCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb25Db21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXBwbGljYXRpb25Db21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLDhEQUFzQztBQUl0Qyw0Q0FBdUQ7QUFjdkQsTUFBcUIsa0JBQWdGLFNBQVEsY0FBSTtJQUNoSCx3R0FBd0c7SUFDeEcsV0FBVyxDQUErQjtJQUMxQyxnREFBZ0Q7SUFDaEQsd0JBQXdCLENBQW9CO0lBQzVDLG1GQUFtRjtJQUNuRixXQUFXLENBQTZEO0lBQ3hFLGtIQUFrSDtJQUNsSCx3QkFBd0IsQ0FBaUM7SUFDekQsNkVBQTZFO0lBQzdFLFlBQVksQ0FBVztJQUN2QiwwREFBMEQ7SUFDMUQsS0FBSyxDQUFTO0lBQ2Qsb0VBQW9FO0lBQ3BFLE9BQU8sQ0FBVTtJQUNqQixnQ0FBZ0M7SUFDaEMsSUFBSSxDQUFTO0lBQ2IsMkdBQTJHO0lBQzNHLGlCQUFpQixDQUFpQztJQUNsRCxnRUFBZ0U7SUFDaEUsT0FBTyxDQUFvQztJQUMzQyw4SkFBOEo7SUFDOUosSUFBSSxDQUFJO0lBQ1IscUZBQXFGO0lBQ3JGLE9BQU8sQ0FBUztJQUNoQixZQUFZLElBQTJCLEVBQUUsTUFBYztRQUN0RCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2pJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLElBQUksb0JBQVUsQ0FB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