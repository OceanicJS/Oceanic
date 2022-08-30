import Base from "./Base";
import type Client from "../Client";
import type { RawClientApplication } from "../types/oauth";
import type { AnyApplicationCommand, CreateApplicationCommandOptions, CreateGuildApplicationCommandOptions, EditApplicationCommandOptions, EditApplicationCommandPermissionsOptions, EditGuildApplicationCommandOptions } from "../types/application-commands";
import type { JSONClientApplication } from "../types/json";
/** A representation of the authorized client's application (typically recieved via gateway). */
export default class ClientApplication extends Base {
    /** This application's [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
    flags: number;
    constructor(data: RawClientApplication, client: Client);
    protected update(data: Partial<RawClientApplication>): void;
    /**
     * Overwrite all existing global application commands.
     * @param options The commands.
     */
    bulkEditGlobalCommands(options: Array<CreateApplicationCommandOptions>): Promise<import("./ApplicationCommand").default<import("..").ApplicationCommandTypes>[]>;
    /**
     * Overwrite all existing application commands in a guild.
     * @param guildID The ID of the guild.
     * @param options The commands.
     */
    bulkEditGuildCommands(guildID: string, options: Array<CreateGuildApplicationCommandOptions>): Promise<import("./ApplicationCommand").default<import("..").ApplicationCommandTypes>[]>;
    /**
     * Create a global application command.
     * @param options The options for creating the command.
     */
    createGlobalCommand<T extends CreateApplicationCommandOptions = CreateApplicationCommandOptions>(options: T): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<T>>;
    /**
     * Create a guild application command.
     * @param guildID The ID of the guild.
     * @param options The options for creating the command.
     */
    createGuildCommand<T extends CreateGuildApplicationCommandOptions = CreateGuildApplicationCommandOptions>(guildID: string, options: T): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<T>>;
    /**
     * Delete a global application command.
     * @param commandID The ID of the command.
     */
    deleteGlobalCommand(commandID: string): Promise<void>;
    /**
     * Delete a guild application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     */
    deleteGuildCommand(guildID: string, commandID: string): Promise<void>;
    /**
     * Edit a global application command.
     * @param commandID The ID of the command.
     * @param options The options for editing the command.
     */
    editGlobalCommand<T extends EditApplicationCommandOptions = EditApplicationCommandOptions>(commandID: string, options: T): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<T>>;
    /**
     * Edit a guild application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the command.
     */
    editGuildCommand<T extends EditGuildApplicationCommandOptions = EditGuildApplicationCommandOptions>(guildID: string, commandID: string, options: T): Promise<import("../types/application-commands").ApplicationCommandOptionConversion<T>>;
    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the permissions.
     */
    editGuildCommandPermissions(guildID: string, commandID: string, options: EditApplicationCommandPermissionsOptions): Promise<import("../types/application-commands").RESTGuildApplicationCommandPermissions>;
    /**
     * Get a global application command.
     * @param commandID The ID of the command.
     * @param withLocalizations If localizations should be included.
     */
    getGlobalCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(commandID: string, withLocalizations?: W): Promise<T>;
    /**
     * Get this application's global commands.
     * @param withLocalizations If localizations should be included.
     */
    getGlobalCommands<W extends boolean = false>(withLocalizations?: W): Promise<AnyApplicationCommand<W>[]>;
    /**
     * Get a global application command.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param withLocalizations If localizations should be included.
     */
    getGuildCommand<W extends boolean = false, T extends AnyApplicationCommand<W> = AnyApplicationCommand<W>>(guildID: string, commandID: string, withLocalizations?: W): Promise<T>;
    /**
     * Get this application's commands in a specific guild.
     * @param guildID The ID of the guild.
     * @param withLocalization If localizations should be included.
     */
    getGuildCommands<W extends boolean = false>(guildID: string, withLocalizations?: W): Promise<AnyApplicationCommand<W>[]>;
    /**
     * Get a command's permissions in a guild.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     */
    getGuildPermission(guildID: string, commandID: string): Promise<import("../types/application-commands").RESTGuildApplicationCommandPermissions>;
    /**
     * Get the permissions for all commands in a guild.
     * @param guildID The ID of the guild.
     */
    getGuildPermissions(guildID: string): Promise<import("../types/application-commands").RESTGuildApplicationCommandPermissions[]>;
    toJSON(): JSONClientApplication;
}
