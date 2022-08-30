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
     *
     * @param {String} [reason] - The reason for deleting the rule.
     * @returns {Promise<void>}
     */
    deleteAutoModerationRule(reason?: string): Promise<void>;
    /**
     * Edit this auto moderation rule.
     *
     * @param {Object} options
     * @param {Object[]} [options.actions] - The actions to take.
     * @param {Object} options.actions[].metadata - The metadata for the action.
     * @param {String} [options.actions[].metadata.channelID] - The ID of the channel to send the message to. (`SEND_ALERT_MESSAGE`)
     * @param {Number} [options.actions[].metadata.durationSeconds] - The duration of the timeout in seconds. (`TIMEOUT`)
     * @param {AutoModerationActionTypes} options.actions[].type - The type of action to take.
     * @param {AutoModerationEventTypes} options.eventType - The event type to trigger on.
     * @param {String[]} [options.exemptChannels] - The channels to exempt from the rule.
     * @param {String[]} [options.exemptRoles] - The roles to exempt from the rule.
     * @param {String} [options.reason] - The reason for editing the rule.
     * @param {Object} [options.triggerMetadata] - The metadata to use for the trigger.
     * @param {String} [options.triggerMetadata.allowList] - The keywords to allow. (`KEYWORD_PRESET`)
     * @param {String[]} [options.triggerMetadata.keywordFilter] - The keywords to filter. (`KEYWORD`)
     * @param {Number} [options.triggerMetadata.mentionTotalLimit] - The maximum number of mentions to allow. (`MENTION_SPAM`)
     * @param {AutoModerationKeywordPresetTypes[]} [options.triggerMetadata.presets] - The presets to use. (`KEYWORD_PRESET`)
     * @returns {Promise<AutoModerationRule>}
     */
    edit(options: EditAutoModerationRuleOptions): Promise<AutoModerationRule | undefined>;
    toJSON(): JSONAutoModerationRule;
}
