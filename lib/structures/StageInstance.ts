import Base from "./Base";
import type StageChannel from "./StageChannel";
import Guild from "./Guild";
import GuildScheduledEvent from "./GuildScheduledEvent";
import type { RawStageInstance } from "../types/stage-instances";
import type Client from "../Client";
import type { StageInstancePrivacyLevels } from "../Constants";
import type { Uncached } from "../types/shared";
import type { JSONStageInstance } from "../types/json";

export default class StageInstance extends Base {
    /** The associated stage channel. */
    channel!: StageChannel;
    /** @deprecated If the stage channel is discoverable */
    discoverableDisabled: boolean;
    /** The guild of the associated stage channel. */
    guild: Guild;
    /** The id of the guild associated with this stage instance's stage channel. */
    guildID: string;
    /** The [privacy level](https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level) of this stage instance. */
    privacyLevel: StageInstancePrivacyLevels;
    /** The scheduled event for this stage instance. */
    scheduledEvent?: GuildScheduledEvent | Uncached;
    /** The topic of this stage instance. */
    topic: string;
    constructor(data: RawStageInstance, client: Client) {
        super(data.id, client);
        this.discoverableDisabled = !!data.discoverable_disabled;
        this.guild = this._client.guilds.get(data.guild_id)!;
        this.guildID = data.guild_id;
        this.privacyLevel = data.privacy_level;
        this.topic = data.topic;
        this.update(data);
    }

    protected update(data: Partial<RawStageInstance>) {
        if (data.channel_id !== undefined) this.channel = this._client.getChannel(data.channel_id)!;
        if (data.discoverable_disabled !== undefined) this.discoverableDisabled = data.discoverable_disabled;
        if (data.guild_scheduled_event_id !== undefined) this.scheduledEvent = (this.guild instanceof Guild ? this.guild.scheduledEvents.get(data.guild_scheduled_event_id) : undefined) || { id: data.guild_scheduled_event_id };
        if (data.privacy_level !== undefined) this.privacyLevel = data.privacy_level;
        if (data.topic !== undefined) this.topic = data.topic;
    }

    override toJSON(): JSONStageInstance {
        return {
            ...super.toJSON(),
            channel:              this.channel.id,
            discoverableDisabled: this.discoverableDisabled,
            guild:                this.guildID,
            scheduledEvent:       this.scheduledEvent instanceof GuildScheduledEvent ? this.scheduledEvent.toJSON() : this.scheduledEvent?.id,
            topic:                this.topic
        };
    }
}
