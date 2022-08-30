import Base from "./Base";
import Permission from "./Permission";
import type Guild from "./Guild";
import type ClientApplication from "./ClientApplication";
import type Client from "../Client";
import { ApplicationCommandTypes } from "../Constants";
import type { ApplicationCommandOptions, EditApplicationCommandPermissionsOptions, RawApplicationCommand, TypeToEdit } from "../types/application-commands";
import type { Uncached } from "../types/shared";
import type { JSONApplicationCommand } from "../types/json";

export default class ApplicationCommand<T extends ApplicationCommandTypes = ApplicationCommandTypes> extends Base {
    /** The the application this command is for. This can be a partial object with only an `id` property. */
    application: ClientApplication | Uncached;
    /** The default permissions for this command. */
    defaultMemberPermissions: Permission | null;
    /** The description of this command. Empty string for non `CHAT_INPUT` commands. */
    description: T extends ApplicationCommandTypes.CHAT_INPUT ? string : "";
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. */
    descriptionLocalizations?: Record<string, string> | null;
    /** If this command can be used in direct messages (global commands only). */
    dmPermission?: boolean;
    /** The guild this command is in (guild commands only). */
    guild?: Guild;
    /** The id of the guild this command is in (guild commands only). */
    guildID?: string;
    /** The name of this command. */
    name: string;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names. */
    nameLocalizations?: Record<string, string> | null;
    /** The options on this command. Only valid for `CHAT_INPUT`. */
    options?: Array<ApplicationCommandOptions>;
    /** The [type](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types) of this command. */
    type: T;
    /** Autoincrementing version identifier updated during substantial record changes. */
    version: string;
    constructor(data: RawApplicationCommand, client: Client) {
        super(data.id, client);
        this.application = this._client.application?.id === data.application_id ? this._client.application : { id: data.application_id };
        this.defaultMemberPermissions = data.default_member_permissions ? new Permission(data.default_member_permissions) : null;
        this.description = data.description as never;
        this.descriptionLocalizations = data.description_localizations;
        this.dmPermission = data.dm_permission;
        this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
        this.guildID = !data.guild_id ? undefined : data.guild_id;
        this.name = data.name;
        this.nameLocalizations = data.name_localizations;
        this.options = data.options?.map(o => this._client.util.optionToParsed(o));
        this.type = (data.type || ApplicationCommandTypes.CHAT_INPUT) as T;
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
     * @param options The options for editing the command.
     */
    async edit(options: TypeToEdit<T>) {
        return this.guildID ? this._client.rest.applicationCommands.editGuildCommand(this.application.id, this.guildID, this.id, options) : this._client.rest.applicationCommands.editGlobalCommand(this.application.id, this.id, options);
    }

    /**
     * Edit this command's permissions (guild commands only). This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param options The options for editing the permissions.
     */
    async editGuildCommandPermissions(options: EditApplicationCommandPermissionsOptions) {
        if (!this.guildID) throw new Error("editGuildCommandPermissions cannot be used on global commands.");
        return this._client.rest.applicationCommands.editGuildCommandPermissions(this.application.id, this.guildID, this.id, options);
    }

    /**
     * Get this command's permissions (guild commands only).
     */
    async getGuildPermission() {
        if (!this.guildID) throw new Error("getGuildPermission cannot be used on global commands.");
        return this._client.rest.applicationCommands.getGuildPermission(this.application.id, this.guildID, this.id);
    }

    /**
     * Get a mention for this command.
     * @param sub The subcommand group and/or subcommand to include (["subcommand"] or ["subcommand-group", "subcommand"]).
     */
    mention(sub?: [subcommand: string] | [subcommandGroup: string, subcommand: string]) {
        let text = `${this.name}`;
        if (sub?.length) text += ` ${sub.slice(0, 2).join(" ")}`;
        return `<${text}:${this.id}>`;
    }

    override toJSON(): JSONApplicationCommand {
        return {
            ...super.toJSON(),
            application:              this.application.id,
            defaultMemberPermissions: this.defaultMemberPermissions?.toJSON(),
            description:              this.description,
            descriptionLocalizations: this.descriptionLocalizations,
            dmPermission:             this.dmPermission,
            guild:                    this.guildID,
            name:                     this.name,
            nameLocalizations:        this.nameLocalizations,
            options:                  this.options,
            type:                     this.type,
            version:                  this.version
        };
    }
}
