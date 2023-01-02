/** @module CommandInteraction */
import Interaction from "./Interaction";
import Attachment from "./Attachment";
import Member from "./Member";
import Message from "./Message";
import Role from "./Role";
import User from "./User";
import type Guild from "./Guild";
import Permission from "./Permission";
import GuildChannel from "./GuildChannel";
import type PrivateChannel from "./PrivateChannel";
import InteractionResolvedChannel from "./InteractionResolvedChannel";
import TypedCollection from "../util/TypedCollection";
import { ApplicationCommandTypes, InteractionResponseTypes, type InteractionTypes } from "../Constants";
import type {
    ApplicationCommandInteractionData,
    InteractionContent,
    ModalData,
    RawApplicationCommandInteraction,
    ApplicationCommandInteractionResolvedData
} from "../types/interactions";
import type Client from "../Client";
import type { RawMember } from "../types/guilds";
import type { AnyGuildTextChannel, AnyTextChannelWithoutGroup } from "../types/channels";
import type { RawUser } from "../types/users";
import type { JSONCommandInteraction } from "../types/json";
import InteractionOptionsWrapper from "../util/InteractionOptionsWrapper";
import type { Uncached } from "../types/shared";

/** Represents a command interaction. */
export default class CommandInteraction<T extends AnyTextChannelWithoutGroup | Uncached = AnyTextChannelWithoutGroup | Uncached> extends Interaction {
    private _cachedChannel!: T extends AnyTextChannelWithoutGroup ? T : undefined;
    private _cachedGuild?: T extends AnyGuildTextChannel ? Guild : Guild | null;
    /** The permissions the bot has in the channel this interaction was sent from, if this interaction is sent from a guild. */
    appPermissions: T extends AnyGuildTextChannel ? Permission : Permission | undefined;
    /** The ID of the channel this interaction was sent from. */
    channelID: string;
    /** The data associated with the interaction. */
    data: ApplicationCommandInteractionData;
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
    declare type: InteractionTypes.APPLICATION_COMMAND;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawApplicationCommandInteraction, client: Client) {
        super(data, client);
        this.appPermissions = (data.app_permissions === undefined ? undefined : new Permission(data.app_permissions)) as T extends AnyGuildTextChannel ? Permission : Permission | undefined;
        this.channelID = data.channel_id!;
        const resolved: ApplicationCommandInteractionResolvedData = {
            attachments: new TypedCollection(Attachment, client),
            channels:    new TypedCollection(InteractionResolvedChannel, client) ,
            members:     new TypedCollection(Member, client),
            messages:    new TypedCollection(Message, client),
            roles:       new TypedCollection(Role, client),
            users:       new TypedCollection(User, client)
        };
        this.guildID = (data.guild_id ?? null) as T extends AnyGuildTextChannel ? string : string | null;
        this.guildLocale = data.guild_locale as T extends AnyGuildTextChannel ? string : string | undefined;
        this.locale = data.locale!;
        this.member = (data.member !== undefined ? this.client.util.updateMember(data.guild_id!, data.member.user.id, data.member) : undefined) as T extends AnyGuildTextChannel ? Member : Member | undefined;
        this.memberPermissions = (data.member !== undefined ? new Permission(data.member.permissions) : undefined) as T extends AnyGuildTextChannel ? Permission : Permission | undefined;
        this.user = client.users.update((data.user ?? data.member!.user)!);

        if (data.data.resolved) {
            if (data.data.resolved.attachments) {
                for (const attachment of Object.values(data.data.resolved.attachments)) resolved.attachments.update(attachment);
            }

            if (data.data.resolved.channels) {
                for (const channel of Object.values(data.data.resolved.channels)) resolved.channels.update(channel);
            }

            if (data.data.resolved.members) {
                for (const [id, member] of Object.entries(data.data.resolved.members)) {
                    const m = member as unknown as RawMember & { user: RawUser; };
                    m.user = data.data.resolved.users![id];
                    resolved.members.add(client.util.updateMember(data.guild_id!, id, m));
                }
            }

            if (data.data.resolved.messages) {
                for (const message of Object.values(data.data.resolved.messages)) {
                    const channel = client.getChannel(message.channel_id);
                    if (channel && "messages" in channel) {
                        resolved.messages.add(channel.messages.update(message));
                    } else {
                        resolved.messages.update(message);
                    }
                }
            }

            if (data.data.resolved.roles) {
                for (const role of Object.values(data.data.resolved.roles)) {
                    try {
                        resolved.roles.add(this.guild?.roles.update(role, this.guildID!) ?? new Role(role, client, this.guildID!));
                    } catch {
                        resolved.roles.add(new Role(role, client, this.guildID!));
                    }
                }
            }

            if (data.data.resolved.users) {
                for (const user of Object.values(data.data.resolved.users)) resolved.users.add(client.users.update(user));
            }
        }

        this.data = {
            guildID:  data.data.guild_id,
            id:       data.data.id,
            name:     data.data.name,
            options:  new InteractionOptionsWrapper(data.data.options ?? [], resolved ?? null),
            resolved,
            target:   undefined,
            targetID: data.data.target_id,
            type:     data.data.type
        };

        if (this.data.targetID) {
            if (this.data.type === ApplicationCommandTypes.USER) {
                this.data.target = resolved.users.get(this.data.targetID);
            } else if (this.data.type === ApplicationCommandTypes.MESSAGE) {
                this.data.target = resolved.messages.get(this.data.targetID);
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
     * Delete a follow-up message.
     * @param messageID The ID of the message.
     */
    async deleteFollowup(messageID: string): Promise<void> {
        return this.client.rest.interactions.deleteFollowupMessage(this.applicationID, this.token, messageID);
    }

    /**
     * Delete the original interaction response.
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
    inCachedGuildChannel(): this is CommandInteraction<AnyGuildTextChannel> {
        return this.channel instanceof GuildChannel;
    }

    /** Whether this interaction belongs to a private channel (PrivateChannel or uncached). The only difference on using this method over a simple if statement is to easily update all the interaction properties typing definitions based on the channel it belongs to. */
    inPrivateChannel(): this is CommandInteraction<PrivateChannel | Uncached> {
        return this.guildID === null;
    }

    override toJSON(): JSONCommandInteraction {
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
