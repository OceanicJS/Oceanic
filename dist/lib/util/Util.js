"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Properties_1 = __importDefault(require("./Properties"));
const Routes_1 = require("./Routes");
const Constants_1 = require("../Constants");
const Member_1 = __importDefault(require("../structures/Member"));
/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
class Util {
    static BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[A-Za-z0-9+/]{2}[A-Za-z0-9+/]{2})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
    _client;
    constructor(client) {
        Properties_1.default.looseDefine(this, "_client", client);
    }
    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image, name) {
        try {
            return this.convertImage(image);
        }
        catch (err) {
            throw new Error(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err });
        }
    }
    componentsToParsed(components) {
        return components.map(row => ({
            type: row.type,
            components: row.components.map(component => {
                if (component.type === Constants_1.ComponentTypes.BUTTON) {
                    if (component.style === Constants_1.ButtonStyles.LINK)
                        return component;
                    else
                        return {
                            customID: component.custom_id,
                            disabled: component.disabled,
                            emoji: component.emoji,
                            label: component.label,
                            style: component.style,
                            type: component.type
                        };
                }
                else if (component.type === Constants_1.ComponentTypes.SELECT_MENU)
                    return {
                        customID: component.custom_id,
                        disabled: component.disabled,
                        maxValues: component.max_values,
                        minValues: component.min_values,
                        options: component.options,
                        placeholder: component.placeholder,
                        type: component.type
                    };
                else if (component.type === Constants_1.ComponentTypes.TEXT_INPUT) {
                    return {
                        customID: component.custom_id,
                        label: component.label,
                        maxLength: component.max_length,
                        minLength: component.min_length,
                        placeholder: component.placeholder,
                        required: component.required,
                        style: component.style,
                        type: component.type,
                        value: component.value
                    };
                }
                else
                    return component;
            })
        }));
    }
    componentsToRaw(components) {
        return components.map(row => ({
            type: row.type,
            components: row.components.map(component => {
                if (component.type === Constants_1.ComponentTypes.BUTTON) {
                    if (component.style === Constants_1.ButtonStyles.LINK)
                        return component;
                    else
                        return {
                            custom_id: component.customID,
                            disabled: component.disabled,
                            emoji: component.emoji,
                            label: component.label,
                            style: component.style,
                            type: component.type
                        };
                }
                else if (component.type === Constants_1.ComponentTypes.SELECT_MENU) {
                    return {
                        custom_id: component.customID,
                        disabled: component.disabled,
                        max_values: component.maxValues,
                        min_values: component.minValues,
                        options: component.options,
                        placeholder: component.placeholder,
                        type: component.type
                    };
                }
                else if (component.type === Constants_1.ComponentTypes.TEXT_INPUT) {
                    return {
                        custom_id: component.customID,
                        label: component.label,
                        max_length: component.maxLength,
                        min_length: component.minLength,
                        placeholder: component.placeholder,
                        required: component.required,
                        style: component.style,
                        type: component.type,
                        value: component.value
                    };
                }
                else
                    return component;
            })
        }));
    }
    convertImage(img) {
        if (Buffer.isBuffer(img)) {
            const b64 = img.toString("base64");
            let mime;
            const magic = [...new Uint8Array(img.subarray(0, 4))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
            switch (magic) {
                case "47494638":
                    mime = "image/gif";
                    break;
                case "89504E47":
                    mime = "image/png";
                    break;
                case "FFD8FFDB":
                case "FFD8FFE0":
                case "49460001":
                case "FFD8FFEE":
                case "69660000":
                    mime = "image/jpeg";
                    break;
            }
            if (!mime)
                throw new Error(`Failed to determine image format. (magic: ${magic})`);
            img = `data:${mime};base64,${b64}`;
        }
        if (!Util.BASE64URL_REGEX.test(img))
            throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.");
        return img;
    }
    formatAllowedMentions(allowed) {
        const result = {
            parse: []
        };
        if (!allowed)
            return this.formatAllowedMentions(this._client.options.allowedMentions);
        if (allowed.everyone === true)
            result.parse.push("everyone");
        if (allowed.roles === true)
            result.parse.push("roles");
        else if (Array.isArray(allowed.roles))
            result.roles = allowed.roles;
        if (allowed.users === true)
            result.parse.push("users");
        else if (Array.isArray(allowed.users))
            result.users = allowed.users;
        if (allowed.repliedUser === true)
            result.replied_user = true;
        return result;
    }
    formatImage(url, format, size) {
        if (!format || !Constants_1.ImageFormats.includes(format.toLowerCase()))
            format = url.includes("/a_") ? "gif" : this._client.options.defaultImageFormat;
        if (!size || size < Constants_1.MIN_IMAGE_SIZE || size > Constants_1.MAX_IMAGE_SIZE)
            size = this._client.options.defaultImageSize;
        return `${Routes_1.CDN_URL}${url}.${format}?size=${size}`;
    }
    optionToParsed(option) {
        const opt = option;
        return {
            autocomplete: opt.autocomplete,
            channelTypes: opt.channel_types,
            choices: opt.choices,
            description: opt.description,
            descriptionLocalizations: opt.description_localizations,
            max_length: opt.max_length,
            max_value: opt.max_value,
            min_length: opt.min_length,
            min_value: opt.min_value,
            name: opt.name,
            nameLocalizations: opt.name_localizations,
            options: opt.options?.map(o => this.optionToParsed(o)),
            required: opt.required,
            type: opt.type
        };
    }
    optionToRaw(option) {
        const opt = option;
        return {
            autocomplete: opt.autocomplete,
            channel_types: opt.channelTypes,
            choices: opt.choices,
            description: opt.description,
            description_localizations: opt.descriptionLocalizations,
            max_length: opt.maxLength,
            max_value: opt.maxValue,
            min_length: opt.minLength,
            min_value: opt.minValue,
            name: opt.name,
            name_localizations: opt.nameLocalizations,
            options: opt.options?.map(o => this.optionToRaw(o)),
            required: opt.required,
            type: opt.type
        };
    }
    updateMember(guildID, memberID, member) {
        return this._client.guilds.has(guildID) ? this._client.guilds.get(guildID).members.update({ ...member, id: memberID }, guildID) : new Member_1.default(member, this._client, guildID);
    }
}
exports.default = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL1V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4REFBc0M7QUFDdEMscUNBQW1DO0FBR25DLDRDQU1zQjtBQWF0QixrRUFBMEM7QUFFMUMsdUlBQXVJO0FBQ3ZJLE1BQXFCLElBQUk7SUFDckIsTUFBTSxDQUFDLGVBQWUsR0FBRywwSEFBMEgsQ0FBQztJQUM1SSxPQUFPLENBQVU7SUFFekIsWUFBWSxNQUFjO1FBQ3RCLG9CQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELDBFQUEwRTtJQUMxRSxhQUFhLENBQUMsS0FBc0IsRUFBRSxJQUFZO1FBQzlDLElBQUk7WUFDQSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxJQUFJLDBFQUEwRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQVksRUFBRSxDQUFDLENBQUM7U0FDdkk7SUFDTCxDQUFDO0lBRUQsa0JBQWtCLENBQW9ELFVBQW9CO1FBQ3RGLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUIsSUFBSSxFQUFRLEdBQUcsQ0FBQyxJQUFJO1lBQ3BCLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDdkMsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLDBCQUFjLENBQUMsTUFBTSxFQUFFO29CQUMxQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEtBQUssd0JBQVksQ0FBQyxJQUFJO3dCQUFFLE9BQU8sU0FBUyxDQUFDOzt3QkFDdkQsT0FBTzs0QkFDUixRQUFRLEVBQUUsU0FBUyxDQUFDLFNBQVM7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