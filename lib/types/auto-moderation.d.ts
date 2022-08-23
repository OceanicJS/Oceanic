import type { AutoModerationActionTypes, AutoModerationEventTypes, AutoModerationKeywordPresetTypes, AutoModerationTriggerTypes } from "../Constants";
import type AutoModerationRule from "../structures/AutoModerationRule";

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
	/** KEYWORD_PRESET */
	allow_list?: Array<string>;
	/** KEYWORD */
	keyword_filter?: Array<string>;
	/** MENTION_SPAM */
	mention_total_limit?: number;
	/** KEYWORD_PRESET */
	presets?: Array<AutoModerationKeywordPresetTypes>;
}

export interface RawAutoModerationAction {
	metadata: RawActionMetadata;
	type: AutoModerationActionTypes;
}

export interface RawActionMetadata {
	/** SEND_ALERT_MESSAGE */
	channel_id: string;
	/** TIMEOUT */
	duration_seconds: number;
}

export interface TriggerMetadata {
	/** KEYWORD_PRESET */
	allowList?: Array<string>;
	/** KEYWORD */
	keywordFilter?: Array<string>;
	/** MENTION_SPAM */
	mentionTotalLimit?: number;
	/** KEYWORD_PRESET */
	presets?: Array<AutoModerationKeywordPresetTypes>;
}

export interface AutoModerationAction {
	metadata: ActionMetadata;
	type: AutoModerationActionTypes;
}

export interface ActionMetadata {
	/** SEND_ALERT_MESSAGE */
	channelID: string;
	/** TIMEOUT */
	durationSeconds: number;
}

export type CreateAutoModerationRuleOptions = Pick<AutoModerationRule, "name" | "eventType" | "triggerType" | "actions"> & Partial<Pick<AutoModerationRule, "triggerMetadata" | "enabled" | "exemptRoles" | "exemptChannels">> & { reason?: string; };

export type EditAutoModerationRuleOptions = Partial<Pick<CreateAutoModerationRuleOptions, "name" | "eventType" | "triggerMetadata" | "actions" | "enabled" | "exemptRoles" | "exemptChannels" | "reason">>;
