/** @module Invite */
import Channel from "./Channel";
import Guild from "./Guild";
import type GuildScheduledEvent from "./GuildScheduledEvent";
import type User from "./User";
import PartialApplication from "./PartialApplication";
import type {
    InviteChannel,
    InviteInfoTypes,
    InviteStageInstance,
    PartialInviteChannel,
    RawInvite,
    RawInviteWithMetadata
} from "../types/channels";
import type Client from "../Client";
import type { InviteTargetTypes } from "../Constants";
import type { RawGuild } from "../types/guilds";
import type { JSONInvite } from "../types/json";
import type { Uncached } from "../types/shared";

/** Represents an invite. */
export default class Invite<T extends InviteInfoTypes = "withMetadata", CH extends InviteChannel | Uncached = InviteChannel | Uncached> {
    private _cachedChannel!: (CH extends InviteChannel ? CH : PartialInviteChannel) | null;
    /** The approximate number of total members in the guild this invite leads to. */
    approximateMemberCount?: number;
    /** The approximate number of online members in the guild this invite leads to. */
    approximatePresenceCount?: number;
    /** The ID of the channel this invite leads to. */
    channelID: string | null;
    client!: Client;
    /** The code of this invite. */
    code: string;
    /** When this invite was created. */
    createdAt!: T extends "withMetadata" ? Date : undefined;
    /** The date at which this invite expires. */
    expiresAt?: T extends "withMetadata" | "withoutExpiration" ? never : Date;
    /** The guild this invite leads to or `null` if this invite leads to a Group DM. */
    guild: Guild | null;
    /** The ID of the guild this invite leads to or `null` if this invite leads to a Group DM. */
    guildID: string | null;
    /** The scheduled event associated with this invite. */
    guildScheduledEvent?: GuildScheduledEvent;
    /** The user that created this invite. */
    inviter?: User;
    /** The time after which this invite expires. */
    maxAge!: T extends "withMetadata" ? number : never;
    /** The maximum number of times this invite can be used, */
    maxUses!: T extends "withMetadata" ? number : never;
    /** @deprecated The stage instance in the invite this channel is for (deprecated). */
    stageInstance?: InviteStageInstance;
    /** The embedded application this invite will open. */
    targetApplication?: PartialApplication;
    /** The [target type](https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types) of this invite. */
    targetType?: InviteTargetTypes;
    /** The user whose stream to display for this voice channel stream invite. */
    targetUser?: User;
    /** If this invite only grants temporary membership. */
    temporary!: T extends "withMetadata" ? boolean : never;
    /** The number of times this invite has been used. */
    uses!: T extends "withMetadata" ? number : never;
    constructor(data: RawInvite | RawInviteWithMetadata, client: Client) {
        Object.defineProperty(this, "client", {
            value:        client,
            enumerable:   false,
            writable:     false,
            configurable: false
        });
        this.channelID = (data.channel_id ?? data.channel?.id) ?? null;
        this.code = data.code;
        this.guild = null;
        this.guildID = data.guild?.id ?? null;
        this.expiresAt = (!data.expires_at ? undefined : new Date(data.expires_at)) as never;
        this.targetType = data.target_type;
        this.update(data);
    }

