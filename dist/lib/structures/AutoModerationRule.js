"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** Represents an auto moderation rule. */
class AutoModerationRule extends Base_1.default {
    /** The actions that will execute when this rule is triggered. */
    actions;
    /** The creator of this rule. This can be a partial object with just an `id` property. */
    creator;
    /** The ID of the creator of this rule. */
    creatorID;
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
        this.actions = data.actions.map(a => ({
            metadata: {
                channelID: a.metadata.channel_id,
                durationSeconds: a.metadata.duration_seconds
            },
            type: a.type
        }));
        this.creator = this._client.users.get(data.creator_id);
        this.creatorID = data.creator_id;
        this.enabled = data.enabled;
        this.eventType = data.event_type;
        this.exemptChannels = data.exempt_channels;
        this.exemptRoles = data.exempt_roles;
        this.guild = this._client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.name = data.name;
        this.triggerMetadata = {
            allowList: data.trigger_metadata.allow_list,
            keywordFilter: data.trigger_metadata.keyword_filter,
            mentionTotalLimit: data.trigger_metadata.mention_total_limit,
            presets: data.trigger_metadata.presets
        };
        this.triggerType = data.trigger_type;
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
     * @param reason The reason for deleting this rule.
     */
    async deleteAutoModerationRule(reason) {
        return this._client.rest.guilds.deleteAutoModerationRule(this.guildID, this.id, reason);
    }
    /**
     * Edit this auto moderation rule.
     * @param options The options for editing the rule.
     */
    async edit(options) {
        return this._client.rest.guilds.editAutoModerationRule(this.guildID, this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            actions: this.actions,
            creator: this.creatorID,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b01vZGVyYXRpb25SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXV0b01vZGVyYXRpb25SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBUTFCLDBDQUEwQztBQUMxQyxNQUFxQixrQkFBbUIsU0FBUSxjQUFJO0lBQ2hELGlFQUFpRTtJQUNqRSxPQUFPLENBQThCO0lBQ3JDLHlGQUF5RjtJQUN6RixPQUFPLENBQU87SUFDZCwwQ0FBMEM7SUFDMUMsU0FBUyxDQUFTO0lBQ2xCLCtCQUErQjtJQUMvQixPQUFPLENBQVU7SUFDakIsNElBQTRJO0lBQzVJLFNBQVMsQ0FBMkI7SUFDcEMsbURBQW1EO0lBQ25ELGNBQWMsQ0FBZ0I7SUFDOUIsZ0RBQWdEO0lBQ2hELFdBQVcsQ0FBZ0I7SUFDM0IsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBUTtJQUNiLDJDQUEyQztJQUMzQyxPQUFPLENBQVM7SUFDaEIsNEJBQTRCO0lBQzVCLElBQUksQ0FBUztJQUNiLDRDQUE0QztJQUM1QyxlQUFlLENBQWtCO0lBQ2pDLDJJQUEySTtJQUMzSSxXQUFXLENBQTZCO0lBQ3hDLFlBQVksSUFBMkIsRUFBRSxNQUFjO1FBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xDLFFBQVEsRUFBRTtnQkFDTixTQUFTLEVBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVO2dCQUN0QyxlQUFlLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0I7YUFDL0M7WUFDRCxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7U0FDZixDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxD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