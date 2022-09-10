import Base from "./Base";
import type StageChannel from "./StageChannel";
import Guild from "./Guild";
import GuildScheduledEvent from "./GuildScheduledEvent";
import type { RawStageInstance } from "../types/stage-instances";
import type Client from "../Client";
import type { StageInstancePrivacyLevels } from "../Constants";
import type { JSONStageInstance } from "../types/json";

export default class StageInstance extends Base {
    private _guild?: Guild;
    /** The associated stage channel. */
    channel?: StageChannel;
    /** The ID of the associated stage channel. */
    channelID: string;
    /** @deprecated If the stage channel is discoverable */
    discoverableDisabled: boolean;
    /** The id of the guild associated with this stage instance's stage channel. */
    guildID: string;
    /** The [privacy level](https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level) of this stage instance. */
    privacyLevel: StageInstancePrivacyLevels;
    /** The scheduled event for this stage instance. */
    scheduledEvent?: GuildScheduledEvent;
    scheduledEventID: string | null;
    /** The topic of this stage instance. */
    topic: string;
    constructor(data: RawStageInstance, client: Client) {
        super(data.id, client);
        this.channelID = data.channel_id;
        this.discoverableDisabled = !!data.discoverable_disabled;
        this._guild = client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.privacyLevel = data.privacy_level;
        this.scheduledEventID = data.guild_scheduled_event_id !== undefined ? data.guild_scheduled_event_id : null;
        this.topic = data.topic;
        this.update(data);
    }

    protected update(data: Partial<RawStageInstance>): void {
        if (data.channel_id !== undefined) {
            this.channel = this.client.getChannel<StageChannel>(data.channel_id);
            this.channelID = data.channel_id;
        }
        if (data.discoverable_disabled !== undefined) {
            this.discoverableDisabled = data.discoverable_disabled;
        }
        if (data.guild_scheduled_event_id !== undefined) {
            this.scheduledEvent = (this._guild instanceof Guild ? this._guild.scheduledEvents.get(data.guild_scheduled_event_id) : undefined);
            this.scheduledEventID = data.guild_scheduled_event_id;
        }
        if (data.privacy_level !== undefined) {
            this.privacyLevel = data.privacy_level;
        }
        if (data.topic !== undefined) {
            this.topic = data.topic;
        }
    }

    /** The guild of the associated stage channel. This will throw an error if the guild is not cached. */
    get guild(): Guild {
        if (!this._guild) {
            throw new Error(`${this.constructor.name}#guild is not present without having the GUILDS intent or fetching the guild.`);
        } else {
            return this._guild;
        }
    }

    override toJSON(): JSONStageInstance {
        return {
            ...super.toJSON(),
            channelID:            this.channelID,
            discoverableDisabled: this.discoverableDisabled,
            guildID:              this.guildID,
            scheduledEvent:       this.scheduledEvent?.toJSON() || this.scheduledEventID || undefined,
            topic:                this.topic
        };
    }
}
