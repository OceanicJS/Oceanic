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
        this.creator = client.users.get(data.creator_id);
        this.creatorID = data.creator_id;
        this.enabled = data.enabled;
        this.eventType = data.event_type;
        this.exemptChannels = data.exempt_channels;
        this.exemptRoles = data.exempt_roles;
        this.guild = client.guilds.get(data.guild_id);
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
        return this.client.rest.guilds.deleteAutoModerationRule(this.guildID, this.id, reason);
    }
    /**
     * Edit this auto moderation rule.
     * @param options The options for editing the rule.
     */
    async edit(options) {
        return this.client.rest.guilds.editAutoModerationRule(this.guildID, this.id, options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b01vZGVyYXRpb25SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXV0b01vZGVyYXRpb25SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBUTFCLDBDQUEwQztBQUMxQyxNQUFxQixrQkFBbUIsU0FBUSxjQUFJO0lBQ2hELGlFQUFpRTtJQUNqRSxPQUFPLENBQThCO0lBQ3JDLHlGQUF5RjtJQUN6RixPQUFPLENBQU87SUFDZCwwQ0FBMEM7SUFDMUMsU0FBUyxDQUFTO0lBQ2xCLCtCQUErQjtJQUMvQixPQUFPLENBQVU7SUFDakIsNElBQTRJO0lBQzVJLFNBQVMsQ0FBMkI7SUFDcEMsbURBQW1EO0lBQ25ELGNBQWMsQ0FBZ0I7SUFDOUIsZ0RBQWdEO0lBQ2hELFdBQVcsQ0FBZ0I7SUFDM0IsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBUTtJQUNiLDJDQUEyQztJQUMzQyxPQUFPLENBQVM7SUFDaEIsNEJBQTRCO0lBQzVCLElBQUksQ0FBUztJQUNiLDRDQUE0QztJQUM1QyxlQUFlLENBQWtCO0lBQ2pDLDJJQUEySTtJQUMzSSxXQUFXLENBQTZCO0lBQ3hDLFlBQVksSUFBMkIsRUFBRSxNQUFjO1FBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xDLFFBQVEsRUFBRTtnQkFDTixTQUFTLEVBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVO2dCQUN0QyxlQUFlLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0I7YUFDL0M7WUFDRCxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7U0FDZixDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxD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