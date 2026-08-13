/** @module ClientApplication */
import Base from "./Base";
import type ApplicationCommand from "./ApplicationCommand";
import TestEntitlement from "./TestEntitlement";
import Entitlement from "./Entitlement";
import BaseEntitlement from "./BaseEntitlement";
import type SKU from "./SKU";
import type Application from "./Application";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import type { ApplicationCommandTypes } from "../Constants";
import TypedCollection from "../util/TypedCollection";

/** A representation of the authorized client's application (typically received via gateway). */
export default class ClientApplication extends Base {
    /** The entitlements for this application. This will almost certainly be empty unless you fetch entitlements, or recieve new/updated entitlements. */
    entitlements: TypedCollection<Types.Applications.RawEntitlement | Types.Applications.RawTestEntitlement, Entitlement | TestEntitlement>;
    /**
     * This application's [flags](https://discord.com/developers/docs/resources/application#application-object-application-flags).
     * @deprecated See {@link flagsNew}. This will likely be made a bigint in the future.
     */
    flags: number;
    /** This application's [flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
    flagsNew: bigint;
    constructor(data: Types.Applications.RawClientApplication, client: Client) {
        super(data.id, client);
        this.entitlements = new TypedCollection(BaseEntitlement, client, Infinity, {
            construct: (entitlement): BaseEntitlement => {
                if ("subscription_id" in entitlement && entitlement.subscription_id) {
                    return new Entitlement(entitlement as Types.Applications.RawEntitlement, client);
                }

                return new TestEntitlement(entitlement as Types.Applications.RawTestEntitlement, client);
            }
        }) as TypedCollection<Types.Applications.RawEntitlement | Types.Applications.RawTestEntitlement, Entitlement | TestEntitlement>;
        this.flags = data.flags ?? 0;
        this.flagsNew = BigInt(data.flags_new ?? data.flags ?? "0");
        this.update(data);
    }

    protected override update(data: Partial<Types.Applications.RawClientApplication>): void {
        if (data.flags !== undefined) {
            this.flags = data.flags;
        }
    }

    /**
     * Overwrite all existing global application commands.
     * @param options The commands.
     */
    async bulkEditGlobalCommands(options: Array<Types.Applications.CreateApplicationCommandOptions>): Promise<Array<ApplicationCommand<ApplicationCommandTypes>>> {
        return this.client.rest.applications.bulkEditGlobalCommands(this.id, options);
    }

    /**
     * Overwrite all existing application commands in a guild.
     * @param guildID The ID of the guild.
     * @param options The commands.
     */
    async bulkEditGuildCommands(guildID: string, options: Array<Types.Applications.CreateGuildApplicationCommandOptions>): Promise<Array<ApplicationCommand<ApplicationCommandTypes>>> {
        return this.client.rest.applications.bulkEditGuildCommands(this.id, guildID, options);
    }

    /**
     * Mark an entitlement as consumed.
     * @param entitlementID The ID of the entitlement to consume.
     */
    async consumeEntitlement(entitlementID: string): Promise<void> {
        return this.client.rest.applications.consumeEntitlement(this.id, entitlementID);
    }

    /**
     * Create an emoji for this application.
     * @param options The options for creating the emoji.
     * @caching This method **does not** cache its result.
     */
    async createEmoji(options: Types.Applications.CreateApplicationEmojiOptions): Promise<Types.Applications.ApplicationEmoji> {
        return this.client.rest.applications.createEmoji(this.id, options);
    }

    /**
     * Create a global application command.
     * @param options The options for creating the command.
     */
    async createGlobalCommand<T extends Types.Applications.CreateApplicationCommandOptions = Types.Applications.CreateApplicationCommandOptions>(options: T): Promise<Types.Applications.ApplicationCommandOptionConversion<T>> {
        return this.client.rest.applications.createGlobalCommand<T>(this.id, options);
    }

    /**
     * Create a guild application command.
     * @param guildID The ID of the guild.
     * @param options The options for creating the command.
     */
    async createGuildCommand<T extends Types.Applications.CreateGuildApplicationCommandOptions = Types.Applications.CreateGuildApplicationCommandOptions>(guildID: string, options: T): Promise<Types.Applications.ApplicationCommandOptionConversion<T>> {
        return this.client.rest.applications.createGuildCommand<T>(this.id, guildID, options);
    }

