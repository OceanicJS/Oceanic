import Interaction from "./Interaction";
import Message from "./Message";
import Guild from "./Guild";
import Member from "./Member";
import type User from "./User";
import Permission from "./Permission";
import type Client from "../Client";
import type { InteractionContent, MessageComponentButtonInteractionData, MessageComponentSelectMenuInteractionData, ModalData, RawMessageComponentInteraction } from "../types/interactions";
import type { InteractionTypes } from "../Constants";
import type { AnyGuildTextChannel, AnyTextChannel } from "../types/channels";
import type { JSONComponentInteraction } from "../types/json";
export default class ComponentInteraction extends Interaction {
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions?: Permission;
    /** The channel this interaction was sent from. */
    channel: AnyTextChannel;
    /** The data associated with the interaction. */
    data: MessageComponentButtonInteractionData | MessageComponentSelectMenuInteractionData;
    /** The guild this interaction was sent from, if applicable. */
    guild?: Guild;
    /** The id of the guild this interaction was sent from, if applicable. */
    guildID?: string;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale?: string;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale: string;
    /** The member associated with the invoking user. */
    member?: Member;
    /** The permissions of the member associated with the invoking user */
    memberPermissions?: Permission;
    /** The message the interaction is from. */
    message: Message;
    type: InteractionTypes.MESSAGE_COMPONENT;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawMessageComponentInteraction, client: Client);
    /**
     * Create a followup message.
     * @param options - The options for creating the followup message.
     */
    createFollowup<T extends AnyGuildTextChannel>(options: InteractionContent): Promise<Message<T>>;
    /**
     * Create a message through this interaction. This is an initial response, and more than one initial response cannot be used. Use `createFollowup`.
     * @param options - The options for the message.
     */
    createMessage(options: InteractionContent): Promise<void>;
    /**
     * Respond to this interaction with a modal. This is an initial response, and more than one initial response cannot be used.
     * @param options - The options for the modal.
     */
    createModal(options: ModalData): Promise<void>;
    /**
     * Defer this interaction with a `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE` response. This is an initial response, and more than one initial response cannot be used.
     * @param flags - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    defer(flags?: number): Promise<void>;
    /**
     * Defer this interaction with a `DEFERRED_UPDATE_MESAGE` response.. This is an initial response, and more than one initial response cannot be used.
     * @param flags - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    deferUpdate(flags?: number): Promise<void>;
    /**
     * Delete a follow up message.
     * @param messageID - The ID of the message.
     */
    deleteFollowup(messageID: string): Promise<void>;
    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     */
    deleteOriginal(): Promise<void>;
    /**
     * Edit a followup message.
     * @param messageID - The ID of the message.
     * @param options - The options for editing the followup message.
     */
    editFollowup<T extends AnyGuildTextChannel>(messageID: string, options: InteractionContent): Promise<Message<T>>;
    /**
     * Edit the original interaction response.
     * @param options - The options for editing the original message.
     */
    editOriginal<T extends AnyGuildTextChannel>(options: InteractionContent): Promise<Message<T>>;
    /**
     * Edit the message this interaction is from. If this interaction has already been acknowledged, use `createFollowup`.
     * @param options - The options for editing the message.
     */
    editParent(options: InteractionContent): Promise<void>;
    /**
     * Get a followup message.
     * @param messageID - The ID of the message.
     */
    getFollowup<T extends AnyGuildTextChannel>(messageID: string): Promise<Message<T>>;
    /**
     * Get the original interaction response.
     */
    getOriginal<T extends AnyGuildTextChannel>(): Promise<Message<T>>;
    toJSON(): JSONComponentInteraction;
}
