import { ApplicationCommandOptionTypes } from "../Constants";
import type Member from "../structures/Member";
import type Role from "../structures/Role";
import type User from "../structures/User";
import type {
    AnyChannel,
    ApplicationCommandInteractionResolvedData,
    InteractionOptions,
    InteractionOptionsAttachment,
    InteractionOptionsBoolean,
    InteractionOptionsChannel,
    InteractionOptionsInteger,
    InteractionOptionsMentionable,
    InteractionOptionsNumber,
    InteractionOptionsRole,
    InteractionOptionsString,
    InteractionOptionsSubCommand,
    InteractionOptionsSubCommandGroup,
    InteractionOptionsUser
} from "../types";
import type Attachment from "../structures/Attachment";
import { assert } from "tsafe";

export default class InteractionOptionsWrapper {
    private resolved: ApplicationCommandInteractionResolvedData | null;
    raw: Array<InteractionOptions>;
    constructor(data: Array<InteractionOptions>, resolved: ApplicationCommandInteractionResolvedData | null) {
        this.raw = data;
        this.resolved = resolved;
    }

    getAttachment(name: string, required?: false): InteractionOptionsAttachment | undefined;
    getAttachment(name: string, required: true): InteractionOptionsAttachment;
    getAttachment(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.ATTACHMENT) as InteractionOptionsAttachment | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getAttachmentValue(name: string, required?: false): Attachment | undefined;
    getAttachmentValue(name: string, required: true): Attachment;
    getAttachmentValue(name: string, required?: boolean) {
        assert(this.resolved, "attempt to use getAttachmentValue with null resolved");
        let val: string | undefined;
        if (!(val = this.getAttachment(name, required as false)?.value)) return undefined;
        const a = this.resolved.attachments.get(val);
        if (!a && required) throw new Error(`attachment not present for required option: ${name}`);
        return a;
    }

    getBoolean(name: string, required?: false): InteractionOptionsBoolean | undefined;
    getBoolean(name: string, required: true): InteractionOptionsBoolean;
    getBoolean(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.BOOLEAN) as InteractionOptionsBoolean | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getBooleanValue(name: string, required?: false): boolean | undefined;
    getBooleanValue(name: string, required: true): boolean;
    getBooleanValue(name: string, required?: boolean) {
        return this.getBoolean(name, required as false)?.value;
    }

    getChannel(name: string, required?: false): InteractionOptionsChannel | undefined;
    getChannel(name: string, required: true): InteractionOptionsChannel;
    getChannel(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.CHANNEL) as InteractionOptionsChannel | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getChannelID(name: string, required?: false): string | undefined;
    getChannelID(name: string, required: true): string;
    getChannelID(name: string, required?: boolean) {
        return  this.getChannel(name, required as false)?.value;
    }

    getChannelValue<T extends AnyChannel = AnyChannel>(name: string, required?: false): T | undefined;
    getChannelValue<T extends AnyChannel = AnyChannel>(name: string, required: true): T;
    getChannelValue(name: string, required?: boolean) {
        assert(this.resolved, "attempt to use getChannelValue with null resolved");
        let val: string | undefined;
        if (!(val = this.getChannel(name, required as false)?.value)) return undefined;
        const ch = this.resolved.channels.get(val);
        if (!ch && required) throw new Error(`channel not present for required option: ${name}`);
        return ch;
    }

    getDeepSubCommand(name1: string, name2: string, required?: false): InteractionOptionsWrapper | undefined;
    getDeepSubCommand(name1: string, name2: string, required: true): InteractionOptionsWrapper;
    getDeepSubCommand(name1: string, name2: string, required?: boolean) {
        return this.getSubCommandGroup(name1, required as false)?.getSubCommand(name2, required as false);
    }

    getInteger(name: string, required?: false): InteractionOptionsInteger | undefined;
    getInteger(name: string, required: true): InteractionOptionsInteger;
    getInteger(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.INTEGER) as InteractionOptionsInteger | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getIntegerValue(name: string, required?: false): number | undefined;
    getIntegerValue(name: string, required: true): number;
    getIntegerValue(name: string, required?: boolean) {
        return this.getInteger(name, required as false)?.value;
    }

    getMemberValue(name: string, required?: false): Member | undefined;
    getMemberValue(name: string, required: true): Member;
    getMemberValue(name: string, required?: boolean) {
        assert(this.resolved, "attempt to use getMemberValue with null resolved");
        let val: string | undefined;
        if (!(val = this.getUser(name, required as false)?.value)) return undefined;
        const ch = this.resolved.members.get(val);
        if (!ch && required) throw new Error(`member not present for required option: ${name}`);
        return ch;
    }

