/** @module VoiceChannel */
import TextableVoiceChannel from "./TextableVoiceChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { RawVoiceChannel } from "../types/channels";
import type { JSONVoiceChannel } from "../types/json";

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

    override toJSON(): JSONVoiceChannel {
        return {
            ...super.toJSON(),
            status: this.status,
            type:   this.type
        };
    }
}
