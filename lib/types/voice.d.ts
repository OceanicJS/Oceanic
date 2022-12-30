/** @module Types/Voice */
import type { RawMember } from "./guilds";

export interface RawVoiceState {
    channel_id: string | null;
    deaf: boolean;
    guild_id?: string;
    member?: RawMember;
    mute: boolean;
    request_to_speak_timestamp: string | null;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    session_id: string;
    suppress: boolean;
    user_id: string;
}

export interface VoiceRegion {
    custom: boolean;
    deprecated: boolean;
    id: string;
    name: string;
    optimal: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { type DiscordGatewayAdapterCreator } from "@discordjs/voice";

export interface JoinVoiceChannelOptions {
    /** The ID of the channel to join. */
    channelID: string;
    /** Whether debug messages are enabled. Defaults to false. */
    debug?: boolean;
    /** The ID of the guild the channel to join belongs to. */
    guildID: string;
    /** Whether to join the channel deafened. Defaults to true. */
    selfDeaf?: boolean;
    /** Whether to join the channel muted. Defaults to true. */
    selfMute?: boolean;
    /** The voice adapter creator for this voice connection. Use the \<Guild\>.voiceAdapterCreator property for this. */
    voiceAdapterCreator: DiscordGatewayAdapterCreator;
}