    getMentionable(name: string, required?: false): InteractionOptionsMentionable | undefined;
    getMentionable(name: string, required: true): InteractionOptionsMentionable;
    getMentionable(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.MENTIONABLE) as InteractionOptionsMentionable | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getMentionableID(name: string, required?: false): string | undefined;
    getMentionableID(name: string, required: true): string;
    getMentionableID(name: string, required?: boolean) {
        return  this.getMentionable(name, required as false)?.value;
    }

    getMentionableValue<T extends AnyChannel | User | Role = AnyChannel | User | Role>(name: string, required?: false): T | undefined;
    getMentionableValue<T extends AnyChannel | User | Role = AnyChannel | User | Role>(name: string, required: true): T;
    getMentionableValue(name: string, required?: boolean) {
        assert(this.resolved, "attempt to use getMentionableValue with null resolved");
        let val: string | undefined;
        if (!(val = this.getChannel(name, required as false)?.value)) return undefined;
        const ch = this.resolved.channels.get(val);
        if (!ch && required) throw new Error(`channel not present for required option: ${name}`);
        return ch;
    }

    getNumber(name: string, required?: false): InteractionOptionsNumber | undefined;
    getNumber(name: string, required: true): InteractionOptionsNumber;
    getNumber(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.NUMBER) as InteractionOptionsNumber | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getNumberValue(name: string, required?: false): number | undefined;
    getNumberValue(name: string, required: true): number;
    getNumberValue(name: string, required?: boolean) {
        return this.getNumber(name, required as false)?.value;
    }

    getRole(name: string, required?: false): InteractionOptionsRole | undefined;
    getRole(name: string, required: true): InteractionOptionsRole;
    getRole(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.ROLE) as InteractionOptionsRole | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getRoleID(name: string, required?: false): string | undefined;
    getRoleID(name: string, required: true): string;
    getRoleID(name: string, required?: boolean) {
        return  this.getRole(name, required as false)?.value;
    }

    getRoleValue(name: string, required?: false): Role | undefined;
    getRoleValue(name: string, required: true): Role;
    getRoleValue(name: string, required?: boolean) {
        assert(this.resolved, "attempt to use getRoleValue with null resolved");
        let val: string | undefined;
        if (!(val = this.getRole(name, required as false)?.value)) return undefined;
        const ch = this.resolved.roles.get(val);
        if (!ch && required) throw new Error(`role not present for required option: ${name}`);
        return ch;
    }

    getString(name: string, required?: false): InteractionOptionsString | undefined;
    getString(name: string, required: true): InteractionOptionsString;
    getString(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.STRING) as InteractionOptionsString | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getStringValue<T extends string = string>(name: string, required?: false): T | undefined;
    getStringValue<T extends string = string>(name: string, required: true): T;
    getStringValue(name: string, required?: boolean) {
        return this.getString(name, required as false)?.value;
    }

    getSubCommand(name: string, required?: false): InteractionOptionsWrapper | undefined;
    getSubCommand(name: string, required: true): InteractionOptionsWrapper;
    getSubCommand(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.SUB_COMMAND) as InteractionOptionsSubCommand;
        if (!opt?.options) {
            if (required) throw new Error(`Missing required option: ${name}`);
            else return undefined;
        } else return new InteractionOptionsWrapper(opt.options, this.resolved);
    }

    getSubCommandGroup(name: string, required?: false): InteractionOptionsWrapper | undefined;
    getSubCommandGroup(name: string, required: true): InteractionOptionsWrapper;
    getSubCommandGroup(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP) as InteractionOptionsSubCommandGroup;
        if (!opt?.options) {
            if (required) throw new Error(`Missing required option: ${name}`);
            else return undefined;
        } else return new InteractionOptionsWrapper(opt.options, this.resolved);
    }

    getUser(name: string, required?: false): InteractionOptionsUser | undefined;
    getUser(name: string, required: true): InteractionOptionsUser;
    getUser(name: string, required?: boolean) {
        const opt = this.raw.find(o => o.name === name && o.type === ApplicationCommandOptionTypes.USER) as InteractionOptionsUser | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    getUserID(name: string, required?: false): string | undefined;
    getUserID(name: string, required: true): string;
    getUserID(name: string, required?: boolean) {
        return  this.getUser(name, required as false)?.value;
    }

    getUserValue(name: string, required?: false): User | undefined;
    getUserValue(name: string, required: true): User;
    getUserValue(name: string, required?: boolean) {
        assert(this.resolved, "attempt to use getUserValue with null resolved");
        let val: string | undefined;
        if (!(val = this.getUser(name, required as false)?.value)) return undefined;
        const ch = this.resolved.users.get(val);
        if (!ch && required) throw new Error(`user not present for required option: ${name}`);
        return ch;
    }

    pickSubCommand<T extends string>(names: Array<T> | ReadonlyArray<T>, def?: T) {
        for (const name of names) if (this.getSubCommand(name)) return name;
        return def || names[0];
    }
}
