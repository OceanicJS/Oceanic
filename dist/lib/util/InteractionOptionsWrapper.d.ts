import type Member from "../structures/Member";
import type Role from "../structures/Role";
import type User from "../structures/User";
import type { AnyChannel, ApplicationCommandInteractionResolvedData, InteractionOptions, InteractionOptionsAttachment, InteractionOptionsBoolean, InteractionOptionsChannel, InteractionOptionsInteger, InteractionOptionsMentionable, InteractionOptionsNumber, InteractionOptionsRole, InteractionOptionsString, InteractionOptionsUser } from "../types";
import type Attachment from "../structures/Attachment";
/** A wrapper for interaction options. */
export default class InteractionOptionsWrapper {
    /** The raw options from Discord.  */
    raw: Array<InteractionOptions>;
    /** Then resolved data for this options instance. */
    resolved: ApplicationCommandInteractionResolvedData | null;
    constructor(data: Array<InteractionOptions>, resolved: ApplicationCommandInteractionResolvedData | null);
    private _getOption;
    /**
     * Get an attachment option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getAttachment(name: string, required?: false): InteractionOptionsAttachment | undefined;
    getAttachment(name: string, required: true): InteractionOptionsAttachment;
    /**
     * Get an attachment option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present or the attachment cannot be found.
     */
    getAttachmentValue(name: string, required?: false): Attachment | undefined;
    getAttachmentValue(name: string, required: true): Attachment;
    /**
     * Get a boolean option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getBoolean(name: string, required?: false): InteractionOptionsBoolean | undefined;
    getBoolean(name: string, required: true): InteractionOptionsBoolean;
    /**
     * Get a boolean option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getBooleanValue(name: string, required?: false): boolean | undefined;
    getBooleanValue(name: string, required: true): boolean;
    /**
     * Get a channel option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getChannel(name: string, required?: false): InteractionOptionsChannel | undefined;
    getChannel(name: string, required: true): InteractionOptionsChannel;
    /**
     * Get a channel option value (id).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getChannelID(name: string, required?: false): string | undefined;
    getChannelID(name: string, required: true): string;
    /**
     * Get a channel option value (channel).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present or the channel cannot be found.
     */
    getChannelValue<T extends AnyChannel = AnyChannel>(name: string, required?: false): T | undefined;
    getChannelValue<T extends AnyChannel = AnyChannel>(name: string, required: true): T;
    /**
     * Get an integer option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getInteger(name: string, required?: false): InteractionOptionsInteger | undefined;
    getInteger(name: string, required: true): InteractionOptionsInteger;
    /**
     * Get an integer option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getIntegerValue(name: string, required?: false): number | undefined;
    getIntegerValue(name: string, required: true): number;
    /**
     * Get a user option value (member).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the member cannot be found.
     */
    getMemberValue(name: string, required?: false): Member | undefined;
    getMemberValue(name: string, required: true): Member;
    /**
     * Get a mentionable option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getMentionable(name: string, required?: false): InteractionOptionsMentionable | undefined;
    getMentionable(name: string, required: true): InteractionOptionsMentionable;
    /**
     * Get a mentionable option (id).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getMentionableID(name: string, required?: false): string | undefined;
    getMentionableID(name: string, required: true): string;
    /**
     * Get a mentionable option (channel, user, role).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the value cannot be found.
     */
    getMentionableValue<T extends AnyChannel | User | Role = AnyChannel | User | Role>(name: string, required?: false): T | undefined;
    getMentionableValue<T extends AnyChannel | User | Role = AnyChannel | User | Role>(name: string, required: true): T;
    /**
     * Get a number option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getNumber(name: string, required?: false): InteractionOptionsNumber | undefined;
    getNumber(name: string, required: true): InteractionOptionsNumber;
    /**
     * Get a number option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getNumberValue(name: string, required?: false): number | undefined;
    getNumberValue(name: string, required: true): number;
    /**
     * Get a role option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getRole(name: string, required?: false): InteractionOptionsRole | undefined;
    getRole(name: string, required: true): InteractionOptionsRole;
    /**
     * Get a role option value (id).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getRoleID(name: string, required?: false): string | undefined;
    getRoleID(name: string, required: true): string;
    /**
     * Get a role option value (role).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the role cannot be found.
     */
    getRoleValue(name: string, required?: false): Role | undefined;
    getRoleValue(name: string, required: true): Role;
    /**
     * Get a string option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getString(name: string, required?: false): InteractionOptionsString | undefined;
    getString(name: string, required: true): InteractionOptionsString;
    /**
     * Get a string option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getStringValue<T extends string = string>(name: string, required?: false): T | undefined;
    getStringValue<T extends string = string>(name: string, required: true): T;
    /**
     * If present, returns the top level subcommand. This only goes one level deep, to get the subcommand of a subcommandgroup, you must call this twice in a ro.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getSubCommand(required?: false): [subcommand: string] | [subcommandGroup: string, subcommand: string] | undefined;
    getSubCommand(required: true): [subcommand: string] | [subcommandGroup: string, subcommand: string];
    /**
     * Get a user option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getUser(name: string, required?: false): InteractionOptionsUser | undefined;
    getUser(name: string, required: true): InteractionOptionsUser;
    /**
     * Get a user option value (id).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getUserID(name: string, required?: false): string | undefined;
    getUserID(name: string, required: true): string;
    /**
     * Get a user option value (user).
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present, or if the user cannot be found.
     */
    getUserValue(name: string, required?: false): User | undefined;
    getUserValue(name: string, required: true): User;
}
