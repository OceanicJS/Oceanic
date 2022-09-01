"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuildTemplate {
    client;
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
    /** The ID of the source guild of this template. */
    sourceGuildID;
    /** When this template was last updated. */
    updatedAt;
    /** The amount of times this template has been used. */
    usageCount;
    constructor(data, client) {
        this.client = client;
        this.code = data.code;
        this.createdAt = new Date(data.created_at);
        this.creator = this.client.users.update(data.creator);
        this.description = null;
        this.isDirty = null;
        this.name = data.name;
        this.serializedSourceGuild = data.serialized_source_guild;
        this.sourceGuild = this.client.guilds.get(data.source_guild_id);
        this.sourceGuildID = data.source_guild_id;
        this.updatedAt = new Date(data.updated_at);
        this.usageCount = data.usage_count;
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
        if (data.source_guild_id !== undefined) {
            this.sourceGuild = this.client.guilds.get(data.source_guild_id);
            this.sourceGuildID = data.source_guild_id;
        }
        if (data.updated_at !== undefined)
            this.updatedAt = new Date(data.updated_at);
        if (data.usage_count !== undefined)
            this.usageCount = data.usage_count;
    }
    /**
     * Create a guild from this template. This can only be used by bots in less than 10 guilds.
     * @param options The options for creating the guild.
     */
    async createGuild(options) {
        return this.client.rest.guilds.createFromTemplate(this.code, options);
    }
    /**
     * Delete this template.
     */
    async delete() {
        return this.client.rest.guilds.deleteTemplate(this.sourceGuild.id, this.code);
    }
    /**
     * Edit this template.
     * @param options The options for editing the template.
     */
    async editTemplate(options) {
        return this.client.rest.guilds.editTemplate(this.sourceGuild.id, this.code, options);
    }
    /**
     * Sync this template.
     */
    async syncTemplate() {
        return this.client.rest.guilds.syncTemplate(this.sourceGuild.id, this.code);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRUZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0d1aWxkVGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSxNQUFxQixhQUFhO0lBQzlCLE1BQU0sQ0FBUztJQUNmLGdDQUFnQztJQUNoQyxJQUFJLENBQVM7SUFDYixzQ0FBc0M7SUFDdEMsU0FBUyxDQUFPO0lBQ2hCLG9DQUFvQztJQUNwQyxPQUFPLENBQU87SUFDZCx3Q0FBd0M7SUFDeEMsV0FBVyxDQUFnQjtJQUMzQiw2Q0FBNkM7SUFDN0MsT0FBTyxDQUFpQjtJQUN4QixpQ0FBaUM7SUFDakMsSUFBSSxDQUFTO0lBQ2IsK0JBQStCO0lBQy9CLHFCQUFxQixDQUFvQjtJQUN6Qyx5Q0FBeUM7SUFDekMsV0FBVyxDQUFRO0lBQ25CLG1EQUFtRDtJQUNuRCxhQUFhLENBQVM7SUFDdEIsMkNBQTJDO0lBQzNDLFNBQVMsQ0FBTztJQUNoQix1REFBdUQ7SUFDdkQsVUFBVSxDQUFTO0lBQ25CLFlBQVksSUFBc0IsRUFBRSxNQUFjO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJ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