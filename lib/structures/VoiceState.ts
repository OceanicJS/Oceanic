import Base from "./Base";
import type VoiceChannel from "./VoiceChannel";
import type StageChannel from "./StageChannel";
import Member from "./Member";
import type Guild from "./Guild";
import type User from "./User";
import type Client from "../Client";
import type { RawVoiceState } from "../types/voice";
import type { JSONVoiceState } from "../types/json";

/** Represents a guild member's voice state. */
export default class VoiceState extends Base {
    /** The channel the user is connected to. */
    channel: VoiceChannel | StageChannel | null;
    /** The ID of the channel the user is connected to. */
    channelID: string | null;
    /** If the associated member is deafened. */
    deaf: boolean;
    /** The guild this voice state is a part of. */
    guild?: Guild;
    /** The ID of the guild this voice state is a part of. */
    guildID?: string;
    /** The member associated with this voice state. */
    member?: Member;
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
    /** The user associated with this voice state. */
    user: User;
    constructor(data: RawVoiceState, client: Client) {
        super(data.user_id, client);
        this.channel = null;
        this.channelID = data.channel_id;
        this.deaf = false;
        this.mute = false;
        this.requestToSpeakTimestamp = null;
        this.selfDeaf = false;
        this.selfMute = false;
        this.selfStream = false;
        this.selfVideo = false;
        this.suppress = false;
        this.user = client.users.get(this.id)!;
        this.update(data);
    }

    protected update(data: Partial<RawVoiceState>): void {
        if (data.channel_id !== undefined) {
            this.channelID = data.channel_id;
            if (data.channel_id === null) {
                this.channel = null;
            } else {
                this.channel = this.client.getChannel<VoiceChannel | StageChannel>(data.channel_id)!;
            }

        }
        if (data.deaf !== undefined) {
            this.deaf = data.deaf;
        }
        if (data.guild_id !== undefined) {
            this.guildID = data.guild_id;
            this.guild = this.client.guilds.get(data.guild_id)!;
        }
        if (data.member !== undefined) {
            this.member = this.guild ? this.guild.members.update({ ...data.member, id: this.id }, this.guildID!) : new Member(data.member, this.client, this.guildID!);
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
            this.user = this.client.users.get(data.user_id)!;
        }
    }

    toJSON(): JSONVoiceState {
        return {
            ...super.toJSON(),
            channel:                 this.channel?.id || null,
            deaf:                    this.deaf,
            guild:                   this.guildID,
            member:                  this.member?.toJSON(),
            mute:                    this.mute,
            requestToSpeakTimestamp: this.requestToSpeakTimestamp ? this.requestToSpeakTimestamp.getTime() : null,
            selfDeaf:                this.selfDeaf,
            selfMute:                this.selfMute,
            selfStream:              this.selfStream,
            selfVideo:               this.selfVideo,
            sessionID:               this.sessionID,
            suppress:                this.suppress,
            user:                    this.user.toJSON()
        };
    }
}
