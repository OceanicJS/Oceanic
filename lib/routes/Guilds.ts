import BaseRoute from "./BaseRoute";
import type { RawGuild } from "../types/guilds";
import * as Routes from "../util/Routes";
import Guild from "../structures/Guild";
import type { AutoModerationRule, CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions, RawAutoModerationRule } from "../types/auto-moderation";
import { AutoModerationActionTypes, AutoModerationEventTypes, AutoModerationKeywordPresetTypes, AutoModerationTriggerTypes } from "../Constants";

export default class Guilds extends BaseRoute {
	private _formatAutoModRule(data: RawAutoModerationRule) {
		return {
			actions: data.actions.map(a => ({
				metadata: {
					channelID:       a.metadata.channel_id,
					durationSeconds: a.metadata.duration_seconds
				},
				type: a.type
			})),
			creatorID:       data.creator_id,
			enabled:         data.enabled,
			eventType:       data.event_type,
			exemptChannels:  data.exempt_channels,
			exemptRoles:     data.exempt_roles,
			guildID:         data.guild_id,
			id:              data.id,
			name:            data.name,
			triggerMetadata: {
				allowList:         data.trigger_metadata.allow_list,
				keywordFilter:     data.trigger_metadata.keyword_filter,
				mentionTotalLimit: data.trigger_metadata.mention_total_limit,
				presets:           data.trigger_metadata.presets
			},
			triggerType: data.trigger_type
		} as AutoModerationRule;
	}

	/**
	 * Create an auto moderation rule for a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {Object} options
	 * @param {Object[]} options.actions - The actions to take.
	 * @param {Object} options.actions[].metadata - The metadata for the action.
	 * @param {String} [options.actions[].metadata.channelID] - The ID of the channel to send the message to. (`SEND_ALERT_MESSAGE`)
	 * @param {Number} [options.actions[].metadata.durationSeconds] - The duration of the timeout in seconds. (`TIMEOUT`)
	 * @param {AutoModerationActionTypes} options.actions[].type - The type of action to take.
	 * @param {AutoModerationEventTypes} options.eventType - The event type to trigger on.
	 * @param {String[]} options.exemptChannels - The channels to exempt from the rule.
	 * @param {String[]} options.exemptRoles - The roles to exempt from the rule.
	 * @param {String} [options.reason] - The reason for creating the rule.
	 * @param {Object} [options.triggerMetadata] - The metadata to use for the trigger.
	 * @param {String} [options.triggerMetadata.allowList] - The keywords to allow. (`KEYWORD_PRESET`)
	 * @param {String[]} [options.triggerMetadata.keywordFilter] - The keywords to filter. (`KEYWORD`)
	 * @param {Number} [options.triggerMetadata.mentionTotalLimit] - The maximum number of mentions to allow. (`MENTION_SPAM`)
	 * @param {AutoModerationKeywordPresetTypes[]} [options.triggerMetadata.presets] - The presets to use. (`KEYWORD_PRESET`)
	 * @param {AutoModerationTriggerTypes} options.triggerType - The type of trigger to use.
	 * @returns {Promise<AutoModerationRule>}
	 */
	async createAutoModerationRule(id: string, options: CreateAutoModerationRuleOptions) {
		return this._manager.authRequest<RawAutoModerationRule>({
			method: "POST",
			path:   Routes.GUILD_AUTOMOD_RULES(id),
			json:   {
				actions: options.actions.map(a => ({
					metadata: {
						channel_id:       a.metadata.channelID,
						duration_seconds: a.metadata.durationSeconds
					},
					type: a.type
				})),
				event_type:       options.eventType,
				exempt_channels:  options.exemptChannels,
				exempt_roles:     options.exemptRoles,
				name:             options.name,
				trigger_metadata: !options.triggerMetadata ? undefined : {
					allow_list:          options.triggerMetadata.allowList,
					keyword_filter:      options.triggerMetadata.keywordFilter,
					mention_total_limit: options.triggerMetadata.mentionTotalLimit,
					presets:             options.triggerMetadata.presets
				},
				trigger_type: options.triggerType
			},
			reason: options.reason
		}).then(data => this._formatAutoModRule(data));
	}

	/**
	 * Delete an auto moderation rule.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} ruleID - The ID of the rule to delete.
	 * @param {String} [reason] - The reason for deleting the rule.
	 * @returns {Promise<void>}
	 */
	async deleteAutoModerationRule(id: string, ruleID: string, reason?: string) {
		await this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.GUILD_AUTOMOD_RULE(id, ruleID),
			reason
		});
	}

	/**
	 * Edit an existing auto moderation rule.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} ruleID - The ID of the rule to edit.
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
	async editAutoModerationRule(id: string, ruleID: string, options: EditAutoModerationRuleOptions) {
		return this._manager.authRequest<RawAutoModerationRule>({
			method: "PATCH",
			path:   Routes.GUILD_AUTOMOD_RULE(id, ruleID),
			json:   {
				actions: options.actions?.map(a => ({
					metadata: {
						channel_id:       a.metadata.channelID,
						duration_seconds: a.metadata.durationSeconds
					},
					type: a.type
				})),
				event_type:       options.eventType,
				exempt_channels:  options.exemptChannels,
				exempt_roles:     options.exemptRoles,
				name:             options.name,
				trigger_metadata: !options.triggerMetadata ? undefined : {
					allow_list:          options.triggerMetadata.allowList,
					keyword_filter:      options.triggerMetadata.keywordFilter,
					mention_total_limit: options.triggerMetadata.mentionTotalLimit,
					presets:             options.triggerMetadata.presets
				}
			},
			reason: options.reason
		}).then(data => this._formatAutoModRule(data));
	}

	async get(id: string) {
		return this._manager.authRequest<RawGuild>({
			method: "GET",
			path:   Routes.GUILD(id)
		}).then(data => new Guild(data, this._client));
	}

	/**
	 * Get an auto moderation rule for a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} ruleID - The ID of the rule to get.
	 * @returns {Promise<AutoModerationRule>}
	 */
	async getAutoModerationRule(id: string, ruleID: string) {
		return this._manager.authRequest<RawAutoModerationRule>({
			method: "GET",
			path:   Routes.GUILD_AUTOMOD_RULE(id, ruleID)
		}).then(data => this._formatAutoModRule(data));
	}

	/**
	 * Get the auto moderation rules for a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @returns {Promise<AutoModerationRule[]>}
	 */
	async getAutoModerationRules(id: string) {
		return this._manager.authRequest<Array<RawAutoModerationRule>>({
			method: "GET",
			path:   Routes.GUILD_AUTOMOD_RULES(id)
		}).then(data => data.map(d => this._formatAutoModRule(d)));
	}
}
