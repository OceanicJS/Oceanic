import Base from "./Base";
import type Client from "../Client";
import type { RawClientApplication } from "../types/oauth";
import type {
    AnyApplicationCommand,
    CreateApplicationCommandOptions,
    CreateGuildApplicationCommandOptions,
    EditApplicationCommandOptions,
    EditApplicationCommandPermissionsOptions,
    EditGuildApplicationCommandOptions
} from "../types/application-commands";
import type { JSONClientApplication } from "../types/json";

/** A representation of the authorized client's application (typically recieved via gateway). */
export default class ClientApplication extends Base {
    /** This application's [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
    flags: number;
    constructor(data: RawClientApplication, client: Client) {
        super(data.id, client);
        this.update(data);
    }

    protected update(data: Partial<RawClientApplication>): void {
        if (typeof data.flags !== "undefined") this.flags = data.flags;
    }

    /**
     * Overwrite all existing global application commands.
     * @param options The commands.
     */
    async bulkEditGlobalCommands(options: Array<CreateApplicationCommandOptions>) {
        return this._client.rest.applicationCommands.bulkEditGlobalCommands(this.id, options);
    }

    /**
     * Overwrite all existing application commands in a guild.
     * @param guildID The ID of the guild.
     * @param options The commands.
     */
    async bulkEditGuildCommands(guildID: string, options: Array<CreateGuildApplicationCommandOptions>) {
        return this._client.rest.applicationCommands.bulkEditGuildCommands(this.id, guildID, options);
    }

    /**
     * Create a global application command.
     * @param options The options for creating the command.
     */
    async createGlobalCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(options: T) {
        return this._client.rest.applicationCommands.createGlobalCommand<T>(this.id, options);
    }

    /**
     * Create a guild application command.
     * @param guildID The ID of the guild.
     * @param options The options for creating the command.
     */
    async createGuildCommand<T extends CreateGuildApplicationCommandOptions = CreateGuildApplicationCommandOptions>(guildID: string, options: T) {
        return this._client.rest.applicationCommands.createGuildCommand<T>(this.id, guildID, options);
    }

    /**
     * Delete a global application command.
     * @param commandID The ID of the command.
     */
    async deleteGlobalCommand(commandID: string) {
        return this._client.rest.applicationCommands.deleteGlobalCommand(this.id, commandID);
    }

    /**
     * Delete a guild application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     */
    async deleteGuildCommand(guildID: string, commandID: string) {
        return this._client.rest.applicationCommands.deleteGuildCommand(this.id, guildID, commandID);
    }

    /**
     * Edit a global application command.
     * @param commandID The ID of the command.
     * @param options The options for editing the command.
     */
    async editGlobalCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(commandID: string, options: T) {
        return this._client.rest.applicationCommands.editGlobalCommand<T>(this.id, commandID, options);
    }

    /**
     * Edit a guild application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the command.
     */
    async editGuildCommand<T extends EditGuildApplicationCommandOptions = EditGuildApplicationCommandOptions>(guildID: string, commandID: string, options: T) {
        return this._client.rest.applicationCommands.editGuildCommand<T>(this.id, guildID, commandID, options);
    }

    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the permissions.
     */
    async editGuildCommandPermissions(guildID: string, commandID: string, options: EditApplicationCommandPermissionsOptions) {
        return this._client.rest.applicationCommands.editGuildCommandPermissions(this.id, guildID, commandID, options);
    }

    /**
     * Get a global application command.
     * @param commandID The ID of the command.
     * @param withLocalizations If localizations should be included.
     */
    async getGlobalCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(commandID: string, withLocalizations?: W) {
        return this._client.rest.applicationCommands.getGlobalCommand<W, T>(this.id, commandID, withLocalizations);
    }

    /**
     * Get this application's global commands.
     * @param withLocalizations If localizations should be included.
     */
    async getGlobalCommands<W extends boolean = false>(withLocalizations?: W) {
        return this._client.rest.applicationCommands.getGlobalCommands<W>(this.id, withLocalizations);
    }

    /**
     * Get a global application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param withLocalizations If localizations should be included.
     */
    async getGuildCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(guildID: string, commandID: string, withLocalizations?: W) {
        return this._client.rest.applicationCommands.getGuildCommand<W, T>(this.id, guildID, commandID, withLocalizations);
    }

    /**
     * Get this application's commands in a specific guild.
     * @param guildID The ID of the guild.
     * @param withLocalization If localizations should be included.
     */
    async getGuildCommands<W extends boolean = false>(guildID: string, withLocalizations?: W) {
        return this._client.rest.applicationCommands.getGuildCommands<W>(this.id, guildID, withLocalizations);
    }

    /**
     * Get a command's permissions in a guild.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     */
    async getGuildPermission(guildID: string, commandID: string) {
        return this._client.rest.applicationCommands.getGuildPermission(this.id, guildID, commandID);
    }

    /**
     * Get the permissions for all commands in a guild.
     * @param guildID The ID of the guild.
     */
    async getGuildPermissions(guildID: string) {
        return this._client.rest.applicationCommands.getGuildPermissions(this.id, guildID);
    }

    override toJSON(): JSONClientApplication {
        return {
            ...super.toJSON(),
            flags: this.flags
        };
    }
}
