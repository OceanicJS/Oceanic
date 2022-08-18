import Base from "./Base";
import type { RawStageInstance } from "../types/stage-instances";
import type Client from "../Client";
import type { StageInstancePrivacyLevels } from "../Constants";

export default class StageInstance extends Base {
	/** The id of the associated stage channel. */
	channelID: string;
	/** @deprecated If the stage channel is discoverable */
	discoverableDisabled: boolean;
	/** The guild id of the associated stage channel. */
	guildID: string;
	/** The id of scheduled event for this stage instance. */
	guildScheduledEventID?: string;
	/** The [privacy level](https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level) of this stage instance. */
	privacyLevel: StageInstancePrivacyLevels;
	/** The topic of this stage instance. */
	topic: string;
	constructor(data: RawStageInstance, client: Client) {
		super(data.id, client);
		this.update(data);
	}

	protected update(data: RawStageInstance) {
		this.channelID             = data.channel_id;
		this.discoverableDisabled  = data.discoverable_disabled;
		this.guildID               = data.guild_id;
		this.guildScheduledEventID = data.guild_scheduled_event_id;
		this.privacyLevel          = data.privacy_level;
		this.topic                 = data.topic;
	}
}
