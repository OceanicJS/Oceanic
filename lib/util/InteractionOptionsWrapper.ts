/** @module InteractionOptionsWrapper */
import { WrapperError } from "./Errors";
import { ApplicationCommandOptionTypes, ChannelTypes } from "../Constants";
import type Member from "../structures/Member";
import type Role from "../structures/Role";
import type User from "../structures/User";
import type { AnyImplementedChannel } from "../types/channels";
import type {
    ApplicationCommandInteractionResolvedData,
    AutoCompleteFocusedOption,
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
    InteractionOptionsWithValue,
    SubCommandArray
} from "../types/interactions";
import type Attachment from "../structures/Attachment";
import type InteractionResolvedChannel from "../structures/InteractionResolvedChannel";

/** A wrapper for interaction options. */
export default class InteractionOptionsWrapper {
    /** The raw options from Discord.  */
    raw: Array<InteractionOptions>;
    /** The resolved data for this options instance. */
    resolved: ApplicationCommandInteractionResolvedData | null;
    constructor(data: Array<InteractionOptions>, resolved: ApplicationCommandInteractionResolvedData | null) {
        this.raw = data;
        this.resolved = resolved;
    }

    private _getOption<T extends InteractionOptionsWithValue = InteractionOptionsWithValue>(name: string, required = false, type: ApplicationCommandOptionTypes): T | undefined {
        const opt = this.getOptions().find(o => o.name === name && o.type === type) as T | undefined;
        if (!opt && required) {
            throw new WrapperError(`Missing required option: ${name}`);
        } else {
            return opt;
        }
    }

    /**
     * Get an attachment option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present or the attachment cannot be found.
     */
    getAttachment(name: string, required?: false): Attachment | undefined;
    getAttachment(name: string, required: true): Attachment;
    getAttachment(name: string, required?: boolean): Attachment | undefined {
        if (this.resolved === null) {
            throw new TypeError("Attempt to use getAttachment with null resolved. If this is on an autocomplete interaction, use getAttachmentOption instead.");
        }
        let val: string | undefined;
        if (!(val = this.getAttachmentOption(name, required as false)?.value)) {
            return undefined;
        }
        const a = this.resolved.attachments.get(val);
        if (!a && required) {
            throw new WrapperError(`Attachment not present for required option: ${name}`);
        }
        return a;
    }

    /**
     * Get an attachment option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getAttachmentOption(name: string, required?: false): InteractionOptionsAttachment | undefined;
    getAttachmentOption(name: string, required: true): InteractionOptionsAttachment;
    getAttachmentOption(name: string, required?: boolean): InteractionOptionsAttachment | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.ATTACHMENT);
    }

    /**
     * Get a boolean option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getBoolean(name: string, required?: false): boolean | undefined;
    getBoolean(name: string, required: true): boolean;
    getBoolean(name: string, required?: boolean): boolean | undefined {
        return this.getBooleanOption(name, required as false)?.value;
    }


    /**
     * Get a boolean option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getBooleanOption(name: string, required?: false): InteractionOptionsBoolean | undefined;
    getBooleanOption(name: string, required: true): InteractionOptionsBoolean;
    getBooleanOption(name: string, required?: boolean): InteractionOptionsBoolean | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.BOOLEAN);
    }

    /**
     * Get a channel option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present or the channel cannot be found.
     */
    getChannel(name: string, required?: false): InteractionResolvedChannel | undefined;
    getChannel(name: string, required: true): InteractionResolvedChannel;
    getChannel(name: string, required?: boolean): InteractionResolvedChannel | undefined {
        if (this.resolved === null) {
            throw new TypeError("Attempt to use getChannel with null resolved. If this is on an autocomplete interaction, use getChannelOption instead.");
        }
        let val: string | undefined;
        if (!(val = this.getChannelOption(name, required as false)?.value)) {
            return undefined;
        }
        const ch = this.resolved.channels.get(val);
        if (!ch && required) {
            throw new WrapperError(`Channel not present for required option: ${name}`);
        }
        return ch;
    }

