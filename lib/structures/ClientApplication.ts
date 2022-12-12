/** @module ClientApplication */
import Base from "./Base";
import type ApplicationCommand from "./ApplicationCommand";
import type Client from "../Client";
import type { RawClientApplication, RoleConnection, RoleConnectionMetadata } from "../types/oauth";
import type {
    AnyApplicationCommand,
    ApplicationCommandOptionConversion,
    CreateApplicationCommandOptions,
    CreateGuildApplicationCommandOptions,
    EditApplicationCommandOptions,
    EditApplicationCommandPermissionsOptions,
    EditGuildApplicationCommandOptions,
    GetApplicationCommandOptions,
    RESTGuildApplicationCommandPermissions
} from "../types/application-commands";
import type { JSONClientApplication } from "../types/json";
import type { ApplicationCommandTypes } from "../Constants";

/** A representation of the authorized client's application (typically received via gateway). */
export default class ClientApplication extends Base {
    /** This application's [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
    flags: number;
    constructor(data: RawClientApplication, client: Client) {
        super(data.id, client);
        this.flags = data.flags;
        this.update(data);
    }

    protected override update(data: Partial<RawClientApplication>): void {
        if (data.flags !== undefined) {
            this.flags = data.flags;
        }
    }

    /**
     * Overwrite all existing global application commands.
     * @param options The commands.
     */
    async bulkEditGlobalCommands(options: Array<CreateApplicationCommandOptions>): Promise<Array<ApplicationCommand<ApplicationCommandTypes>>> {
        return this.client.rest.applicationCommands.bulkEditGlobalCommands(this.id, options);
    }

    /**
     * Overwrite all existing application commands in a guild.
     * @param guildID The ID of the guild.
     * @param options The commands.
     */
    async bulkEditGuildCommands(guildID: string, options: Array<CreateGuildApplicationCommandOptions>): Promise<Array<ApplicationCommand<ApplicationCommandTypes>>> {
        return this.client.rest.applicationCommands.bulkEditGuildCommands(this.id, guildID, options);
    }

    /**
     * Create a global application command.
     * @param options The options for creating the command.
     */
    async createGlobalCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(options: T): Promise<ApplicationCommandOptionConversion<T>> {
        return this.client.rest.applicationCommands.createGlobalCommand<T>(this.id, options);
    }

    /**
     * Create a guild application command.
     * @param guildID The ID of the guild.
     * @param options The options for creating the command.
     */
    async createGuildCommand<T extends CreateGuildApplicationCommandOptions = CreateGuildApplicationCommandOptions>(guildID: string, options: T): Promise<ApplicationCommandOptionConversion<T>> {
        return this.client.rest.applicationCommands.createGuildCommand<T>(this.id, guildID, options);
    }

    /**
     * Delete a global application command.
     * @param commandID The ID of the command.
     */
    async deleteGlobalCommand(commandID: string): Promise<void> {
        return this.client.rest.applicationCommands.deleteGlobalCommand(this.id, commandID);
    }

    /**
     * Delete a guild application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     */
    async deleteGuildCommand(guildID: string, commandID: string): Promise<void> {
        return this.client.rest.applicationCommands.deleteGuildCommand(this.id, guildID, commandID);
    }

    /**
     * Edit a global application command.
     * @param commandID The ID of the command.
     * @param options The options for editing the command.
     */
    async editGlobalCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(commandID: string, options: T): Promise<ApplicationCommandOptionConversion<T>> {
        return this.client.rest.applicationCommands.editGlobalCommand<T>(this.id, commandID, options);
    }

    /**
     * Edit a guild application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the command.
     */
    async editGuildCommand<T extends EditGuildApplicationCommandOptions = EditGuildApplicationCommandOptions>(guildID: string, commandID: string, options: T): Promise<ApplicationCommandOptionConversion<T>> {
        return this.client.rest.applicationCommands.editGuildCommand<T>(this.id, guildID, commandID, options);
    }

    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the permissions.
     */
    async editGuildCommandPermissions(guildID: string, commandID: string, options: EditApplicationCommandPermissionsOptions): Promise<RESTGuildApplicationCommandPermissions> {
        return this.client.rest.applicationCommands.editGuildCommandPermissions(this.id, guildID, commandID, options);
    }

    /**
     * Get a global application command.
     * @param commandID The ID of the command.
     * @param options The options for getting the command.
     */
    async getGlobalCommand<T extends AnyApplicationCommand = AnyApplicationCommand>(commandID: string, options?: GetApplicationCommandOptions): Promise<T> {
        return this.client.rest.applicationCommands.getGlobalCommand<T>(this.id, commandID, options);
    }

    /**
     * Get this application's global commands.
     * @param options The options for getting the command.
     */
    async getGlobalCommands(options?: GetApplicationCommandOptions): Promise<Array<AnyApplicationCommand>> {
        return this.client.rest.applicationCommands.getGlobalCommands(this.id, options);
    }

    /**
     * Get a global application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for getting the command.
     */
    async getGuildCommand<T extends AnyApplicationCommand = AnyApplicationCommand>(guildID: string, commandID: string, options?: GetApplicationCommandOptions): Promise<T> {
        return this.client.rest.applicationCommands.getGuildCommand<T>(this.id, guildID, commandID, options);
    }

    /**
     * Get this application's commands in a specific guild.
     * @param guildID The ID of the guild.
     * @param options The options for getting the command.
     */
    async getGuildCommands(guildID: string, options?: GetApplicationCommandOptions): Promise<Array<AnyApplicationCommand>> {
        return this.client.rest.applicationCommands.getGuildCommands(this.id, guildID, options);
    }

    /**
     * Get a command's permissions in a guild.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     */
    async getGuildPermission(guildID: string, commandID: string): Promise<RESTGuildApplicationCommandPermissions> {
        return this.client.rest.applicationCommands.getGuildPermission(this.id, guildID, commandID);
    }

    /**
     * Get the permissions for all commands in a guild.
     * @param guildID The ID of the guild.
     */
    async getGuildPermissions(guildID: string): Promise<Array<RESTGuildApplicationCommandPermissions>> {
        return this.client.rest.applicationCommands.getGuildPermissions(this.id, guildID);
    }

    /**
     * Get this application's role connection metadata records.
     */
    async getRoleConnectionsMetadata(): Promise<Array<RoleConnectionMetadata>> {
        return this.client.rest.oauth.getRoleConnectionsMetatdata(this.id);
    }

    /**
     * Get the authenticated user's role connection object for this application. This requires the `role_connections.write` scope.
     */
    async getUserRoleConnection(): Promise<RoleConnection> {
        return this.client.rest.oauth.getUserRoleConnection(this.id);
    }

    override toJSON(): JSONClientApplication {
        return {
            ...super.toJSON(),
            flags: this.flags
        };
    }

    /**
     * Update this application's role connections metadata.
     * @param metadata The metadata records.
     */
    async updateRoleConnectionsMetata(metadata: Array<RoleConnectionMetadata>): Promise<Array<RoleConnectionMetadata>> {
        return this.client.rest.oauth.updateRoleConnectionsMetata(this.id, metadata);
    }

    /**
     * Update the authenticated user's role connection object for an application. This requires the `role_connections.write` scope.
     * @param data The metadata to update.
     */
    async updateUserRoleConnection(data: RoleConnection): Promise<RoleConnection> {
        return this.client.rest.oauth.updateUserRoleConnection(this.id, data);
    }
}
