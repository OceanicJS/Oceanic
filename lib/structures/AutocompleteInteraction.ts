import Interaction from "./Interaction";
import Member from "./Member";
import type User from "./User";
import Guild from "./Guild";
import Permission from "./Permission";
import type { InteractionTypes } from "../Constants";
import { InteractionResponseTypes } from "../Constants";
import type { AutocompleteChoice, AutocompleteInteractionData, RawAutocompleteInteraction } from "../types/interactions";
import type Client from "../Client";
import type { AnyTextChannel } from "../types/channels";
import type { Uncached } from "../types/shared";

export default class AutocompleteInteraction extends Interaction {
	/** The permissions the bot has in the channel this interaction was sent from. */
	appPermissions?: Permission;
	/** The channel this interaction was sent from. This can be a partial object with only an `id`. */
	channel: AnyTextChannel | Uncached;
	/** The data associated with the interaction. */
	data: AutocompleteInteractionData;
	/** The guild this interaction was sent from, if applicable. This can be a partial object with only an `id`. */
	guild?: Guild | Uncached;
	/** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
	guildLocale?: string;
	/** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
	locale: string;
	/** The member associated with the invoking user. */
	member?: Member;
	declare type: InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
	/** The user that invoked this interaction. */
	user: User;
	constructor(data: RawAutocompleteInteraction, client: Client) {
		super(data, client);
		this.appPermissions = !data.app_permissions ? undefined : new Permission(data.app_permissions);
		this.channel = this._client.getChannel<AnyTextChannel>(data.channel_id!) || { id: data.channel_id! };
		this.data = {
			guildID: data.data.guild_id,
			id:      data.data.id,
			name:    data.data.name,
			options: data.data.options || [],
			type:    data.data.type
		};
		this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id) || { id: data.guild_id };
		this.guildLocale = data.guild_locale;
		this.locale = data.locale!;
		this.member = data.member ? this.guild instanceof Guild ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guild.id) : new Member(data.member, this._client, this.guild!.id) : undefined;
		this.user = this._client.users.update((data.user || data.member!.user)!);
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
	async defer(choices: Array<AutocompleteChoice>) {
		if (this.acknowledged) throw new Error("Interactions cannot have more than one initial response.");
		this.acknowledged = true;
		return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT, data: choices });
	}

	override toJSON(props: Array<string> = []) {
		return super.toJSON([
			"appPermissions",
			"channel",
			"data",
			"guild",
			"guildLocale",
			"locale",
			"member",
			"user",
			...props
		]);
	}
}
