"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = __importDefault(require("./Interaction"));
const Member_1 = __importDefault(require("./Member"));
const Guild_1 = __importDefault(require("./Guild"));
const Permission_1 = __importDefault(require("./Permission"));
class ModalSubmitInteraction extends Interaction_1.default {
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
    /** The user that invoked this interaction. */
    user;
    constructor(data, client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission_1.default(data.app_permissions);
        this.channel = this._client.getChannel(data.channel_id);
        this.data = {
            components: data.data.components.map(row => ({
                type: row.type,
                components: row.components.map(component => ({
                    customID: component.custom_id,
                    label: component.label,
                    maxLength: component.max_length,
                    minLength: component.min_length,
                    placeholder: component.placeholder,
                    required: component.required,
                    style: component.style,
                    type: component.type,
                    value: component.value
                }))
            })),
            customID: data.data.custom_id
        };
        this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.guildLocale = data.guild_locale;
        this.locale = data.locale;
        this.member = data.member ? this.guild instanceof Guild_1.default ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guild.id) : new Member_1.default(data.member, this._client, this.guild.id) : undefined;
        this.user = this._client.users.update((data.user || data.member.user));
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
exports.default = ModalSubmitInteraction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kYWxTdWJtaXRJbnRlcmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL01vZGFsU3VibWl0SW50ZXJhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnRUFBd0M7QUFDeEMsc0RBQThCO0FBRTlCLG9EQUE0QjtBQUM1Qiw4REFBc0M7QUFPdEMsTUFBcUIsc0JBQXVCLFNBQVEscUJBQVc7SUFDM0QsaUZBQWlGO0lBQ2pGLGNBQWMsQ0FBYztJQUM1QixrREFBa0Q7SUFDbEQsT0FBTyxDQUFpQjtJQUN4QixnREFBZ0Q7SUFDaEQsSUFBSSxDQUE2QjtJQUNqQywrREFBK0Q7SUFDL0QsS0FBSyxDQUFTO0lBQ2QseUVBQXlFO0lBQ3pFLE9BQU8sQ0FBVTtJQUNqQixnSkFBZ0o7SUFDaEosV0FBVyxDQUFVO0lBQ3JCLGdHQUFnRztJQUNoRyxNQUFNLENBQVM7SUFDZixvREFBb0Q7SUFDcEQsTUFBTSxDQUFVO0lBRWhCLDhDQUE4QztJQUM5QyxJQUFJLENBQU87SUFDWCxZQUFZLElBQStCLEVBQUUsTUFBYztRQUN2RCxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksb0JBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBaUIsSUFBSSxDQUFDLFVBQVcsQ0FBRSxDQUFDO1FBQzFFLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDUixVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDekMsSUFBSSxFQUFRLEdBQUcsQ0FB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