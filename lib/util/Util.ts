/** @module Util */
import { CDN_URL } from "./Routes";
import { FrozenModificationError } from "./Errors";
import { fromRaw as messageComponentsFromRaw, toRaw as messageComponentsToRaw } from "./parsing/message-components";
import { fromRaw as modalSubmitComponentsFromRaw, toRaw as modalSubmitComponentsToRaw } from "./parsing/modal-components";
import { fromRaw as embedFromRaw, toRaw as embedToRaw } from "./parsing/embeds";
import { fromRaw as applicationCommandOptionFromRaw, toRaw as applicationCommandOptionToRaw } from "./parsing/application-command-options";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import {
    ImageFormats,
    MEDIA_PROXY_SIZES,
    type ImageFormat,
    ThreadChannelTypes,
    ChannelTypes,
    Intents,
    PrivilegedIntentMapping,
    type ApplicationFlags,
    type PrivilegedIntentNames
} from "../Constants";
import Member from "../structures/Member";
import Channel from "../structures/Channel";
import Message from "../structures/Message";
import Entitlement from "../structures/Entitlement";
import TestEntitlement from "../structures/TestEntitlement";
import type Poll from "../structures/Poll";
import Subscription from "../structures/Subscription";
import { types } from "node:util";

/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
export default class Util {
    private _client: Client;

    constructor(client: Client) {
        this._client = client;
    }

    static rawEmbeds(embeds: Types.Channels.RawEmbed): Types.Channels.Embed;
    static rawEmbeds(embeds: Array<Types.Channels.RawEmbed>): Array<Types.Channels.Embed>;
    static rawEmbeds(embeds: Types.Channels.RawEmbed | Array<Types.Channels.RawEmbed>): Types.Channels.Embed | Array<Types.Channels.Embed> {
        const data = Util.prototype.embedsToParsed(Array.isArray(embeds) ? embeds : [embeds]);
        return Array.isArray(embeds) ? data : data[0];
    }

    static rawMessageComponents(components: Types.Channels.RawMessageComponent): Types.Channels.MessageComponent;
    static rawMessageComponents(components: Array<Types.Channels.RawMessageComponent>): Array<Types.Channels.MessageComponent>;
    static rawMessageComponents(components: Types.Channels.RawMessageComponent | Array<Types.Channels.RawMessageComponent>): Types.Channels.MessageComponent | Array<Types.Channels.MessageComponent> {
        const data = Util.prototype.componentsToParsed(Array.isArray(components) ? components : [components]);
        return Array.isArray(components) ? data : data[0];
    }

    static rawModalComponents(components: Types.Channels.RawModalComponent): Types.Channels.ModalComponent;
    static rawModalComponents(components: Array<Types.Channels.RawModalComponent>): Array<Types.Channels.ModalComponent>;
    static rawModalComponents(components: Types.Channels.RawModalComponent | Array<Types.Channels.RawModalComponent>): Types.Channels.ModalComponent | Array<Types.Channels.ModalComponent> {
        const data = Util.prototype.componentsToParsed(Array.isArray(components) ? components : [components]);
        return Array.isArray(components) ? data : data[0];
    }

    /** @hidden intentionally not documented - this is an internal function */
    _arrayToCSV(data: Array<string>, header?: string): Buffer {
        return Buffer.from([header, ...data].filter(Boolean).join("\n"), "utf8");
    }

