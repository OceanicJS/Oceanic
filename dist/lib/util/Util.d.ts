/// <reference types="node" />
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import type { AllowedMentions, ApplicationCommandOptions, MessageActionRow, ModalActionRow, RawAllowedMentions, RawApplicationCommandOption, RawMember, RawMessageActionRow, RawModalActionRow } from "../types";
import Member from "../structures/Member";
/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
export default class Util {
    static BASE64URL_REGEX: RegExp;
    private _client;
    constructor(client: Client);
    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image: Buffer | string, name: string): string;
    assert(condition: unknown, message?: string): asserts condition;
    componentsToParsed<T extends RawModalActionRow | RawMessageActionRow>(components: Array<T>): T extends RawModalActionRow ? Array<ModalActionRow> : T extends RawMessageActionRow ? Array<MessageActionRow> : never;
    componentsToRaw<T extends ModalActionRow | MessageActionRow>(components: Array<T>): T extends ModalActionRow ? Array<RawModalActionRow> : T extends MessageActionRow ? Array<RawMessageActionRow> : never;
    convertImage(img: Buffer | string): string;
    formatAllowedMentions(allowed?: AllowedMentions): RawAllowedMentions;
    formatImage(url: string, format?: ImageFormat, size?: number): string;
    is<T>(input: unknown): input is T;
    optionToParsed(option: RawApplicationCommandOption): ApplicationCommandOptions;
    optionToRaw(option: ApplicationCommandOptions): RawApplicationCommandOption;
    updateMember(guildID: string, memberID: string, member: RawMember): Member;
}
