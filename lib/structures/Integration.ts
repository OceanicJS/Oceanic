/** @module Integration */
import Base from "./Base";
import PartialApplication from "./PartialApplication";
import type User from "./User";
import type Guild from "./Guild";
import type Role from "./Role";
import type { IntegrationAccount, RawIntegration } from "../types/guilds";
import type { IntegrationExpireBehaviors, IntegrationType } from "../Constants";
import type Client from "../Client";
import type { JSONIntegration } from "../types/json";

/** Represents a guild integration. */
export default class Integration extends Base {
    private _cachedGuild?: Guild | null;
    private _cachedRole?: Role | null;
    /** The account information associated with this integration. */
    account: IntegrationAccount;
    /** The application associated with this integration. */
    application: PartialApplication | null;
    /** If emoticons should be synced for this integration. */
    enableEmoticons: boolean;
    /** If this integration is enabled. */
    enabled: boolean;
    /** The [behavior](https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors) of expiring subscribers. */
    expireBehavior?: IntegrationExpireBehaviors;
    /** The grace period (in days) before expiring subscribers. */
    expireGracePeriod?: number;
    /** The ID of the guild this integration belongs to, if applicable. */
    guildID: string | null;
    /** The name of the integration. */
    name: string;
    /** If this integration has been revoked. */
    revoked: boolean;
    /** The id of the role this integration uses for subscribers, if any. */
    roleID: string | null;
    /** The scopes the application associated with this integration has been authorized for. */
    scopes?: Array<string>;
    /** The number of subscribers this integration has. */
    subscriberCount?: number;
    /** The last date at which this integration was synced at. */
    syncedAt?: Date;
    /** If this integration is syncing. */
    syncing: boolean;
    /** The type of integration. */
    type: IntegrationType;
    /** The user associated with this integration, if applicable. */
    user?: User;
    constructor(data: RawIntegration, client: Client, guildID?: string) {
        super(data.id, client);
        this.account = data.account;
        this.application = null;
        this.enableEmoticons = !!data.enable_emoticons;
        this.enabled = !!data.enabled;
        this.guildID = guildID === undefined ? null : guildID;
        this.name = data.name;
        this.revoked = !!data.revoked;
        this.roleID = data.role_id === undefined ? null : data.role_id;
        this.syncing = !!data.syncing;
        this.type = data.type;
        this.update(data);
    }

    protected override update(data: Partial<RawIntegration>): void {
        if (data.account !== undefined) {
            this.account = data.account;
        }
        if (data.application !== undefined) {
            this.application = new PartialApplication(data.application, this.client);
        }
        if (data.enable_emoticons !== undefined) {
            this.enableEmoticons = data.enable_emoticons;
        }
        if (data.enabled !== undefined) {
            this.enabled = data.enabled;
        }
        if (data.expire_behavior !== undefined) {
            this.expireBehavior = data.expire_behavior;
        }
        if (data.expire_grace_period !== undefined) {
            this.expireGracePeriod = data.expire_grace_period;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.revoked !== undefined) {
            this.revoked = data.revoked;
        }
        if (data.role_id !== undefined) {
            this.roleID = data.role_id;
        }
        if (data.scopes !== undefined) {
            this.scopes = data.scopes;
        }
        if (data.subscriber_count !== undefined) {
            this.subscriberCount = data.subscriber_count;
        }
        if (data.synced_at !== undefined) {
            this.syncedAt = new Date(data.synced_at);
        }
        if (data.syncing !== undefined) {
            this.syncing = data.syncing;
        }
        if (data.type !== undefined) {
            this.type = data.type;
        }
        if (data.user !== undefined) {
            this.user = this.client.users.update(data.user);
        }
    }

    /** The guild this integration belongs to, if applicable. This will throw an error if the guild is not cached. */
    get guild(): Guild | null {
        if (this.guildID !== null && this._cachedGuild !== null) {
            if (!this._cachedGuild) {
                this._cachedGuild = this.client.guilds.get(this.guildID);

                if (!this._cachedGuild) {
                    throw new Error(`${this.constructor.name}#guild is not present if you don't have the GUILDS intent.`);
                }
            }

            return this._cachedGuild;
        }

        return this._cachedGuild === null ? this._cachedGuild : (this._cachedGuild = null);
    }

    /** The role this integration uses for subscribers, if any. */
    get role(): Role | null | undefined {
        if (this.roleID !== null && this._cachedRole !== null) {
            try {
                return this._cachedRole ?? (this._cachedRole = this.guild?.roles.get(this.roleID));
            } catch {
                return (this._cachedRole = undefined);
            }
        }

        return this._cachedRole === null ? this._cachedRole : (this._cachedRole = null);
    }

    override toJSON(): JSONIntegration {
        return {
            ...super.toJSON(),
            account:           this.account,
            application:       this.application?.toJSON(),
            enableEmoticons:   this.enableEmoticons,
            enabled:           this.enabled,
            expireBehavior:    this.expireBehavior,
            expireGracePeriod: this.expireGracePeriod,
            name:              this.name,
            revoked:           this.revoked,
            roleID:            this.roleID,
            scopes:            this.scopes,
            subscriberCount:   this.subscriberCount,
            syncedAt:          this.syncedAt?.getTime(),
            syncing:           this.syncing,
            type:              this.type,
            user:              this.user?.toJSON()
        };
    }
}
