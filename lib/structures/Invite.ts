/** @module Invite */
import Channel from "./Channel";
import type Guild from "./Guild";
import type GuildScheduledEvent from "./GuildScheduledEvent";
import type User from "./User";
import PartialApplication from "./PartialApplication";
import InviteGuild from "./InviteGuild";
import InviteRole from "./InviteRole";
import GuildChannel from "./GuildChannel";
import type { AnyGuildInviteChannel, AnyInviteChannel, PartialInviteChannel } from "../types/channels";
import type {
    DMInviteChannel,
    GuildInviteChannel,
    InviteChannel,
    InviteStageInstance,
    InviteTargetUsersJobStatusResponse,
    RawInvite
} from "../types/invites";
import type Client from "../Client";
import { DMInviteChannelTypes, type InviteTargetTypes, type InviteTypes } from "../Constants";
import type { JSONInvite } from "../types/json";
import type { Uncached } from "../types/shared";

/** Represents an invite. */
export default class Invite<CH extends InviteChannel = InviteChannel> {
    private _cachedChannel!: (CH extends AnyInviteChannel ? CH : PartialInviteChannel) | null;
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
    createdAt?: Date;
    /** The date at which this invite expires. */
    expiresAt?: Date;
    /** This invite's [flags](https://discord.com/developers/docs/resources/invite#invite-object-invite-flags). */
    flags: number;
    /** The guild this invite leads to or `null` if this invite leads to a Group DM. */
    guild: InviteGuild | null;
    /** The ID of the guild this invite leads to or `null` if this invite leads to a Group DM. */
    guildID: string | null;
    /** The scheduled event associated with this invite. */
    guildScheduledEvent?: GuildScheduledEvent;
    /** The user that created this invite. */
    inviter?: User;
    /** The time after which this invite expires. */
    maxAge?: number;
    /** The maximum number of times this invite can be used, */
    maxUses?: number;
    /** The roles assigned to the user upon accepting the invite . */
    roles?: Array<InviteRole>;
    /** @deprecated The stage instance in the invite this channel is for. */
    stageInstance?: InviteStageInstance;
    /** The embedded application this invite will open. */
    targetApplication?: PartialApplication;
    /** The [target type](https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types) of this invite. */
    targetType?: InviteTargetTypes;
    /** The user whose stream to display for this voice channel stream invite. */
    targetUser?: User;
    /** If this invite only grants temporary membership. */
    temporary?: boolean;
    /** The [type](https://discord.com/developers/docs/resources/invite#invite-object-invite-types) of this invite. */
    type: InviteTypes;
    /** The number of times this invite has been used. */
    uses: number | undefined;
    constructor(data: RawInvite, client: Client) {
        Object.defineProperty(this, "client", {
            value:        client,
            enumerable:   false,
            writable:     false,
            configurable: false
        });
        this.channelID = (data.channel_id ?? data.channel?.id) ?? null;
        this.code = data.code;
        this.flags = data.flags ?? 0;
        this.guild = null;
        this.guildID = data.guild_id ?? null;
        this.expiresAt = (data.expires_at ? new Date(data.expires_at) : undefined) as never;
        this.targetType = data.target_type;
        this.type = data.type;
        this.update(data);
    }

    static withCounts<CH extends GuildInviteChannel = GuildInviteChannel>(data: RawInvite, client: Client): InviteWithCounts<CH> {
        return new Invite<CH>(data, client) as InviteWithCounts<CH>;
    }

    static withCountsAndScheduledEvent<CH extends GuildInviteChannel = GuildInviteChannel>(data: RawInvite, client: Client): InviteWithCountsAndScheduledEvent<CH> {
        return new Invite<CH>(data, client) as InviteWithCountsAndScheduledEvent<CH>;
    }

    static withMetadata<CH extends GuildInviteChannel = GuildInviteChannel>(data: RawInvite, client: Client): InviteWithMetadata<CH> {
        return new Invite<CH>(data, client) as InviteWithMetadata<CH>;
    }

