/** @module VoiceChannel */
import TextableVoiceChannel from "./TextableVoiceChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { RawVoiceChannel } from "../types/channels";
import type { JSONVoiceChannel } from "../types/json";

/** Represents a guild voice channel. */
export default class VoiceChannel extends TextableVoiceChannel<VoiceChannel> {
    declare type: ChannelTypes.GUILD_VOICE;
    constructor(data: RawVoiceChannel, client: Client) {
        super(data, client);
    }

    override toJSON(): JSONVoiceChannel {
        return super.toJSON() as JSONVoiceChannel;
    }
}
