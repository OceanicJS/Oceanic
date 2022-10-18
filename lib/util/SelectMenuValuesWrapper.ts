/** @module SelectMenuValuesWrapper */
import { ChannelTypes } from "../Constants";
import type Member from "../structures/Member";
import type Role from "../structures/Role";
import type User from "../structures/User";
import type InteractionResolvedChannel from "../structures/InteractionResolvedChannel";
import type PrivateChannel from "../structures/PrivateChannel";
import type { AnyGuildChannel } from "../types/channels";
import type { MessageComponentInteractionResolvedData } from "../types/interactions";

/** A wrapper for select menu data. */
export default class SelectMenuValuesWrapper {
    /** The raw received values. */
    raw: Array<string>;
    /** The resolved data for this instance. */
    resolved: MessageComponentInteractionResolvedData;
    constructor(resolved: MessageComponentInteractionResolvedData, values: Array<string>) {
        this.resolved = resolved;
        this.raw   = values;
    }

    /**
     * Get the selected channels.
     *
     * If `ensurePresent` is false, channels that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a channel.
     */
    getChannels(ensurePresent?: boolean): Array<InteractionResolvedChannel> {
        return this.raw.map(id => {
            const ch = this.resolved.channels.get(id);
            if (!ch && ensurePresent) {
                throw new Error(`Failed to find channel in resolved data: ${id}`);
            }
            return ch!;
        }).filter(Boolean);
    }

    /**
     * Get the complete version of the selected channels. This will only succeed if the channel is cached. If the channel is private and isn't cached, an `InteractionResolvedChannel` instance will still be returned.
     *
     * If `ensurePresent` is false, channels that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a member.
     */
    getCompleteChannels(ensurePresent?: boolean): Array<AnyGuildChannel | PrivateChannel | InteractionResolvedChannel> {
        return this.raw.map(id => {
            const ch = this.resolved.channels.get(id);
            if (ch && ch.type === ChannelTypes.DM) {
                return ch?.completeChannel ?? ch;
            }
            if (!ch && ensurePresent) {
                throw new Error(`Failed to find channel in resolved data: ${id}`);
            }
            return ch!;
        }).filter(Boolean);
    }

    /**
     * Get the selected members.
     *
     * If `ensurePresent` is false, members that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a member.
     */
    getMembers(ensurePresent?: boolean): Array<Member> {
        return this.raw.map(id => {
            const member = this.resolved.members.get(id);
            if (!member && ensurePresent) {
                throw new Error(`Failed to find member in resolved data: ${id}`);
            }
            return member!;
        }).filter(Boolean);
    }

    /**
     * Get the selected mentionables. (channels, users, roles)
     *
     * If `ensurePresent` is false, mentionables that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a channel, user, or role.
     */
    getMentionables(ensurePresent?: boolean): Array<InteractionResolvedChannel | User | Role> {
        const res: Array<InteractionResolvedChannel | User | Role> = [];
        for (const id of this.raw) {
            const ch = this.resolved.channels.get(id);
            const role = this.resolved.roles.get(id);
            const user = this.resolved.users.get(id);
            if ((!ch && !role && !user)) {
                if (ensurePresent) {
                    throw new Error(`Failed to find mentionable in resolved data: ${id}`);
                }
            } else {
                res.push((ch ?? role ?? user)!);
            }
        }

        return res;
    }

    /**
     * Get the selected roles.
     *
     * If `ensurePresent` is false, roles that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a role.
     */
    getRoles(ensurePresent?: boolean): Array<Role> {
        return this.raw.map(id => {
            const role = this.resolved.roles.get(id);
            if (!role && ensurePresent) {
                throw new Error(`Failed to find role in resolved data: ${id}`);
            }
            return role!;
        }).filter(Boolean);
    }

    /**
     * Get the selected string values. This cannot fail.
     */
    getStrings(): Array<string> {
        return this.raw;
    }

    /**
     * Get the selected users.
     *
     * If `ensurePresent` is false, users that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a user.
     */
    getUsers(ensurePresent?: boolean): Array<User> {
        return this.raw.map(id => {
            const user = this.resolved.users.get(id);
            if (!user && ensurePresent) {
                throw new Error(`Failed to find user in resolved data: ${id}`);
            }
            return user!;
        }).filter(Boolean);
    }
}
