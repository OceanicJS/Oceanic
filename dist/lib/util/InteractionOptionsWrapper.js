"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
/** A wrapper for interaction options. */
class InteractionOptionsWrapper {
    resolved;
    /** The raw options from Discord.  */
    raw;
    constructor(data, resolved) {
        this.raw = data;
        this.resolved = resolved;
    }
    _getOption(name, required = false, type) {
        let baseOptions;
        const sub = this.getSubCommand(false);
        if (sub?.length === 1)
            baseOptions = this.raw.find(o => o.name === sub[0] && o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND)?.options;
        else if (sub?.length === 2)
            baseOptions = this.raw.find(o => o.name === sub[0] && o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP)?.options?.find(o2 => o2.name === sub[1] && o2.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND)?.options;
        const opt = (baseOptions || this.raw).find(o => o.name === name && o.type === type);
        if (!opt && required)
            throw new Error(`Missing required option: ${name}`);
        else
            return opt;
    }
    getAttachment(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.ATTACHMENT);
    }
    getAttachmentValue(name, required) {
        if (this.resolved === null)
            throw new Error("attempt to use getAttachmentValue with null resolved");
        let val;
        if (!(val = this.getAttachment(name, required)?.value))
            return undefined;
        const a = this.resolved.attachments.get(val);
        if (!a && required)
            throw new Error(`attachment not present for required option: ${name}`);
        return a;
    }
    getBoolean(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.BOOLEAN);
    }
    getBooleanValue(name, required) {
        return this.getBoolean(name, required)?.value;
    }
    getChannel(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.CHANNEL);
    }
    getChannelID(name, required) {
        return this.getChannel(name, required)?.value;
    }
    getChannelValue(name, required) {
        if (this.resolved === null)
            throw new Error("attempt to use getChannelValue with null resolved");
        let val;
        if (!(val = this.getChannel(name, required)?.value))
            return undefined;
        const ch = this.resolved.channels.get(val);
        if (!ch && required)
            throw new Error(`channel not present for required option: ${name}`);
        return ch;
    }
    getInteger(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.INTEGER);
    }
    getIntegerValue(name, required) {
        return this.getInteger(name, required)?.value;
    }
    getMemberValue(name, required) {
        if (this.resolved === null)
            throw new Error("attempt to use getMemberValue with null resolved");
        let val;
        if (!(val = this.getUser(name, required)?.value))
            return undefined;
        const ch = this.resolved.members.get(val);
        if (!ch && required)
            throw new Error(`member not present for required option: ${name}`);
        return ch;
    }
    getMentionable(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.MENTIONABLE);
    }
    getMentionableID(name, required) {
        return this.getMentionable(name, required)?.value;
    }
    getMentionableValue(name, required) {
        if (this.resolved === null)
            throw new Error("attempt to use getMentionableValue with null resolved");
        let val;
        if (!(val = this.getChannel(name, required)?.value))
            return undefined;
        const ch = this.resolved.channels.get(val);
        if (!ch && required)
            throw new Error(`channel not present for required option: ${name}`);
        return ch;
    }
    getNumber(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.NUMBER);
    }
    getNumberValue(name, required) {
        return this.getNumber(name, required)?.value;
    }
    getRole(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.ROLE);
    }
    getRoleID(name, required) {
        return this.getRole(name, required)?.value;
    }
    getRoleValue(name, required) {
        if (this.resolved === null)
            throw new Error("attempt to use getRoleValue with null resolved");
        let val;
        if (!(val = this.getRole(name, required)?.value))
            return undefined;
        const ch = this.resolved.roles.get(val);
        if (!ch && required)
            throw new Error(`role not present for required option: ${name}`);
        return ch;
    }
    getString(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.STRING);
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
        else {
            // nested
            if (opt.options.length === 1 && opt.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP) {
                const sub = opt.options.find(o => o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND);
                if (!sub?.options)
                    return [opt.name];
                else
                    return [opt.name, sub.name];
            }
            else
                return [opt.name];
        }
    }
    getUser(name, required) {
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.USER);
    }
    getUserID(name, required) {
        return this.getUser(name, required)?.value;
    }
    getUserValue(name, required) {
        if (this.resolved === null)
            throw new Error("attempt to use getUserValue with null resolved");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25PcHRpb25zV3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL0ludGVyYWN0aW9uT3B0aW9uc1dyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBNkQ7QUF1QjdELHlDQUF5QztBQUN6QyxNQUFxQix5QkFBeUI7SUFDbEMsUUFBUSxDQUFtRDtJQUNuRSxxQ0FBcUM7SUFDckMsR0FBRyxDQUE0QjtJQUMvQixZQUFZLElBQStCLEVBQUUsUUFBMEQ7UUFDbkcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVPLFVBQVUsQ0FBc0UsSUFBWSxFQUFFLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBbUM7UUFDdkosSUFBSSxXQUEyRCxDQUFDO1FBQ2hFLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxHQUFHLEVBQUUsTUFBTSxLQUFLLENBQUM7WUFBRSxXQUFXLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlDQUE2QixDQUFDLFdBQVcsQ0FBOEMsRUFBRSxPQUFPLENBQUM7YUFDckwsSUFBSSxHQUFHLEVBQUUsTUFBTSxLQUFLLENBQUM7WUFBRSxXQUFXLEdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlDQUE2QixDQUFDLGlCQUFpQixDQUFtRCxFQUFFLE9BQU8sRUFBRSxJQUFJ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