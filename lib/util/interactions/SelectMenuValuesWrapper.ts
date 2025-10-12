/** @module SelectMenuValuesWrapper */
import { mapRawToResolved } from "./shared";
import { ChannelTypes } from "../../Constants";
import type Member from "../../structures/Member";
import type Role from "../../structures/Role";
import type User from "../../structures/User";
import type InteractionResolvedChannel from "../../structures/InteractionResolvedChannel";
import type { AnyImplementedChannel } from "../../types/channels";
import type { MessageComponentInteractionResolvedData } from "../../types/interactions";
import Collection from "../Collection";

/** A wrapper for select menu data. */
export default class SelectMenuValuesWrapper {
    /** The raw received values. */
    raw: Array<string>;
    /** The resolved data for this instance. */
    resolved: MessageComponentInteractionResolvedData;
    constructor(resolved: MessageComponentInteractionResolvedData, values: Array<string>) {
        this.resolved = resolved;
        this.raw = values;
    }

    /**
     * Get the selected channels.
     *
     * If `ensurePresent` is false, channels that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a channel.
     */
    getChannels(ensurePresent?: boolean): Array<InteractionResolvedChannel> {
        return mapRawToResolved("channel", this.raw, this.resolved.channels, ensurePresent);
    }

    /**
     * Get the complete version of the selected channels. This will only succeed if the channel is cached. If the channel is private and isn't cached, an `InteractionResolvedChannel` instance will still be returned.
     *
     * If `ensurePresent` is false, channels that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a channel.
     */
    getCompleteChannels(ensurePresent?: boolean): Array<AnyImplementedChannel | InteractionResolvedChannel> {
        return this.getChannels(ensurePresent).map(ch => ch.type === ChannelTypes.DM ? ch.completeChannel ?? ch : ch);
    }

    /**
     * Get the selected members.
     *
     * If `ensurePresent` is false, members that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a member.
     */
    getMembers(ensurePresent?: boolean): Array<Member> {
        return mapRawToResolved("member", this.raw, this.resolved.members, ensurePresent);
    }

    /**
     * Get the selected mentionables. (users, roles)
     *
     * If `ensurePresent` is false, mentionables that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a user, or role.
     */
    getMentionables(ensurePresent?: boolean): Array<User | Role> {
        return mapRawToResolved("mentionable", this.raw, new Collection<string, User | Role>([...this.resolved.users, ...this.resolved.roles]), ensurePresent);
    }

    /**
     * Get the selected roles.
     *
     * If `ensurePresent` is false, roles that aren't in resolved will be ignored.
     * @param ensurePresent If true, an error will be thrown if any value cannot be mapped to a role.
     */
    getRoles(ensurePresent?: boolean): Array<Role> {
        return mapRawToResolved("role", this.raw, this.resolved.roles, ensurePresent);
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
        return mapRawToResolved("user", this.raw, this.resolved.users, ensurePresent);
    }
}
