/** @module VoiceChannel */
import TextableVoiceChannel from "./TextableVoiceChannel.js";
import type { ChannelTypes } from "../Constants.js";
import type Client from "../Client.js";
import type { RawVoiceChannel } from "../types/channels.js";
import type { JSONVoiceChannel } from "../types/json.js";

/** Represents a guild voice channel. */
export default class VoiceChannel extends TextableVoiceChannel<VoiceChannel> {
    /** The status of this voice channel. */
    status: string | null;
    declare type: ChannelTypes.GUILD_VOICE;
    constructor(data: RawVoiceChannel, client: Client) {
        super(data, client);
        this.status = null;
        this.update(data);
    }

    protected override update(data: Partial<RawVoiceChannel>): void {
        this.status = data.status ?? null;
        super.update(data);
    }

    /**
     * Set a voice status in this channel.
     * @param status The voice status to set.
     */
    async setStatus(status: string | null): Promise<void> {
        return this.client.rest.channels.setVoiceStatus(this.id, status);
    }

    override toJSON(): JSONVoiceChannel {
        return {
            ...super.toJSON(),
            status: this.status,
            type:   this.type
        };
    }
}