    /**
     * Get a channel option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getChannelOption(name: string, required?: false): InteractionOptionsChannel | undefined;
    getChannelOption(name: string, required: true): InteractionOptionsChannel;
    getChannelOption(name: string, required?: boolean): InteractionOptionsChannel | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.CHANNEL);
    }

    /**
     * Get a channel option's complete channel. This will only succeed if the channel is cached. If the channel is private and isn't cached, an `InteractionResolvedChannel` instance will still be returned.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present or the channel cannot be found.
     */
    getCompleteChannel<T extends AnyImplementedChannel | InteractionResolvedChannel = AnyImplementedChannel | InteractionResolvedChannel>(name: string, required?: false): T | undefined;
    getCompleteChannel<T extends AnyImplementedChannel | InteractionResolvedChannel = AnyImplementedChannel | InteractionResolvedChannel>(name: string, required: true): T;
    getCompleteChannel(name: string, required?: boolean): AnyImplementedChannel | InteractionResolvedChannel | undefined {
        const resolved = this.getChannel(name, required as false);
        if (!resolved) {
            return undefined; // required will be handled in getChannel
        }
        const channel = resolved.completeChannel ?? (resolved.type === ChannelTypes.DM ? resolved : undefined);
        if (!channel && required) {
            throw new WrapperError(`Failed to resolve complete channel for required option: ${name}`);
        }
        return channel;
    }

    /**
     * Get the focused option (in an autocomplete interaction).
     * @param required If true, an error will be thrown if no focused option is present.
     */
    getFocused<T extends AutoCompleteFocusedOption = AutoCompleteFocusedOption>(required?: false): T | undefined;
    getFocused<T extends AutoCompleteFocusedOption = AutoCompleteFocusedOption>(required: true): T;
    getFocused<T extends AutoCompleteFocusedOption = AutoCompleteFocusedOption>(required?: boolean): T | undefined {
        const opt = this.getOptions().find(o => o.focused === true) as T | undefined;
        if (!opt && required) {
            throw new WrapperError("Missing required focused option");
        } else {
            return opt;
        }
    }

    /**
     * Get an integer option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getInteger(name: string, required?: false): number | undefined;
    getInteger(name: string, required: true): number;
    getInteger(name: string, required?: boolean): number | undefined {
        return this.getIntegerOption(name, required as false)?.value;
    }

    /**
     * Get an integer option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getIntegerOption(name: string, required?: false): InteractionOptionsInteger | undefined;
    getIntegerOption(name: string, required: true): InteractionOptionsInteger;
    getIntegerOption(name: string, required?: boolean): InteractionOptionsInteger | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.INTEGER);
    }

    /**
     * Get a user option value (as a member).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the member cannot be found.
     */
    getMember(name: string, required?: false): Member | undefined;
    getMember(name: string, required: true): Member;
    getMember(name: string, required?: boolean): Member | undefined {
        if (this.resolved === null) {
            throw new TypeError("Attempt to use getMember with null resolved. If this is on an autocomplete interaction, use getUserOption instead.");
        }
        let val: string | undefined;
        if (!(val = this.getUserOption(name, required as false)?.value)) {
            return undefined;
        }
        const ch = this.resolved.members.get(val);
        if (!ch && required) {
            throw new WrapperError(`Member not present for required option: ${name}`);
        }
        return ch;
    }

    /**
     * Get a mentionable option value (user, role).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the value cannot be found.
     */
    getMentionable<T extends User | Role = User | Role>(name: string, required?: false): T | undefined;
    getMentionable<T extends User | Role = User | Role>(name: string, required: true): T;
    getMentionable(name: string, required?: boolean): InteractionResolvedChannel | User | Role | undefined {
        if (this.resolved === null) {
            throw new TypeError("Attempt to use getMentionable with null resolved. If this is on an autocomplete interaction, use getAttachmentOption instead.");
        }
        let val: string | undefined;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        if (!(val = (this._getOption(name, required as false, ApplicationCommandOptionTypes.MENTIONABLE) as InteractionOptionsMentionable | undefined)?.value)) {
            return undefined;
        }
        const role = this.resolved.roles.get(val);
        const user = this.resolved.users.get(val);
        if ((!role && !user) && required) {
            throw new WrapperError(`Value not present for required option: ${name}`);
        }
		
				if (role) {
						return role;
				} else if (user) {
						return user;
				} else {
						return undefined;
				}
    }

