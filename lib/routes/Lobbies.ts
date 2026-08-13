/** @module REST/Channels */
import * as Routes from "../util/Routes";
import type RESTManager from "../rest/RESTManager";
import type { RawLobby, CreateLobbyOptions, AddLobbyMemberOptions, EditLobbyOptions } from "../types/lobbies";
import Lobby from "../structures/Lobby";
import LobbyMember from "../structures/LobbyMember";

/** Various methods for interacting with lobbies. Located at {@link Client#rest | Client#rest}{@link RESTManager#lobbies | .lobbies}. */
export default class Lobbies {
    private _manager: RESTManager;
    constructor(manager: RESTManager) {
        this._manager = manager;
    }

    /**
     * Add a member to a lobby.
     * @param lobbyID The ID of the lobby to add the member to.
     * @param userID The ID of the user to add to the lobby.
     * @param options The options for adding the member to the lobby.
     */
    async addMember(lobbyID: string, userID: string, options?: AddLobbyMemberOptions): Promise<LobbyMember> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<RawLobby>({
            method: "PUT",
            path:   Routes.LOBBY_MEMBER(lobbyID, userID),
            json:   options
        }).then(data => new LobbyMember(data, this._manager.client, lobbyID));
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
                metadata:             options?.metadata,
                members:              options?.members,
                idle_timeout_seconds: options?.idleTimeoutSeconds
            }
        }).then(data => new Lobby(data, this._manager.client));
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
     * Leave a lobby. This requires bearer token authentication.
     * @param lobbyID The ID of the lobby to leave.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async leave(lobbyID: string, accessToken?: string): Promise<void> {
        let auth = this._manager.client.options.auth!;
        if (accessToken) {
            if (!accessToken.startsWith("Bearer ")) {
                accessToken = `Bearer ${accessToken}`;
            }
            auth = accessToken;
        }
        await this._manager.request<null>({
            method: "DELETE",
            path:   Routes.LOBBY_MEMBER(lobbyID, "@me"),
            auth
        });
    }

    /**
     * Link a lobby to a channel. This requires bearer token authentication and the `CAN_LINK_LOBBY` flag on the member.
     * @param lobbyID The ID of the lobby to link the channel to.
     * @param channelID The ID of the channel to link the lobby to.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async linkChannel(lobbyID: string, channelID: string | undefined, accessToken?: string): Promise<Lobby> {
        let auth = this._manager.client.options.auth!;
        if (accessToken) {
            if (!accessToken.startsWith("Bearer ")) {
                accessToken = `Bearer ${accessToken}`;
            }
            auth = accessToken;
        }
        return this._manager.request<RawLobby>({
            method: "PATCH",
            path:   Routes.LOBBY_CHANNEL_LINKING(lobbyID),
            auth,
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
