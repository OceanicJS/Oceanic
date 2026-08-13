import Base from "./Base";
import type Guild from "./Guild";
import type User from "./User";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import { UncachedError } from "../util/Errors";

/** Represents a guild join request. */
export default class GuildJoinRequest extends Base {
    private _createdAt: Date;
    /** A deprecated snowflake timestamp representing when the join request was actioned. */
    actionedAt?: string;
    /** The moderator who actioned the join request, if included. */
    actionedByUser?: User;
    /** The status of the join request. */
    applicationStatus: Types.Guilds.GuildJoinRequestStatus;
    /** Responses to the guild's member verification questions, if included. */
    formResponses?: Array<Record<string, unknown>> | null;
    /** The ID of the guild this join request is for. */
    guildID: string;
    /** The ID of a channel where an interview regarding this join request may be conducted. */
    interviewChannelID: string | null;
    /** The ID of the join request. */
    joinRequestID: string;
    /** When the request was acknowledged by the user. */
    lastSeen: Date | null;
    /** Why the join request was rejected. */
    rejectionReason: string | null;
    /** When the join request was actioned, if included. */
    reviewedAt?: Date;
    /** The user who created this join request, if included. */
    user?: User;
    /** The ID of the user who created this join request. */
    userID: string;
    constructor(data: Types.Guilds.RawGuildJoinRequest, client: Client) {
        super(data.id, client);
        this.actionedAt = data.actioned_at;
        this.actionedByUser = data.actioned_by_user && client.users.update(data.actioned_by_user);
        this.applicationStatus = data.application_status;
        this._createdAt = new Date(data.created_at);
        this.formResponses = data.form_responses;
        this.guildID = data.guild_id;
        this.interviewChannelID = data.interview_channel_id;
        this.joinRequestID = data.join_request_id;
        this.lastSeen = data.last_seen === null ? null : new Date(data.last_seen);
        this.rejectionReason = data.rejection_reason;
        this.reviewedAt = data.reviewed_at === undefined ? undefined : new Date(data.reviewed_at);
        this.user = data.user && client.users.update(data.user);
        this.userID = data.user_id;
    }

    /** When the join request was created. */
    override get createdAt(): Date {
        return this._createdAt;
    }

    /** The guild this join request is for. */
    get guild(): Guild {
        const guild = this.client.guilds.get(this.guildID);
        if (!guild) {
            if (this.client.options.restMode) {
                throw new UncachedError(`${this.constructor.name}#guild is not present when rest mode is enabled.`);
            }

            if (!this.client.shards.connected) {
                throw new UncachedError(`${this.constructor.name}#guild is not present without a gateway connection.`);
            }

            throw new UncachedError(`${this.constructor.name}#guild is not present.`);
        }
        return guild;
    }

    /**
     * Accept or deny this join request.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#joinRequests | Guild#joinRequests}
     */
    async action(options: Types.Guilds.ActionGuildJoinRequestOptions): Promise<GuildJoinRequest> {
        return this.client.rest.guilds.actionJoinRequest(this.guildID, this.id, options);
    }

    /**
     * Approve this join request.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#joinRequests | Guild#joinRequests}
     */
    async approve(): Promise<GuildJoinRequest> {
        return this.action({ action: "APPROVED" });
    }

    /**
     * Reject this join request.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#joinRequests | Guild#joinRequests}
     */
    async reject(rejectionReason?: string | null): Promise<GuildJoinRequest> {
        return this.action({ action: "REJECTED", rejectionReason });
    }

    override toJSON(): Types.JSON.JSONGuildJoinRequest {
        return {
            ...super.toJSON(),
            actionedAt:         this.actionedAt,
            actionedByUser:     this.actionedByUser?.toJSON(),
            applicationStatus:  this.applicationStatus,
            createdAt:          this._createdAt.getTime(),
            formResponses:      this.formResponses,
            guildID:            this.guildID,
            interviewChannelID: this.interviewChannelID,
            joinRequestID:      this.joinRequestID,
            lastSeen:           this.lastSeen?.getTime() ?? null,
            rejectionReason:    this.rejectionReason,
            reviewedAt:         this.reviewedAt?.getTime(),
            user:               this.user?.toJSON(),
            userID:             this.userID
        };
    }
}
