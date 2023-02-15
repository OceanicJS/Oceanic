/** @module StageChannel */
import Member from "./Member";
import type CategoryChannel from "./CategoryChannel";
import type StageInstance from "./StageInstance";
import TextableChannel from "./TextableChannel";
import type { ChannelTypes, VideoQualityModes } from "../Constants";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
import type { EditStageChannelOptions, RawStageChannel } from "../types/channels";
import type { JSONStageChannel } from "../types/json";
import type { RawMember, CreateStageInstanceOptions, EditStageInstanceOptions } from "../types/guilds";
import type { JoinVoiceChannelOptions } from "../types/voice";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { VoiceConnection } from "@discordjs/voice";

/** Represents a guild stage channel. */
export default class StageChannel extends TextableChannel<StageChannel> {
    /** The bitrate of the stage channel. */
    bitrate: number;
    /** The id of the voice region of the channel, `null` is automatic. */
    rtcRegion: string | null;
    declare type: ChannelTypes.GUILD_STAGE_VOICE;
    /** The maximum number of members in this voice channel. `0` is unlimited. */
    userLimit: number;
    /** The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of this channel. */
    videoQualityMode: VideoQualityModes;
    voiceMembers: TypedCollection<string, RawMember, Member, [guildID: string]>;
    constructor(data: RawStageChannel, client: Client) {
        super(data, client);
        this.bitrate = data.bitrate;
        this.rtcRegion = data.rtc_region;
        this.userLimit = data.user_limit;
        this.videoQualityMode = data.video_quality_mode;
        this.voiceMembers = new TypedCollection(Member, client);
        this.update(data);
    }

    protected override update(data: Partial<RawStageChannel>): void {
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
     * Create a stage instance on this channel.
     * @param options The options for creating the stage instance.
     */
    async createStageInstance(options: CreateStageInstanceOptions): Promise<StageInstance> {
        return this.client.rest.channels.createStageInstance(this.id, options);
    }

    /**
     * Delete the stage instance on this channel.
     * @param reason The reason for deleting the stage instance.
     */
    async deleteStageInstance(reason?: string): Promise<void> {
        return this.client.rest.channels.deleteStageInstance(this.id, reason);
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    override async edit(options: EditStageChannelOptions): Promise<this> {
        return this.client.rest.channels.edit<this>(this.id, options);
    }

    /**
     * Edit the stage instance on this channel.
     * @param options The options for editing the stage instance.
     */
    async editStageInstance(options: EditStageInstanceOptions): Promise<StageInstance> {
        return this.client.rest.channels.editStageInstance(this.id, options);
    }

    /**
     * Get the stage instance associated with this channel.
     */
    async getStageInstance(): Promise<StageInstance> {
        return this.client.rest.channels.getStageInstance(this.id);
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

    override toJSON(): JSONStageChannel {
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
