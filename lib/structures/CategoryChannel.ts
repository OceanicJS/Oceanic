/** @module CategoryChannel */
import PermissionOverwrite from "./PermissionOverwrite";
import GuildChannel from "./GuildChannel";
import type Member from "./Member";
import Permission from "./Permission";
import type Client from "../Client";
import { AllPermissions, Permissions, type ChannelTypes } from "../Constants";
import TypedCollection from "../util/TypedCollection";
import type { EditPermissionOptions, RawCategoryChannel, RawOverwrite } from "../types/channels";
import type { JSONCategoryChannel } from "../types/json";
import { UncachedError } from "../util/Errors";
import Collection from "../util/Collection";

/** Represents a guild category channel. */
export default class CategoryChannel extends GuildChannel {
    /** The permission overwrites of this channel. */
    permissionOverwrites: TypedCollection<RawOverwrite, PermissionOverwrite>;
    /** The position of this channel on the sidebar. */
    position: number;
    declare type: ChannelTypes.GUILD_CATEGORY;
    constructor(data: RawCategoryChannel, client: Client) {
        super(data, client);
        this.permissionOverwrites = new TypedCollection(PermissionOverwrite, client);
        this.position = data.position;
        this.update(data);
    }

    protected override update(data: Partial<RawCategoryChannel>): void {
        super.update(data);
        if (data.position !== undefined) {
            this.position = data.position;
        }
        if (data.permission_overwrites !== undefined) {
            for (const id of this.permissionOverwrites.keys()) {
                if (!data.permission_overwrites.some(overwrite => overwrite.id === id)) {
                    this.permissionOverwrites.delete(id);
                }
            }

            for (const overwrite of data.permission_overwrites) {
                this.permissionOverwrites.update(overwrite);
            }
        }
    }

    /** The channels in this category. The returned collection is disposable. */
    get channels(): Collection<string, GuildChannel> {
        return new Collection(this.guild.channels.filter(channel => channel.parentID === this.id).map(channel => [channel.id, channel as GuildChannel]));
    }

    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(overwriteID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }

    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(overwriteID: string, options: EditPermissionOptions): Promise<void> {
        return this.client.rest.channels.editPermission(this.id, overwriteID, options);
    }

    /**
     * Get the permissions of a member. If providing an id, the member must be cached.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member: string | Member): Permission {
        if (typeof member === "string") {
            member = this.guild.members.get(member)!;
        }
        if (!member) {
            throw new UncachedError(`Cannot use ${this.constructor.name}#permissionsOf with an ID when the member is not cached.`);
        }
        let permission = this.guild.permissionsOf(member).allow;
        if (permission & Permissions.ADMINISTRATOR) {
            return new Permission(AllPermissions);
        }
        let overwrite = this.permissionOverwrites.get(this.guildID);
        if (overwrite) {
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        }
        let deny = 0n;
        let allow = 0n;
        for (const id of member.roles) {
            if ((overwrite = this.permissionOverwrites.get(id))) {
                deny |= overwrite.deny;
                allow |= overwrite.allow;
            }
        }

        permission = (permission & ~deny) | allow;
        overwrite = this.permissionOverwrites.get(member.id);
        if (overwrite) {
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        }
        return new Permission(permission);
    }

    override toJSON(): JSONCategoryChannel {
        return {
            ...super.toJSON(),
            channels:             this.channels.map(channel => channel.id),
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position:             this.position,
            type:                 this.type
        };
    }
}
