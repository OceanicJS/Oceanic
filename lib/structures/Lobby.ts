/** @module Lobby */
import Base from "./Base";
import GuildChannel from "./GuildChannel";
import LobbyMember from "./LobbyMember";
import type Client from "../Client";
import type * as Types from "../types/namespaced";

export default class Lobby extends Base {
    applicationID: string;
    linkedChannel?: GuildChannel | Types.Shared.Uncached;
    members: Array<LobbyMember>;
    metadata?: Record<string, string> | null;
    constructor(data: Types.Lobbies.RawLobby, client: Client) {
        super(data.id, client);
        this.applicationID = data.application_id;
        this.linkedChannel = data.linked_channel ? client.util.updateChannel(data.linked_channel) : undefined;
        this.members = data.members.map(member => new LobbyMember(member, client, this.id));
        this.metadata = data.metadata;
    }

    /**
     * Add a member to this lobby.
     * @param userID The ID of the user to add to the lobby.
     * @param options The options for adding the member to the lobby.
     */
    async addMember(userID: string, options?: Types.Lobbies.AddLobbyMemberOptions): Promise<LobbyMember> {
        return this.client.rest.lobbies.addMember(this.id, userID, options);
    }

    /** Delete this lobby. */
    async delete(): Promise<void> {
        return this.client.rest.lobbies.delete(this.id);
    }

    /**
     * Edit this lobby.
     * @param options The options for editing the lobby.
     */
    async edit(options: Types.Lobbies.EditLobbyOptions): Promise<Lobby> {
        return this.client.rest.lobbies.edit(this.id, options);
    }

    /**
     * Leave this lobby. This requires bearer token authentication.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async leave(accessToken?: string): Promise<void> {
        return this.client.rest.lobbies.leave(this.id, accessToken);
    }

    /**
     * Link this lobby to a channel. This requires bearer token authentication and the `CAN_LINK_LOBBY` flag on the member.
     * @param channelID The ID of the channel to link the lobby to.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async linkChannel(channelID: string | undefined, accessToken?: string): Promise<Lobby> {
        return this.client.rest.lobbies.linkChannel(this.id, channelID, accessToken);
    }

    /**
     * Remove a member from this lobby.
     * @param userID The ID of the user to remove from the lobby.
     */
    async removeMember(userID: string): Promise<void> {
        return this.client.rest.lobbies.removeMember(this.id, userID);
    }

    override toJSON(): Types.JSON.JSONLobby {
        return {
            ...super.toJSON(),
            applicationID: this.applicationID,
            linkedChannel: this.linkedChannel ? (this.linkedChannel instanceof GuildChannel ? this.linkedChannel.toJSON() : this.linkedChannel) : undefined,
            members:       this.members.map(member => member.toJSON()),
            metadata:      this.metadata
        };
    }

    /**
     * Unlink this lobby from a channel. This requires bearer token authentication and the `CAN_LINK_LOBBY` flag on the member.
     * @param accessToken An optional access token to use instead of the client's token. This overrides the client's auth.
     */
    async unlinkChannel(accessToken?: string): Promise<Lobby> {
        return this.client.rest.lobbies.unlinkChannel(this.id, accessToken);
    }

    /**
     * Update the moderation metadata for a message in this lobby.
     * @param messageID The ID of the message to update the metadata for.
     * @param metadata The metadata to set for the message.
     */
    async updateMessageModerationMetadata(messageID: string, metadata: Record<string, string>): Promise<void> {
        return this.client.rest.lobbies.updateMessageModerationMetadata(this.id, messageID, metadata);
    }
}
