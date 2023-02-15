/** @module VoiceChannel */
import Member from "./Member";
import type CategoryChannel from "./CategoryChannel";
import TextableChannel from "./TextableChannel";
import type { JoinVoiceChannelOptions } from "../types/voice";
import type { ChannelTypes, VideoQualityModes } from "../Constants";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
import type { EditVoiceChannelOptions, RawVoiceChannel } from "../types/channels";
import type { RawMember } from "../types/guilds";
import type { JSONVoiceChannel } from "../types/json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { VoiceConnection } from "@discordjs/voice";

/** Represents a guild voice channel. */
export default class VoiceChannel extends TextableChannel<VoiceChannel> {
    /** The bitrate of the voice channel. */
    bitrate: number;
    /** The id of the voice region of the channel, `null` is automatic. */
    rtcRegion: string | null;
    declare type: ChannelTypes.GUILD_VOICE;
    /** The maximum number of members in this voice channel. `0` is unlimited. */
    userLimit: number;
    /** The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of this channel. */
    videoQualityMode: VideoQualityModes;
    voiceMembers: TypedCollection<string, RawMember, Member, [guildID: string]>;
    constructor(data: RawVoiceChannel, client: Client) {
        super(data, client);
        this.bitrate = data.bitrate;
        this.rtcRegion = data.rtc_region;
        this.userLimit = data.user_limit;
        this.videoQualityMode = data.video_quality_mode;
        this.voiceMembers = new TypedCollection(Member, client);
        this.update(data);
    }

    protected override update(data: Partial<RawVoiceChannel>): void {
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

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    override async edit(options: EditVoiceChannelOptions): Promise<this> {
        return this.client.rest.channels.edit<this>(this.id, options);
    }


    /**
     * Join this voice channel.
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

    /** Leave this voice channel. */
    leave(): void {
        return this.client.leaveVoiceChannel(this.guildID);
    }

    override toJSON(): JSONVoiceChannel {
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
