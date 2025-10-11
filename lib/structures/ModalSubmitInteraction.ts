/** @module ModalSubmitInteraction */
import Interaction from "./Interaction";
import Member from "./Member";
import User from "./User";
import type Guild from "./Guild";
import Permission from "./Permission";
import Message from "./Message";
import GuildChannel from "./GuildChannel";
import type PrivateChannel from "./PrivateChannel";
import type Entitlement from "./Entitlement";
import type TestEntitlement from "./TestEntitlement";
import InteractionResolvedChannel from "./InteractionResolvedChannel";
import Role from "./Role";
import { InteractionResponseTypes, type InteractionTypes, type InteractionContextTypes } from "../Constants";
import type {
    AuthorizingIntegrationOwners,
    EditInteractionContent,
    InteractionCallbackResponse,
    InteractionContent,
    InteractionGuild,
    ModalSubmitInteractionData,
    ModalSubmitInteractionResolvedData,
    RawModalSubmitInteraction
} from "../types/interactions";
import type Client from "../Client";
import type { AnyTextableGuildChannel, AnyInteractionChannel } from "../types/channels";
import type { JSONModalSubmitInteraction } from "../types/json";
import type { Uncached } from "../types/shared";
import TypedCollection from "../util/TypedCollection";
import { UncachedError } from "../util/Errors";
import MessageInteractionResponse, { type FollowupMessageInteractionResponse, type InitialMessagedInteractionResponse } from "../util/interactions/MessageInteractionResponse";
import ModalSubmitInteractionComponentsWrapper from "../util/interactions/ModalSubmitInteractionComponentsWrapper";
import type { RawMember } from "../types/guilds";
import type { RawUser } from "../types/users";

