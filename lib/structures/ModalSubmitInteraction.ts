import Interaction from "./Interaction";
import Member from "./Member";
import type User from "./User";
import Guild from "./Guild";
import Permission from "./Permission";
import type { InteractionTypes } from "../Constants";
import type { ModalSubmitInteractionData, RawModalSubmitInteraction } from "../types/interactions";
import type Client from "../Client";
import type { AnyTextChannel } from "../types/channels";
import type { JSONModalSubmitInteraction } from "../types/json";

export default class ModalSubmitInteraction extends Interaction {
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions?: Permission;
    /** The channel this interaction was sent from. This can be a partial object with only an `id`. */
    channel: AnyTextChannel;
    /** The data associated with the interaction. */
    data: ModalSubmitInteractionData;
    /** The guild this interaction was sent from, if applicable. This can be a partial object with only an `id`. */
    guild?: Guild;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale?: string;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale: string;
    /** The member associated with the invoking user. */
    member?: Member;
    declare type: InteractionTypes.MODAL_SUBMIT;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawModalSubmitInteraction, client: Client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission(data.app_permissions);
        this.channel = this._client.getChannel<AnyTextChannel>(data.channel_id!)!;
        this.data = {
            components: data.data.components,
            customID:   data.data.custom_id
        };
        this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
        this.guildLocale = data.guild_locale;
        this.locale = data.locale!;
        this.member = data.member ? this.guild instanceof Guild ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guild.id) : new Member(data.member, this._client, this.guild!.id) : undefined;
        this.user = this._client.users.update((data.user || data.member!.user)!);
    }

    override toJSON(): JSONModalSubmitInteraction {
        return {
            ...super.toJSON(),
            appPermissions: this.appPermissions?.toJSON(),
            channel:        this.channel.id,
            data:           this.data,
            guild:          this.guild?.id,
            guildLocale:    this.guildLocale,
            locale:         this.locale,
            member:         this.member?.toJSON(),
            type:           this.type,
            user:           this.user.toJSON()
        };
    }
}
