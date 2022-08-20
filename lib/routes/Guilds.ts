import BaseRoute from "./BaseRoute";
import type {
	CreateEmojiOptions,
	EditEmojiOptions,
	GuildEmoji,
	RawGuild,
	RawGuildEmoji,
	RawMember
} from "../types/guilds";
import * as Routes from "../util/Routes";
import Guild from "../structures/Guild";
import type { AutoModerationRule, CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions, RawAutoModerationRule } from "../types/auto-moderation";
import {
	AuditLogActionTypes,
	AutoModerationActionTypes,
	AutoModerationEventTypes,
	AutoModerationKeywordPresetTypes,
	AutoModerationTriggerTypes,
	ScheduledEventEntityTypes,
	ScheduledEventPrivacyLevels,
	ScheduledEventStatuses
} from "../Constants";
import type { AuditLog, GetAuditLogOptions, RawAuditLog } from "../types/audit-log";
import ScheduledEvent from "../structures/ScheduledEvent";
import Channel from "../structures/Channel";
import Webhook from "../structures/Webhook";
import type {
	CreateScheduledEventOptions,
	EditScheduledEventOptions,
	GetScheduledEventUsersOptions,
	RawScheduledEvent,
	RawScheduledEventUser,
	ScheduledEventUser
} from "../types/scheduled-events";
import Member from "../structures/Member";
import GuildTemplate from "../structures/GuildTemplate";
import type { CreateGuildFromTemplateOptions, CreateTemplateOptions, EditGuildTemplateOptions, RawGuildTemplate } from "../types/guild-template";

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
		const reason = options.reason;
		if (options.reason) delete options.reason;
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
			reason
		}).then(data => this._formatAutoModRule(data));
	}

	/**
	 * Create an emoji in a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {Object} options
	 * @param {String} options.name - The name of the emoji.
	 * @param {(Buffer | String)} options.image - The image (buffer, or full data url).
	 * @param {String} [options.reason] - The reason for creating the emoji.
	 * @param {String[]} [options.roles] - The roles to restrict the emoji to.
	 * @returns {Promise<GuildEmoji>}
	 */
	async createEmoji(id: string, options: CreateEmojiOptions) {
		const reason = options.reason;
		if (options.reason) delete options.reason;
		if (options.image) {
			try {
				options.image = this._client._convertImage(options.image);
			} catch (err) {
				throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}
		return this._manager.authRequest<RawGuildEmoji>({
			method: "POST",
			path:   Routes.GUILD_EMOJIS(id),
			json:   {
				image: options.image,
				name:  options.name,
				roles: options.roles
			},
			reason
		}).then(data => ({
			...data,
			user: !data.user ? undefined : this._client.users.update(data.user)
		}));
	}

	/**
	 * Create a guild from a template. This can only be used by bots in less than 10 guilds.
	 *
	 * @param {String} code - The code of the template to use.
	 * @param {Object} options
	 * @param {(Buffer | String)} [options.icon] - The icon for the created guild (buffer, or full data url).
	 * @param {String} options.name - The name of the guild.
	 * @returns {Promise<Guild>}
	 */
	async createFromTemplate(code: string, options: CreateGuildFromTemplateOptions) {
		if (options.icon) {
			try {
				options.icon = this._client._convertImage(options.icon);
			} catch (err) {
				throw new Error("Invalid icon provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}
		return this._manager.authRequest<RawGuild>({
			method: "POST",
			path:   Routes.GUILD_TEMPLATE_CODE(code),
			json:   {
				icon: options.icon,
				name: options.name
			}
		}).then(data => this._client.guilds.update(data));
	}

	/**
	 * Create a scheduled event in a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {Object} options
	 * @param {String} [options.channelID] - The ID of the stage channel the event is taking place in. Optional if `entityType` is `EXTERNAL`.
	 * @param {String} [options.description] - The description of the event.
	 * @param {Object} [options.entityMetadata]
	 * @param {String} [options.entityMetadata.location] - The location of the event. Required if `entityType` is `EXTERNAL`.
	 * @param {ScheduledEventEntityTypes} options.entityType - The type of the event.
	 * @param {(Buffer | String)} [options.image] - The cover image of the event.
	 * @param {String} options.name - The name of the scheduled event.
	 * @param {ScheduledEventPrivacyLevels} options.privacyLevel - The privacy level of the event.
	 * @param {String} [options.reason] - The reason for creating the scheduled event.
	 * @param {String} [options.scheduledEndTime] - The time the event ends. ISO8601 Timestamp. Required if `entityType` is `EXTERNAL`.
	 * @param {String} options.scheduledStartTime - The time the event starts. ISO8601 Timestamp.
	 * @returns {Promise<ScheduledEvent>}
	 */
	async createScheduledEvent(id: string, options: CreateScheduledEventOptions) {
		const reason = options.reason;
		if (options.reason) delete options.reason;
		if (options.image) {
			try {
				options.image = this._client._convertImage(options.image);
			} catch (err) {
				throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}
		return this._manager.authRequest<RawScheduledEvent>({
			method: "POST",
			path:   Routes.GUILD_SCHEDULED_EVENTS(id),
			json:   {
				channel_id:      options.channelID,
				description:     options.description,
				entity_metadata: !options.entityMetadata ? undefined : {
					location: options.entityMetadata.location
				},
				entity_type:          options.entityType,
				image:                options.image,
				name:                 options.name,
				privacy_level:        options.privacyLevel,
				scheduled_end_time:   options.scheduledEndTime,
				scheduled_start_time: options.scheduledStartTime
			},
			reason
		}).then(data => new ScheduledEvent(data, this._client));
	}

	/**
	 * Create a guild template.
	 *
	 * @param {String} id - The ID of the guild to create a template from.
	 * @param {Object} options
	 * @param {String} [options.description] - The description of the template.
	 * @param {String} options.name - The name of the template.
	 * @returns {Promise<GuildTemplate>}
	 */
	async createTemplate(id: string, options: CreateTemplateOptions) {
		return this._manager.authRequest<RawGuildTemplate>({
			method: "POST",
			path:   Routes.GUILD_TEMPLATES(id),
			json:   {
				description: options.description,
				name:        options.name
			}
		}).then(data => new GuildTemplate(data, this._client));
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
	 * Delete an emoji.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} emojiID - The ID of the emoji.
	 * @param {String} [reason] - The reason for deleting the emoji.
	 * @returns {Promise<void>}
	 */
	async deleteEmoji(id: string, emojiID: string, reason?: string) {
		await this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.GUILD_EMOJI(id, emojiID),
			reason
		});
	}

	/**
	 * Delete a scheduled event.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} eventID - The ID of the scheduled event.
	 * @param {String} reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
	 * @returns {Promise<void>}
	 */
	async deleteScheduledEvent(id: string, eventID: string, reason?: string) {
		await this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.GUILD_SCHEDULED_EVENT(id, eventID),
			reason
		});
	}

	/**
	 * Delete a template.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} code - The code of the template.
	 * @returns {Promise<void>}
	 */
	async deleteTemplate(id: string, code: string) {
		await this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.GUILD_TEMPLATE(id, code)
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
		const reason = options.reason;
		if (options.reason) delete options.reason;
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
			reason
		}).then(data => this._formatAutoModRule(data));
	}

	/**
	 * Edit an existing emoji.
	 *
	 * @param {String} id - The ID of the guild the emoji is in.
	 * @param {Object} options
	 * @param {String} [options.name] - The name of the emoji.
	 * @param {String} [options.reason] - The reason for creating the emoji.
	 * @param {String[]} [options.roles] - The roles to restrict the emoji to.
	 * @returns {Promise<GuildEmoji>}
	 */
	async editEmoji(id: string, emojiID: string, options: EditEmojiOptions) {
		const reason = options.reason;
		if (options.reason) delete options.reason;
		return this._manager.authRequest<RawGuildEmoji>({
			method: "POST",
			path:   Routes.GUILD_EMOJI(id, emojiID),
			json:   {
				name:  options.name,
				roles: options.roles
			},
			reason
		}).then(data => ({
			...data,
			user: !data.user ? undefined : this._client.users.update(data.user)
		}));
	}

	/**
	 * Edit an existing scheduled event in a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {Object} options
	 * @param {?String} [options.channelID] - The ID of the stage channel the event is taking place in. Required to be `null` if changing `entityType` to `EXTERNAL`.
	 * @param {String} [options.description] - The description of the event.
	 * @param {Object} [options.entityMetadata]
	 * @param {String} [options.entityMetadata.location] - The location of the event. Required if changing `entityType` to `EXTERNAL`.
	 * @param {ScheduledEventEntityTypes} options.entityType - The type of the event.
	 * @param {(Buffer | String)} [options.image] - The cover image of the event.
	 * @param {String} options.name - The name of the scheduled event.
	 * @param {ScheduledEventPrivacyLevels} options.privacyLevel - The privacy level of the event.
	 * @param {String} [options.reason] - The reason for creating the scheduled event.
	 * @param {String} [options.scheduledEndTime] - The time the event ends. ISO8601 Timestamp. Required if changing `entityType` to `EXTERNAL`.
	 * @param {String} options.scheduledStartTime - The time the event starts. ISO8601 Timestamp.
	 * @param {ScheduledEventStatuses} [options.status] - The status of the event.
	 * @returns {Promise<ScheduledEvent>}
	 */
	async editScheduledEvent(id: string, options: EditScheduledEventOptions) {
		const reason = options.reason;
		if (options.reason) delete options.reason;
		if (options.image) {
			try {
				options.image = this._client._convertImage(options.image);
			} catch (err) {
				throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}
		return this._manager.authRequest<RawScheduledEvent>({
			method: "POST",
			path:   Routes.GUILD_SCHEDULED_EVENTS(id),
			json:   {
				channel_id:      options.channelID,
				description:     options.description,
				entity_metadata: !options.entityMetadata ? undefined : {
					location: options.entityMetadata.location
				},
				entity_type:          options.entityType,
				image:                options.image,
				name:                 options.name,
				privacy_level:        options.privacyLevel,
				status:               options.status,
				scheduled_end_time:   options.scheduledEndTime,
				scheduled_start_time: options.scheduledStartTime
			},
			reason
		}).then(data => new ScheduledEvent(data, this._client));
	}

	/**
	 * Edit a guild template.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} code - The code of the template.
	 * @param {Object} options
	 * @param {String} [options.description] - The description of the template.
	 * @param {String} [options.name] - The name of the template.
	 * @returns {Promise<GuildTemplate>}
	 */
	async editTemplate(id: string, code: string, options: EditGuildTemplateOptions) {
		return this._manager.authRequest<RawGuildTemplate>({
			method: "POST",
			path:   Routes.GUILD_TEMPLATE(id, code),
			json:   {
				code,
				description: options.description,
				name:        options.name
			}
		}).then(data => new GuildTemplate(data, this._client));
	}

	/**
	 * Get a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @returns {Promise<Guild>}
	 */
	async get(id: string) {
		return this._manager.authRequest<RawGuild>({
			method: "GET",
			path:   Routes.GUILD(id)
		}).then(data => new Guild(data, this._client));
	}

	/**
	 * Get a guild's audit log.
	 *
	 * Note: everything under the `entries` key is raw from Discord. See [their documentation](https://discord.com/developers/docs/resources/audit-log#audit-logs) for structure and other information. (`audit_log_entries`)
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {Object} [options]
	 * @param {AuditLogActionTypes} [options.actionType] - The action type to filter by.
	 * @param {Number} [options.before] - The ID of the entry to get entries before.
	 * @param {Number} [options.limit] - The maximum number of entries to get.
	 * @param {String} [options.userID] - The ID of the user to filter by.
	 * @returns {Promise<AuditLog>}
	 */
	async getAuditLog(id: string, options?: GetAuditLogOptions) {
		const query = new URLSearchParams();
		if (options?.actionType) query.set("action_type", options.actionType.toString());
		if (options?.before) query.set("before", options.before);
		if (options?.limit) query.set("limit", options.limit.toString());
		if (options?.userID) query.set("user_id", options.userID);
		return this._manager.authRequest<RawAuditLog>({
			method: "GET",
			path:   Routes.GUILD_AUDIT_LOG(id),
			query
		}).then(data => ({
			autoModerationRules:  data.auto_moderation_rules.map(rule => this._formatAutoModRule(rule)),
			entries:              data.audit_log_entries,
			guildScheduledEvents: data.guild_scheduled_events.map(event => new ScheduledEvent(event, this._client)),
			integrations:         data.integrations,
			threads:              data.threads.map(thread => Channel.from(thread, this._client)),
			users:                data.users.map(user => this._client.users.update(user)),
			webhooks:             data.webhooks.map(webhook => new Webhook(webhook, this._client))
		}) as AuditLog);
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

	/**
	 * Get an emoji in a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} emojiID - The ID of the emoji to get.
	 * @returns {Promise<GuildEmoji>}
	 */
	async getEmoji(id: string, emojiID: string) {
		return this._manager.authRequest<RawGuildEmoji>({
			method: "GET",
			path:   Routes.GUILD_EMOJI(id, emojiID)
		}).then(data => ({
			...data,
			user: !data.user ? undefined : this._client.users.update(data.user)
		}) as GuildEmoji);
	}

	/**
	 * Get the emojis in a guild.
	 *
	 * @param {String} id - The ID of the guild.
	 * @returns {Promise<GuildEmoji[]>}
	 */
	async getEmojis(id: string) {
		return this._manager.authRequest<Array<RawGuildEmoji>>({
			method: "GET",
			path:   Routes.GUILD_EMOJIS(id)
		}).then(data => data.map(d => ({
			...d,
			user: !d.user ? undefined : this._client.users.update(d.user)
		}) as GuildEmoji));
	}

	/**
	 * Get a scheduled event.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} eventID - The ID of the scheduled event to get.
	 * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
	 * @returns {Promise<ScheduledEvent>}
	 */
	async getScheduledEvent(id: string, eventID: string, withUserCount?: number) {
		const query = new URLSearchParams();
		if (withUserCount) query.set("with_user_count", withUserCount.toString());
		return this._manager.authRequest<RawScheduledEvent>({
			method: "GET",
			path:   Routes.GUILD_SCHEDULED_EVENT(id, eventID),
			query
		}).then(data => new ScheduledEvent(data, this._client));
	}

	/**
	 * Get the users subscribed to a scheduled event.
	 *
	 * @param {String} id
	 * @param {String} eventID
	 * @param {Object} options
	 * @param {String} [options.after] - The ID of the entry to get entries after.
	 * @param {String} [options.before] - The ID of the entry to get entries before.
	 * @param {Number} [options.limit] - The maximum number of entries to get.
	 * @param {Boolean} [options.withMember] - If the member object should be included.
	 * @returns {Promise<ScheduledEventUser[]>}
	 */
	async getScheduledEventUsers(id: string, eventID: string, options?: GetScheduledEventUsersOptions) {
		const guild = this._client.guilds.get(id);
		const query = new URLSearchParams();
		if (options?.after) query.set("after", options.after);
		if (options?.before) query.set("before", options.before);
		if (options?.limit) query.set("limit", options.limit.toString());
		if (options?.withMember !== undefined) query.set("with_member", options.withMember ? "true" : "false");
		return this._manager.authRequest<Array<RawScheduledEventUser>>({
			method: "GET",
			path:   Routes.GUILD_SCHEDULED_EVENT_USERS(id, eventID)
		}).then(data => data.map(d => {
			const member = d.member as RawMember & { id: string; };
			if (member) member.id = d.user.id;
			return {
				guildScheduledEventID: d.guild_scheduled_event_id,
				user:                  this._client.users.update(d.user),
				member:                member ? guild ? guild.members.update(member, id) : new Member(member, this._client, id) : undefined
			} as ScheduledEventUser;
		}));
	}

	/**
	 * Get a guild's scheduled events
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
	 * @returns {Promise<ScheduledEvent[]>}
	 */
	async getScheduledEvents(id: string, withUserCount?: number) {
		const query = new URLSearchParams();
		if (withUserCount) query.set("with_user_count", withUserCount.toString());
		return this._manager.authRequest<Array<RawScheduledEvent>>({
			method: "GET",
			path:   Routes.GUILD_SCHEDULED_EVENTS(id),
			query
		}).then(data => data.map(d => new ScheduledEvent(d, this._client)));
	}

	/**
	 * Get a guild template.
	 *
	 * @param {String} code - The code of the template to get.
	 * @returns {Promise<GuildTemplate>}
	 */
	async getTemplate(code: string) {
		return this._manager.authRequest<RawGuildTemplate>({
			method: "GET",
			path:   Routes.GUILD_TEMPLATE_CODE(code)
		}).then(data => new GuildTemplate(data, this._client));
	}

	/**
	 * Get a guild's templates.
	 *
	 * @param {String} id - The ID of the guild.
	 * @returns {Promise<GuildTemplate[]>}
	 */
	async getTemplates(id: string) {
		return this._manager.authRequest<Array<RawGuildTemplate>>({
			method: "GET",
			path:   Routes.GUILD_TEMPLATES(id)
		}).then(data => data.map(d => new GuildTemplate(d, this._client)));
	}

	/**
	 * Sync a guild template.
	 *
	 * @param {String} id - The ID of the guild.
	 * @param {String} code - The code of the template to sync.
	 * @returns {Promise<GuildTemplate>}
	 */
	async syncTemplate(id: string, code: string) {
		return this._manager.authRequest<RawGuildTemplate>({
			method: "POST",
			path:   Routes.GUILD_TEMPLATE(id, code)
		}).then(data => new GuildTemplate(data, this._client));
	}
}
