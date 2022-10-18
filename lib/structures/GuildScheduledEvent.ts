/** @module GuildScheduledEvent */
import Base from "./Base";
import type User from "./User";
import type Guild from "./Guild";
import type StageChannel from "./StageChannel";
import type Client from "../Client";
import type { ImageFormat, GuildScheduledEventEntityTypes, GuildScheduledEventPrivacyLevels, GuildScheduledEventStatuses } from "../Constants";
import * as Routes from "../util/Routes";
import type { RawScheduledEvent, ScheduledEventEntityMetadata } from "../types/scheduled-events";
import type { JSONScheduledEvent } from "../types/json";

/** Represents a guild scheduled event. */
export default class GuildScheduledEvent extends Base {
    private _cachedChannel?: StageChannel | null;
    private _cachedGuild?: Guild;
    /** The id of the channel in which the event will be hosted. `null` if entityType is `EXTERNAL` */
    channelID: string | null;
    /** The creator of the event. Not present on events created before October 25th, 2021. */
    creator?: User;
    /** The description of the event. */
    description?: string | null;
    /** The id of the entity associated with the event. */
    entityID: string | null;
    /** The [metadata](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-field-requirements-by-entity-type) associated with the event. */
    entityMetadata: ScheduledEventEntityMetadata | null;
    /** The [entity type](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types) of the event */
    entityType: GuildScheduledEventEntityTypes;
    /** The id of the guild this scheduled event belongs to. */
    guildID: string;
    /** The cover image of this event. */
    image: string | null;
    /** The name of the event. */
    name: string;
    /** The [privacy level](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-privacy-level) of the event. */
    privacyLevel: GuildScheduledEventPrivacyLevels;
    /** The time at which the event will end. Required if entityType is `EXTERNAL`. */
    scheduledEndTime: Date | null;
    /** The time at which the event will start. */
    scheduledStartTime: Date;
    /** The [status](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-status) of the event. */
    status: GuildScheduledEventStatuses;
    /** The number of users subscribed to the event. */
    userCount: number;
    constructor(data: RawScheduledEvent, client: Client) {
        super(data.id, client);
        this.channelID = data.channel_id;
        this.entityID = null;
        this.entityMetadata = null;
        this.entityType = data.entity_type;
        this.guildID = data.guild_id;
        this.image = null;
        this.name = data.name;
        this.privacyLevel = data.privacy_level;
        this.scheduledEndTime = data.scheduled_end_time ? new Date(data.scheduled_end_time) : null;
        this.scheduledStartTime = new Date(data.scheduled_start_time);
        this.status = data.status;
        this.userCount = 0;
        if (data.creator) {
            this.creator = client.users.update(data.creator);
        }
        this.update(data);
    }

    protected override update(data: Partial<RawScheduledEvent>): void {
        if (data.channel_id !== undefined) {
            this.channelID = data.channel_id;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        if (data.entity_id !== undefined) {
            this.entityID = data.entity_id;
        }
        if (data.entity_metadata !== undefined) {
            this.entityMetadata = data.entity_metadata;
        }
        if (data.entity_type !== undefined) {
            this.entityType = data.entity_type;
        }
        if (data.image !== undefined) {
            this.image = data.image;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.privacy_level !== undefined) {
            this.privacyLevel = data.privacy_level;
        }
        if (data.scheduled_end_time !== undefined) {
            this.scheduledEndTime = data.scheduled_end_time ? new Date(data.scheduled_end_time) : null;
        }
        if (data.scheduled_start_time !== undefined) {
            this.scheduledStartTime = new Date(data.scheduled_start_time);
        }
        if (data.status !== undefined) {
            this.status = data.status;
        }
        if (data.user_count !== undefined) {
            this.userCount = data.user_count;
        }
    }

    /** The channel in which the event will be hosted. `null` if entityType is `EXTERNAL` */
    get channel(): StageChannel | null | undefined {
        if (this.channelID !== null && this._cachedChannel !== null) {
            return this._cachedChannel ?? (this._cachedChannel = this.client.getChannel<StageChannel>(this.channelID));
        }

        return this._cachedChannel === null ? this._cachedChannel : (this._cachedChannel = null);
    }
    /** The guild this scheduled event belongs to. This will throw an error if the guild is not cached. */
    get guild(): Guild {
        if (!this._cachedGuild) {
            this._cachedGuild = this.client.guilds.get(this.guildID);

            if (!this._cachedGuild) {
                throw new Error(`${this.constructor.name}#guild is not present if you don't have the GUILDS intent.`);
            }
        }

        return this._cachedGuild;
    }


    /**
     * Delete this scheduled event.
     * @param reason The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     */
    async deleteScheduledEvent(reason?: string): Promise<void> {
        return this.client.rest.guilds.deleteScheduledEvent(this.guildID, this.id, reason);
    }

    /**
     * The url of this event's cover image.
     * @param format The format of the image.
     * @param size The size of the image.
     */
    imageURL(format?: ImageFormat, size?: number): string | null {
        return !this.image ? null : this.client.util.formatImage(Routes.GUILD_SCHEDULED_EVENT_COVER(this.id, this.image), format, size);
    }

    override toJSON(): JSONScheduledEvent {
        return {
            ...super.toJSON(),
            channelID:          this.channelID,
            creator:            this.creator?.toJSON(),
            description:        this.description,
            entityID:           this.entityID,
            entityMetadata:     this.entityMetadata,
            entityType:         this.entityType,
            guildID:            this.guildID,
            image:              this.image,
            name:               this.name,
            privacyLevel:       this.privacyLevel,
            scheduledEndTime:   this.scheduledEndTime?.getTime() ?? null,
            scheduledStartTime: this.scheduledStartTime.getTime(),
            status:             this.status,
            userCount:          this.userCount
        };
    }
}
