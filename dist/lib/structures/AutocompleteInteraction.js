"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = __importDefault(require("./Interaction"));
const Member_1 = __importDefault(require("./Member"));
const Guild_1 = __importDefault(require("./Guild"));
const Permission_1 = __importDefault(require("./Permission"));
const Constants_1 = require("../Constants");
const InteractionOptionsWrapper_1 = __importDefault(require("../util/InteractionOptionsWrapper"));
class AutocompleteInteraction extends Interaction_1.default {
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions;
    /** The channel this interaction was sent from. */
    channel;
    /** The data associated with the interaction. */
    data;
    /** The guild this interaction was sent from, if applicable. */
    guild;
    /** The id of the guild this interaction was sent from, if applicable. */
    guildID;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale;
    /** The member associated with the invoking user. */
    member;
    /** The permissions of the member associated with the invoking user */
    memberPermissions;
    /** The user that invoked this interaction. */
    user;
    constructor(data, client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission_1.default(data.app_permissions);
        this.channel = this._client.getChannel(data.channel_id);
        this.data = {
            guildID: data.data.guild_id,
            id: data.data.id,
            name: data.data.name,
            options: new InteractionOptionsWrapper_1.default(data.data.options || [], null),
            type: data.data.type
        };
        this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.guildLocale = data.guild_locale;
        this.locale = data.locale;
        this.member = data.member ? this.guild instanceof Guild_1.default ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guildID) : new Member_1.default(data.member, this._client, this.guild.id) : undefined;
        this.memberPermissions = data.member ? new Permission_1.default(data.member.permissions) : undefined;
        this.user = this._client.users.update((data.user || data.member.user));
    }
    /**
     * Defer this reaction. This is an initial response, and more than one initial response cannot be used.
     *
     * @param {Number} flags - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     * @returns {Promise<void>}
     */
    async defer(flags) {
        if (this.acknowledged)
            throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE, data: { flags } });
    }
    /**
     * Acknowledge this interaction with a set of choices. This is an initial response, and more than one initial response cannot be used.
     *
     * @param {Object[]} choices - The choices to send.
     * @param {string} choices[].name - The name of the choice.
     * @param {Object} choices[].nameLocalizations - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
     * @param {string} choices[].value - The value of the choice.
     * @returns {Promise<void>}
     */
    async result(choices) {
        if (this.acknowledged)
            throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT, data: { choices } });
    }
    toJSON() {
        return {
            ...super.toJSON(),
            appPermissions: this.appPermissions?.toJSON(),
            channel: this.channel.id,
            data: this.data,
            guild: this.guildID,
            guildLocale: this.guildLocale,
            locale: this.locale,
            member: this.member?.toJSON(),
            type: this.type,
            user: this.user.toJSON()
        };
    }
}
exports.default = AutocompleteInteraction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b2NvbXBsZXRlSW50ZXJhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9BdXRvY29tcGxldGVJbnRlcmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdFQUF3QztBQUN4QyxzREFBOEI7QUFFOUIsb0RBQTRCO0FBQzVCLDhEQUFzQztBQUV0Qyw0Q0FBd0Q7QUFLeEQsa0dBQTBFO0FBRTFFLE1BQXFCLHVCQUF3QixTQUFRLHFCQUFXO0lBQzVELGlGQUFpRjtJQUNqRixjQUFjLENBQWM7SUFDNUIsa0RBQWtEO0lBQ2xELE9BQU8sQ0FBa0I7SUFDekIsZ0RBQWdEO0lBQ2hELElBQUksQ0FBOEI7SUFDbEMsK0RBQStEO0lBQy9ELEtBQUssQ0FBUztJQUNkLHlFQUF5RTtJQUN6RSxPQUFPLENBQVU7SUFDakIsZ0pBQWdKO0lBQ2hKLFdBQVcsQ0FBVTtJQUNyQixnR0FBZ0c7SUFDaEcsTUFBTSxDQUFTO0lBQ2Ysb0RBQW9EO0lBQ3BELE1BQU0sQ0FBVTtJQUNoQixzRUFBc0U7SUFDdEUsaUJBQWlCLENBQWM7SUFFL0IsOENBQThDO0lBQzlDLElBQUksQ0FBTztJQUNYLFlBQVksSUFBZ0MsRUFBRSxNQUFjO1FBQ3hELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMvRixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFpQixJQUFJLENBQUMsVUFBVyxDQUFFLENBQUM7UUFDMUUsSUFBSSxDQUFDLElBQUksR0FBRztZQUNSLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7WUFDM0IsRUFBRSxFQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQixJQUFJLEVBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ3ZCLE9BQU8sRUFBRSxJQUFJLG1DQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUM7WUFDckUsSUFBSSxFQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtTQUMxQixDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLFlBQVksZUFBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDcE4sSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksb0JBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDM0YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQWM7UUFDdEIsSUFBSSxJQUFJLENBQUMsWUFBWTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztRQUNuRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0NBQXdCLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFLLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBa0M7UUFDM0MsSUFBSSxJQUFJLENBQUMsWUFBWTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztRQUNuRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0NBQXdCLENBQUMsdUNBQXVDLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hMLENBQUM7SUFFUSxNQUFNO1FBQ1gsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUU7WUFDN0MsT0FBTyxFQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMvQixJQUFJLEVBQVksSUFBSSxDQUFDLElBQUk7WUFDekIsS0FBSyxFQUFXLElBQUksQ0FBQyxPQUFPO1lBQzVCLFdBQVcsRUFBSyxJQUFJLENBQUMsV0FBVztZQUNoQyxNQUFNLEVBQVUsSUFBSSxDQUFDLE1BQU07WUFDM0IsTUFBTSxFQUFVLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO1lBQ3JDLElBQUksRUFBWSxJQUFJLENBQUMsSUFBSTtZQUN6QixJQUFJLEVBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7U0FDckMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQW5GRCwwQ0FtRkMifQ==