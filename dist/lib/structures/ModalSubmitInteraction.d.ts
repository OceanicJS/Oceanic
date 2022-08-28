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
    type: InteractionTypes.MODAL_SUBMIT;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawModalSubmitInteraction, client: Client);
    toJSON(): JSONModalSubmitInteraction;
}
