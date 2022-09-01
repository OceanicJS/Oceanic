import Interaction from "./Interaction";
import Attachment from "./Attachment";
import Channel from "./Channel";
import Member from "./Member";
import Message from "./Message";
import Role from "./Role";
import User from "./User";
import Guild from "./Guild";
import Permission from "./Permission";
import Collection from "../util/Collection";
import type { InteractionTypes } from "../Constants";
import { ApplicationCommandTypes, InteractionResponseTypes } from "../Constants";
import type { ApplicationCommandInteractionData, InteractionContent, ModalData, RawApplicationCommandInteraction } from "../types/interactions";
import type Client from "../Client";
import type { RawMember } from "../types/guilds";
import type { AnyChannel, AnyGuildTextChannel, AnyTextChannel, RawChannel } from "../types/channels";
import type { RawUser } from "../types/users";
import type { JSONCommandInteraction } from "../types/json";
import InteractionOptionsWrapper from "../util/InteractionOptionsWrapper";

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
    declare type: InteractionTypes.APPLICATION_COMMAND;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawApplicationCommandInteraction, client: Client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission(data.app_permissions);
        this.channel = client.getChannel<AnyTextChannel>(data.channel_id!)!;
        this.data = {
            guildID:  data.data.guild_id,
            id:       data.data.id,
            name:     data.data.name,
            options:  new InteractionOptionsWrapper([], null),
            resolved: {
                attachments: new Collection(Attachment, client),
                channels:    new Collection(Channel, client) as Collection<string, RawChannel, AnyChannel>,
                members:     new Collection(Member, client),
                messages:    new Collection(Message, client),
                roles:       new Collection(Role, client),
                users:       new Collection(User, client)
            },
            target:   undefined,
            targetID: data.data.target_id,
            type:     data.data.type
        };
        this.guild = !data.guild_id ? undefined : client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.guildLocale = data.guild_locale;
        this.locale = data.locale!;
        this.member = data.member ? this.guild instanceof Guild ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guildID!) : new Member(data.member, client, this.guildID!) : undefined;
        this.memberPermissions = data.member ? new Permission(data.member.permissions) : undefined;
        this.user = client.users.update((data.user || data.member!.user)!);

        if (data.data.resolved) {
            if (data.data.resolved.attachments) Object.values(data.data.resolved.attachments).forEach(attachment => this.data.resolved.attachments.update(attachment));

            if (data.data.resolved.channels) Object.values(data.data.resolved.channels).forEach(channel => {
                const ch = client.getChannel(channel.id);
                if (ch && "update" in ch) (ch as Channel)["update"](channel);
                this.data.resolved.channels.add(ch || Channel.from(channel, client));
            });

            if (data.data.resolved.members) Object.entries(data.data.resolved.members).forEach(([id, member]) => {
                const m = member as unknown as RawMember & { id: string; user: RawUser; };
                m.id = id;
                m.user = data.data.resolved!.users![id]!;
                this.data.resolved.members.add(this.guild instanceof Guild ? this.guild.members.update(m, this.guildID!) : new Member(m, client, this.guildID!));
            });

            if (data.data.resolved.messages) Object.values(data.data.resolved.messages).forEach(message => this.data.resolved.messages.update(message));

            if (data.data.resolved.roles) Object.values(data.data.resolved.roles).forEach(role => this.data.resolved.roles.add(this.guild instanceof Guild ? this.guild.roles.update(role, this.guildID!) : new Role(role, client, this.guildID!)));

            if (data.data.resolved.users) Object.values(data.data.resolved.users).forEach(user => this.data.resolved.users.update(user));
        }

        if (this.data.targetID) {
            if (this.data.type === ApplicationCommandTypes.USER) this.data.target = this.data.resolved.users.get(this.data.targetID);
            else if (this.data.type === ApplicationCommandTypes.MESSAGE) this.data.target = this.data.resolved.messages.get(this.data.targetID);
        }

        if (data.data.options) this.data.options = new InteractionOptionsWrapper(data.data.options, this.data.resolved);
    }

    /**
     * Create a followup message.
     * @param options The options for creating the followup message.
     */
    async createFollowup<T extends AnyGuildTextChannel>(options: InteractionContent) {
        return this.client.rest.interactions.createFollowupMessage<T>(this.application.id, this.token, options);
    }

    /**
     * Create a message through this interaction. This is an initial response, and more than one initial response cannot be used. Use `createFollowup`.
     * @param options The options for the message.
     */
    async createMessage(options: InteractionContent) {
        if (this.acknowledged) throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE, data: options });
    }

    /**
     * Respond to this interaction with a modal. This is an initial response, and more than one initial response cannot be used.
     * @param options The options for the modal.
     */
    async createModal(options: ModalData) {
        if (this.acknowledged) throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.MODAL, data: options });
    }

    /**
     * Defer this interaction. This is an initial response, and more than one initial response cannot be used.
     * @param flags The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    async defer(flags?: number) {
        if (this.acknowledged) throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, data: { flags } });
    }

    /**
     * Delete a follow up message.
     * @param messageID The ID of the message.
     */
    async deleteFollowup(messageID: string) {
        return this.client.rest.interactions.deleteFollowupMessage(this.application.id, this.token, messageID);
    }

    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     */
    async deleteOriginal() {
        return this.client.rest.interactions.deleteOriginalMessage(this.application.id, this.token);
    }

    /**
     * Edit a followup message.
     * @param messageID The ID of the message.
     * @param options The options for editing the followup message.
     */
    async editFollowup<T extends AnyGuildTextChannel>(messageID: string, options: InteractionContent) {
        return this.client.rest.interactions.editFollowupMessage<T>(this.application.id, this.token, messageID, options);
    }

    /**
     * Edit the original interaction response.
     * @param options The options for editing the original message.
     */
    async editOriginal<T extends AnyGuildTextChannel>(options: InteractionContent) {
        return this.client.rest.interactions.editOriginalMessage<T>(this.application.id, this.token, options);
    }

    /**
     * Get a followup message.
     * @param messageID The ID of the message.
     */
    async getFollowup<T extends AnyGuildTextChannel>(messageID: string) {
        return this.client.rest.interactions.getFollowupMessage<T>(this.application.id, this.token, messageID);
    }

    /**
     * Get the original interaction response.
     */
    async getOriginal<T extends AnyGuildTextChannel>() {
        return this.client.rest.interactions.getOriginalMessage<T>(this.application.id, this.token);
    }

    override toJSON(): JSONCommandInteraction {
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
