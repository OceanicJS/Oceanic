/** @module VoiceState */
import Base from "./Base";
import type VoiceChannel from "./VoiceChannel";
import type StageChannel from "./StageChannel";
import type Member from "./Member";
import type Guild from "./Guild";
import type User from "./User";
import type Client from "../Client";
import type { RawVoiceState } from "../types/voice";
import type { JSONVoiceState } from "../types/json";

/** Represents a guild member's voice state. */
export default class VoiceState extends Base {
    private _cachedChannel?: VoiceChannel | StageChannel | null;
    private _cachedGuild?: Guild;
    private _cachedMember?: Member;
    private _cachedUser?: User;
    /** The ID of the channel the user is connected to. */
    channelID: string | null;
    /** If the associated member is deafened. */
    deaf: boolean;
    /** The ID of the guild this voice state is a part of. */
    guildID: string;
    /** If the associated member is muted. */
    mute: boolean;
    /** The time at which the associated member requested to speak. */
    requestToSpeakTimestamp: Date | null;
    /** If the associated member is self deafened. */
    selfDeaf: boolean;
    /** If the associated member is self muted. */
    selfMute: boolean;
    /** If the associated member is streaming. */
    selfStream: boolean;
    /** If the associated member is has their camera on. */
    selfVideo: boolean;
    /** The id of the associated member's voice session. */
    sessionID!: string;
    /** If the associated member is suppressed. */
    suppress: boolean;
    /** The ID of the user associated with this voice state. */
    userID: string;
    constructor(data: RawVoiceState, client: Client) {
        super(data.user_id, client);
        this.channelID = data.channel_id;
        this.deaf = false;
        this.guildID = data.guild_id!;
        this.mute = false;
        this.requestToSpeakTimestamp = null;
        this.selfDeaf = false;
        this.selfMute = false;
        this.selfStream = false;
        this.selfVideo = false;
        this.suppress = false;
        this.userID = this.id;
        this.update(data);
    }

    protected override update(data: Partial<RawVoiceState>): void {
        if (data.channel_id !== undefined) {
            this.channelID = data.channel_id;
        }
        if (data.deaf !== undefined) {
            this.deaf = data.deaf;
        }
        if (data.guild_id !== undefined) {
            this.guildID = data.guild_id;
        }
        if (data.member !== undefined) {
            this._cachedMember = this.client.util.updateMember(data.guild_id!, this.id, data.member);
        }
        if (data.mute !== undefined) {
            this.mute = data.mute;
        }
        if (data.request_to_speak_timestamp !== undefined) {
            this.requestToSpeakTimestamp = data.request_to_speak_timestamp  === null ? null : new Date(data.request_to_speak_timestamp);
        }
        if (data.self_deaf !== undefined) {
            this.selfDeaf = data.self_deaf;
        }
        if (data.self_mute !== undefined) {
            this.selfMute = data.self_mute;
        }
        if (data.self_stream !== undefined) {
            this.selfStream = data.self_stream;
        }
        if (data.self_video !== undefined) {
            this.selfVideo = data.self_video;
        }
        if (data.suppress !== undefined) {
            this.suppress = data.suppress;
        }
        if (data.user_id !== undefined) {
            this.userID = data.user_id;
        }
    }

    /** The channel the user is connected to. */
    get channel(): VoiceChannel | StageChannel | null | undefined {
        if (this.channelID !== null && this._cachedChannel !== null) {
            return this._cachedChannel ?? (this._cachedChannel = this.client.getChannel<VoiceChannel | StageChannel>(this.channelID));
        }

        return this._cachedChannel === null ? this._cachedChannel : (this._cachedChannel = null);
    }

    /** The guild this voice state is a part of. This will throw an error if the guild is not cached. */
    get guild(): Guild {
        if (!this._cachedGuild) {
            this._cachedGuild = this.client.guilds.get(this.guildID);

            if (!this._cachedGuild) {
                throw new Error(`${this.constructor.name}#guild is not present if you don't have the GUILDS intent.`);
            }
        }

        return this._cachedGuild;
    }

    /** The member associated with this voice state. */
    get member(): Member | undefined {
        try {
            return this._cachedMember ?? (this._cachedMember = this.guild.members.get(this.userID));
        } catch {
            return (this._cachedMember = undefined);
        }
    }

    /** TThe user associated with this voice state. */
    get user(): User | undefined {
        return this._cachedUser ?? (this._cachedUser = this.client.users.get(this.userID));
    }

    override toJSON(): JSONVoiceState {
        return {
            ...super.toJSON(),
            channelID:               this.channelID,
            deaf:                    this.deaf,
            guildID:                 this.guildID ?? undefined,
            member:                  this.member?.toJSON(),
            mute:                    this.mute,
            requestToSpeakTimestamp: this.requestToSpeakTimestamp ? this.requestToSpeakTimestamp.getTime() : null,
            selfDeaf:                this.selfDeaf,
            selfMute:                this.selfMute,
            selfStream:              this.selfStream,
            selfVideo:               this.selfVideo,
            sessionID:               this.sessionID,
            suppress:                this.suppress,
            user:                    this.user?.toJSON()
        };
    }
}
