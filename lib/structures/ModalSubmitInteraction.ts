import Interaction from "./Interaction";
import Member from "./Member";
import type User from "./User";
import Guild from "./Guild";
import Permission from "./Permission";
import Message from "./Message";
import type { InteractionTypes } from "../Constants";
import { InteractionResponseTypes } from "../Constants";
import type { InteractionContent, ModalSubmitInteractionData, RawModalSubmitInteraction } from "../types/interactions";
import type Client from "../Client";
import type { AnyGuildTextChannel, AnyTextChannel } from "../types/channels";
import type { JSONModalSubmitInteraction } from "../types/json";

export default class ModalSubmitInteraction extends Interaction {
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions?: Permission;
    /** The channel this interaction was sent from. */
    channel: AnyTextChannel;
    /** The data associated with the interaction. */
    data: ModalSubmitInteractionData;
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
    declare type: InteractionTypes.MODAL_SUBMIT;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawModalSubmitInteraction, client: Client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission(data.app_permissions);
        this.channel = client.getChannel<AnyTextChannel>(data.channel_id!)!;
        this.data = {
            components: client.util.componentsToParsed(data.data.components),
            customID:   data.data.custom_id
        };
        this.guild = !data.guild_id ? undefined : client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.guildLocale = data.guild_locale;
        this.locale = data.locale!;
        this.member = data.member ? this.guild instanceof Guild ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guildID!) : new Member(data.member, client, this.guildID!) : undefined;
        this.memberPermissions = data.member ? new Permission(data.member.permissions) : undefined;
        this.user = client.users.update((data.user || data.member!.user)!);
    }

    /**
     * Create a followup message.
     * @param options The options for creating the followup message.
     */
    async createFollowup<T extends AnyGuildTextChannel>(options: InteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.createFollowupMessage<T>(this.application.id, this.token, options);
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
     * Defer this interaction. This is an initial response, and more than one initial response cannot be used.
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
        return this.client.rest.interactions.deleteFollowupMessage(this.application.id, this.token, messageID);
    }

    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     */
    async deleteOriginal(): Promise<void> {
        return this.client.rest.interactions.deleteOriginalMessage(this.application.id, this.token);
    }

    /**
     * Edit a followup message.
     * @param messageID The ID of the message.
     * @param options The options for editing the followup message.
     */
    async editFollowup<T extends AnyGuildTextChannel>(messageID: string, options: InteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.editFollowupMessage<T>(this.application.id, this.token, messageID, options);
    }

    /**
     * Edit the original interaction response.
     * @param options The options for editing the original message.
     */
    async editOriginal<T extends AnyGuildTextChannel>(options: InteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.editOriginalMessage<T>(this.application.id, this.token, options);
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
        return this.client.rest.interactions.getFollowupMessage<T>(this.application.id, this.token, messageID);
    }

    /**
     * Get the original interaction response.
     */
    async getOriginal<T extends AnyGuildTextChannel>(): Promise<Message<T>> {
        return this.client.rest.interactions.getOriginalMessage<T>(this.application.id, this.token);
    }

    override toJSON(): JSONModalSubmitInteraction {
        return {
            ...super.toJSON(),
            appPermissions: this.appPermissions?.toJSON(),
            channel:        this.channel.id,
            data:           this.data,
            guild:          this.guildID,
            guildLocale:    this.guildLocale,
            locale:         this.locale,
            member:         this.member?.toJSON(),
            type:           this.type,
            user:           this.user.toJSON()
        };
    }
}
