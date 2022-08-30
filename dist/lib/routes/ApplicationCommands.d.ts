import BaseRoute from "./BaseRoute";
import type { AnyApplicationCommand, ApplicationCommandOptionConversion, CreateApplicationCommandOptions, EditApplicationCommandOptions, EditApplicationCommandPermissionsOptions, RESTGuildApplicationCommandPermissions, CreateGuildApplicationCommandOptions, EditGuildApplicationCommandOptions } from "../types/application-commands";
import ApplicationCommand from "../structures/ApplicationCommand";
export default class ApplicationCommands extends BaseRoute {
    /**
     * Overwrite all existing global application commands.
     * @param applicationID - The ID of the application.
     * @param options - The commands.
     */
    bulkEditGlobalCommands(applicationID: string, options: Array<CreateApplicationCommandOptions>): Promise<ApplicationCommand<import("..").ApplicationCommandTypes>[]>;
    /**
     * Overwrite all existing application commands in a guild.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     * @param options - The commands.
     */
    bulkEditGuildCommands(applicationID: string, guildID: string, options: Array<CreateGuildApplicationCommandOptions>): Promise<ApplicationCommand<import("..").ApplicationCommandTypes>[]>;
    /**
     * Create a global application command.
     * @param applicationID - The ID of the application.
     * @param options - The options for the command.
     */
    createGlobalCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(applicationID: string, options: T): Promise<ApplicationCommandOptionConversion<T>>;
    /**
     * Create a guild application command.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     * @param options - The options for the command.
     */
    createGuildCommand<T extends CreateGuildApplicationCommandOptions = CreateGuildApplicationCommandOptions>(applicationID: string, guildID: string, options: T): Promise<ApplicationCommandOptionConversion<T>>;
    /**
     * Delete a global application command.
     * @param applicationID - The ID of the application.
     * @param commandID - The ID ID the command to delete.
     */
    deleteGlobalCommand(applicationID: string, commandID: string): Promise<void>;
    /**
     * Delete a guild application command.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command to delete.
     */
    deleteGuildCommand(applicationID: string, guildID: string, commandID: string): Promise<void>;
    /**
     * Edit a global application command.
     * @param applicationID - The ID of the application.
     * @param commandID - The ID of the command to edit.
     * @param options - The options for editing the command.
     */
    editGlobalCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(applicationID: string, commandID: string, options: T): Promise<ApplicationCommandOptionConversion<T>>;
    /**
     * Edit a guild application command.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command to edit.
     * @param options - The options for editing the command.
     */
    editGuildCommand<T extends EditGuildApplicationCommandOptions = EditGuildApplicationCommandOptions>(applicationID: string, guildID: string, commandID: string, options: T): Promise<ApplicationCommandOptionConversion<T>>;
    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command.
     * @param options - The options for editing the permissions.
     */
    editGuildCommandPermissions(applicationID: string, guildID: string, commandID: string, options: EditApplicationCommandPermissionsOptions): Promise<RESTGuildApplicationCommandPermissions>;
    /**
     * Get a global application command.
     * @param applicationID - The ID of the application.
     * @param commandID - The ID of the command.
     * @param withLocalizations - If localizations should be included.
     */
    getGlobalCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(applicationID: string, commandID: string, withLocalizations?: W): Promise<T>;
    /**
     * Get an application's global commands.
     * @param applicationID - The ID of the application.
     * @param withLocalizations - If localizations should be included.
     */
    getGlobalCommands<W extends boolean = false>(applicationID: string, withLocalizations?: W): Promise<AnyApplicationCommand<W>[]>;
    /**
     * Get a global application command.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command.
     * @param withLocalizations - If localizations should be included.
     */
    getGuildCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(applicationID: string, guildID: string, commandID: string, withLocalizations?: W): Promise<T>;
    /**
     * Get an application's application commands in a specific guild.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     * @param withLocalizations - If localizations should be included.
     */
    getGuildCommands<W extends boolean = false>(applicationID: string, guildID: string, withLocalizations?: W): Promise<AnyApplicationCommand<W>[]>;
    /**
     * Get an application command's permissions in a guild.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     * @param commandID - The ID of the command.
     */
    getGuildPermission(applicationID: string, guildID: string, commandID: string): Promise<RESTGuildApplicationCommandPermissions>;
    /**
     * Get the permissions for all application commands in a guild.
     * @param applicationID - The ID of the application.
     * @param guildID - The ID of the guild.
     */
    getGuildPermissions(applicationID: string, guildID: string): Promise<RESTGuildApplicationCommandPermissions[]>;
}