    /** @hidden intentionally not documented - this is an internal function */
    _arrayToCSVFile(data: Array<string>, name: string, header?: string): Types.RequestHandler.File {
        return {
            name:     `${name}.csv`,
            field:    name,
            contents: this._arrayToCSV(data, header),
            index:    undefined
        } satisfies Types.Shared.KeysExist<Types.RequestHandler.File>;
    }

    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image: Buffer | string, name: string): string {
        try {
            return this.convertImage(image);
        } catch (err) {
            throw new TypeError(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err as Error });
        }
    }

    /** @hidden intended for internal use only */
    _convertSound(sound: Buffer | string, name: string): string {
        try {
            return this.convertSound(sound);
        } catch (err) {
            throw new TypeError(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err as Error });
        }
    }

    /** @internal */
    _freeze<T>(obj: T, detail?: string): T {
        let message = "This is an error in the library and should be reported.";
        if (detail) {
            message += `Detail: ${detail}`;
        }
        if (typeof obj !== "object" || obj === null || types.isProxy(obj)) {
            return obj;
        }
        return new Proxy(obj, {
            set: (target, prop, value, receiver): boolean => {
                this._client.emit("error", new FrozenModificationError(message, prop));
                return Reflect.set(target, prop, value, receiver);
            }
        });
    }

    /** @hidden intended for internal use only */
    _getLimit(name: Exclude<keyof Types.Client.CollectionLimitsOptions, "users">, id?: string): number {
        const opt = this._client.options.collectionLimits[name];
        if (typeof opt === "number") {
            return opt;
        }
        return (id === undefined ? undefined : opt[id]) ?? opt.default ?? Infinity;
    }

    /** @hidden intended for internal use only */
    _isModuleInstalled(name: string): boolean {
        try {
            // eslint-disable-next-line unicorn/prefer-module
            require(name);
            return true;
        } catch {
            return false;
        }
    }

    _setLimit(values?: Record<string, number> | number, defaultValue = Infinity): Record<string, number> | number {
        if (values === undefined) {
            return defaultValue;
        }

        if (typeof values === "object") {
            return { default: defaultValue, ...values };
        }

        return values;
    }

    componentToParsed<T extends Types.Channels.RawComponent>(component: T): Types.Channels.ToComponentFromRaw<T> {
        return messageComponentsFromRaw<T>(component);
    }

    componentToRaw<T extends Types.Channels.Component>(component: T): Types.Channels.ToRawFromComponent<T> {
        return messageComponentsToRaw<T>(component);
    }

    componentsToParsed<T extends Types.Channels.AnyRawBaseComponent>(components: Array<T>): Array<Types.Channels.ToComponentFromRaw<T>> {
        return components.map(component => this.componentToParsed(component)) as never;
    }

    componentsToRaw<T extends Types.Channels.MessageComponent | Types.Channels.ModalComponent>(components: Array<T>): Array<T extends Types.Channels.MessageComponent ? Types.Channels.RawMessageComponent : T extends Types.Channels.ModalComponent ? Types.Channels.RawModalComponent : never> {
        return components.map(component => this.componentToRaw(component)) as never;
    }

    convertApplicationEmoji(raw: Types.Applications.RawApplicationEmoji): Types.Applications.ApplicationEmoji {
        return this.convertGuildEmoji(raw);
    }

    convertGuildEmoji(raw: Types.Guilds.RawGuildEmoji): Types.Guilds.GuildEmoji {
        return {
            animated:      raw.animated,
            available:     raw.available,
            id:            raw.id,
            managed:       raw.managed,
            name:          raw.name,
            requireColons: raw.require_colons,
            roles:         raw.roles,
            user:          raw.user ? this._client.users.update(raw.user) : undefined
        } satisfies Types.Shared.KeysExist<Types.Guilds.GuildEmoji>;
    }

    convertImage(img: Buffer | string): string {
        if (Buffer.isBuffer(img)) {
            const b64 = img.toString("base64");
            let mime: string | undefined;
            const magicMap: Array<[mime: string, magic: RegExp]> = [
                // 47 49 46 38
                ["image/gif", /^47494638/],
                // 89 50 4E 47
                ["image/png", /^89504E47/],
                // FF D8 FF
                ["image/jpeg", /^FFD8FF/],
                // 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
                ["image/webp", /^52494646\d{8}57454250/],
                // 02 27 62 20 22 0 - lottie JSON (assuming all files will start with {"v":")
                ["application/json", /^02276220220/]
            ];
            for (const format of magicMap) {
                if (format[1].test(this.getMagic(img, 16))) {
                    mime = format[0];
                    break;
                }
            }
            if (!mime) {
                throw new TypeError(`Failed to determine image format. (magic: ${this.getMagic(img, 16)})`);
            }
            img = `data:${mime};base64,${b64}`;
        }
        return img;
    }

    convertScheduledEventException(raw: Types.ScheduledEvents.RawScheduledEventException): Types.ScheduledEvents.ScheduledEventException {
        return {
            eventExceptionID:   raw.event_exception_id,
            eventID:            raw.event_id,
            isCanceled:         raw.is_canceled,
            scheduledEndTime:   raw.scheduled_end_time === null ? null : new Date(raw.scheduled_end_time),
            scheduledStartTime: raw.scheduled_start_time === null ? null : new Date(raw.scheduled_start_time)
        } satisfies Types.Shared.KeysExist<Types.ScheduledEvents.ScheduledEventException>;
    }

    convertSound(audio: Buffer | string): string {
        if (Buffer.isBuffer(audio)) {
            const b64 = audio.toString("base64");
            let mime: string | undefined;
            const magicMap: Array<[mime: string, magic: RegExp]> = [
                // 49 44 33
                ["audio/mpeg", /^494433/],
                // FF FB
                ["audio/mpeg", /^FFFB/],
                // 4F 67 67 53
                ["audio/ogg", /^4F676753/]
            ];
            for (const format of magicMap) {
                if (format[1].test(this.getMagic(audio, 16))) {
                    mime = format[0];
                    break;
                }
            }
            if (!mime) {
                throw new TypeError(`Failed to determine sound format. (magic: ${this.getMagic(audio, 16)})`);
            }
            audio = `data:${mime};base64,${b64}`;
        }
        return audio;
    }

    convertSticker(raw: Types.Guilds.RawSticker): Types.Guilds.Sticker {
        return {
            asset:       raw.asset,
            available:   raw.available,
            description: raw.description,
            formatType:  raw.format_type,
            guildID:     raw.guild_id,
            id:          raw.id,
            name:        raw.name,
            packID:      raw.pack_id,
            sortValue:   raw.sort_value,
            tags:        raw.tags,
            type:        raw.type,
            user:        raw.user ? this._client.users.update(raw.user) : undefined
        } satisfies Types.Shared.KeysExist<Types.Guilds.Sticker>;
    }

    async detectMissingPrivilegedIntents(intents?: number): Promise<Array<PrivilegedIntentNames>> {
        const application = this._client["_application"] || await this._client.rest.applications.getClient();
        intents ??= this._client.shards.options.intents;
        this._client["_application"] ??= application;

        const missing: Array<PrivilegedIntentNames> = [];
        const check = (intent: Intents, allowed: Array<ApplicationFlags>): void => {
            if ((intents! & intent) === intent && !allowed.some(flag => (application.flags & flag) === flag)) {
                missing.push(Intents[intent] as PrivilegedIntentNames);
            }
        };
        for (const [intent, allowed] of PrivilegedIntentMapping) {
            check(intent, allowed);
        }

        return missing;
    }

    embedsToParsed(embeds: Array<Types.Channels.RawEmbed>): Array<Types.Channels.Embed> {
        return embeds.map(embed => embedFromRaw(embed));
    }

    embedsToRaw(embeds: Array<Types.Channels.EmbedOptions>): Array<Types.Channels.RawEmbedOptions> {
        return embeds.map(embed => embedToRaw(embed));
    }

    formatAllowedMentions(allowed?: Types.Channels.AllowedMentions | null): Types.Channels.RawAllowedMentions {
        const result: Types.Channels.RawAllowedMentions = {
            parse:        [],
            replied_user: undefined,
            roles:        undefined,
            users:        undefined
        } satisfies Types.Shared.KeysExist<Types.Channels.RawAllowedMentions>;

        if (!allowed) {
            return this.formatAllowedMentions(this._client.options.allowedMentions);
        }

        if (allowed.everyone === true) {
            result.parse.push("everyone");
        }

        if (allowed.roles === true) {
            result.parse.push("roles");
        } else if (Array.isArray(allowed.roles)) {
            result.roles = allowed.roles;
        }

        if (allowed.users === true) {
            result.parse.push("users");
        } else if (Array.isArray(allowed.users)) {
            result.users = allowed.users;
        }

        if (allowed.repliedUser === true) {
            result.replied_user = true;
        }

        return result;
    }

    formatImage(url: string, format?: ImageFormat, size?: number): string {
        if (!format || !ImageFormats.includes(format.toLowerCase() as ImageFormat)) {
            format = url.includes("/a_") ? "gif" : this._client.options.defaultImageFormat;
        }
        if (!size || !MEDIA_PROXY_SIZES.includes(size)) {
            size = this._client.options.defaultImageSize;
        }
        return `${CDN_URL}${url}.${format}?size=${size}`;
    }

    getMagic(file: Buffer, len = 4): string {
        return [...new Uint8Array(file.subarray(0, len))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    }

    modalSubmitComponentsToParsed<T extends Types.Interactions.RawModalSubmitComponentsActionRow | Types.Interactions.RawModalSubmitComponentsLabel | Types.Interactions.RawModalSubmitComponents>(components: Array<T>): Array<Types.Interactions.ToModalSubmitComponentFromRaw<T>> {
        return components.map(component => modalSubmitComponentsFromRaw(component));
    }

    modalSubmitComponentsToRaw<T extends Types.Interactions.ModalSubmitComponentsActionRow | Types.Interactions.ModalSubmitComponentsLabel | Types.Interactions.ModalSubmitComponents>(components: Array<T>): Array<Types.Interactions.ToRawFromModalSubmitComponent<T>> {
        return components.map(component => modalSubmitComponentsToRaw(component));
    }

    optionToParsed(option: Types.Applications.RawApplicationCommandOption): Types.Applications.ApplicationCommandOptions {
        return applicationCommandOptionFromRaw(option);
    }

    optionToRaw(option: Types.Applications.ApplicationCommandOptions): Types.Applications.RawApplicationCommandOption {
        return applicationCommandOptionToRaw(option);
    }

    /** @internal */
    replacePollAnswer(poll: Poll, answerID: number, count: number, users?: Array<string>): void {
        let answerCount = poll.results.answerCounts.find(a => a.id === answerID);
        if (!answerCount) {
            answerCount = {
                count,
                id:      answerID,
                users:   [],
                meVoted: false
            } satisfies Types.Shared.KeysExist<Types.Channels.PollAnswerCount>;
        }

        answerCount.count = count;
        if (users) {
            answerCount.users = users;
            answerCount.meVoted = (this._client["_user"] && users.includes(this._client["_user"]?.id)) ?? false;
        }
    }

    updateChannel<T extends Types.Channels.AnyChannel>(channelData: Types.Channels.RawChannel): T {
        guild: if (channelData.guild_id) {
            const guild = this._client.guilds.get(channelData.guild_id);
            if (guild) {
                if (ThreadChannelTypes.includes(channelData.type as typeof ThreadChannelTypes[number])) {
                    if (!channelData.parent_id) {
                        break guild;
                    }
                    return guild.threads.update(channelData as Types.Channels.RawThreadChannel) as T;
                } else {
                    return guild.channels.update(channelData as Types.Channels.RawGuildChannel) as T;
                }
            }
        }

        switch (channelData.type) {
            case ChannelTypes.DM: return this._client.privateChannels.update(channelData as Types.Channels.RawPrivateChannel) as T;
            case ChannelTypes.GROUP_DM: return this._client.groupChannels.update(channelData as Types.Channels.RawGroupChannel) as T;
            default: return Channel.from<T>(channelData, this._client);
        }
    }

    /** @internal */
    updateEntitlement<T extends Entitlement | TestEntitlement = Entitlement | TestEntitlement>(data: Types.Applications.RawBaseEntitlement): T {
        if (this._client["_application"] === undefined || data.application_id !== this._client["_application"]!.id) {
            return "subscription_id" in data && data.subscription_id ?
                new Entitlement(data as Types.Applications.RawEntitlement, this._client) as T :
                new TestEntitlement(data as Types.Applications.RawTestEntitlement, this._client) as T;
        } else {
            return this._client.application.entitlements.update(data) as T;
        }
    }

    /** @internal */
    updateMember(guildID: string, memberID: string, member: Types.Guilds.RawMember | Types.Guilds.RESTMember): Member {
        const guild = this._client.guilds.get(guildID);
        if (guild && this._client["_user"] && this._client.user.id === memberID) {
            if (guild["_clientMember"]) {
                guild["_clientMember"]["update"](member);
            } else {
                guild["_clientMember"] = guild.members.update({ ...member, id: memberID }, guildID);
            }
            return guild["_clientMember"];
        }
        return guild ? guild.members.update({ ...member, id: memberID }, guildID) : new Member({ ...member, id: memberID }, this._client, guildID);
    }

    /** @internal */
    updateMessage<T extends Types.Channels.AnyTextableChannel | Types.Shared.Uncached>(data: Types.Channels.RawMessage): Message<T> {
        const channel = this._client.getChannel(data.channel_id) as T | undefined;
        if (channel && "messages" in channel) {
            return channel.messages.update(data) as Message<T>;
        }

        return new Message<T>(data, this._client);
    }

    /** @internal */
    updatePollAnswer(poll: Poll, answerID: number, count: number, user?: string): void {
        let answerCount = poll.results.answerCounts.find(a => a.id === answerID);
        if (!answerCount) {
            if (count === -1) {
                return;
            }

            answerCount = {
                count,
                id:      answerID,
                users:   user ? [user] : [],
                meVoted: user === this._client["_user"]?.id
            } satisfies Types.Shared.KeysExist<Types.Channels.PollAnswerCount>;
            poll.results.answerCounts.push(answerCount);
            return;
        }

        answerCount.count += count;
        if (user) {
            if (count === 1 && !answerCount.users.includes(user)) {
                answerCount.users.push(user);
                answerCount.meVoted = user === this._client["_user"]?.id;
            } else if (count === -1 && answerCount.users.includes(user)) {
                answerCount.users.splice(answerCount.users.indexOf(user), 1);
                if (user === this._client["_user"]?.id) {
                    answerCount.meVoted = false;
                }
            }
        }
    }

    /** @internal */
    updateSubscription(data: Types.Applications.RawSubscription): Subscription {
        if (this._client["_application"] === undefined) {
            return new Subscription(data, this._client);
        } else {
            return this._client.application.subscriptions.update(data);
        }
    }

    /** @internal */
    updateThread<T extends Types.Channels.AnyThreadChannel>(threadData: Types.Channels.RawThreadChannel): T {
        const guild = this._client.guilds.get(threadData.guild_id);
        if (guild) {
            return guild.threads.update(threadData) as T;
        }
        return Channel.from<T>(threadData, this._client);
    }
}
