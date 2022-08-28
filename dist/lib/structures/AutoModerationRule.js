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
        if (data.guild_id !== undefined)
            this.guild = this._client.guilds.get(data.guild_id);
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
    async edit(options) {
        return this._client.rest.guilds.editAutoModerationRule(this.guild.id, this.id, options);
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
            guild: this.guild.id,
            name: this.name,
            triggerMetadata: this.triggerMetadata,
            triggerType: this.triggerType
        };
    }
}
exports.default = AutoModerationRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b01vZGVyYXRpb25SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXV0b01vZGVyYXRpb25SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQVExQiwwQ0FBMEM7QUFDMUMsTUFBcUIsa0JBQW1CLFNBQVEsY0FBSTtJQUNoRCxpRUFBaUU7SUFDakUsT0FBTyxDQUE4QjtJQUNyQyx5RkFBeUY7SUFDekYsT0FBTyxDQUFrQjtJQUN6QiwrQkFBK0I7SUFDL0IsT0FBTyxDQUFVO0lBQ2pCLDRJQUE0STtJQUM1SSxTQUFTLENBQTJCO0lBQ3BDLG1EQUFtRDtJQUNuRCxjQUFjLENBQWdCO0lBQzlCLGdEQUFnRDtJQUNoRCxXQUFXLENBQWdCO0lBQzNCLGlDQUFpQztJQUNqQyxLQUFLLENBQVE7SUFDYiw0QkFBNEI7SUFDNUIsSUFBSSxDQUFTO0lBQ2IsNENBQTRDO0lBQzVDLGVBQWUsQ0FBa0I7SUFDakMsMklBQTJJO0lBQzNJLFdBQVcsQ0FBNkI7SUFDeEMsWUFBWSxJQUEyQixFQUFFLE1BQWM7UUFDbkQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3JILElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDO1FBQ3RGLElBQUksQ0FBQyxNQUFN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