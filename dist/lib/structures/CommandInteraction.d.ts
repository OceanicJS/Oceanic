import Interaction from "./Interaction";
import Member from "./Member";
import Message from "./Message";
import User from "./User";
import Guild from "./Guild";
import Permission from "./Permission";
import type { InteractionTypes } from "../Constants";
import type { ApplicationCommandInteractionData, InteractionContent, ModalData, RawApplicationCommandInteraction } from "../types/interactions";
import type Client from "../Client";
import type { AnyGuildTextChannel, AnyTextChannel } from "../types/channels";
import type { JSONCommandInteraction } from "../types/json";
export default class CommandInteraction extends Interaction {
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions?: Permission;
    /** The channel this interaction was sent from. */
    channel: AnyTextChannel;
    /** The data associated with the interaction. */
    data: ApplicationCommandInteractionData;
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
    type: InteractionTypes.APPLICATION_COMMAND;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawApplicationCommandInteraction, client: Client);
    /**
     * Create a followup message.
     * @param options The options for creating the followup message.
     */
    createFollowup<T extends AnyGuildTextChannel>(options: InteractionContent): Promise<Message<T>>;
    /**
     * Create a message through this interaction. This is an initial response, and more than one initial response cannot be used. Use `createFollowup`.
     * @param options The options for the message.
     */
    createMessage(options: InteractionContent): Promise<void>;
    /**
     * Respond to this interaction with a modal. This is an initial response, and more than one initial response cannot be used.
     * @param options The options for the modal.
     */
    createModal(options: ModalData): Promise<void>;
    /**
     * Defer this interaction. This is an initial response, and more than one initial response cannot be used.
     * @param flags The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    defer(flags?: number): Promise<void>;
    /**
     * Delete a follow up message.
     * @param messageID The ID of the message.
     */
    deleteFollowup(messageID: string): Promise<void>;
    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     */
    deleteOriginal(): Promise<void>;
    /**
     * Edit a followup message.
     * @param messageID The ID of the message.
     * @param options The options for editing the followup message.
     */
    editFollowup<T extends AnyGuildTextChannel>(messageID: string, options: InteractionContent): Promise<Message<T>>;
    /**
     * Edit the original interaction response.
     * @param options The options for editing the original message.
     */
    editOriginal<T extends AnyGuildTextChannel>(options: InteractionContent): Promise<Message<T>>;
    /**
     * Get a followup message.
     * @param messageID The ID of the message.
     */
    getFollowup<T extends AnyGuildTextChannel>(messageID: string): Promise<Message<T>>;
    /**
     * Get the original interaction response.
     */
    getOriginal<T extends AnyGuildTextChannel>(): Promise<Message<T>>;
    toJSON(): JSONCommandInteraction;
}
