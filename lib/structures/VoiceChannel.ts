/** @module VoiceChannel */
import TextableVoiceChannel from "./TextableVoiceChannel";
import type * as Types from "../types/namespaced";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";

/** Represents a guild voice channel. */
export default class VoiceChannel extends TextableVoiceChannel<VoiceChannel> {
    /** The status of this voice channel. */
    status: string | null;
    declare type: ChannelTypes.GUILD_VOICE;
    /** The start time of the session in this voice channel. */
    voiceStartTime: number | null;
    constructor(data: Types.Channels.RawVoiceChannel, client: Client) {
        super(data, client);
        this.status = null;
        this.voiceStartTime = null;
        this.update(data);
    }

    protected override update(data: Partial<Types.Channels.RawVoiceChannel>): void {
        this.status = data.status ?? null;
        if (data.status !== undefined) {
            this.status = data.status;
        }
        if (data.voice_start_time !== undefined) {
            this.voiceStartTime = data.voice_start_time;
        }
        super.update(data);
    }

    /**
     * Set a voice status in this channel.
     * @param status The voice status to set.
     */
    async setStatus(status: string | null): Promise<void> {
        return this.client.rest.channels.setVoiceStatus(this.id, status);
    }

    override toJSON(): Types.JSON.JSONVoiceChannel {
        return {
            ...super.toJSON(),
            status: this.status,
            type:   this.type
        };
    }
}
