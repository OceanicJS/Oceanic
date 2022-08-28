import Base from "./Base";
import type VoiceChannel from "./VoiceChannel";
import type StageChannel from "./StageChannel";
import type Member from "./Member";
import type Guild from "./Guild";
import type User from "./User";
import type Client from "../Client";
import type { RawVoiceState } from "../types/voice";
import type { JSONVoiceState } from "../types/json";
/** Represents a guild member's voice state. */
export default class VoiceState extends Base {
    /** The channel the user is connected to. */
    channel: VoiceChannel | StageChannel | null;
    /** If the associated member is deafened. */
    deaf: boolean;
    /** The guild this voice state is a part of. */
    guild: Guild;
    /** The member associated with this voice state. */
    member: Member;
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
    sessionID: string;
    /** If the associated member is suppressed. */
    suppress: boolean;
    /** The user associated with this voice state. */
    user: User;
    constructor(data: RawVoiceState, client: Client);
    protected update(data: Partial<RawVoiceState>): void;
    toJSON(): JSONVoiceState;
}
