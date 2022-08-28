import Base from "./Base";
import PartialApplication from "./PartialApplication";
import User from "./User";
import type { IntegrationAccount, RawIntegration } from "../types/guilds";
import type { IntegrationExpireBehaviors, IntegrationType } from "../Constants";
import type Client from "../Client";
import type { JSONIntegration } from "../types/json";
/** Represents a guild integration. */
export default class Integration extends Base {
    /** The account information associated with this integration. */
    account: IntegrationAccount;
    /** The application associated with this integration. */
    application?: PartialApplication;
    /** If emoticons should be synced for this integration. */
    enableEmoticons?: boolean;
    /** If this integration is enabled. */
    enabled?: boolean;
    /** The [behavior](https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors) of expiring subscribers. */
    expireBehavior?: IntegrationExpireBehaviors;
    /** The grace period (in days) before expiring subscribers. */
    expireGracePeriod?: number;
    /** The name of the integration. */
    name: string;
    /** If this integration has been revoked. */
    revoked?: boolean;
    /** The id of the role this integration uses for subscribers. */
    roleID?: string;
    /** The number of subscribers this integration has. */
    subscriberCount?: number;
    /** The last date at which this integration was synced at. */
    syncedAt?: Date;
    /** If this integration is syncing. */
    syncing?: boolean;
    /** The type of integration. */
    type: IntegrationType;
    /** The user associated with this integration. */
    user?: User;
    constructor(data: RawIntegration, client: Client);
    protected update(data: Partial<RawIntegration>): void;
    toJSON(): JSONIntegration;
}
