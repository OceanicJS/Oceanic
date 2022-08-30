"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const User_1 = __importDefault(require("./User"));
/** Represents an auto moderation rule. */
class AutoModerationRule extends Base_1.default {
    /** The actions that will execute when this rule is triggered. */
    actions;
    /** The creator of this rule. This can be a partial object with just an `id` property. */
    creator;
    /** If this rule is enabled. */
    enabled;
    /** The [event type](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types) of this rule. */
    eventType;
    /** The channels that are exempt from this rule. */
    exemptChannels;
    /** The roles that are exempt from this rule. */
    exemptRoles;
    /** The guild this rule is in. */
    guild;
    /** The id of the guild this rule is in. */
    guildID;
    /** The name of this rule */
    name;
    /** The metadata of this rule's trigger.  */
    triggerMetadata;
    /** This rule's [trigger type](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types). */
    triggerType;
    constructor(data, client) {
        super(data.id, client);
        if (data.creator_id !== undefined)
            this.creator = this._client.users.get(data.creator_id) || { id: data.creator_id };
        if (data.guild_id !== undefined) {
            this.guild = this._client.guilds.get(data.guild_id);
            this.guildID = data.guild_id;
        }
        this.update(data);
    }
    update(data) {
        if (data.actions !== undefined)
            this.actions = data.actions.map(a => ({
                metadata: {
                    channelID: a.metadata.channel_id,
                    durationSeconds: a.metadata.duration_seconds
                },
                type: a.type
            }));
        if (data.enabled !== undefined)
            this.enabled = data.enabled;
        if (data.event_type !== undefined)
            this.eventType = data.event_type;
        if (data.exempt_channels !== undefined)
            this.exemptChannels = data.exempt_channels;
        if (data.exempt_roles !== undefined)
            this.exemptRoles = data.exempt_roles;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.trigger_metadata !== undefined)
            this.triggerMetadata = {
                allowList: data.trigger_metadata.allow_list,
                keywordFilter: data.trigger_metadata.keyword_filter,
                mentionTotalLimit: data.trigger_metadata.mention_total_limit,
                presets: data.trigger_metadata.presets
            };
        if (data.trigger_type !== undefined)
            this.triggerType = data.trigger_type;
    }
    /**
     * Delete this auto moderation rule.
     *
     * @param {String} [reason] - The reason for deleting the rule.
     * @returns {Promise<void>}
     */
    async deleteAutoModerationRule(reason) {
        return this._client.rest.guilds.deleteAutoModerationRule(this.guildID, this.id, reason);
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
    async edit(options) {
        return this._client.rest.guilds.editAutoModerationRule(this.guildID, this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            actions: this.actions,
            creator: this.creator instanceof User_1.default ? this.creator.toJSON() : this.creator.id,
            enabled: this.enabled,
            eventType: this.eventType,
            exemptChannels: this.exemptChannels,
            exemptRoles: this.exemptRoles,
            guild: this.guildID,
            name: this.name,
            triggerMetadata: this.triggerMetadata,
            triggerType: this.triggerType
        };
    }
}
exports.default = AutoModerationRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b01vZGVyYXRpb25SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXV0b01vZGVyYXRpb25SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQVExQiwwQ0FBMEM7QUFDMUMsTUFBcUIsa0JBQW1CLFNBQVEsY0FBSTtJQUNoRCxpRUFBaUU7SUFDakUsT0FBTyxDQUE4QjtJQUNyQyx5RkFBeUY7SUFDekYsT0FBTyxDQUFrQjtJQUN6QiwrQkFBK0I7SUFDL0IsT0FBTyxDQUFVO0lBQ2pCLDRJQUE0STtJQUM1SSxTQUFTLENBQTJCO0lBQ3BDLG1EQUFtRDtJQUNuRCxjQUFjLENBQWdCO0lBQzlCLGdEQUFnRDtJQUNoRCxXQUFXLENBQWdCO0lBQzNCLGlDQUFpQztJQUNqQyxLQUFLLENBQVE7SUFDYiwyQ0FBMkM7SUFDM0MsT0FBTyxDQUFTO0lBQ2hCLDRCQUE0QjtJQUM1QixJQUFJLENBQVM7SUFDYiw0Q0FBNEM7SUFDNUMsZUFBZSxDQUFrQjtJQUNqQywySUFBMkk7SUFDM0ksV0FBVyxDQUE2QjtJQUN4QyxZQUFZLElBQTJCLEVBQUUsTUFBYztRQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckgsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMs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