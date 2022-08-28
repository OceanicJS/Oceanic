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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb25Db21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXBwbGljYXRpb25Db21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLDhEQUFzQztBQUl0Qyw0Q0FBdUQ7QUFjdkQsTUFBcUIsa0JBQWdGLFNBQVEsY0FBSTtJQUM3Ryx3R0FBd0c7SUFDeEcsV0FBVyxDQUErQjtJQUMxQyxnREFBZ0Q7SUFDaEQsd0JBQXdCLENBQW9CO0lBQzVDLG1GQUFtRjtJQUNuRixXQUFXLENBQTZEO0lBQ3hFLGtIQUFrSDtJQUNsSCx3QkFBd0IsQ0FBaUM7SUFDekQsNkVBQTZFO0lBQzdFLFlBQVksQ0FBVztJQUN2QiwwREFBMEQ7SUFDMUQsS0FBSyxDQUFTO0lBQ2Qsb0VBQW9FO0lBQ3BFLE9BQU8sQ0FBVTtJQUNqQixnQ0FBZ0M7SUFDaEMsSUFBSSxDQUFTO0lBQ2IsMkdBQTJHO0lBQzNHLGlCQUFpQixDQUFpQztJQUNsRCxnRUFBZ0U7SUFDaEUsT0FBTyxDQUFvQztJQUMzQyw4SkFBOEo7SUFDOUosSUFBSSxDQUFJO0lBQ1IscUZBQXFGO0lBQ3JGLE9BQU8sQ0FBUztJQUNoQixZQUFZLElBQTJCLEVBQUUsTUFBYztRQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2pJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLElBQUksb0JBQVUsQ0FB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