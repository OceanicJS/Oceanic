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
        const opt = this.raw.find(o => o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND || o.type === Constants_1.ApplicationCommandOptionTypes.SUB_COMMAND);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25PcHRpb25zV3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL0ludGVyYWN0aW9uT3B0aW9uc1dyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBNkQ7QUFxQjdELGlDQUErQjtBQUUvQixNQUFxQix5QkFBeUI7SUFDbEMsUUFBUSxDQUFtRDtJQUNuRSxHQUFHLENBQTRCO0lBQy9CLFlBQVksSUFBK0IsRUFBRSxRQUEwRDtRQUNuRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBSUQsYUFBYSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUMxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUsseUNBQTZCLENBQUMsVUFBVSxDQUE2QyxDQUFDO1FBQ25KLElBQUksQ0FBQyxHQUFHLElBQUksUUFBUTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLElBQUksRUFBRSxDQUFDLENBQUM7O1lBQ3JFLE9BQU8sR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFJRCxrQkFBa0IsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDL0MsSUFBQSxjQUFNLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO1FBQzlFLElBQUksR0FBdUIsQ0FBQztRQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBaUIsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQ2xGLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsQ0FBQyxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNGLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUlELFVBQVUsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlDQUE2QixDQUFDLE9BQU8sQ0FBMEMsQ0FBQztRQUM3SSxJQUFJLENBQUMsR0FBRyxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQyxDQUFDOztZQUNyRSxPQUFPLEdBQUcsQ0FBQztJQUNwQixDQUFDO0lBSUQsZUFBZSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUM1QyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQWlCLENBQUMsRUFBRSxLQUFLLENBQUM7SUFDM0QsQ0FBQztJQUlELFVBQVUsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlDQUE2QixDQUFDLE9BQU8sQ0FBMEMsQ0FBQztRQUM3SSxJQUFJLENBQUMsR0FBRyxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQyxDQUFDOztZQUNyRSxPQUFPLEdBQUcsQ0FBQztJQUNwQixDQUFDO0lBSUQsWUFBWSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUN6QyxPQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQWlCLENBQUMsRUFBRSxLQUFLLENBQUM7SUFDNUQsQ0FBQztJQUlELGVBQWUsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDNUMsSUFBQSxjQUFNLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxtREFBbUQsQ0FBQyxDQUFDO1FBQzNFLElBQUksR0FBdUIsQ0FBQztRQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBaUIsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQy9FLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsRUFBRSxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUlELFVBQVUsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlDQUE2QixDQUFDLE9BQU8sQ0FBMEMsQ0FBQztRQUM3SSxJQUFJLENBQUMsR0FBRyxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQyxDQUFDOztZQUNyRSxPQUFPLEdBQUcsQ0FBQztJQUNwQixDQUFDO0lBSUQsZUFBZSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUM1QyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQWlCLENBQUMsRUFBRSxLQUFLLENBQUM7SUFDM0QsQ0FBQztJQUlELGNBQWMsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDM0MsSUFBQSxjQUFNLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxrREFBa0QsQ0FBQyxDQUFDO1FBQzFFLElBQUksR0FBdUIsQ0FBQztRQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBaUIsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQzVFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsRUFBRSxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3hGLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUlELGNBQWMsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlDQUE2QixDQUFDLFdBQVcsQ0FBOEMsQ0FBQztRQUNySixJQUFJLENBQUMsR0FBRyxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQyxDQUFDOztZQUNyRSxPQUFPLEdBQUcsQ0FBQztJQUNwQixDQUFDO0lBSUQsZ0JBQWdCLENBQUMsSUFBWSxFQUFFLFFBQWtCO1FBQzdDLE9BQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBaUIsQ0FBQyxFQUFFLEtBQUssQ0FBQztJQUNoRSxDQUFDO0lBSUQsbUJBQW1CLENBQUMsSUFBWSxFQUFFLFFBQWtCO1FBQ2hELElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsdURBQXVELENBQUMsQ0FBQztRQUMvRSxJQUFJLEdBQXVCLENBQUM7UUFDNUIsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQWlCLENBQUMsRUFBRSxLQUFLLENBQUM7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUMvRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEVBQUUsSUFBSSxRQUFRO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6RixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFJRCxTQUFTLENBQUMsSUFBWSxFQUFFLFFBQWtCO1FBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyx5Q0FBNkIsQ0FBQyxNQUFNLENBQXlDLENBQUM7UUFDM0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxRQUFRO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsSUFBSSxFQUFFLENBQUMsQ0FBQzs7WUFDckUsT0FBTyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQUlELGNBQWMsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDM0MsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFpQixDQUFDLEVBQUUsS0FBSyxDQUFDO0lBQzFELENBQUM7SUFJRCxPQUFPLENBQUMsSUFBWSxFQUFFLFFBQWtCO1FBQ3BDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyx5Q0FBNkIsQ0FBQyxJQUFJLENBQXVDLENBQUM7UUFDdkksSUFBSSxDQUFDLEdBQUcsSUFBSSxRQUFRO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsSUFBSSxFQUFFLENBQUMsQ0FBQzs7WUFDckUsT0FBTyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQUlELFNBQVMsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDdEMsT0FBUSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFpQixDQUFDLEVBQUUsS0FBSyxDQUFDO0lBQ3pELENBQUM7SUFJRCxZQUFZLENBQUMsSUFBWSxFQUFFLFFBQWtCO1FBQ3pDLElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztRQUN4RSxJQUFJLEdBQXVCLENBQUM7UUFDNUIsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQWlCLENBQUMsRUFBRSxLQUFLLENBQUM7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUM1RSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxRQUFRO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN0RixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFJRCxTQUFTLENBQUMsSUFBWSxFQUFFLFFBQWtCO1FBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyx5Q0FBNkIsQ0FBQyxNQUFNLENBQXlDLENBQUM7UUFDM0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxRQUFRO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsSUFBSSxFQUFFLENBQUMsQ0FBQzs7WUFDckUsT0FBTyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQUlELGNBQWMsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDM0MsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFpQixDQUFDLEVBQUUsS0FBSyxDQUFDO0lBQzFELENBQUM7SUFJRCxhQUFhLENBQUMsUUFBa0I7UUFDNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLHlDQUE2QixDQUFDLFdBQVcsSUFBSyxDQUFDLENBQUMsSUFBYyxLQUFLLHlDQUE2QixDQUFDLFdBQVcsQ0FBcUUsQ0FBQztRQUM1TixJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtZQUNmLElBQUksUUFBUTtnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7O2dCQUNoRixPQUFPLFNBQVMsQ0FBQztTQUN6Qjs7WUFBTSxPQUFPLElBQUkseUJBQXlCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUlELE9BQU8sQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlDQUE2QixDQUFDLElBQUksQ0FBdUMsQ0FBQztRQUN2SSxJQUFJLENBQUMsR0FBRyxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQyxDQUFDOztZQUNyRSxPQUFPLEdBQUcsQ0FBQztJQUNwQixDQUFDO0lBSUQsU0FBUyxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUN0QyxPQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQWlCLENBQUMsRUFBRSxLQUFLLENBQUM7SUFDekQsQ0FBQztJQUlELFlBQVksQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDekMsSUFBQSxjQUFNLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxnREFBZ0QsQ0FBQyxDQUFDO1FBQ3hFLElBQUksR0FBdUIsQ0FBQztRQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBaUIsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQzVFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsRUFBRSxJQUFJLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUNKO0FBM01ELDRDQTJNQyJ9