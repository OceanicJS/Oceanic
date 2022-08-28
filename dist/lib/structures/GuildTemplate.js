"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuildTemplate {
    _client;
    /** The code of the template. */
    code;
    /** When this template was created. */
    createdAt;
    /** The creator of this template. */
    creator;
    /** The description of this template. */
    description;
    /** If this template has unsynced changes. */
    isDirty;
    /** The name of this template. */
    name;
    /** A snapshot of the guild. */
    serializedSourceGuild;
    /** The source guild of this template. */
    sourceGuild;
    /** When this template was last updated. */
    updatedAt;
    /** The amount of times this template has been used. */
    usageCount;
    constructor(data, client) {
        this._client = client;
        this.code = data.code;
        this.createdAt = new Date(data.created_at);
        this.creator = this._client.users.update(data.creator);
        this.update(data);
    }
    update(data) {
        if (data.description !== undefined)
            this.description = data.description;
        if (data.is_dirty !== undefined)
            this.isDirty = data.is_dirty;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.serialized_source_guild !== undefined)
            this.serializedSourceGuild = data.serialized_source_guild;
        if (data.source_guild_id !== undefined)
            this.sourceGuild = this._client.guilds.get(data.source_guild_id) || { id: data.source_guild_id };
        if (data.updated_at !== undefined)
            this.updatedAt = new Date(data.updated_at);
        if (data.usage_count !== undefined)
            this.usageCount = data.usage_count;
    }
    /**
     * Create a guild from this template. This can only be used by bots in less than 10 guilds.
     *
     * @param {Object} options
     * @param {(Buffer | String)} [options.icon] - The icon for the created guild (buffer, or full data url).
     * @param {String} options.name - The name of the guild.
     * @returns {Promise<Guild>}
     */
    async createGuild(options) {
        return this._client.rest.guilds.createFromTemplate(this.code, options);
    }
    /**
     * Delete this template.
     *
     * @returns {Promise<void>}
     */
    async delete() {
        return this._client.rest.guilds.deleteTemplate(this.sourceGuild.id, this.code);
    }
    /**
     * Edit this template.
     *
     * @param {Object} options
     * @param {String} [options.description] - The description of the template.
     * @param {String} [options.name] - The name of the template.
     * @returns {Promise<GuildTemplate>}
     */
    async editTemplate(options) {
        return this._client.rest.guilds.editTemplate(this.sourceGuild.id, this.code, options);
    }
    /**
     * Sync this template.
     *
     * @returns {Promise<GuildTemplate>}
     */
    async syncTemplate() {
        return this._client.rest.guilds.syncTemplate(this.sourceGuild.id, this.code);
    }
    toJSON() {
        return {
            code: this.code,
            createdAt: this.createdAt.getTime(),
            creator: this.creator.toJSON(),
            description: this.description,
            isDirty: this.isDirty,
            name: this.name,
            serializedSourceGuild: this.serializedSourceGuild,
            sourceGuild: this.sourceGuild.id,
            updatedAt: this.updatedAt.getTime(),
            usageCount: this.usageCount
        };
    }
}
exports.default = GuildTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRUZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0d1aWxkVGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxNQUFxQixhQUFhO0lBQ3ZCLE9BQU8sQ0FBUztJQUMxQixnQ0FBZ0M7SUFDaEMsSUFBSSxDQUFTO0lBQ2Isc0NBQXNDO0lBQ3RDLFNBQVMsQ0FBTztJQUNoQixvQ0FBb0M7SUFDcEMsT0FBTyxDQUFPO0lBQ2Qsd0NBQXdDO0lBQ3hDLFdBQVcsQ0FBZ0I7SUFDM0IsNkNBQTZDO0lBQzdDLE9BQU8sQ0FBaUI7SUFDeEIsaUNBQWlDO0lBQ2pDLElBQUksQ0FBUztJQUNiLCtCQUErQjtJQUMvQixxQkFBcUIsQ0FBb0I7SUFDekMseUNBQXlDO0lBQ3pDLFdBQVcsQ0FBbUI7SUFDOUIsMkNBQTJDO0lBQzNDLFNBQVMsQ0FBTztJQUNoQix1REFBdUQ7SUFDdkQsVUFBVSxDQUFTO0lBQ25CLFlBQVksSUFBc0IsRUFBRSxNQUFjO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVMsTUFBTSxDQUFDLElBQStCO1FBQy9DLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3hFLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzlELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25ELElBQUksSUFBSSxDQUFDLHVCQUF1QixLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDO1FBQzFHLElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6SSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlFLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUF1QztRQUN4RCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE1BQU07UUFDWCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFpQztRQUNuRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxZQUFZO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELE1BQU07UUFDTCxPQUFPO1lBQ04sSUFBSSxFQUFtQixJQUFJLENBQUMsSUFBSTtZQUNoQyxTQUFTLEVBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDL0MsT0FBTyxFQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUM1QyxXQUFXLEVBQVksSUFBSSxDQUFDLFdBQVc7WUFDdkMsT0FBTyxFQUFnQixJQUFJLENBQUMsT0FBTztZQUNuQyxJQUFJLEVBQW1CLElBQUksQ0FBQyxJQUFJO1lBQ2hDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxxQkFBcUI7WUFDakQsV0FBVyxFQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUMxQyxTQUFTLEVBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDL0MsVUFBVSxFQUFhLElBQUksQ0FBQyxVQUFVO1NBQ3RDLENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUFoR0QsZ0NBZ0dDIn0=