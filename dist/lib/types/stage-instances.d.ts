import type { StageInstancePrivacyLevels } from "../Constants";

export interface RawStageInstance {
    channel_id: string;
    /** @deprecated */
    discoverable_disabled: boolean;
    guild_id: string;
    guild_scheduled_event_id?: string;
    id: string;
    privacy_level: StageInstancePrivacyLevels;
    topic: string;
}
