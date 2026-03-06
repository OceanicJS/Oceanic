/** @module Role */
import Base from "./Base";
import Permission from "./Permission";
import type Guild from "./Guild";
import type InviteGuild from "./InviteGuild";
import type Role from "./Role";
import type Client from "../Client";
import type { EditRoleOptions, RoleColors, RawInviteRole } from "../types/guilds";
import type { JSONInviteRole } from "../types/json";
import { UncachedError } from "../util/Errors";

/** Represents a partial role for an invite. */
export default class InviteRole extends Base {
    private _cachedCompleteRole?: Role;
    private _cachedGuild?: Guild;
    /**
     * The color of this role.
     * @deprecated Use {@link Role#colors | Role#colors.primaryColor} instead.
     */
    color: number;
    /** The colors of this role. */
    colors: RoleColors;
    guild: InviteGuild;
    /** The id of the guild this role is in. */
    guildID: string;
    /** The icon has of this role. */
    icon: string | null;
    /** The name of this role. */
    name: string;
    /** The permissions of this role. */
    permissions: Permission;
    /** The position of this role. */
    position: number;
    /** The unicode emoji of this role. */
    unicodeEmoji: string | null;
    constructor(data: RawInviteRole, client: Client, guildID: string, guild: InviteGuild) {
        super(data.id, client);
        this.color = data.color;
        this.colors = {
            primaryColor:   data.colors.primary_color,
            secondaryColor: data.colors.secondary_color,
            tertiaryColor:  data.colors.tertiary_color
        };
        this.guild = guild;
        this.guildID = guildID;
        this.icon = data.icon ?? null;
        this.name = data.name;
        this.permissions = new Permission(data.permissions);
        this.position = data.position;
        this.unicodeEmoji = null;
        this.update(data);
    }

    /** The guild this role is in. This will throw an error if the guild is not cached. */
    get completeGuild(): Guild {
        this._cachedGuild ??= this.client.guilds.get(this.guildID);
        if (!this._cachedGuild) {
            if (this.client.options.restMode) {
                throw new UncachedError(`${this.constructor.name}#completeGuild is not present when rest mode is enabled.`);
            }

            if (!this.client.shards.connected) {
                throw new UncachedError(`${this.constructor.name}#completeGuild is not present without a gateway connection.`);
            }

            throw new UncachedError(`${this.constructor.name}#completeGuild is not present.`);
        }

        return this._cachedGuild;
    }

    /** The complete role this InviteRole represents, if cached. */
    get completeRole(): Role | undefined {
        return this._cachedCompleteRole ??= this.client.guilds.get(this.guildID)?.roles.get(this.id);
    }

    /** A string that will mention this role. */
    get mention(): string {
        return `<@&${this.id}>`;
    }

    /**
     * Delete this role.
     * @param reason The reason for deleting the role.
     */
    async delete(reason?: string): Promise<void> {
        return this.client.rest.guilds.deleteRole(this.guildID, this.id, reason);
    }

    /**
     * Edit this role.
     * @param options The options for editing the role.
     */
    async edit(options: EditRoleOptions): Promise<Role> {
        return this.client.rest.guilds.editRole(this.guildID, this.id, options);
    }

    /** Get the complete role this InviteRole represents. */
    async getCompleteRole(): Promise<Role> {
        if (this.completeRole) return this.completeRole;
        const role = await this.client.rest.guilds.getRole(this.guildID, this.id);
        this._cachedCompleteRole = role;
        return role;
    }

    override toJSON(): JSONInviteRole {
        return {
            ...super.toJSON(),
            color:        this.color,
            colors:       this.colors,
            guild:        this.guild.toJSON(),
            guildID:      this.guildID,
            icon:         this.icon,
            name:         this.name,
            permissions:  this.permissions.toJSON(),
            position:     this.position,
            unicodeEmoji: this.unicodeEmoji
        };
    }
}
