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
     * @param options - The commands.
     */
    async bulkEditGlobalCommands(options) {
        return this._client.rest.applicationCommands.bulkEditGlobalCommands(this.id, options);
    }
    /**
     * Overwrite all existing application commands in a guild.
     * @param guildID - The ID of the guild.
     * @param options - The commands.
     */
    async bulkEditGuildCommands(guildID, options) {
        return this._client.rest.applicationCommands.bulkEditGuildCommands(this.id, guildID, options);
    }
    /**
     * Create a global application command.
     * @param options - The options for creating the command.
     */
    async createGlobalCommand(options) {
        return this._client.rest.applicationCommands.createGlobalCommand(this.id, options);
    }
    /**
     * Create a guild application command.
     * @param guildID - The ID of the guild.
     * @param options - The options for creating the command.
     */
    async createGuildCommand(guildID, options) {
        return this._client.rest.applicationCommands.createGuildCommand(this.id, guildID, options);
    }
    /**
     * Delete a global application command.
     * @param commandID - The ID of the command.
     */
    async deleteGlobalCommand(commandID) {
        return this._client.rest.applicationCommands.deleteGlobalCommand(this.id, commandID);
    }
    /**
     * Delete a guild application command.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command.
     */
    async deleteGuildCommand(guildID, commandID) {
        return this._client.rest.applicationCommands.deleteGuildCommand(this.id, guildID, commandID);
    }
    /**
     * Edit a global application command.
     * @param commandID - The ID of the command.
     * @param options - The options for editing the command.
     */
    async editGlobalCommand(commandID, options) {
        return this._client.rest.applicationCommands.editGlobalCommand(this.id, commandID, options);
    }
    /**
     * Edit a guild application command.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command.
     * @param options - The options for editing the command.
     */
    async editGuildCommand(guildID, commandID, options) {
        return this._client.rest.applicationCommands.editGuildCommand(this.id, guildID, commandID, options);
    }
    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command.
     * @param options - The options for editing the permissions.
     */
    async editGuildCommandPermissions(guildID, commandID, options) {
        return this._client.rest.applicationCommands.editGuildCommandPermissions(this.id, guildID, commandID, options);
    }
    /**
     * Get a global application command.
     * @param commandID - The ID of the command.
     * @param withLocalizations - If localizations should be included.
     */
    async getGlobalCommand(commandID, withLocalizations) {
        return this._client.rest.applicationCommands.getGlobalCommand(this.id, commandID, withLocalizations);
    }
    /**
     * Get this application's global commands.
     * @param withLocalizations - If localizations should be included.
     */
    async getGlobalCommands(withLocalizations) {
        return this._client.rest.applicationCommands.getGlobalCommands(this.id, withLocalizations);
    }
    /**
     * Get a global application command.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command.
     * @param withLocalizations - If localizations should be included.
     */
    async getGuildCommand(guildID, commandID, withLocalizations) {
        return this._client.rest.applicationCommands.getGuildCommand(this.id, guildID, commandID, withLocalizations);
    }
    /**
     * Get this application's commands in a specific guild.
     * @param guildID - The ID of the guild.
     * @param withLocalization - If localizations should be included.
     */
    async getGuildCommands(guildID, withLocalizations) {
        return this._client.rest.applicationCommands.getGuildCommands(this.id, guildID, withLocalizations);
    }
    /**
     * Get a command's permissions in a guild.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command.
     */
    async getGuildPermission(guildID, commandID) {
        return this._client.rest.applicationCommands.getGuildPermission(this.id, guildID, commandID);
    }
    /**
     * Get the permissions for all commands in a guild.
     * @param guildID - The ID of the guild.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50QXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9DbGllbnRBcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQWExQixnR0FBZ0c7QUFDaEcsTUFBcUIsaUJBQWtCLFNBQVEsY0FBSTtJQUMvQyx5SUFBeUk7SUFDekksS0FBSyxDQUFTO0lBQ2QsWUFBWSxJQUEwQixFQUFFLE1BQWM7UUFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRVMsTUFBTSxDQUFDLElBQW1DO1FBQ2hELElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVc7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxPQUErQztRQUN4RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMscUJBQXFCLENBQUMsT0FBZSxFQUFFLE9BQW9EO1FBQzdGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxtQkFBbUIsQ0FBOEUsT0FBVTtRQUM3RyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFt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