"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const tsafe_1 = require("tsafe");
class InteractionOptionsWrapper {
    resolved;
    raw;
    constructor(data, resolved) {
        this.raw = data;
        this.resolved = resolved;
    }
    getAttachment(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.ATTACHMENT);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getAttachmentValue(name, required) {
        (0, tsafe_1.assert)(this.resolved, "attempt to use getAttachmentValue with null resolved");
        let val;
        if (!(val = this.getAttachment(name, required)?.value))
            return undefined;
        const a = this.resolved.attachments.get(val);
        if (!a && required)
            throw new Error(`attachment not present for required option: ${name}`);
        return a;
    }
    getBoolean(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.BOOLEAN);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getBooleanValue(name, required) {
        return this.getBoolean(name, required)?.value;
    }
    getChannel(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.CHANNEL);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getChannelID(name, required) {
        return this.getChannel(name, required)?.value;
    }
    getChannelValue(name, required) {
        (0, tsafe_1.assert)(this.resolved, "attempt to use getChannelValue with null resolved");
        let val;
        if (!(val = this.getChannel(name, required)?.value))
            return undefined;
        const ch = this.resolved.channels.get(val);
        if (!ch && required)
            throw new Error(`channel not present for required option: ${name}`);
        return ch;
    }
    getDeepSubCommand(name1, name2, required) {
        return this.getSubCommandGroup(name1, required)?.getSubCommand(name2, required);
    }
    getInteger(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.INTEGER);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getIntegerValue(name, required) {
        return this.getInteger(name, required)?.value;
    }
    getMemberValue(name, required) {
        (0, tsafe_1.assert)(this.resolved, "attempt to use getMemberValue with null resolved");
        let val;
        if (!(val = this.getUser(name, required)?.value))
            return undefined;
        const ch = this.resolved.members.get(val);
        if (!ch && required)
            throw new Error(`member not present for required option: ${name}`);
        return ch;
    }
    getMentionable(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.MENTIONABLE);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getMentionableID(name, required) {
        return this.getMentionable(name, required)?.value;
    }
    getMentionableValue(name, required) {
        (0, tsafe_1.assert)(this.resolved, "attempt to use getMentionableValue with null resolved");
        let val;
        if (!(val = this.getChannel(name, required)?.value))
            return undefined;
        const ch = this.resolved.channels.get(val);
        if (!ch && required)
            throw new Error(`channel not present for required option: ${name}`);
        return ch;
    }
    getNumber(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.NUMBER);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getNumberValue(name, required) {
        return this.getNumber(name, required)?.value;
    }
    getRole(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.ROLE);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getRoleID(name, required) {
        return this.getRole(name, required)?.value;
    }
    getRoleValue(name, required) {
        (0, tsafe_1.assert)(this.resolved, "attempt to use getRoleValue with null resolved");
        let val;
        if (!(val = this.getRole(name, required)?.value))
            return undefined;
        const ch = this.resolved.roles.get(val);
        if (!ch && required)
            throw new Error(`role not present for required option: ${name}`);
        return ch;
    }
    getString(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.STRING);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getStringValue(name, required) {
        return this.getString(name, required)?.value;
    }
    getSubCommand(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND);
        if (!opt?.options) {
            if (required)
                throw new Error(`Missing required option: ${name}`);
            else
                return undefined;
        }
        else
            return new InteractionOptionsWrapper(opt.options, this.resolved);
    }
    getSubCommandGroup(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP);
        if (!opt?.options) {
            if (required)
                throw new Error(`Missing required option: ${name}`);
            else
                return undefined;
        }
        else
            return new InteractionOptionsWrapper(opt.options, this.resolved);
    }
    getUser(name, required) {
        const opt = this.raw.find(o => o.name === name && o.type === Constants_1.ApplicationCommandOptionTypes.USER);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getUserID(name, required) {
        return this.getUser(name, required)?.value;
    }
    getUserValue(name, required) {
        (0, tsafe_1.assert)(this.resolved, "attempt to use getUserValue with null resolved");
        let val;
        if (!(val = this.getUser(name, required)?.value))
            return undefined;
        const ch = this.resolved.users.get(val);
        if (!ch && required)
            throw new Error(`user not present for required option: ${name}`);
        return ch;
    }
    pickSubCommand(names, def) {
        for (const name of names)
            if (this.getSubCommand(name))
                return name;
        return def || names[0];
    }
}
exports.default = InteractionOptionsWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25PcHRpb25zV3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL0ludGVyYWN0aW9uT3B0aW9uc1dyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBNkQ7QUFxQjdELGlDQUErQjtBQUUvQixNQUFxQix5QkFBeUI7SUFDbEMsUUFBUSxDQUFtRDtJQUNuRSxHQUFHLENBQTRCO0lBQy9CLFlBQVksSUFBK0IsRUFBRSxRQUEwRDtRQUNuRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBSUQsYUFBYSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUMxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUsseUNBQTZCLENBQUMsVUFBVSxDQUE2QyxDQUFDO1FBQ25KLElBQUksQ0FBQyxHQUFHLElBQUksUUFBUTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLElBQUksRUFBRSxDQUFDLENBQUM7O1lBQ3JFLE9BQU8sR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFJRCxrQkFBa0IsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDL0MsSUFBQSxjQUFNLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO1FBQzlFLElBQUksR0FBdUIsQ0FBQztRQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBaUIsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQ2xGLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMs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