    /**
     * Create a test entitlement.
     * @param options The options for creating the test entitlement.
     */
    async createTestEntitlement(options: Types.Applications.CreateTestEntitlementOptions): Promise<TestEntitlement> {
        return this.client.rest.applications.createTestEntitlement(this.id, options);
    }
    /**
     * Delete an emoji for this application.
     * @param emojiID The ID of the emoji to be deleted.
     * @caching This method **does not** cache its result.
     */
    async deleteEmoji(emojiID: string): Promise<void> {
        return this.client.rest.applications.deleteEmoji(this.id, emojiID);
    }

    /**
     * Delete a global application command.
     * @param commandID The ID of the command.
     */
    async deleteGlobalCommand(commandID: string): Promise<void> {
        return this.client.rest.applications.deleteGlobalCommand(this.id, commandID);
    }

    /**
     * Delete a guild application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     */
    async deleteGuildCommand(guildID: string, commandID: string): Promise<void> {
        return this.client.rest.applications.deleteGuildCommand(this.id, guildID, commandID);
    }

    /**
     * Delete a test entitlement.
     * @param entitlementID The ID of the entitlement to delete.
     */
    async deleteTestEntitlement(entitlementID: string): Promise<void> {
        return this.client.rest.applications.deleteTestEntitlement(this.id, entitlementID);
    }

    /**
     * Edit this application.
     * @param options The options for editing the application.
     */
    async edit(options: Types.Applications.EditApplicationOptions): Promise<Application> {
        return this.client.rest.applications.editCurrent(options);
    }

    /**
     * Edit an existing emoji for this application.
     * @param emojiID The ID of the emoji to be edited.
     * @param options The options for editing the emoji.
     * @caching This method **does not** cache its result.
     */
    async editEmoji(emojiID: string, options: Types.Applications.EditApplicationEmojiOptions): Promise<Types.Applications.ApplicationEmoji> {
        return this.client.rest.applications.editEmoji(this.id, emojiID, options);
    }

    /**
     * Edit a global application command.
     * @param commandID The ID of the command.
     * @param options The options for editing the command.
     */
    async editGlobalCommand<T extends Types.Applications.EditApplicationCommandOptions = Types.Applications.EditApplicationCommandOptions>(commandID: string, options: T): Promise<Types.Applications.ApplicationCommandOptionConversion<T>> {
        return this.client.rest.applications.editGlobalCommand<T>(this.id, commandID, options);
    }

    /**
     * Edit a guild application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the command.
     */
    async editGuildCommand<T extends Types.Applications.EditGuildApplicationCommandOptions = Types.Applications.EditGuildApplicationCommandOptions>(guildID: string, commandID: string, options: T): Promise<Types.Applications.ApplicationCommandOptionConversion<T>> {
        return this.client.rest.applications.editGuildCommand<T>(this.id, guildID, commandID, options);
    }

    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the permissions.
     */
    async editGuildCommandPermissions(guildID: string, commandID: string, options: Types.Applications.EditApplicationCommandPermissionsOptions): Promise<Types.Applications.RESTGuildApplicationCommandPermissions> {
        return this.client.rest.applications.editGuildCommandPermissions(this.id, guildID, commandID, options);
    }

    /**
     * Get an activity instance.
     * @param instanceID The ID of the instance.
     */
    async getActivityInstance(instanceID: string): Promise<Types.Applications.ActivityInstance> {
        return this.client.rest.applications.getActivityInstance(this.id, instanceID);
    }

    /**
     * Get an emoji for this application.
     * @param emojiID The ID of the emoji to get.
     */
    async getEmoji(emojiID: string): Promise<Types.Applications.ApplicationEmoji> {
        return this.client.rest.applications.getEmoji(this.id, emojiID);
    }

    /**
     * Get the emojis for this application.
     */
    async getEmojis(): Promise<Types.Applications.ApplicationEmojis> {
        return this.client.rest.applications.getEmojis(this.id);
    }

