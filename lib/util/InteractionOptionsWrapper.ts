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
    InteractionOptionsUser,
    InteractionOptionsWithValue
} from "../types";
import type Attachment from "../structures/Attachment";
import { assert } from "tsafe";

/** A wrapper for interaction options. */
export default class InteractionOptionsWrapper {
    private resolved: ApplicationCommandInteractionResolvedData | null;
    /** The raw options from Discord.  */
    raw: Array<InteractionOptions>;
    constructor(data: Array<InteractionOptions>, resolved: ApplicationCommandInteractionResolvedData | null) {
        this.raw = data;
        this.resolved = resolved;
    }

    private _getOption<T extends InteractionOptionsWithValue = InteractionOptionsWithValue>(name: string, required = false, type: ApplicationCommandOptionTypes) {
        let baseOptions: Array<InteractionOptionsWithValue> | undefined;
        const sub = this.getSubCommand(false);
        if (sub?.length === 1) baseOptions = (this.raw.find(o => o.name === sub[0] && o.type === ApplicationCommandOptionTypes.SUB_COMMAND) as InteractionOptionsSubCommand | undefined)?.options;
        else if (sub?.length === 2) baseOptions = ((this.raw.find(o => o.name === sub[0] && o.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP) as InteractionOptionsSubCommandGroup | undefined)?.options?.find(o2 => o2.name === sub[1] && o2.type === ApplicationCommandOptionTypes.SUB_COMMAND) as InteractionOptionsSubCommand | undefined)?.options;
        const opt = (baseOptions || this.raw).find(o => o.name === name && o.type === type) as T | undefined;
        if (!opt && required) throw new Error(`Missing required option: ${name}`);
        else return opt;
    }

    /**
     * Get an attachment option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getAttachment(name: string, required?: false): InteractionOptionsAttachment | undefined;
    getAttachment(name: string, required: true): InteractionOptionsAttachment;
    getAttachment(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.ATTACHMENT);
    }


    /**
     * Get an attachment option value.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present or the attachment cannot be found.
     */
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


    /**
     * Get a boolean option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getBoolean(name: string, required?: false): InteractionOptionsBoolean | undefined;
    getBoolean(name: string, required: true): InteractionOptionsBoolean;
    getBoolean(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.BOOLEAN);
    }

    /**
     * Get a boolean option value.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getBooleanValue(name: string, required?: false): boolean | undefined;
    getBooleanValue(name: string, required: true): boolean;
    getBooleanValue(name: string, required?: boolean) {
        return this.getBoolean(name, required as false)?.value;
    }

    /**
     * Get a channel option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getChannel(name: string, required?: false): InteractionOptionsChannel | undefined;
    getChannel(name: string, required: true): InteractionOptionsChannel;
    getChannel(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.CHANNEL);
    }

    /**
     * Get a channel option value (id).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getChannelID(name: string, required?: false): string | undefined;
    getChannelID(name: string, required: true): string;
    getChannelID(name: string, required?: boolean) {
        return  this.getChannel(name, required as false)?.value;
    }

    /**
     * Get a channel option value (channel).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present or the channel cannot be found.
     */
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

    /**
     * Get an integer option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getInteger(name: string, required?: false): InteractionOptionsInteger | undefined;
    getInteger(name: string, required: true): InteractionOptionsInteger;
    getInteger(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.INTEGER);
    }

    /**
     * Get an integer option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getIntegerValue(name: string, required?: false): number | undefined;
    getIntegerValue(name: string, required: true): number;
    getIntegerValue(name: string, required?: boolean) {
        return this.getInteger(name, required as false)?.value;
    }

    /**
     * Get a user option value (member).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present, or if the member cannot be found.
     */
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

    /**
     * Get a mentionable option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getMentionable(name: string, required?: false): InteractionOptionsMentionable | undefined;
    getMentionable(name: string, required: true): InteractionOptionsMentionable;
    getMentionable(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.MENTIONABLE);
    }

    /**
     * Get a mentionable option (id).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getMentionableID(name: string, required?: false): string | undefined;
    getMentionableID(name: string, required: true): string;
    getMentionableID(name: string, required?: boolean) {
        return  this.getMentionable(name, required as false)?.value;
    }

    /**
     * Get a mentionable option (channel, user, role).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present, or if the value cannot be found.
     */
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

    /**
     * Get a number option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getNumber(name: string, required?: false): InteractionOptionsNumber | undefined;
    getNumber(name: string, required: true): InteractionOptionsNumber;
    getNumber(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.NUMBER);
    }

    /**
     * Get a number option value.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getNumberValue(name: string, required?: false): number | undefined;
    getNumberValue(name: string, required: true): number;
    getNumberValue(name: string, required?: boolean) {
        return this.getNumber(name, required as false)?.value;
    }

    /**
     * Get a role option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getRole(name: string, required?: false): InteractionOptionsRole | undefined;
    getRole(name: string, required: true): InteractionOptionsRole;
    getRole(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.ROLE);
    }

    /**
     * Get a role option value (id).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getRoleID(name: string, required?: false): string | undefined;
    getRoleID(name: string, required: true): string;
    getRoleID(name: string, required?: boolean) {
        return  this.getRole(name, required as false)?.value;
    }

    /**
     * Get a role option value (role).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present, or if the role cannot be found.
     */
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

    /**
     * Get a string option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getString(name: string, required?: false): InteractionOptionsString | undefined;
    getString(name: string, required: true): InteractionOptionsString;
    getString(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.STRING);
    }

    /**
     * Get a string option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getStringValue<T extends string = string>(name: string, required?: false): T | undefined;
    getStringValue<T extends string = string>(name: string, required: true): T;
    getStringValue(name: string, required?: boolean) {
        return this.getString(name, required as false)?.value;
    }

    /**
     * If present, returns the top level subcommand. This only goes one level deep, to get the subcommand of a subcommandgroup, you must call this twice in a ro.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getSubCommand(required?: false): [subcommand: string] | [subcommandGroup: string, subcommand: string] | undefined;
    getSubCommand(required: true): [subcommand: string] | [subcommandGroup: string, subcommand: string];
    getSubCommand(required?: boolean) {
        const opt = this.raw.find(o => o.type === ApplicationCommandOptionTypes.SUB_COMMAND || o.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP) as InteractionOptionsSubCommand | InteractionOptionsSubCommandGroup;
        if (!opt?.options) {
            if (required) throw new Error("Missing required option: subcommand/subcommandgroup");
            else return undefined;
        } else {
            // nested
            if (opt.options.length === 1 && opt.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP) {
                const sub = opt.options.find(o => o.type === ApplicationCommandOptionTypes.SUB_COMMAND) as InteractionOptionsSubCommand | undefined;
                if (!sub?.options) return [opt.name];
                else return [opt.name, sub.name];
            } else return [opt.name];
        }
    }

    /**
     * Get a user option.
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getUser(name: string, required?: false): InteractionOptionsUser | undefined;
    getUser(name: string, required: true): InteractionOptionsUser;
    getUser(name: string, required?: boolean) {
        return this._getOption(name, required, ApplicationCommandOptionTypes.USER);
    }

    /**
     * Get a user option value (id).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present.
     */
    getUserID(name: string, required?: false): string | undefined;
    getUserID(name: string, required: true): string;
    getUserID(name: string, required?: boolean) {
        return  this.getUser(name, required as false)?.value;
    }

    /**
     * Get a user option value (user).
     *
     * @param {String} name - The name of the option.
     * @param {Boolean} [required=false] - If true, an error will be thrown if the option is not present, or if the user cannot be found.
     */
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
}
