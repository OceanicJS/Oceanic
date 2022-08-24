import Base from "./Base";
import { PartialApplication } from "./PartialApplication";
import User from "./User";
import type { IntegrationAccount, RawIntegration } from "../types/guilds";
import type { IntegrationExpireBehaviors, IntegrationType } from "../Constants";
import type Client from "../Client";

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
	constructor(data: RawIntegration, client: Client) {
		super(data.id, client);
	}

	protected update(data: Partial<RawIntegration>) {
		if (data.account !== undefined) this.account = data.account;
		if (data.application !== undefined) this.application = new PartialApplication(data.application, this._client);
		if (data.enable_emoticons !== undefined) this.enableEmoticons = data.enable_emoticons;
		if (data.enabled !== undefined) this.enabled = data.enabled;
		if (data.expire_behavior !== undefined) this.expireBehavior = data.expire_behavior;
		if (data.expire_grace_period !== undefined) this.expireGracePeriod = data.expire_grace_period;
		if (data.name !== undefined) this.name = data.name;
		if (data.revoked !== undefined) this.revoked = data.revoked;
		if (data.role_id !== undefined) this.roleID = data.role_id;
		if (data.subscriber_count !== undefined) this.subscriberCount = data.subscriber_count;
		if (data.synced_at !== undefined) this.syncedAt = new Date(data.synced_at);
		if (data.syncing !== undefined) this.syncing = data.syncing;
		if (data.type !== undefined) this.type = data.type;
		if (data.user !== undefined) this.user = new User(data.user, this._client);
	}

	override toJSON(props: Array<string> = []) {
		return super.toJSON([
			"account",
			"application",
			"enableEmoticons",
			"enabled",
			"expireBehavior",
			"expireGracePeriod",
			"name",
			"revoked",
			"roleID",
			"subscriberCount",
			"syncedAt",
			"syncing",
			"type",
			"user",
			...props
		]);
	}
}
