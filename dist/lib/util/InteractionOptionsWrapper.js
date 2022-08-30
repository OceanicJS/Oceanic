"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const tsafe_1 = require("tsafe");
/** A wrapper for interaction options. */
class InteractionOptionsWrapper {
    resolved;
    /** The raw options from Discord.  */
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
    getSubCommand(required) {
        const opt = this.raw.find(o => o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND || o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP);
        if (!opt?.options) {
            if (required)
                throw new Error("Missing required option: subcommand/subcommandgroup");
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
}
exports.default = InteractionOptionsWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25PcHRpb25zV3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL0ludGVyYWN0aW9uT3B0aW9uc1dyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBNkQ7QUFxQjdELGlDQUErQjtBQUUvQix5Q0FBeUM7QUFDekMsTUFBcUIseUJBQXlCO0lBQ2xDLFFBQVEsQ0FBbUQ7SUFDbkUscUNBQXFDO0lBQ3JDLEdBQUcsQ0FBNEI7SUFDL0IsWUFBWSxJQUErQixFQUFFLFFBQTBEO1FBQ25HLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFVRCxhQUFhLENBQUMsSUFBWSxFQUFFLFFBQWtCO1FBQzFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyx5Q0FBNkIsQ0FBQyxVQUFVLENBQTZDLENBQUM7UUFDbkosSUFBSSxDQUFDLEdBQUcsSUFBSSxRQUFRO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsSUFBSSxFQUFFLENBQUMsQ0FBQzs7WUFDckUsT0FBTyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQVdELGtCQUFrQixDQUFDLElBQVksRUFBRSxRQUFrQjtRQUMvQyxJQUFBLGNBQU0sRUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLHNEQUFzRCxDQUFDLENBQUM7UUFDOUUsSUFBSSxHQUF1QixDQUFDO1FBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxRQUFpQixDQUFDLEVBQUUsS0FBSyxDQUFDO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDbEYsTUFBTSxDQUFD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