    /**
     * Get a mentionable option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getMentionableOption(name: string, required?: false): InteractionOptionsMentionable | undefined;
    getMentionableOption(name: string, required: true): InteractionOptionsMentionable;
    getMentionableOption(name: string, required?: boolean): InteractionOptionsMentionable | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.MENTIONABLE);
    }

    /**
     * Get a number option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getNumber(name: string, required?: false): number | undefined;
    getNumber(name: string, required: true): number;
    getNumber(name: string, required?: boolean): number | undefined {
        return this.getNumberOption(name, required as false)?.value;
    }

    /**
     * Get a number option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getNumberOption(name: string, required?: false): InteractionOptionsNumber | undefined;
    getNumberOption(name: string, required: true): InteractionOptionsNumber;
    getNumberOption(name: string, required?: boolean): InteractionOptionsNumber | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.NUMBER);
    }

    /** Get the options received in this interaction, excluding subcommands and subcommand groups. */
    getOptions(): Array<InteractionOptionsWithValue> {
        let baseOptions: Array<InteractionOptionsWithValue> | undefined;
        const sub = this.getSubCommand(false) ?? [];
        switch (sub.length) {
            case 0: {
                baseOptions = this.raw as Array<InteractionOptionsWithValue>;
                break;
            }
            case 1: {
                baseOptions = (this.raw.find(o => o.name === sub[0] && o.type === ApplicationCommandOptionTypes.SUB_COMMAND) as InteractionOptionsSubCommand | undefined)?.options;
                break;
            }
            case 2: {
                baseOptions = ((this.raw.find(o => o.name === sub[0] && o.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP) as InteractionOptionsSubCommandGroup | undefined)?.options?.find(o2 => o2.name === sub[1] && o2.type === ApplicationCommandOptionTypes.SUB_COMMAND) as InteractionOptionsSubCommand | undefined)?.options;
                break;
            }
        }
        return baseOptions ?? [];
    }

    /**
     * Get a role option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the role cannot be found.
     */
    getRole(name: string, required?: false): Role | undefined;
    getRole(name: string, required: true): Role;
    getRole(name: string, required?: boolean): Role | undefined {
        if (this.resolved === null) {
            throw new TypeError("Attempt to use getRole with null resolved. If this is on an autocomplete interaction, use getRoleOption instead.");
        }
        let val: string | undefined;
        if (!(val = this.getRoleOption(name, required as false)?.value)) {
            return undefined;
        }
        const ch = this.resolved.roles.get(val);
        if (!ch && required) {
            throw new WrapperError(`Role not present for required option: ${name}`);
        }
        return ch;
    }

    /**
     * Get a role option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getRoleOption(name: string, required?: false): InteractionOptionsRole | undefined;
    getRoleOption(name: string, required: true): InteractionOptionsRole;
    getRoleOption(name: string, required?: boolean): InteractionOptionsRole | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.ROLE);
    }

    /**
     * Get a string option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getString<T extends string = string>(name: string, required?: false): T | undefined;
    getString<T extends string = string>(name: string, required: true): T;
    getString(name: string, required?: boolean): string | undefined {
        return this.getStringOption(name, required as false)?.value;
    }

    /**
     * Get a string option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getStringOption(name: string, required?: false): InteractionOptionsString | undefined;
    getStringOption(name: string, required: true): InteractionOptionsString;
    getStringOption(name: string, required?: boolean): InteractionOptionsString | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.STRING);
    }

    /**
     * If present, returns the top level subcommand. This will return an array of the subcommand name, and subcommand group name, if applicable.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getSubCommand<T extends SubCommandArray = SubCommandArray>(required?: false): T | undefined;
    getSubCommand<T extends SubCommandArray = SubCommandArray>(required: true): T;
    getSubCommand(required?: boolean): SubCommandArray | undefined {
        const opt = this.raw.find(o => o.type === ApplicationCommandOptionTypes.SUB_COMMAND || o.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP) as InteractionOptionsSubCommand | InteractionOptionsSubCommandGroup;
        if (opt?.options) {
        // nested
            if (opt.options.length === 1 && opt.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP) {
                const sub = opt.options.find(o => o.type === ApplicationCommandOptionTypes.SUB_COMMAND) as InteractionOptionsSubCommand | undefined;
                return sub?.options ? [opt.name, sub.name] : [opt.name];
            } else {
                return [opt.name];
            }
        } else {
            if (required) {
                throw new WrapperError("Missing required option: SubCommand/SubCommandGroup.");
            } else {
                return undefined;
            }
        }
    }

    /**
     * Get a user option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the user cannot be found.
     */
    getUser(name: string, required?: false): User | undefined;
    getUser(name: string, required: true): User;
    getUser(name: string, required?: boolean): User | undefined {
        if (this.resolved === null) {
            throw new TypeError("Attempt to use getUser with null resolved. If this is on an autocomplete interaction, use getUseOption instead.");
        }
        let val: string | undefined;
        if (!(val = this.getUserOption(name, required as false)?.value)) {
            return undefined;
        }
        const ch = this.resolved.users.get(val);
        if (!ch && required) {
            throw new WrapperError(`User not present for required option: ${name}`);
        }
        return ch;
    }

    /**
     * Get a user option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getUserOption(name: string, required?: false): InteractionOptionsUser | undefined;
    getUserOption(name: string, required: true): InteractionOptionsUser;
    getUserOption(name: string, required?: boolean): InteractionOptionsUser | undefined {
        return this._getOption(name, required, ApplicationCommandOptionTypes.USER);
    }
}
