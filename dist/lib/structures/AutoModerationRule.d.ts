import Base from "./Base";
import User from "./User";
import type Guild from "./Guild";
import type Client from "../Client";
import type { AutoModerationAction, EditAutoModerationRuleOptions, RawAutoModerationRule, TriggerMetadata } from "../types/auto-moderation";
import type { AutoModerationEventTypes, AutoModerationTriggerTypes } from "../Constants";
import type { Uncached } from "../types/shared";
import type { JSONAutoModerationRule } from "../types/json";
/** Represents an auto moderation rule. */
export default class AutoModerationRule extends Base {
    /** The actions that will execute when this rule is triggered. */
    actions: Array<AutoModerationAction>;
    /** The creator of this rule. This can be a partial object with just an `id` property. */
    creator: User | Uncached;
    /** If this rule is enabled. */
    enabled: boolean;
    /** The [event type](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types) of this rule. */
    eventType: AutoModerationEventTypes;
    /** The channels that are exempt from this rule. */
    exemptChannels: Array<string>;
    /** The roles that are exempt from this rule. */
    exemptRoles: Array<string>;
    /** The guild this rule is in. */
    guild: Guild;
    /** The id of the guild this rule is in. */
    guildID: string;
    /** The name of this rule */
    name: string;
    /** The metadata of this rule's trigger.  */
    triggerMetadata: TriggerMetadata;
    /** This rule's [trigger type](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types). */
    triggerType: AutoModerationTriggerTypes;
    constructor(data: RawAutoModerationRule, client: Client);
    protected update(data: Partial<RawAutoModerationRule>): void;
    /**
     * Delete this auto moderation rule.
     * @param reason - The reason for deleting this rule.
     */
    deleteAutoModerationRule(reason?: string): Promise<void>;
    /**
     * Edit this auto moderation rule.
     * @param options - The options for editing the rule.
     */
    edit(options: EditAutoModerationRuleOptions): Promise<AutoModerationRule | undefined>;
    toJSON(): JSONAutoModerationRule;
}