/** Represents a modal submit interaction. */
export default class ModalSubmitInteraction<T extends AnyInteractionChannel | Uncached = AnyInteractionChannel | Uncached> extends Interaction {
    private _cachedChannel!: T extends AnyInteractionChannel ? T : undefined;
    private _cachedGuild?: T extends AnyTextableGuildChannel ? Guild : Guild | null;
    /** The permissions the bot has in the channel this interaction was sent from. If in a dm/group dm, this will contain `ATTACH_FILES`, `EMBED_LINKS`, and `MENTION_EVERYONE`. In addition, `USE_EXTERNAL_EMOJIS` will be included for DMs with the app's bot user. */
    appPermissions: Permission;
    /** The maximum size limit per attachment. This will be 10MiB by default, unless the user that created this interaction has a Nitro subscription or the guild it was sent from has been boosted to level 2 or above. */
    attachmentSizeLimit: number;
    /** Details about the authorizing user or server for the installation(s) relevant to the interaction. See [Discord's docs](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-authorizing-integration-owners-object) for more information. */
    authorizingIntegrationOwners: AuthorizingIntegrationOwners;
    /** The ID of the channel this interaction was sent from. */
    channelID: string;
    /** The context this interaction was sent from. */
    context?: InteractionContextTypes;
    /** The data associated with the interaction. */
    data: ModalSubmitInteractionData;
    /** The entitlements for the user that created this interaction, and the guild it was created in. */
    entitlements: Array<Entitlement | TestEntitlement>;
    /** The id of the guild this interaction was sent from, if applicable. */
    guildID: T extends AnyTextableGuildChannel ? string : string | null;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale: T extends AnyTextableGuildChannel ? string : string | undefined;
    /** The partial guild this interaction was sent from, if applicable. */
    guildPartial?: T extends AnyTextableGuildChannel ? InteractionGuild : InteractionGuild | undefined;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale: string;
    /** The member associated with the invoking user, if this interaction is sent from a guild. */
    member: T extends AnyTextableGuildChannel ? Member : Member | null;
    /** The permissions of the member associated with the invoking user, if this interaction is sent from a guild. */
    memberPermissions: T extends AnyTextableGuildChannel ? Permission : Permission | null;
    /** The message this interaction is from, if the modal was triggered from a component interaction. */
    message?: Message<T>;
    declare type: InteractionTypes.MODAL_SUBMIT;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawModalSubmitInteraction, client: Client) {
        super(data, client);
        if (data.message !== undefined && data.guild_id !== undefined) {
            data.message.guild_id = data.guild_id;
        }

        this.appPermissions = new Permission(data.app_permissions ?? "0");
        this.attachmentSizeLimit = data.attachment_size_limit;
        this.authorizingIntegrationOwners = data.authorizing_integration_owners;
        this.channelID = data.channel_id!;
        this.context = data.context;
        this.entitlements = data.entitlements?.map(entitlement => client.util.updateEntitlement(entitlement)) ?? [];
        this.guildID = (data.guild_id ?? null) as T extends AnyTextableGuildChannel ? string : string | null;
        this.guildLocale = data.guild_locale as T extends AnyTextableGuildChannel ? string : string | undefined;
        this.guildPartial = data.guild;
        this.locale = data.locale!;
        this.member = (data.member === undefined ? null : this.client.util.updateMember(data.guild_id!, data.member.user.id, data.member)) as T extends AnyTextableGuildChannel ? Member : Member | null;
        this.memberPermissions = (data.member === undefined ? null : new Permission(data.member.permissions)) as T extends AnyTextableGuildChannel ? Permission : Permission | null;
        if (data.message !== undefined) {
            this.message = (this.channel && "messages" in this.channel && (this.channel.messages.update(data.message) as Message<T>)) || new Message<T>(data.message, client);
        }
        this.user = client.users.update(data.user ?? data.member!.user);

        const resolved: ModalSubmitInteractionResolvedData = {
            channels: new TypedCollection(InteractionResolvedChannel, client),
            members:  new TypedCollection(Member, client),
            roles:    new TypedCollection(Role, client),
            users:    new TypedCollection(User, client)
        };

        if (data.data.resolved) {
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
            components: new ModalSubmitInteractionComponentsWrapper(resolved, client.util.modalSubmitComponentsToParsed(data.data.components)),
            customID:   data.data.custom_id,
            resolved
        };
    }

    /** The channel this interaction was sent from. */
    get channel(): T extends AnyInteractionChannel ? T : undefined {
        return this._cachedChannel ??= this.client.getChannel(this.channelID) as T extends AnyInteractionChannel ? T : undefined;
    }

    /** The guild this interaction was sent from, if applicable. This will throw an error if the guild is not cached. */
    get guild(): T extends AnyTextableGuildChannel ? Guild : Guild | null {
        if (this.guildID !== null && this._cachedGuild !== null) {
            this._cachedGuild ??= this.client.guilds.get(this.guildID);
            if (!this._cachedGuild) {
                if (this.client.options.restMode) {
                    throw new UncachedError(`${this.constructor.name}#guild is not present when rest mode is enabled.`);
                }

                if (!this.client.shards.connected) {
                    throw new UncachedError(`${this.constructor.name}#guild is not present without a gateway connection.`);
                }

                throw new UncachedError(`${this.constructor.name}#guild is not present.`);
            }

            return this._cachedGuild;
        }

        return this._cachedGuild === null ? this._cachedGuild : (this._cachedGuild = null as T extends AnyTextableGuildChannel ? Guild : Guild | null);
    }

    /**
     * Create a followup message.
     * Note that the returned class is not a message. It is a wrapper around the interaction response. The {@link MessageInteractionResponse#getMessage | getMessage} function can be used to get the message.
     * @param options The options for creating the followup message.
     */
    async createFollowup(options: InteractionContent): Promise<FollowupMessageInteractionResponse<this>> {
        const message = await this.client.rest.interactions.createFollowupMessage<T>(this.applicationID, this.token, options);
        return new MessageInteractionResponse<ModalSubmitInteraction<T>>(this, message, "followup", null) as FollowupMessageInteractionResponse<this>;
    }

    /**
     * Create a message through this interaction. This is an initial response, and more than one initial response cannot be used. Use {@link ModalSubmitInteraction#createFollowup | createFollowup}.
     * Note that the returned class is not a message. It is a wrapper around the interaction response. The {@link MessageInteractionResponse#getMessage | getMessage} function can be used to get the message.
     * @param options The options for the message.
     */
    async createMessage(options: InteractionContent): Promise<InitialMessagedInteractionResponse<this>> {
        if (this.acknowledged) {
            throw new TypeError("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        const cb = await this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE, data: options }, true);
        return new MessageInteractionResponse<this>(this, null, "initial", cb) as InitialMessagedInteractionResponse<this>;
    }

    /**
     * Defer this interaction. This is an initial response, and more than one initial response cannot be used.
     * @param flags The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    async defer(flags?: number): Promise<InteractionCallbackResponse<T>> {
        if (this.acknowledged) {
            throw new TypeError("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, data: { flags } }, true);
    }

    /**
     * Defer this interaction with a `DEFERRED_UPDATE_MESSAGE` response. This is an initial response, and more than one initial response cannot be used.
     * @param flags The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    async deferUpdate(flags?: number): Promise<InteractionCallbackResponse<T>> {
        if (this.acknowledged) {
            throw new TypeError("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.DEFERRED_UPDATE_MESSAGE, data: { flags } }, true);
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
    async editFollowup(messageID: string, options: EditInteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.editFollowupMessage<T>(this.applicationID, this.token, messageID, options);
    }

    /**
     * Edit the original interaction response.
     * @param options The options for editing the original message.
     */
    async editOriginal(options: EditInteractionContent): Promise<Message<T>> {
        return this.client.rest.interactions.editOriginalMessage<T>(this.applicationID, this.token, options);
    }

    /**
     * Edit the message this interaction is from. If this interaction has already been acknowledged, use `createFollowup`.
     * @param options The options for editing the message.
     */
    async editParent(options: InteractionContent): Promise<InteractionCallbackResponse<T>> {
        if (this.acknowledged) {
            throw new TypeError("Interactions cannot have more than one initial response.");
        }
        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.UPDATE_MESSAGE, data: options }, true);
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
    inCachedGuildChannel(): this is ModalSubmitInteraction<AnyTextableGuildChannel> {
        return this.channel instanceof GuildChannel;
    }

    /** Whether this interaction belongs to a private channel (PrivateChannel or uncached). The only difference on using this method over a simple if statement is to easily update all the interaction properties typing definitions based on the channel it belongs to. */
    inPrivateChannel(): this is ModalSubmitInteraction<PrivateChannel | Uncached> {
        return this.guildID === null;
    }

    /**
     * Launch the bot's activity. This is an initial response, and more than one initial response cannot be used.
     */
    async launchActivity(): Promise<InteractionCallbackResponse<T>> {
        if (this.acknowledged) {
            throw new TypeError("Interactions cannot have more than one initial response.");
        }

        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.LAUNCH_ACTIVITY }, true);
    }

    /**
     * Show a "premium required" response to the user. This is an initial response, and more than one initial response cannot be used.
     * @deprecated The {@link Constants~InteractionResponseTypes.PREMIUM_REQUIRED | PREMIUM_REQUIRED} interaction response type is now deprecated in favor of using {@link Types/Channels~PremiumButton | custom premium buttons}.
     */
    async premiumRequired(): Promise<InteractionCallbackResponse<T>> {
        if (this.acknowledged) {
            throw new TypeError("Interactions cannot have more than one initial response.");
        }

        this.acknowledged = true;
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.PREMIUM_REQUIRED }, true);
    }

    /**
     * Reply to this interaction. If the interaction hasn't been acknowledged, {@link ModalSubmitInteraction#createMessage | createMessage} is used. Else, {@link ModalSubmitInteraction#createFollowup | createFollowup} is used.
     * Note that the returned class is not a message. It is a wrapper around the interaction response. The {@link MessageInteractionResponse#getMessage | getMessage} function can be used to get the message.
     * @param options The options for the message.
     */
    async reply(options: InteractionContent): Promise<MessageInteractionResponse<this>> {
        let useFollowup = this.acknowledged;
        if (!useFollowup && options.files && options.files.length !== 0) {
            await this.defer(options.flags);
            useFollowup = true;
        }
        return useFollowup ? this.createFollowup(options) : this.createMessage(options);
    }

    override toJSON(): JSONModalSubmitInteraction {
        return {
            ...super.toJSON(),
            appPermissions:               this.appPermissions.toJSON(),
            attachmentSizeLimit:          this.attachmentSizeLimit,
            authorizingIntegrationOwners: this.authorizingIntegrationOwners,
            channelID:                    this.channelID,
            context:                      this.context,
            data:                         this.data,
            guildID:                      this.guildID ?? undefined,
            guildLocale:                  this.guildLocale,
            locale:                       this.locale,
            member:                       this.member?.toJSON(),
            type:                         this.type,
            user:                         this.user.toJSON()
        };
    }
}
