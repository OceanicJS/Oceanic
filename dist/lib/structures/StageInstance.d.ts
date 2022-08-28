import Base from "./Base";
import type StageChannel from "./StageChannel";
import Guild from "./Guild";
import ScheduledEvent from "./ScheduledEvent";
import type { RawStageInstance } from "../types/stage-instances";
import type Client from "../Client";
import type { StageInstancePrivacyLevels } from "../Constants";
import type { Uncached } from "../types/shared";
import type { JSONStageInstance } from "../types/json";
export default class StageInstance extends Base {
    /** The associated stage channel. */
    channel: StageChannel;
    /** @deprecated If the stage channel is discoverable */
    discoverableDisabled: boolean;
    /** The guild of the associated stage channel. */
    guild: Guild;
    /** The id of the guild associated with this stage instance's stage channel. */
    guildID: string;
    /** The [privacy level](https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level) of this stage instance. */
    privacyLevel: StageInstancePrivacyLevels;
    /** The scheduled event for this stage instance. */
    scheduledEvent?: ScheduledEvent | Uncached;
    /** The topic of this stage instance. */
    topic: string;
    constructor(data: RawStageInstance, client: Client);
    protected update(data: Partial<RawStageInstance>): void;
    toJSON(): JSONStageInstance;
}
