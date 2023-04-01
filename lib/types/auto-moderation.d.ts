/** @module Types/AutoModeration */
import type { AutoModerationActionTypes, AutoModerationEventTypes, AutoModerationKeywordPresetTypes, AutoModerationTriggerTypes } from "../Constants";

export interface RawAutoModerationRule {
    actions: Array<RawAutoModerationAction>;
    creator_id: string;
    enabled: boolean;
    event_type: AutoModerationEventTypes;
    exempt_channels: Array<string>;
    exempt_roles: Array<string>;
    guild_id: string;
    id: string;
    name: string;
    trigger_metadata: RawTriggerMetadata;
    trigger_type: AutoModerationTriggerTypes;
}

export interface RawTriggerMetadata {
    /** `KEYWORD`, `KEYWORD_PRESET`, `MEMBER_PROFILE` */
    allow_list?: Array<string>;
    /** `KEYWORD`, `MEMBER_PROFILE` */
    keyword_filter?: Array<string>;
    /** `MENTION_SPAM` */
    mention_raid_protection_enabled?: boolean;
    /** `MENTION_SPAM` */
    mention_total_limit?: number;
    /** `KEYWORD_PRESET` */
    presets?: Array<AutoModerationKeywordPresetTypes>;
    /** `KEYWORD`, `MEMBER_PROFILE` */
    regex_patterns?: Array<string>;
}

export interface RawAutoModerationAction {
    metadata: RawActionMetadata;
    type: AutoModerationActionTypes;
}

export interface RawActionMetadata {
    /** `SEND_ALERT_MESSAGE` */
    channel_id?: string;
    /** `BLOCK_MESSAGE` */
    custom_message?: string;
    /** `TIMEOUT` */
    duration_seconds?: number;
}

export interface TriggerMetadata {
    /** The keywords to allow. Valid for `KEYWORD`, `KEYWORD_PRESET` & `MEMBER_PROFILE`. `KEYWORD`, `MEMBER_PROFILE`: Max 100 total, 60 characters each. `KEYWORD_PRESET`: Max 1000 total, 60 characters each. */
    allowList?: Array<string>;
    /** The keywords to filter. Valid for `KEYWORD` & `MEMBER_PROFILE`. Max 1000 total, 60 characters each. */
    keywordFilter?: Array<string>;
    /** Whether to enable mention raid protection. Valid for `MENTION_SPAM`. */
    mentionRaidProtectionEnabled?: boolean;
    /** The maximum number of mentions to allow. Valid for `MENTION_SPAM`. */
    mentionTotalLimit?: number;
    /** The presets to use. Valid for `KEYWORD_PRESET`. */
    presets?: Array<AutoModerationKeywordPresetTypes>;
    /** The regular expressions to match the content against and filter. Currently only Rust flavored regex such as `Rustexp` are supported. Valid for `KEYWORD`& `MEMBER_PROFILE`. Max 10 total, 260 characters each. */
    regexPatterns?: Array<string>;
}

export interface AutoModerationAction {
    /** The metadata for the action. */
    metadata: ActionMetadata;
    /** The type of the action. */
    type: AutoModerationActionTypes;
}

export interface ActionMetadata {
    /** The ID of the channel to send the message to. Valid for `SEND_ALERT_MESSAGE`. */
    channelID?: string;
    /** The custom message to send. Valid for `BLOCK_MESSAGE`. */
    customMessage?: string;
    /** The duration of the timeout in seconds. Valid for `TIMEOUT`. */
    durationSeconds?: number;
}

export interface CreateAutoModerationRuleOptions {
    /** The actions for the rule. */
    actions: Array<AutoModerationAction>;
    /** If the rule is enabled. */
    enabled?: boolean;
    /** The event type to trigger on. */
    eventType: AutoModerationEventTypes;
    /** The channels to exempt from the rule. */
    exemptChannels?: Array<string>;
    /** The roles to exempt from the rule. */
    exemptRoles?: Array<string>;
    /** The name of the rule. */
    name: string;
    /** The reason for creating the rule. */
    reason?: string;
    /** The metadata to use for the trigger. */
    triggerMetadata?: TriggerMetadata;
    /** The type of trigger to use. */
    triggerType: AutoModerationTriggerTypes;
}

export type EditAutoModerationRuleOptions = Partial<Pick<CreateAutoModerationRuleOptions, "name" | "eventType" | "triggerMetadata" | "actions" | "enabled" | "exemptRoles" | "exemptChannels" | "reason">>;
