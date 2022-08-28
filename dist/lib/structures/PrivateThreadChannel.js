"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ThreadChannel_1 = __importDefault(require("./ThreadChannel"));
/** Represents a guild thread channel. */
class PrivateThreadChannel extends ThreadChannel_1.default {
    constructor(data, client) {
        super(data, client);
    }
    /**
     * Edit a channel.
     *
     * @param {String} id - The id of the channel to edit.
     * @param {Object} options
     * @param {Boolean} [options.archived] - If the thread is archived.
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration after which the thread will be archived.
     * @param {Number} [options.flags] - The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
     * @param {Boolean} [options.invitable] - If non-moderators can add other non-moderators to the thread.
     * @param {Boolean} [options.locked] - If the thread should be locked.
     * @param {String} [options.name] - The name of the channel.
     * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @returns {Promise<PrivateThreadChannel>}
     */
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type: this.type
        };
    }
}
exports.default = PrivateThreadChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpdmF0ZVRocmVhZENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9Qcml2YXRlVGhyZWFkQ2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLG9FQUE0QztBQU01Qyx5Q0FBeUM7QUFDekMsTUFBcUIsb0JBQXFCLFNBQVEsdUJBQW1DO0lBR3BGLFlBQVksSUFBNkIsRUFBRSxNQUFjO1FBQ3hELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ00sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUF3QztRQUMzRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsTUFBTTtRQUNMLE9BQU87WUFDTixHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ25DLElBQUksRUFBWSxJQUFJLENBQUMsSUFBSTtTQUN6QixDQUFDO0lBQ0gsQ0FBQztDQUNEO0FBakNELHVDQWlDQyJ9