/** @module SelectMenuWrapper */
import { ChannelTypes } from "../Constants";
import type Member from "../structures/Member";
import type Role from "../structures/Role";
import type User from "../structures/User";
import type { AnyGuildChannel, MessageCommandInteractionResolvedData, RawMessageComponentInteractionResolvedData } from "../types";
import InteractionResolvedChannel from "../structures/InteractionResolvedChannel";
import PrivateChannel from "../structures/PrivateChannel";
import Client from "../Client";

/** A wrapper for interaction options. */
export default class SelectMenuWrapper {
    #client: Client;
    /** The raw options from Discord.  */
    raw: RawMessageComponentInteractionResolvedData;
    /** Then resolved data for this options instance. */
    resolved: MessageCommandInteractionResolvedData;
    constructor(client: Client, data: RawMessageComponentInteractionResolvedData, resolved: MessageCommandInteractionResolvedData) {
        this.#client = client;
        this.raw = data;
        this.resolved = resolved;
    }

    /**
     * Get a channel option value.
     * @param id The id of the option.
     * @param required If true, an error will be thrown if the option is not present or the channel cannot be found.
     */
    getChannel(id: string, required?: false): InteractionResolvedChannel | undefined;
    getChannel(id: string, required: true): InteractionResolvedChannel;
    getChannel(id: string, required?: boolean): InteractionResolvedChannel | undefined {
        const ch = this.resolved.channels.get(id);
        if (!ch && required) {
            throw new Error(`Channel not present for required option: ${id}`);
        }
        return ch;
    }

    /**
     * Get a channel option's complete channel. This will only succeed if the channel is cached. If the channel is a private channel and it isn't cached, a `InteractionResolvedChannel` instance will still be returned.
     * @param id The id of the option.
     * @param required If true, an error will be thrown if the option is not present or the channel cannot be found.
     */
    getCompleteChannel<T extends AnyGuildChannel | PrivateChannel | InteractionResolvedChannel = AnyGuildChannel | PrivateChannel | InteractionResolvedChannel>(id: string, required?: false): T | undefined;
    getCompleteChannel<T extends AnyGuildChannel | PrivateChannel | InteractionResolvedChannel = AnyGuildChannel | PrivateChannel | InteractionResolvedChannel>(id: string, required: true): T;
    getCompleteChannel(id: string, required?: boolean): AnyGuildChannel | PrivateChannel | InteractionResolvedChannel | undefined {
        const resolved = this.getChannel(id, required as false);
        if (!resolved) {
            return undefined; // required will be handled in getChannel
        }
        const channel = resolved.completeChannel ?? resolved.type === ChannelTypes.DM ? resolved : undefined;
        if (!channel && required) {
            throw new Error(`Failed to resolve complete channel for required option: ${id}`);
        }
        return channel;
    }

    /**
     * Get a user option value (as a member).
     * @param id The id of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the member cannot be found.
     */
    getMember(id: string, required?: false): Member | undefined;
    getMember(id: string, required: true): Member;
    getMember(id: string, required?: boolean): Member | undefined {
        const ch = this.resolved.members.get(id);
        if (!ch && required) {
            throw new Error(`Member not present for required option: ${id}`);
        }
        return ch;
    }

    /**
     * Get a mentionable option value (channel, user, role).
     * @param id The id of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the value cannot be found.
     */
    getMentionable<T extends InteractionResolvedChannel | User | Role = InteractionResolvedChannel | User | Role>(id: string, required?: false): T | undefined;
    getMentionable<T extends InteractionResolvedChannel | User | Role = InteractionResolvedChannel | User | Role>(id: string, required: true): T;
    getMentionable(id: string, required?: boolean): InteractionResolvedChannel | User | Role | undefined {
        const ch = this.resolved.channels.get(id);
        const role = this.resolved.roles.get(id);
        const user = this.resolved.users.get(id);
        if ((!ch && !role && !user) && required) {
            throw new Error(`Value not present for required option: ${id}`);
        }
        return ch;
    }

    /**
     * Get a role option value.
     * @param id The id of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the role cannot be found.
     */
    getRole(id: string, required?: false): Role | undefined;
    getRole(id: string, required: true): Role;
    getRole(id: string, required?: boolean): Role | undefined {
        const ch = this.resolved.roles.get(id);
        if (!ch && required) {
            throw new Error(`Role not present for required option: ${id}`);
        }
        return ch;
    }

    /**
     * Get a user option value.
     * @param id The id of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the user cannot be found.
     */
    getUser(id: string, required?: false): User | undefined;
    getUser(id: string, required: true): User;
    getUser(id: string, required?: boolean): User | undefined {
        const ch = this.resolved.users.get(id);
        if (!ch && required) {
            throw new Error(`User not present for required option: ${id}`);
        }
        return ch;
    }
}
