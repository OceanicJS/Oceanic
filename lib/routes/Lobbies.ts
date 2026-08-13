/** @module REST/Channels */
import * as Routes from "../util/Routes";
import QueryBuilder from "../util/QueryBuilder";
import type RESTManager from "../rest/RESTManager";
import type * as Types from "../types/namespaced";
import type { RawLobby, CreateLobbyOptions, AddLobbyMemberOptions, EditLobbyOptions } from "../types/lobbies";
import Lobby from "../structures/Lobby";
import LobbyMember from "../structures/LobbyMember";
import Message from "../structures/Message";

/** Various methods for interacting with lobbies. Located at {@link Client#rest | Client#rest}{@link RESTManager#lobbies | .lobbies}. */
export default class Lobbies {
    private _manager: RESTManager;
    constructor(manager: RESTManager) {
        this._manager = manager;
    }

    private _getBearerAuth(accessToken?: string): string {
        if (accessToken === undefined) {
            return this._manager.client.options.auth!;
        }
        return accessToken.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`;
    }

    /**
     * Add a member to a lobby.
     * @param lobbyID The ID of the lobby to add the member to.
     * @param userID The ID of the user to add to the lobby.
     * @param options The options for adding the member to the lobby.
     */
    async addMember(lobbyID: string, userID: string, options?: AddLobbyMemberOptions): Promise<LobbyMember> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Lobbies.RawLobbyMember>({
            method: "PUT",
            path:   Routes.LOBBY_MEMBER(lobbyID, userID),
            json:   options
        }).then(data => new LobbyMember(data, this._manager.client, lobbyID));
    }

    /**
     * Bulk update members in a lobby.
     * @param lobbyID The ID of the lobby to update members in.
     * @param members The members to update.
     */
    async bulkUpdateMembers(lobbyID: string, members: Array<Types.Lobbies.BulkUpdateLobbyMemberOptions>): Promise<Array<LobbyMember>> {
        members = this._manager.client.util._freeze(members);
        return this._manager.authRequest<Array<Types.Lobbies.RawLobbyMember>>({
            method: "POST",
            path:   Routes.LOBBY_MEMBERS_BULK(lobbyID),
            json:   members.map(member => ({
                flags:         member.flags,
                id:            member.id,
                metadata:      member.metadata,
                remove_member: member.removeMember
            }))
        }).then(data => data.map(member => new LobbyMember(member, this._manager.client, lobbyID)));
    }

    /**
     * Create a new lobby.
     * @param options The options for creating the lobby.
     * @caching This method **does not** cache its result.
     */
    async create(options?: CreateLobbyOptions): Promise<Lobby> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<RawLobby>({
            method: "POST",
            path:   Routes.LOBBIES,
            json:   {
                flags:                options?.flags,
                metadata:             options?.metadata,
                members:              options?.members,
                idle_timeout_seconds: options?.idleTimeoutSeconds
            }
        }).then(data => new Lobby(data, this._manager.client));
    }

    /**
     * Create an invite for the current user to join a lobby's linked channel. This requires bearer token authentication.
     * @param lobbyID The ID of the lobby to create the invite for.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async createCurrentUserInvite(lobbyID: string, accessToken?: string): Promise<Types.Lobbies.LobbyInvite> {
        return this._manager.request<Types.Lobbies.RawLobbyInvite>({
            method: "POST",
            path:   Routes.LOBBY_MEMBER_INVITES(lobbyID, "@me"),
            auth:   this._getBearerAuth(accessToken)
        });
    }

    /**
     * Create an invite for a user to join a lobby's linked channel. This requires bearer token authentication.
     * @param lobbyID The ID of the lobby to create the invite for.
     * @param userID The ID of the user to create the invite for.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async createInvite(lobbyID: string, userID: string, accessToken?: string): Promise<Types.Lobbies.LobbyInvite> {
        return this._manager.request<Types.Lobbies.RawLobbyInvite>({
            method: "POST",
            path:   Routes.LOBBY_MEMBER_INVITES(lobbyID, userID),
            auth:   this._getBearerAuth(accessToken)
        });
    }

    /**
     * Create a message in a lobby. This requires bearer token authentication.
     * @param lobbyID The ID of the lobby to create the message in.
     * @param options The options for creating the message.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async createMessage(lobbyID: string, options: Types.Lobbies.CreateLobbyMessageOptions, accessToken?: string): Promise<Types.Lobbies.LobbyMessage> {
        options = this._manager.client.util._freeze(options);
        return this._manager.request<Types.Channels.RawMessage>({
            method: "POST",
            path:   Routes.LOBBY_MESSAGES(lobbyID),
            auth:   this._getBearerAuth(accessToken),
            json:   {
                allowed_mentions: this._manager.client.util.formatAllowedMentions(options.allowedMentions),
                attachments:      options.attachments?.map(attachment => ({
                    description: attachment.description,
                    filename:    attachment.filename,
                    id:          attachment.id,
                    is_spoiler:  attachment.isSpoiler
                })),
                components:        options.components ? this._manager.client.util.componentsToRaw(options.components) : undefined,
                content:           options.content,
                embeds:            options.embeds ? this._manager.client.util.embedsToRaw(options.embeds) : undefined,
                enforce_nonce:     options.enforceNonce,
                flags:             options.flags,
                message_reference: options.messageReference ? {
                    channel_id:         options.messageReference.channelID,
                    fail_if_not_exists: options.messageReference.failIfNotExists,
                    guild_id:           options.messageReference.guildID,
                    message_id:         options.messageReference.messageID,
                    type:               options.messageReference.type
                } : undefined,
                metadata: options.metadata,
                nonce:    options.nonce,
                poll:     options.poll ? {
                    allow_multiselect: options.poll.allowMultiselect,
                    answers:           options.poll.answers.map(a => ({
                        poll_media: a.pollMedia
                    })),
                    duration:    options.poll.duration,
                    layout_type: options.poll.layoutType,
                    question:    options.poll.question
                } : undefined,
                sticker_ids: options.stickerIDs,
                tts:         options.tts
            },
            files: options.files
        }).then(data => new Message<Types.Shared.Uncached>(data, this._manager.client));
    }

    /**
     * Delete a lobby.
     * @param lobbyID The ID of the lobby to delete.
     */
    async delete(lobbyID: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.LOBBY(lobbyID)
        });
    }

    /**
     * Edit a lobby.
     * @param lobbyID The ID of the lobby to edit.
     * @param options The options for editing the lobby.
     */
    async edit(lobbyID: string, options: EditLobbyOptions): Promise<Lobby> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<RawLobby>({
            method: "PATCH",
            path:   Routes.LOBBY(lobbyID),
            json:   {
                flags:                options?.flags,
                metadata:             options?.metadata,
                members:              options?.members,
                idle_timeout_seconds: options?.idleTimeoutSeconds
            }
        }).then(data => new Lobby(data, this._manager.client));
    }

    /**
     * Get a lobby.
     * @param lobbyID The ID of the lobby to retrieve.
     */
    async get(lobbyID: string): Promise<Lobby> {
        return this._manager.authRequest<RawLobby>({
            method: "GET",
            path:   Routes.LOBBY(lobbyID)
        }).then(data => new Lobby(data, this._manager.client));
    }

    /**
     * Get messages in a lobby. This requires bearer token authentication.
     * @param lobbyID The ID of the lobby to get messages from.
     * @param options The options for getting the messages.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async getMessages(lobbyID: string, options?: Types.Lobbies.GetLobbyMessagesOptions, accessToken?: string): Promise<Array<Types.Lobbies.LobbyMessage>> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.setIfPresent("limit", options?.limit);
        return this._manager.request<Array<Types.Channels.RawMessage>>({
            method: "GET",
            path:   Routes.LOBBY_MESSAGES(lobbyID),
            auth:   this._getBearerAuth(accessToken),
            query
        }).then(data => data.map(message => new Message<Types.Shared.Uncached>(message, this._manager.client)));
    }

    /**
     * Join an existing lobby or create a new lobby.
     * @param options The options for joining or creating the lobby.
     * @caching This method **does not** cache its result.
     */
    async joinOrCreate(options: Types.Lobbies.JoinLobbyOptions): Promise<Lobby> {
        options = this._manager.client.util._freeze(options);
        const requestOptions = {
            method: "PUT",
            path:   Routes.LOBBIES,
            json:   {
                flags:                options.flags,
                idle_timeout_seconds: options.idleTimeoutSeconds,
                lobby_metadata:       options.lobbyMetadata,
                member_metadata:      options.memberMetadata,
                secret:               options.secret
            }
        } as const;
        if (options.accessToken === undefined) {
            return this._manager.authRequest<RawLobby>(requestOptions).then(data => new Lobby(data, this._manager.client));
        }

        return this._manager.request<RawLobby>({
            ...requestOptions,
            auth: this._getBearerAuth(options.accessToken)
        }).then(data => new Lobby(data, this._manager.client));
    }

    /**
     * Leave a lobby. This requires bearer token authentication.
     * @param lobbyID The ID of the lobby to leave.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async leave(lobbyID: string, accessToken?: string): Promise<void> {
        await this._manager.request<null>({
            method: "DELETE",
            path:   Routes.LOBBY_MEMBER(lobbyID, "@me"),
            auth:   this._getBearerAuth(accessToken)
        });
    }

    /**
     * Link a lobby to a channel. This requires bearer token authentication and the `CAN_LINK_LOBBY` flag on the member.
     * @param lobbyID The ID of the lobby to link the channel to.
     * @param channelID The ID of the channel to link the lobby to.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async linkChannel(lobbyID: string, channelID: string | undefined, accessToken?: string): Promise<Lobby> {
        return this._manager.request<RawLobby>({
            method: "PATCH",
            path:   Routes.LOBBY_CHANNEL_LINKING(lobbyID),
            auth:   this._getBearerAuth(accessToken),
            json:   { channel_id: channelID }
        }).then(data => new Lobby(data, this._manager.client));
    }

    /**
     * Remove a member from a lobby.
     * @param lobbyID The ID of the lobby to remove the member from.
     * @param userID The ID of the user to remove from the lobby.
     */
    async removeMember(lobbyID: string, userID: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.LOBBY_MEMBER(lobbyID, userID)
        });
    }

    /**
     * Unlink a lobby from a channel. This requires bearer token authentication and the `CAN_LINK_LOBBY` flag on the member.
     * @param lobbyID The ID of the lobby to unlink the channel from.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async unlinkChannel(lobbyID: string, accessToken?: string): Promise<Lobby> {
        return this.linkChannel(lobbyID, undefined, accessToken);
    }

    /**
     * Update the moderation metadata for a message in a lobby.
     * @param lobbyID The ID of the lobby the message is in.
     * @param messageID The ID of the message to update the metadata for.
     * @param metadata The metadata to set for the message.
     */
    async updateMessageModerationMetadata(lobbyID: string, messageID: string, metadata: Record<string, string>): Promise<void> {
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.LOBBY_MESSAGE_MODERATION_METADATA(lobbyID, messageID),
            json:   metadata
        });
    }
}
