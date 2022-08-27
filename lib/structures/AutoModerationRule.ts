import Base from "./Base";
import User from "./User";
import type Guild from "./Guild";
import type Client from "../Client";
import type { AutoModerationAction, EditAutoModerationRuleOptions, RawAutoModerationRule, TriggerMetadata } from "../types/auto-moderation";
import type { AutoModerationActionTypes, AutoModerationEventTypes, AutoModerationKeywordPresetTypes, AutoModerationTriggerTypes } from "../Constants";
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
	/** The name of this rule */
	name: string;
	/** The metadata of this rule's trigger.  */
	triggerMetadata: TriggerMetadata;
	/** This rule's [trigger type](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types). */
	triggerType: AutoModerationTriggerTypes;
	constructor(data: RawAutoModerationRule, client: Client) {
		super(data.id, client);
		if (data.creator_id !== undefined) this.creator = this._client.users.get(data.creator_id) || { id: data.creator_id };
		if (data.guild_id !== undefined) this.guild = this._client.guilds.get(data.guild_id)!;
		this.update(data);
	}

	protected update(data: Partial<RawAutoModerationRule>) {
		if (data.actions !== undefined) this.actions = data.actions.map(a => ({
			metadata: {
				channelID:       a.metadata.channel_id,
				durationSeconds: a.metadata.duration_seconds
			},
			type: a.type
		}));
		if (data.enabled !== undefined) this.enabled = data.enabled;
		if (data.event_type !== undefined) this.eventType = data.event_type;
		if (data.exempt_channels !== undefined) this.exemptChannels = data.exempt_channels;
		if (data.exempt_roles !== undefined) this.exemptRoles = data.exempt_roles;
		if (data.name !== undefined) this.name = data.name;
		if (data.trigger_metadata !== undefined) this.triggerMetadata = {
			allowList:         data.trigger_metadata.allow_list,
			keywordFilter:     data.trigger_metadata.keyword_filter,
			mentionTotalLimit: data.trigger_metadata.mention_total_limit,
			presets:           data.trigger_metadata.presets
		};
		if (data.trigger_type !== undefined) this.triggerType = data.trigger_type;
	}

	/**
	 * Delete this auto moderation rule.
	 *
	 * @param {String} [reason] - The reason for deleting the rule.
	 * @returns {Promise<void>}
	 */
	async deleteAutoModerationRule(reason?: string) {
		return this._client.rest.guilds.deleteAutoModerationRule(this.guild.id, this.id, reason);
	}

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
	async edit(options: EditAutoModerationRuleOptions) {
		return this._client.rest.guilds.editAutoModerationRule(this.guild.id, this.id, options);
	}

	override toJSON(): JSONAutoModerationRule {
		return {
			...super.toJSON(),
			actions:         this.actions,
			creator:         this.creator instanceof User ? this.creator.toJSON() : this.creator.id,
			enabled:         this.enabled,
			eventType:       this.eventType,
			exemptChannels:  this.exemptChannels,
			exemptRoles:     this.exemptRoles,
			guild:           this.guild.id,
			name:            this.name,
			triggerMetadata: this.triggerMetadata,
			triggerType:     this.triggerType
		};
	}
}
