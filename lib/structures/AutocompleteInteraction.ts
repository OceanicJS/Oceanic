/** @module AutocompleteInteraction */
import Interaction from "./Interaction";
import type Member from "./Member";
import type User from "./User";
import type Guild from "./Guild";
import Permission from "./Permission";
import GuildChannel from "./GuildChannel";
import type PrivateChannel from "./PrivateChannel";
import { InteractionResponseTypes, type InteractionTypes } from "../Constants";
import type { AutocompleteChoice, AutocompleteInteractionData, RawAutocompleteInteraction } from "../types/interactions";
import type Client from "../Client";
import type { AnyGuildTextChannel, AnyTextChannelWithoutGroup } from "../types/channels";
import type { JSONAutocompleteInteraction } from "../types/json";
import InteractionOptionsWrapper from "../util/InteractionOptionsWrapper";
import type { Uncached } from "../types/shared";

/** Represents an autocomplete interaction. */
export default class AutocompleteInteraction<T extends AnyTextChannelWithoutGroup | Uncached = AnyTextChannelWithoutGroup | Uncached> extends Interaction {
    private _cachedChannel!: T extends AnyTextChannelWithoutGroup ? T : undefined;
    private _cachedGuild?: T extends AnyGuildTextChannel ? Guild : Guild | null;
    /** The permissions the bot has in the channel this interaction was sent from, if this interaction is sent from a guild. */
    appPermissions: T extends AnyGuildTextChannel ? Permission : Permission | undefined;
    /** The ID of the channel this interaction was sent from. */
    channelID: string;
    /** The data associated with the interaction. */
    data: AutocompleteInteractionData;
    /** The id of the guild this interaction was sent from, if applicable. */
    guildID: T extends AnyGuildTextChannel ? string : string | null;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale: T extends AnyGuildTextChannel ? string : string | undefined;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale: string;
    /** The member associated with the invoking user, if this interaction is sent from a guild. */
    member: T extends AnyGuildTextChannel ? Member : Member | undefined;
    /** The permissions of the member associated with the invoking user, if this interaction is sent from a guild. */
    memberPermissions: T extends AnyGuildTextChannel ? Permission : Permission | undefined;
    declare type: InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawAutocompleteInteraction, client: Client) {
        super(data, client);
        this.appPermissions = (data.app_permissions === undefined ? undefined : new Permission(data.app_permissions)) as T extends AnyGuildTextChannel ? Permission : Permission | undefined;
        this.channelID = data.channel_id!;
        this.data = {
            guildID: data.data.guild_id,
            id:      data.data.id,
            name:    data.data.name,
            options: new InteractionOptionsWrapper(data.data.options ?? [], null),
            type:    data.data.type
        };
        this.guildID = (data.guild_id ?? null) as T extends AnyGuildTextChannel ? string : string | null;
        this.guildLocale = data.guild_locale as T extends AnyGuildTextChannel ? string : string | undefined;
        this.locale = data.locale!;
        this.member = (data.member !== undefined ? this.client.util.updateMember(data.guild_id!, data.member.user.id, data.member) : undefined) as T extends AnyGuildTextChannel ? Member : Member | undefined;
        this.memberPermissions = (data.member !== undefined ? new Permission(data.member.permissions) : undefined) as T extends AnyGuildTextChannel ? Permission : Permission | undefined;
        this.user = client.users.update(data.user ?? data.member!.user);
    }

    /** The channel this interaction was sent from. */
    get channel(): T extends AnyTextChannelWithoutGroup ? T : undefined {
        return this._cachedChannel ?? (this._cachedChannel = this.client.getChannel(this.channelID) as T extends AnyTextChannelWithoutGroup ? T : undefined);
    }

    /** The guild this interaction was sent from, if applicable. This will throw an error if the guild is not cached. */
    get guild(): T extends AnyGuildTextChannel ? Guild : Guild | null {
        if (this.guildID !== null && this._cachedGuild !== null) {
            if (!this._cachedGuild) {
                this._cachedGuild = this.client.guilds.get(this.guildID);

                if (!this._cachedGuild) {
                    throw new Error(`${this.constructor.name}#guild is not present if you don't have the GUILDS intent.`);
                }
            }

            return this._cachedGuild;
        }

        return this._cachedGuild === null ? this._cachedGuild : (this._cachedGuild = null as T extends AnyGuildTextChannel ? Guild : Guild | null);
    }

    /** Whether this interaction belongs to a cached guild channel. The only difference on using this method over a simple if statement is to easily update all the interaction properties typing definitions based on the channel it belongs to. */
    inCachedGuildChannel(): this is AutocompleteInteraction<AnyGuildTextChannel> {
        return this.channel instanceof GuildChannel;
    }

    /** Whether this interaction belongs to a private channel (PrivateChannel or uncached). The only difference on using this method over a simple if statement is to easily update all the interaction properties typing definitions based on the channel it belongs to. */
    inPrivateChannel(): this is AutocompleteInteraction<PrivateChannel | Uncached> {
        return this.guildID === null;
    }

    /**
     * Acknowledge this interaction with a set of choices. This is an initial response, and more than one initial response cannot be used.
     * @param choices The choices to send.
     */
    async result(choices: Array<AutocompleteChoice>): Promise<void> {
        if (this.acknowledged) {
            throw new Error("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT, data: { choices } });
    }

    override toJSON(): JSONAutocompleteInteraction {
        return {
            ...super.toJSON(),
            appPermissions: this.appPermissions?.toJSON(),
            channel:        this.channelID,
            data:           this.data,
            guildID:        this.guildID ?? undefined,
            guildLocale:    this.guildLocale,
            locale:         this.locale,
            member:         this.member?.toJSON(),
            type:           this.type,
            user:           this.user.toJSON()
        };
    }
}
