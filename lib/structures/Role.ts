/** @module Role */
import Base from "./Base";
import Permission from "./Permission";
import type Guild from "./Guild";
import type Client from "../Client";
import type { RawRole, RoleTags, EditRoleOptions } from "../types/guilds";
import type { JSONRole } from "../types/json";

/** Represents a role in a guild. */
export default class Role extends Base {
    private _cachedGuild?: Guild;
    /** The color of this role. */
    color: number;
    /** The id of the guild this role is in. */
    guildID: string;
    /** If this role is hoisted. */
    hoist: boolean;
    /** The icon has of this role. */
    icon: string | null;
    /** If this role is managed by an integration. */
    managed: boolean;
    /** If this role can be mentioned by anybody. */
    mentionable: boolean;
    /** The name of this role. */
    name: string;
    /** The permissions of this role. */
    permissions: Permission;
    /** The position of this role. */
    position: number;
    /** The [tags](https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure) of this role. */
    tags: RoleTags;
    /** The unicode emoji of this role. */
    unicodeEmoji: string | null;
    constructor(data: RawRole, client: Client, guildID: string) {
        super(data.id, client);
        this.color = data.color;
        this.guildID = guildID;
        this.hoist = !!data.hoist;
        this.icon = null;
        this.managed = !!data.managed;
        this.mentionable = !!data.mentionable;
        this.name = data.name;
        this.permissions = new Permission(data.permissions);
        this.position = data.position;
        this.tags = {
            availableForPurchase: false,
            premiumSubscriber:    false
        };
        this.unicodeEmoji = null;
        this.update(data);
    }

    protected override update(data: Partial<RawRole>): void {
        if (data.color !== undefined) {
            this.color = data.color;
        }
        if (data.hoist !== undefined) {
            this.hoist = data.hoist;
        }
        if (data.icon !== undefined) {
            this.icon = data.icon ?? null;
        }
        if (data.mentionable !== undefined) {
            this.mentionable = data.mentionable;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.permissions !== undefined) {
            this.permissions = new Permission(data.permissions);
        }
        if (data.position !== undefined) {
            this.position = data.position;
        }
        if (data.tags !== undefined) {
            this.tags = {
                availableForPurchase:  data.tags.available_for_purchase === null,
                botID:                 data.tags.bot_id,
                integrationID:         data.tags.integration_id,
                premiumSubscriber:     data.tags.premium_subscriber === null,
                subscriptionListingID: data.tags.subscription_listing_id
            };
        }
        if (data.unicode_emoji !== undefined) {
            this.unicodeEmoji = data.unicode_emoji ?? null;
        }
    }

    /** The guild this role is in. This will throw an error if the guild is not cached. */
    get guild(): Guild {
        if (!this._cachedGuild) {
            this._cachedGuild = this.client.guilds.get(this.guildID);

            if (!this._cachedGuild) {
                throw new Error(`${this.constructor.name}#guild is not present if you don't have the GUILDS intent.`);
            }
        }

        return this._cachedGuild;
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

    override toJSON(): JSONRole {
        return {
            ...super.toJSON(),
            color:        this.color,
            guildID:      this.guildID,
            hoist:        this.hoist,
            icon:         this.icon,
            managed:      this.managed,
            mentionable:  this.mentionable,
            name:         this.name,
            permissions:  this.permissions.toJSON(),
            position:     this.position,
            tags:         this.tags,
            unicodeEmoji: this.unicodeEmoji
        };
    }
}
