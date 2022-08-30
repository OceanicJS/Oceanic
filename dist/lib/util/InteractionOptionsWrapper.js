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
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.INTEGER);
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
        return this._getOption(name, required, Constants_1.ApplicationCommandOptionTypes.MENTIONABLE);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25PcHRpb25zV3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL0ludGVyYWN0aW9uT3B0aW9uc1dyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBNkQ7QUFzQjdELGlDQUErQjtBQUUvQix5Q0FBeUM7QUFDekMsTUFBcUIseUJBQXlCO0lBQ2xDLFFBQVEsQ0FBbUQ7SUFDbkUscUNBQXFDO0lBQ3JDLEdBQUcsQ0FBNEI7SUFDL0IsWUFBWSxJQUErQixFQUFFLFFBQTBEO1FBQ25HLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFTyxVQUFVLENBQXNFLElBQVksRUFBRSxRQUFRLEdBQUcsS0FBSyxFQUFFLElBQW1DO1FBQ3ZKLElBQUksV0FBMkQsQ0FBQztRQUNoRSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLElBQUksR0FBRyxFQUFFLE1BQU0sS0FBSyxDQUFDO1lBQUUsV0FBVyxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyx5Q0FBNkIsQ0FBQyxXQUFXLENBQThDLEVBQUUsT0FBTyxDQUFDO2FBQ3JMLElBQUksR0FBRyxFQUFFLE1BQU0sS0FBSyxDQUFDO1lBQUUsV0FBVyxHQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyx5Q0FBNkIsQ0FBQyxpQkFBaUIsQ0FBbUQsRUFBRSxP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