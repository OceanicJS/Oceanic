import Interaction from "./Interaction";
import Member from "./Member";
import type User from "./User";
import Guild from "./Guild";
import Permission from "./Permission";
import type { InteractionTypes } from "../Constants";
import type { AutocompleteChoice, AutocompleteInteractionData, RawAutocompleteInteraction } from "../types/interactions";
import type Client from "../Client";
import type { AnyTextChannel } from "../types/channels";
import type { JSONAutocompleteInteraction } from "../types/json";
export default class AutocompleteInteraction extends Interaction {
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions?: Permission;
    /** The channel this interaction was sent from. */
    channel: AnyTextChannel;
    /** The data associated with the interaction. */
    data: AutocompleteInteractionData;
    /** The guild this interaction was sent from, if applicable. */
    guild?: Guild;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale?: string;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale: string;
    /** The member associated with the invoking user. */
    member?: Member;
    type: InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawAutocompleteInteraction, client: Client);
    /**
     * Acknowledge this interaction with a set of choices. This is an initial response, and more than one initial response cannot be used.
     *
     * @param {Object[]} choices - The choices to send.
     * @param {string} choices[].name - The name of the choice.
     * @param {Object} choices[].nameLocalizations - A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names.
     * @param {string} choices[].value - The value of the choice.
     * @returns {Promise<void>}
     */
    defer(choices: Array<AutocompleteChoice>): Promise<void>;
    toJSON(): JSONAutocompleteInteraction;
}
