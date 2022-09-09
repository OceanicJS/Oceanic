import { CDN_URL } from "./Routes";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import {
    ButtonStyles,
    ComponentTypes,
    ImageFormats,
    MAX_IMAGE_SIZE,
    MIN_IMAGE_SIZE
} from "../Constants";
import type {
    AllowedMentions,
    ApplicationCommandOptions,
    CombinedApplicationCommandOption,
    MessageActionRow,
    ModalActionRow,
    RawAllowedMentions,
    RawApplicationCommandOption,
    RawMember,
    RawMessageActionRow,
    RawModalActionRow,
    EmbedOptions,
    RawEmbedOptions,
    Embed,
    RawEmbed
} from "../types";
import Member from "../structures/Member";

/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
export default class Util {
    static BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[A-Za-z0-9+/]{2}[A-Za-z0-9+/]{2})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
    #client!: Client;

    constructor(client: Client) {
        this.#client = client;
    }

    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image: Buffer | string, name: string): string {
        try {
            return this.convertImage(image);
        } catch (err) {
            throw new Error(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err as Error });
        }
    }

    componentsToParsed<T extends RawModalActionRow | RawMessageActionRow>(components: Array<T>): T extends RawModalActionRow ? Array<ModalActionRow> : T extends RawMessageActionRow ? Array<MessageActionRow> : never {
        return components.map(row => ({
            type:       row.type,
            components: row.components.map(component => {
                if (component.type === ComponentTypes.BUTTON) {
                    if (component.style === ButtonStyles.LINK) {
                        return component;
                    } else {
                        return {
                            customID: component.custom_id,
                            disabled: component.disabled,
                            emoji:    component.emoji,
                            label:    component.label,
                            style:    component.style,
                            type:     component.type
                        };
                    }
                } else if (component.type === ComponentTypes.SELECT_MENU) {
                    return {
                        customID:    component.custom_id,
                        disabled:    component.disabled,
                        maxValues:   component.max_values,
                        minValues:   component.min_values,
                        options:     component.options,
                        placeholder: component.placeholder,
                        type:        component.type
                    };
                } else if (component.type === ComponentTypes.TEXT_INPUT) {
                    return {
                        customID:    component.custom_id,
                        label:       component.label,
                        maxLength:   component.max_length,
                        minLength:   component.min_length,
                        placeholder: component.placeholder,
                        required:    component.required,
                        style:       component.style,
                        type:        component.type,
                        value:       component.value
                    };
                } else {
                    return component;
                }
            })
        })) as never;
    }

    componentsToRaw<T extends ModalActionRow | MessageActionRow>(components: Array<T>): T extends ModalActionRow ? Array<RawModalActionRow> : T extends MessageActionRow ? Array<RawMessageActionRow> : never {
        return components.map(row => ({
            type:       row.type,
            components: row.components.map(component => {
                if (component.type === ComponentTypes.BUTTON) {
                    if (component.style === ButtonStyles.LINK) {
                        return component;
                    } else {
                        return {
                            custom_id: component.customID,
                            disabled:  component.disabled,
                            emoji:     component.emoji,
                            label:     component.label,
                            style:     component.style,
                            type:      component.type
                        };
                    }
                } else if (component.type === ComponentTypes.SELECT_MENU) {
                    return {
                        custom_id:   component.customID,
                        disabled:    component.disabled,
                        max_values:  component.maxValues,
                        min_values:  component.minValues,
                        options:     component.options,
                        placeholder: component.placeholder,
                        type:        component.type
                    };
                } else if (component.type === ComponentTypes.TEXT_INPUT) {
                    return {
                        custom_id:   component.customID,
                        label:       component.label,
                        max_length:  component.maxLength,
                        min_length:  component.minLength,
                        placeholder: component.placeholder,
                        required:    component.required,
                        style:       component.style,
                        type:        component.type,
                        value:       component.value
                    };
                } else {
                    return component;
                }
            })
        })) as never;
    }

    convertImage(img: Buffer | string): string {
        if (Buffer.isBuffer(img)) {
            const b64 = img.toString("base64");
            let mime: string | undefined;
            const magic = [...new Uint8Array(img.subarray(0, 4))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
            switch (magic) {
                case "47494638": mime = "image/gif"; break;
                case "89504E47": mime = "image/png"; break;
                case "FFD8FFDB": case "FFD8FFE0": case "49460001": case "FFD8FFEE": case "69660000": mime = "image/jpeg"; break;
            }
            if (!mime) {
                throw new Error(`Failed to determine image format. (magic: ${magic})`);
            }
            img = `data:${mime};base64,${b64}`;
        }
        if (!Util.BASE64URL_REGEX.test(img)) {
            throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.");
        }
        return img;
    }

    embedsToParsed(embeds: Array<RawEmbed>): Array<Embed> {
        return embeds.map(embed => {
            const parsedEmbed: Embed = {};

            if (embed.author !== undefined) {
                parsedEmbed.author = {
                    name:         embed.author.name,
                    iconURL:      embed.author.icon_url,
                    proxyIconURL: embed.author.proxy_icon_url,
                    url:          embed.author.url
                };
            }

            if (embed.color !== undefined) {
                parsedEmbed.color = embed.color;
            }
            if (embed.description !== undefined) {
                parsedEmbed.description = embed.description;
            }
            if (embed.fields !== undefined) {
                parsedEmbed.fields = embed.fields.map(field => ({
                    inline: field.inline,
                    name:   field.name,
                    value:  field.value
                }));
            }

            if (embed.footer !== undefined) {
                parsedEmbed.footer = {
                    text:         embed.footer.text,
                    iconURL:      embed.footer.icon_url,
                    proxyIconURL: embed.footer.proxy_icon_url
                };
            }

            if (embed.timestamp !== undefined) {
                parsedEmbed.timestamp = embed.timestamp;
            }
            if (embed.title !== undefined) {
                parsedEmbed.title = embed.title;
            }
            if (embed.image !== undefined) {
                parsedEmbed.image = {
                    url:      embed.image.url,
                    height:   embed.image.height,
                    proxyURL: embed.image.proxy_url,
                    width:    embed.image.width
                };
            }

            if (embed.provider !== undefined) {
                parsedEmbed.provider = {
                    name: embed.provider.name,
                    url:  embed.provider.url
                };
            }
            if (embed.thumbnail !== undefined) {
                parsedEmbed.thumbnail = {
                    url:      embed.thumbnail.url,
                    height:   embed.thumbnail.height,
                    proxyURL: embed.thumbnail.proxy_url,
                    width:    embed.thumbnail.width
                };
            }
            if (embed.url !== undefined) {
                parsedEmbed.url = embed.url;
            }
            if (embed.type !== undefined) {
                parsedEmbed.type =  embed.type;
            }
            if (embed.video !== undefined) {
                parsedEmbed.video = {
                    height:   embed.video.height,
                    proxyURL: embed.video.proxy_url,
                    url:      embed.video.url,
                    width:    embed.video.width
                };
            }


            return parsedEmbed;
        });
    }

    embedsToRaw(embeds: Array<EmbedOptions>): Array<RawEmbedOptions> {
        return embeds.map(embed => {
            const rawEmbed: RawEmbedOptions = {};

            if (embed.author !== undefined) {
                rawEmbed.author = {
                    name:     embed.author.name,
                    icon_url: embed.author.iconURL,
                    url:      embed.author.url
                };
            }

            if (embed.color !== undefined) {
                rawEmbed.color = embed.color;
            }
            if (embed.description !== undefined) {
                rawEmbed.description = embed.description;
            }
            if (embed.fields !== undefined) {
                rawEmbed.fields = embed.fields.map(field => ({
                    inline: field.inline,
                    name:   field.name,
                    value:  field.value
                }));
            }

            if (embed.footer !== undefined) {
                rawEmbed.footer = {
                    text:     embed.footer.text,
                    icon_url: embed.footer.iconURL
                };
            }

            if (embed.timestamp !== undefined) {
                rawEmbed.timestamp = embed.timestamp;
            }
            if (embed.title !== undefined) {
                rawEmbed.title = embed.title;
            }
            if (embed.image !== undefined) {
                rawEmbed.image = { url: embed.image.url };
            }

            if (embed.thumbnail !== undefined) {
                rawEmbed.thumbnail = { url: embed.thumbnail.url };
            }

            if (embed.url !== undefined) {
                rawEmbed.url = embed.url;
            }

            return rawEmbed;
        });
    }

    formatAllowedMentions(allowed?: AllowedMentions): RawAllowedMentions {
        const result: RawAllowedMentions = { parse: [] };

        if (!allowed) {
            return this.formatAllowedMentions(this.#client.options.allowedMentions);
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
            format = url.includes("/a_") ? "gif" : this.#client.options.defaultImageFormat;
        }
        if (!size || size < MIN_IMAGE_SIZE || size > MAX_IMAGE_SIZE) {
            size = this.#client.options.defaultImageSize;
        }
        return `${CDN_URL}${url}.${format}?size=${size}`;
    }

    optionToParsed(option: RawApplicationCommandOption): ApplicationCommandOptions {
        const opt = option as RawApplicationCommandOption;
        return {
            autocomplete:             opt.autocomplete,
            channelTypes:             opt.channel_types,
            choices:                  opt.choices,
            description:              opt.description,
            descriptionLocalizations: opt.description_localizations,
            max_length:               opt.max_length,
            max_value:                opt.max_value,
            min_length:               opt.min_length,
            min_value:                opt.min_value,
            name:                     opt.name,
            nameLocalizations:        opt.name_localizations,
            options:                  opt.options?.map(o => this.optionToParsed(o)),
            required:                 opt.required,
            type:                     opt.type
        } as ApplicationCommandOptions;
    }

    optionToRaw(option: ApplicationCommandOptions): RawApplicationCommandOption {
        const opt = option as CombinedApplicationCommandOption;
        return {
            autocomplete:              opt.autocomplete,
            channel_types:             opt.channelTypes,
            choices:                   opt.choices,
            description:               opt.description,
            description_localizations: opt.descriptionLocalizations,
            max_length:                opt.maxLength,
            max_value:                 opt.maxValue,
            min_length:                opt.minLength,
            min_value:                 opt.minValue,
            name:                      opt.name,
            name_localizations:        opt.nameLocalizations,
            options:                   opt.options?.map(o => this.optionToRaw(o as ApplicationCommandOptions)),
            required:                  opt.required,
            type:                      opt.type
        } as RawApplicationCommandOption;
    }

    updateMember(guildID: string, memberID: string, member: RawMember): Member {
        return this.#client.guilds.has(guildID) ? this.#client.guilds.get(guildID)!.members.update({ ...member, id: memberID }, guildID) : new Member(member, this.#client, guildID);
    }
}

export function is<T>(input: unknown): input is T {
    return true;
}
