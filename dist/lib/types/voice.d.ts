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