    protected update(data: Partial<RawInvite> | Partial<RawInviteWithMetadata>): void {
        if (data.approximate_member_count !== undefined) {
            this.approximateMemberCount = data.approximate_member_count;
        }
        if (data.approximate_presence_count !== undefined) {
            this.approximatePresenceCount = data.approximate_presence_count;
        }

        let guild: Guild | undefined;
        if (data.guild) {
            guild = this.client.guilds.has(data.guild.id) ? this.client.guilds.update(data.guild as RawGuild) : new Guild(data.guild as RawGuild, this.client);
            this.guild = guild;
        }

        if (this.channelID !== null) {
            let channel: Channel | PartialInviteChannel | undefined;
            channel = this.client.getChannel<InviteChannel>(this.channelID);
            if (data.channel !== undefined) {
                if (channel && channel instanceof Channel) {
                    channel["update"](data.channel);
                } else {
                    channel = data.channel as PartialInviteChannel;
                }
            }
            this._cachedChannel = channel as (CH extends InviteChannel ? CH : PartialInviteChannel) | null;
        } else {
            this._cachedChannel = null;
        }

        if (data.inviter !== undefined) {
            this.inviter = this.client.users.update(data.inviter);
        }
        if (data.stage_instance !== undefined) {
            this.stageInstance = {
                members:          data.stage_instance.members.map(member => this.client.util.updateMember(guild!.id, member.user!.id, member)),
                participantCount: data.stage_instance.participant_count,
                speakerCount:     data.stage_instance.speaker_count,
                topic:            data.stage_instance.topic
            };
        }
        if (data.target_application !== undefined) {
            this.targetApplication = new PartialApplication(data.target_application, this.client);
        }
        if (data.guild_scheduled_event !== undefined) {
            this.guildScheduledEvent = guild!.scheduledEvents.update(data.guild_scheduled_event);
        }
        if (data.target_user !== undefined) {
            this.targetUser = this.client.users.update(data.target_user);
        }
        if ("created_at" in data) {
            if (data.created_at !== undefined) {
                this.createdAt = new Date(data.created_at) as never;
            }
            if (data.uses !== undefined) {
                this.uses = data.uses as never;
            }
            if (data.max_uses !== undefined) {
                this.maxUses = data.max_uses as never;
            }
            if (data.max_age !== undefined) {
                this.maxAge = data.max_age as never;
            }
            if (data.temporary !== undefined) {
                this.temporary = data.temporary as never;
            }
        }
    }

    /** The channel this invite leads to. If the channel is not cached, this will be a partial with only `id`, `name, and `type`. */
    get channel(): (CH extends InviteChannel ? CH : PartialInviteChannel) | null {
        if (this.channelID !== null && this._cachedChannel !== null) {
            if (this._cachedChannel instanceof Channel) {
                return this._cachedChannel;
            }

            const cachedChannel = this.client.getChannel<InviteChannel>(this.channelID);

            return (cachedChannel ? (this._cachedChannel = cachedChannel as CH extends InviteChannel ? CH : PartialInviteChannel) : this._cachedChannel);
        }

        return this._cachedChannel === null ? this._cachedChannel : (this._cachedChannel = null);
    }

    /**
     * Delete this invite.
     * @param reason The reason for deleting this invite.
     */
    async deleteInvite(reason?: string): Promise<Invite<"withMetadata", CH>> {
        return this.client.rest.channels.deleteInvite<CH>(this.code, reason);
    }

    /** Whether this invite belongs to a cached channel. The only difference on using this method over a simple if statement is to easily update all the invite properties typing definitions based on the channel it belongs to. */
    inCachedChannel(): this is Invite<T, InviteChannel> {
        return this.channel instanceof Channel;
    }

    toJSON(): JSONInvite {
        return {
            approximateMemberCount:   this.approximateMemberCount,
            approximatePresenceCount: this.approximatePresenceCount,
            channelID:                this.channelID ?? undefined,
            code:                     this.code,
            createdAt:                this.createdAt?.getTime(),
            expiresAt:                this.expiresAt?.getTime(),
            guildID:                  this.guildID ?? undefined,
            guildScheduledEvent:      this.guildScheduledEvent?.toJSON(),
            inviter:                  this.inviter?.id,
            maxAge:                   this.maxAge,
            maxUses:                  this.maxUses,
            stageInstance:            !this.stageInstance ? undefined : {
                members:          this.stageInstance.members.map(member => member.id),
                participantCount: this.stageInstance.participantCount,
                speakerCount:     this.stageInstance.speakerCount,
                topic:            this.stageInstance.topic
            },
            targetApplication: this.targetApplication?.toJSON(),
            targetType:        this.targetType,
            targetUser:        this.targetUser?.id,
            temporary:         this.temporary,
            uses:              this.uses
        };
    }
}
