/** @module ComponentInteraction */
import Interaction from "./Interaction";
import Message from "./Message";
import Guild from "./Guild";
import Member from "./Member";
import Permission from "./Permission";
import GuildChannel from "./GuildChannel";
import type PrivateChannel from "./PrivateChannel";
import Role from "./Role";
import User from "./User";
import InteractionResolvedChannel from "./InteractionResolvedChannel";
import type Client from "../Client";
import type {
    InteractionContent,
    MessageComponentButtonInteractionData,
    MessageComponentSelectMenuInteractionData,
    ModalData,
    RawMessageComponentInteraction
} from "../types/interactions";
import type { InteractionTypes } from "../Constants";
import { ComponentTypes, InteractionResponseTypes } from "../Constants";
import type { AnyGuildTextChannel, AnyTextChannelWithoutGroup } from "../types/channels";
import type { JSONComponentInteraction } from "../types/json";
import type { Uncached } from "../types/shared";
import SelectMenuWrapper from "../util/SelectMenuWrapper";
import { RawMember, RawUser } from "../types";
import { MessageCommandInteractionResolvedData } from "../types/interactions";
import TypedCollection from "../util/TypedCollection";
import { RawInteractionResolvedChannel } from "../types/channels";

/** Represents a component interaction. */
export default class ComponentInteraction<T extends AnyTextChannelWithoutGroup | Uncached = AnyTextChannelWithoutGroup | Uncached> extends Interaction {
    private _cachedChannel!: T extends AnyTextChannelWithoutGroup ? T : undefined;
    private _cachedGuild?: T extends AnyGuildTextChannel ? Guild : Guild | null;
    /** The permissions the bot has in the channel this interaction was sent from, if this interaction is sent from a guild. */
    appPermissions: T extends AnyGuildTextChannel ? Permission : Permission | undefined;
    /** The ID of the channel this interaction was sent from. */
    channelID: string;
    /** The data associated with the interaction. */
    data: MessageComponentButtonInteractionData | MessageComponentSelectMenuInteractionData;
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
    /** The message the interaction is from. */
    message: Message<T>;
    declare type: InteractionTypes.MESSAGE_COMPONENT;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawMessageComponentInteraction, client: Client) {
        super(data, client);
        this.appPermissions = (data.app_permissions === undefined ? undefined : new Permission(data.app_permissions)) as T extends AnyGuildTextChannel ? Permission : Permission | undefined;
        this.channelID = data.channel_id!;

        this.guildID = (data.guild_id ?? null) as T extends AnyGuildTextChannel ? string : string | null;
        this.guildLocale = data.guild_locale as T extends AnyGuildTextChannel ? string : string | undefined;
        this.locale = data.locale!;
        this.member = (data.member !== undefined ? this.client.util.updateMember(data.guild_id!, data.member.user.id, data.member) : undefined) as T extends AnyGuildTextChannel ? Member : Member | undefined;
        this.memberPermissions = (data.member !== undefined ? new Permission(data.member.permissions) : undefined) as T extends AnyGuildTextChannel ? Permission : Permission | undefined;
        this.message = this.channel?.messages?.update(data.message) as Message<T> ?? new Message(data.message, client) as Message<T>;
        this.user = client.users.update((data.user ?? data.member!.user)!);

        switch (data.data.component_type) {
            case ComponentTypes.BUTTON: {
                this.data = {
                    componentType: data.data.component_type,
                    customID:      data.data.custom_id
                };
                break;
            }

            case ComponentTypes.STRING_SELECT: {
                this.data = {
                    componentType: data.data.component_type,
                    customID:      data.data.custom_id,
                    values:        data.data.values!
                };
                break;
            }
            case ComponentTypes.USER_SELECT:
            case ComponentTypes.ROLE_SELECT:
            case ComponentTypes.MENTIONABLE_SELECT:
            case ComponentTypes.CHANNEL_SELECT: {
                const resolved: MessageCommandInteractionResolvedData = {
                    channels: new TypedCollection(InteractionResolvedChannel, client) as TypedCollection<string, RawInteractionResolvedChannel, InteractionResolvedChannel>,
                    members:  new TypedCollection(Member, client),
                    roles:    new TypedCollection(Role, client),
                    users:    new TypedCollection(User, client)
                };

                if (data.data.resolved) {
                    if (data.data.resolved.channels) {
                        Object.values(data.data.resolved.channels).forEach(channel => resolved.channels.update(channel));
                    }

                    if (data.data.resolved.members) {
                        Object.entries(data.data.resolved.members).forEach(([id, member]) => {
                            const m = member as unknown as RawMember & { user: RawUser; };
                            m.user = data.data.resolved!.users![id];
                            resolved.members.add(client.util.updateMember(data.guild_id!, id, m));
                        });
                    }

                    if (data.data.resolved.roles) {
                        Object.values(data.data.resolved.roles).forEach(role => {
                            try {
                                resolved.roles.add(this.guild?.roles.update(role, this.guildID!) ?? new Role(role, client, this.guildID!));
                            } catch {
                                resolved.roles.add(new Role(role, client, this.guildID!));
                            }
                        });
                    }

                    if (data.data.resolved.users) {
                        Object.values(data.data.resolved.users).forEach(user => resolved.users.add(client.users.update(user)));
                    }
                }

                this.data = {
                    componentType: data.data.component_type,
                    customID:      data.data.custom_id,
                    values:        data.data.values!,
                    options:       new SelectMenuWrapper(client, data.data.resolved ?? {}, resolved),
                    resolved
                };
                break;
            }
        }
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

    /**
     * Create a followup message.
     * @param options The options for creating the followup message.
     */
    async createFollowup(options: InteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.createFollowupMessage<T>(this.applicationID, this.token, options);
    }

    /**
     * Create a message through this interaction. This is an initial response, and more than one initial response cannot be used. Use `createFollowup`.
     * @param options The options for the message.
     */
    async createMessage(options: InteractionContent): Promise<void> {
        if (this.acknowledged) {
            throw new Error("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE, data: options });
    }

    /**
     * Respond to this interaction with a modal. This is an initial response, and more than one initial response cannot be used.
     * @param options The options for the modal.
     */
    async createModal(options: ModalData): Promise<void> {
        if (this.acknowledged) {
            throw new Error("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.MODAL, data: options });
    }

    /**
     * Defer this interaction with a `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE` response. This is an initial response, and more than one initial response cannot be used.
     * @param flags The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    async defer(flags?: number): Promise<void> {
        if (this.acknowledged) {
            throw new Error("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, data: { flags } });
    }

    /**
     * Defer this interaction with a `DEFERRED_UPDATE_MESSAGE` response. This is an initial response, and more than one initial response cannot be used.
     * @param flags The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    async deferUpdate(flags?: number): Promise<void> {
        if (this.acknowledged) {
            throw new Error("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.DEFERRED_UPDATE_MESSAGE, data: { flags } });
    }

    /**
     * Delete a follow-up message.
     * @param messageID The ID of the message.
     */
    async deleteFollowup(messageID: string): Promise<void> {
        return this.client.rest.interactions.deleteFollowupMessage(this.applicationID, this.token, messageID);
    }

    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     */
    async deleteOriginal(): Promise<void> {
        return this.client.rest.interactions.deleteOriginalMessage(this.applicationID, this.token);
    }

    /**
     * Edit a followup message.
     * @param messageID The ID of the message.
     * @param options The options for editing the followup message.
     */
    async editFollowup(messageID: string, options: InteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.editFollowupMessage<T>(this.applicationID, this.token, messageID, options);
    }

    /**
     * Edit the original interaction response.
     * @param options The options for editing the original message.
     */
    async editOriginal(options: InteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.editOriginalMessage<T>(this.applicationID, this.token, options);
    }

    /**
     * Edit the message this interaction is from. If this interaction has already been acknowledged, use `editOriginal`.
     * @param options The options for editing the message.
     */
    async editParent(options: InteractionContent): Promise<void> {
        if (this.acknowledged) {
            throw new Error("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.UPDATE_MESSAGE, data: options });
    }

    /**
     * Get a followup message.
     * @param messageID The ID of the message.
     */
    async getFollowup(messageID: string): Promise<Message<T>> {
        return this.client.rest.interactions.getFollowupMessage<T>(this.applicationID, this.token, messageID);
    }

    /**
     * Get the original interaction response.
     */
    async getOriginal(): Promise<Message<T>> {
        return this.client.rest.interactions.getOriginalMessage<T>(this.applicationID, this.token);
    }

    /** Whether this interaction belongs to a cached guild channel. The only difference on using this method over a simple if statement is to easily update all the interaction properties typing definitions based on the channel it belongs to. */
    inCachedGuildChannel(): this is ComponentInteraction<AnyGuildTextChannel> {
        return this.channel instanceof GuildChannel;
    }

    /** Whether this interaction belongs to a private channel (PrivateChannel or uncached). The only difference on using this method over a simple if statement is to easily update all the interaction properties typing definitions based on the channel it belongs to. */
    inPrivateChannel(): this is ComponentInteraction<PrivateChannel | Uncached> {
        return this.guildID === null;
    }

    override toJSON(): JSONComponentInteraction {
        return {
            ...super.toJSON(),
            appPermissions: this.appPermissions?.toJSON(),
            channelID:      this.channelID,
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