    /**
     * Get the entitlements for this application.
     * @param options The options for getting the entitlements.
     */
    async getEntitlements(options: Types.Applications.SearchEntitlementsOptions = {}): Promise<Array<Entitlement | TestEntitlement>> {
        return this.client.rest.applications.getEntitlements(this.id, options);
    }

    /**
     * Get a global application command.
     * @param commandID The ID of the command.
     * @param options The options for getting the command.
     */
    async getGlobalCommand<T extends Types.Applications.AnyApplicationCommand = Types.Applications.AnyApplicationCommand>(commandID: string, options?: Types.Applications.GetApplicationCommandOptions): Promise<T> {
        return this.client.rest.applications.getGlobalCommand<T>(this.id, commandID, options);
    }

    /**
     * Get this application's global commands.
     * @param options The options for getting the command.
     */
    async getGlobalCommands(options?: Types.Applications.GetApplicationCommandOptions): Promise<Array<Types.Applications.AnyApplicationCommand>> {
        return this.client.rest.applications.getGlobalCommands(this.id, options);
    }

    /**
     * Get a global application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for getting the command.
     */
    async getGuildCommand<T extends Types.Applications.AnyApplicationCommand = Types.Applications.AnyApplicationCommand>(guildID: string, commandID: string, options?: Types.Applications.GetApplicationCommandOptions): Promise<T> {
        return this.client.rest.applications.getGuildCommand<T>(this.id, guildID, commandID, options);
    }

    /**
     * Get this application's commands in a specific guild.
     * @param guildID The ID of the guild.
     * @param options The options for getting the command.
     */
    async getGuildCommands(guildID: string, options?: Types.Applications.GetApplicationCommandOptions): Promise<Array<Types.Applications.AnyApplicationCommand>> {
        return this.client.rest.applications.getGuildCommands(this.id, guildID, options);
    }

    /**
     * Get a command's permissions in a guild.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     */
    async getGuildPermission(guildID: string, commandID: string): Promise<Types.Applications.RESTGuildApplicationCommandPermissions> {
        return this.client.rest.applications.getGuildPermission(this.id, guildID, commandID);
    }

    /**
     * Get the permissions for all commands in a guild.
     * @param guildID The ID of the guild.
     */
    async getGuildPermissions(guildID: string): Promise<Array<Types.Applications.RESTGuildApplicationCommandPermissions>> {
        return this.client.rest.applications.getGuildPermissions(this.id, guildID);
    }

    /**
     * Get this application's role connection metadata records.
     */
    async getRoleConnectionsMetadata(): Promise<Array<Types.OAuth.RoleConnectionMetadata>> {
        return this.client.rest.oauth.getRoleConnectionsMetadata(this.id);
    }

    /**
     * Get the SKUs for this application.
     */
    async getSKUs(): Promise<Array<SKU>> {
        return this.client.rest.applications.getSKUs(this.id);
    }

    /**
     * Get the authenticated user's role connection object for this application. This requires the `role_connections.write` scope.
     */
    async getUserRoleConnection(): Promise<Types.OAuth.RoleConnection> {
        return this.client.rest.oauth.getUserRoleConnection(this.id);
    }

    override toJSON(): Types.JSON.JSONClientApplication {
        return {
            ...super.toJSON(),
            flags:    this.flags,
            flagsNew: this.flagsNew
        };
    }

    /**
     * Update this application's role connections metadata.
     * @param metadata The metadata records.
     */
    async updateRoleConnectionsMetadata(metadata: Array<Types.OAuth.RoleConnectionMetadata>): Promise<Array<Types.OAuth.RoleConnectionMetadata>> {
        return this.client.rest.oauth.updateRoleConnectionsMetadata(this.id, metadata);
    }

    /**
     * Update the authenticated user's role connection object for an application. This requires the `role_connections.write` scope.
     * @param data The metadata to update.
     */
    async updateUserRoleConnection(data: Types.OAuth.UpdateUserApplicationRoleConnectionOptions): Promise<Types.OAuth.RoleConnection> {
        return this.client.rest.oauth.updateUserRoleConnection(this.id, data);
    }
}
