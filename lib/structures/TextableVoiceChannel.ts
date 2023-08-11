/** @module TextableVoiceChannel */
import Member from "./Member";
import type CategoryChannel from "./CategoryChannel";
import TextableChannel from "./TextableChannel";
import type VoiceState from "./VoiceState";
import type { VideoQualityModes } from "../Constants";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
import type { AnyVoiceChannel, RawStageChannel, RawVoiceChannel, VoiceChannels } from "../types/channels";
import type { JSONTextableVoiceChannel } from "../types/json";
import type { RawMember } from "../types/guilds";
import type { JoinVoiceChannelOptions } from "../types/voice";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { VoiceConnection } from "@discordjs/voice";

/** Represents a textable voice channel. */
export default class TextableVoiceChannel<T extends AnyVoiceChannel = AnyVoiceChannel> extends TextableChannel<T> {
    /** The bitrate of the stage channel. */
    bitrate: number;
    /** The id of the voice region of the channel, `null` is automatic. */
    rtcRegion: string | null;
    declare type: VoiceChannels;
    /** The maximum number of members in this voice channel, `0` is unlimited. */
    userLimit: number;
    /** The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of this channel. */
    videoQualityMode: VideoQualityModes;
    voiceMembers: TypedCollection<RawMember, Member, [guildID: string]>;
    constructor(data: RawVoiceChannel | RawStageChannel, client: Client) {
        super(data, client);
        this.bitrate = data.bitrate;
        this.rtcRegion = data.rtc_region;
        this.userLimit = data.user_limit;
        this.videoQualityMode = data.video_quality_mode;
        this.voiceMembers = new TypedCollection(Member, client, this.client.util._getLimit("voiceMembers", this.id));
        this.update(data);
    }

    protected override update(data: Partial<RawVoiceChannel | RawStageChannel>): void {
        super.update(data);
        if (data.bitrate !== undefined) {
            this.bitrate = data.bitrate;
        }
        if (data.rtc_region !== undefined) {
            this.rtcRegion = data.rtc_region;
        }
        if (data.user_limit !== undefined) {
            this.userLimit = data.user_limit;
        }
        if (data.video_quality_mode !== undefined) {
            this.videoQualityMode = data.video_quality_mode;
        }
    }

    override get parent(): CategoryChannel | null | undefined {
        return super.parent as CategoryChannel | null | undefined;
    }

    /** The voice states related to this channel. */
    get voiceStates(): Array<VoiceState<T>> {
        return this["_cachedGuild"]?.voiceStates.filter(state => state.channelID === this.id) as Array<VoiceState<T>> ?? [];
    }

    /**
     * Join this stage channel.
     * @param options The options to join the channel with.
     */
    join(options: Omit<JoinVoiceChannelOptions, "guildID" | "channelID" | "voiceAdapterCreator">): VoiceConnection {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
        return this.client.joinVoiceChannel({
            ...options,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            voiceAdapterCreator: this.guild.voiceAdapterCreator,
            guildID:             this.guildID,
            channelID:           this.id
        });
    }

    /** Leave this stage channel. */
    leave(): void {
        return this.client.leaveVoiceChannel(this.guildID);
    }

    override toJSON(): JSONTextableVoiceChannel {
        return {
            ...super.toJSON(),
            bitrate:          this.bitrate,
            rtcRegion:        this.rtcRegion,
            type:             this.type,
            userLimit:        this.userLimit,
            videoQualityMode: this.videoQualityMode,
            voiceMembers:     this.voiceMembers.map(member => member.id)
        };
    }
}
