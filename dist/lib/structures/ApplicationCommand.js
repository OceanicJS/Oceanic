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
        this.options = data.options?.map(o => this._client.util.optionToParsed(o));
        this.type = (data.type || Constants_1.ApplicationCommandTypes.CHAT_INPUT);
        this.version = data.version;
    }
    /**
     * Delete this command.
     */
    async delete() {
        return this.guildID ? this._client.rest.applicationCommands.deleteGuildCommand(this.application.id, this.guildID, this.id) : this._client.rest.applicationCommands.deleteGlobalCommand(this.application.id, this.id);
    }
    /**
     * Edit this command.
     * @param options - The options for editing the command.
     */
    async edit(options) {
        return this.guildID ? this._client.rest.applicationCommands.editGuildCommand(this.application.id, this.guildID, this.id, options) : this._client.rest.applicationCommands.editGlobalCommand(this.application.id, this.id, options);
    }
    /**
     * Edit this command's permissions (guild commands only). This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param options - The options for editing the permissions.
     */
    async editGuildCommandPermissions(options) {
        if (!this.guildID)
            throw new Error("editGuildCommandPermissions cannot be used on global commands.");
        return this._client.rest.applicationCommands.editGuildCommandPermissions(this.application.id, this.guildID, this.id, options);
    }
    /**
     * Get this command's permissions (guild commands only).
     */
    async getGuildPermission() {
        if (!this.guildID)
            throw new Error("getGuildPermission cannot be used on global commands.");
        return this._client.rest.applicationCommands.getGuildPermission(this.application.id, this.guildID, this.id);
    }
    /**
     * Get a mention for this command.
     * @param sub - The subcommand group and/or subcommand to include (["subcommand"] or ["subcommand-group", "subcommand"]).
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb25Db21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXBwbGljYXRpb25Db21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLDhEQUFzQztBQUl0Qyw0Q0FBdUQ7QUFLdkQsTUFBcUIsa0JBQWdGLFNBQVEsY0FBSTtJQUM3Ryx3R0FBd0c7SUFDeEcsV0FBVyxDQUErQjtJQUMxQyxnREFBZ0Q7SUFDaEQsd0JBQXdCLENBQW9CO0lBQzVDLG1GQUFtRjtJQUNuRixXQUFXLENBQTZEO0lBQ3hFLGtIQUFrSDtJQUNsSCx3QkFBd0IsQ0FBaUM7SUFDekQsNkVBQTZFO0lBQzdFLFlBQVksQ0FBVztJQUN2QiwwREFBMEQ7SUFDMUQsS0FBSyxDQUFTO0lBQ2Qsb0VBQW9FO0lBQ3BFLE9BQU8sQ0FBVTtJQUNqQixnQ0FBZ0M7SUFDaEMsSUFBSSxDQUFTO0lBQ2IsMkdBQTJHO0lBQzNHLGlCQUFpQixDQUFpQztJQUNsRCxnRUFBZ0U7SUFDaEUsT0FBTyxDQUFvQztJQUMzQyw4SkFBOEo7SUFDOUosSUFBSSxDQUFJO0lBQ1IscUZBQXFGO0lBQ3JGLE9BQU8sQ0FBUztJQUNoQixZQUFZLElBQTJCLEVBQUUsTUFBYztRQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2pJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLElBQUksb0JBQVUsQ0FB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