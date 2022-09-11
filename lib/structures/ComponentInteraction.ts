import Interaction from "./Interaction";
import Message from "./Message";
import Guild from "./Guild";
import Member from "./Member";
import type User from "./User";
import Permission from "./Permission";
import type Client from "../Client";
import type {
    InteractionContent,
    MessageComponentButtonInteractionData,
    MessageComponentSelectMenuInteractionData,
    ModalData,
    RawMessageComponentInteraction
} from "../types/interactions";
import type { InteractionTypes } from "../Constants";
import { InteractionResponseTypes, ComponentTypes } from "../Constants";
import type { AnyGuildTextChannel, AnyTextChannel } from "../types/channels";
import type { JSONComponentInteraction } from "../types/json";
import type { Uncached } from "../types/shared";

export default class ComponentInteraction<CH extends AnyTextChannel | Uncached = AnyTextChannel | Uncached> extends Interaction {
    private _guild?: CH extends AnyGuildTextChannel ? Guild : Guild | null;
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions?: Permission;
    /** The channel this interaction was sent from. */
    channel: CH extends AnyTextChannel ? CH : undefined;
    /** The ID of the channel this interaction was sent from. */
    channelID: string;
    /** The data associated with the interaction. */
    data: MessageComponentButtonInteractionData | MessageComponentSelectMenuInteractionData;
    /** The id of the guild this interaction was sent from, if applicable. */
    guildID: CH extends AnyGuildTextChannel ? string : string | null;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale?: string;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale: string;
    /** The member associated with the invoking user. */
    member?: Member;
    /** The permissions of the member associated with the invoking user */
    memberPermissions?: Permission;
    /** The message the interaction is from. */
    message: Message<CH>;
    declare type: InteractionTypes.MESSAGE_COMPONENT;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawMessageComponentInteraction, client: Client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission(data.app_permissions);
        this.channel = client.getChannel<AnyTextChannel>(data.channel_id!) as CH extends AnyTextChannel ? CH : undefined;
        this.channelID = data.channel_id!;
        this._guild = (data.guild_id === undefined ? null : client.guilds.get(data.guild_id)) as CH extends AnyGuildTextChannel ? Guild : Guild | null;
        this.guildID = (data.guild_id ?? null) as CH extends AnyGuildTextChannel ? string : string | null;
        this.guildLocale = data.guild_locale;
        this.locale = data.locale!;
        this.member = data.member ? this.client.util.updateMember(data.guild_id!, data.member.user.id, data.member) : undefined;
        this.memberPermissions = data.member ? new Permission(data.member.permissions) : undefined;
        this.message = this.channel && "messages" in this.channel ? this.channel.messages.update(data.message) as Message<CH> : new Message(data.message, client) as Message<CH>;
        this.user = client.users.update((data.user ?? data.member!.user)!);

        switch (data.data.component_type) {
            case ComponentTypes.BUTTON: {
                this.data = {
                    componentType: data.data.component_type,
                    customID:      data.data.custom_id
                };
                break;
            }

            case ComponentTypes.SELECT_MENU: {
                this.data = {
                    componentType: data.data.component_type,
                    customID:      data.data.custom_id,
                    values:        data.data.values!
                };
            }
        }
    }

    /** The guild this interaction was sent from, if applicable. This will throw an error if the guild is not cached. */
    get guild(): CH extends AnyGuildTextChannel ? Guild : Guild | null {
        if (this._guild === undefined) {
            throw new Error(`${this.constructor.name}#guild is not present without having the GUILDS intent or fetching the guild.`);
        } else {
            return this._guild;
        }
    }

    /**
     * Create a followup message.
     * @param options The options for creating the followup message.
     */
    async createFollowup<T extends AnyGuildTextChannel>(options: InteractionContent): Promise<Message<T>> {
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
     * Defer this interaction with a `DEFERRED_UPDATE_MESAGE` response.. This is an initial response, and more than one initial response cannot be used.
     * @param flags The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    async deferUpdate(flags?: number): Promise<void> {
        if (this.acknowledged) {
            throw new Error("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.DEFERRED_UPDATE_MESAGE, data: { flags } });
    }

    /**
     * Delete a follow up message.
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
    async editFollowup<T extends AnyGuildTextChannel>(messageID: string, options: InteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.editFollowupMessage<T>(this.applicationID, this.token, messageID, options);
    }

    /**
     * Edit the original interaction response.
     * @param options The options for editing the original message.
     */
    async editOriginal<T extends AnyGuildTextChannel>(options: InteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.editOriginalMessage<T>(this.applicationID, this.token, options);
    }

    /**
     * Edit the message this interaction is from. If this interaction has already been acknowledged, use `createFollowup`.
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
    async getFollowup<T extends AnyGuildTextChannel>(messageID: string): Promise<Message<T>> {
        return this.client.rest.interactions.getFollowupMessage<T>(this.applicationID, this.token, messageID);
    }

    /**
     * Get the original interaction response.
     */
    async getOriginal<T extends AnyGuildTextChannel>(): Promise<Message<T>> {
        return this.client.rest.interactions.getOriginalMessage<T>(this.applicationID, this.token);
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