    static withScheduledEvent<CH extends GuildInviteChannel = GuildInviteChannel>(data: RawInvite, client: Client): InviteWithScheduledEvent<CH> {
        return new Invite<CH>(data, client) as InviteWithScheduledEvent<CH>;
    }

    protected update(data: Partial<RawInvite>): void {
        if (data.approximate_member_count !== undefined) {
            this.approximateMemberCount = data.approximate_member_count;
        }
        if (data.approximate_presence_count !== undefined) {
            this.approximatePresenceCount = data.approximate_presence_count;
        }
        if (data.flags !== undefined) {
            this.flags = data.flags;
        }

        let guild: Guild | undefined;
        if (data.guild) {
            if (this.guild === null) {
                this.guild = new InviteGuild(data.guild, this.client);
            } else {
                this.guild["update"](data.guild);
            }

            if (this.client.guilds.has(data.guild.id)) {
                this.client.guilds.update(data.guild);
            }
        }

        if (this.channelID === null) {
            this._cachedChannel = null;
        } else {
            let channel: Channel | PartialInviteChannel | undefined;
            channel = this.client.getChannel<AnyInviteChannel>(this.channelID);
            if (data.channel !== undefined) {
                if (channel && channel instanceof Channel) {
                    channel["update"](data.channel);
                } else {
                    channel = data.channel as PartialInviteChannel;
                }
            }
            this._cachedChannel = channel as (CH extends AnyInviteChannel ? CH : PartialInviteChannel) | null;
        }

        if (data.inviter !== undefined) {
            this.inviter = this.client.users.update(data.inviter);
        }
        if (data.roles !== undefined) {
            this.roles = data.roles?.map(role => new InviteRole(role, this.client, data.guild_id!, this.guild!));
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

    /** The channel this invite leads to. If the channel is not cached, this will be a partial with only `id`, `name`, and `type`. */
    get channel(): (CH extends AnyInviteChannel ? CH : PartialInviteChannel) | null {
        if (this.channelID !== null) {
            if (this._cachedChannel instanceof Channel) {
                return this._cachedChannel;
            }

            const cachedChannel = this.client.getChannel<AnyInviteChannel>(this.channelID);

            return cachedChannel ? (this._cachedChannel = cachedChannel as CH extends AnyInviteChannel ? CH : PartialInviteChannel) : this._cachedChannel;
        }

        return this._cachedChannel === null ? this._cachedChannel : (this._cachedChannel = null);
    }

    /**
     * Delete this invite.
     * @param reason The reason for deleting this invite.
     */
    async deleteInvite(reason?: string): Promise<Invite<CH>> {
        return this.client.rest.channels.deleteInvite<CH>(this.code, reason);
    }

    /** Get the target users for this invite. Requires being the inviter or having the `MANAGE_GUILD` or `VIEW_AUDIT_LOG` permission. */
    async getTargetUsers(): Promise<Array<string>> {
        return this.client.rest.channels.getInviteTargetUsers(this.code);
    }

    /** et the target users job status for this invite. Requires being the inviter or having the `MANAGE_GUILD` or `VIEW_AUDIT_LOG` permission. */
    async getTargetUsersJobStatus(): Promise<InviteTargetUsersJobStatusResponse> {
        return this.client.rest.channels.getInviteTargetUsersJobStatus(this.code);
    }

    /** Whether this invite belongs to a cached channel. The only difference on using this method over a simple if statement is to easily update all the invite properties typing definitions based on the channel it belongs to. */
    inCachedChannel(): this is Invite<AnyInviteChannel> {
        return this.channel instanceof Channel;
    }

    inCachedGuildChannel(): this is Invite<AnyGuildInviteChannel> {
        return this.channel instanceof GuildChannel;
    }

    inDMChannel(): this is Invite<Exclude<DMInviteChannel, Uncached>> {
        return this.channel !== null && DMInviteChannelTypes.includes(this.channel.type as never);
    }

    toJSON(): JSONInvite {
        return {
            approximateMemberCount:   this.approximateMemberCount,
            approximatePresenceCount: this.approximatePresenceCount,
            channelID:                this.channelID ?? undefined,
            code:                     this.code,
            createdAt:                this.createdAt?.getTime(),
            expiresAt:                this.expiresAt?.getTime(),
            guild:                    this.guild?.toJSON(),
            guildID:                  this.guildID ?? undefined,
            guildScheduledEvent:      this.guildScheduledEvent?.toJSON(),
            inviter:                  this.inviter?.toJSON(),
            maxAge:                   this.maxAge,
            maxUses:                  this.maxUses,
            roles:                    this.roles?.map(role => role.toJSON()),
            stageInstance:            this.stageInstance ? {
                members:          this.stageInstance.members.map(member => member.id),
                participantCount: this.stageInstance.participantCount,
                speakerCount:     this.stageInstance.speakerCount,
                topic:            this.stageInstance.topic
            } : undefined,
            targetApplication: this.targetApplication?.toJSON(),
            targetType:        this.targetType,
            targetUser:        this.targetUser?.toJSON(),
            temporary:         this.temporary,
            uses:              this.uses
        };
    }

    /**
     * Update the target users for this invite. Requires being the inviter or having the `MANAGE_GUILD` permission.
     * @param users The IDs of the users to allow accepting the invite.
     */
    async updateInviteTargetUsers(users: Array<string>): Promise<null> {
        return this.client.rest.channels.updateInviteTargetUsers(this.code, users);
    }
}

// only possible on `/invites/{code}`
export interface InviteWithoutCounts<CH extends InviteChannel = InviteChannel> extends Invite<CH> {
    approximateMemberCount: undefined;
    approximatePresenceCount: undefined;
    createdAt: undefined;
    guildScheduledEvent: undefined;
    maxAge: undefined;
    maxUses: undefined;
    temporary: undefined;
    uses: undefined;
}

// only possible on `/invites/{code}`
export interface InviteWithScheduledEvent<CH extends GuildInviteChannel = GuildInviteChannel> extends Invite<CH> {
    approximateMemberCount: undefined;
    approximatePresenceCount: undefined;
    createdAt: undefined;
    guildScheduledEvent: GuildScheduledEvent | undefined;
    maxAge: undefined;
    maxUses: undefined;
    temporary: undefined;
    uses: undefined;
}

// only possible via `with_counts=true` on `/invites/{code}`
export interface InviteWithCounts<CH extends InviteChannel = GuildInviteChannel | DMInviteChannel> extends Invite<CH> {
    approximateMemberCount: number;
    approximatePresenceCount: number | undefined;
    createdAt: undefined;
    guildScheduledEvent: undefined;
    maxAge: undefined;
    maxUses: undefined;
    temporary: undefined;
    uses: undefined;
}

// only possible via `with_counts=true&guild_scheduled_event_id={id}` on `/invites/{code}`
export interface InviteWithCountsAndScheduledEvent<CH extends GuildInviteChannel = GuildInviteChannel> extends Invite<CH> {
    approximateMemberCount: number;
    approximatePresenceCount: number;
    createdAt: undefined;
    guildScheduledEvent: GuildScheduledEvent | undefined;
    maxAge: undefined;
    maxUses: undefined;
    temporary: undefined;
    uses: undefined;
}

// only possible on `/channels/{id}/invites` and `/guilds/{id}/invites`
export interface InviteWithMetadata<CH extends GuildInviteChannel = GuildInviteChannel> extends Invite<CH> {
    approximateMemberCount: undefined;
    approximatePresenceCount: undefined;
    createdAt: Date;
    guildScheduledEvent: undefined;
    maxAge: number;
    maxUses: number;
    temporary: boolean;
    uses: number;
}
