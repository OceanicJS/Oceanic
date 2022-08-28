"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** Represents a file attachment. */
class Attachment extends Base_1.default {
    /** The mime type of this attachment. */
    contentType;
    /** The description of this attachment. */
    description;
    /** If this attachment is ephemeral. Ephemeral attachments will be removed after a set period of time. */
    ephemeral;
    /** The filename of this attachment. */
    filename;
    /** The height of this attachment, if an image. */
    height;
    /** A proxied url of this attachment. */
    proxyURL;
    /** The size of this attachment. */
    size;
    /** The source url of this attachment. */
    url;
    /** The width of this attachment, if an image. */
    width;
    constructor(data, client) {
        super(data.id, client);
        this.contentType = data.content_type;
        this.description = data.description;
        this.ephemeral = data.ephemeral;
        this.filename = data.filename;
        this.height = data.height;
        this.proxyURL = data.proxy_url;
        this.size = data.size;
        this.url = data.url;
        this.width = data.width;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            contentType: this.contentType,
            description: this.description,
            ephemeral: this.ephemeral,
            filename: this.filename,
            height: this.height,
            proxyURL: this.proxyURL,
            size: this.size,
            url: this.url,
            width: this.width
        };
    }
}
exports.default = Attachment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXR0YWNobWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0F0dGFjaG1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFLMUIsb0NBQW9DO0FBQ3BDLE1BQXFCLFVBQVcsU0FBUSxjQUFJO0lBQ3hDLHdDQUF3QztJQUN4QyxXQUFXLENBQVU7SUFDckIsMENBQTBDO0lBQzFDLFdBQVcsQ0FBVTtJQUNyQix5R0FBeUc7SUFDekcsU0FBUyxDQUFXO0lBQ3BCLHVDQUF1QztJQUN2QyxRQUFRLENBQVM7SUFDakIsa0RBQWtEO0lBQ2xELE1BQU0sQ0FBVTtJQUNoQix3Q0FBd0M7SUFDeEMsUUFBUSxDQUFTO0lBQ2pCLG1DQUFtQztJQUNuQyxJQUFJLENBQVM7SUFDYix5Q0FBeUM7SUFDekMsR0FBRyxDQUFTO0lBQ1osaURBQWlEO0lBQ2pELEtBQUssQ0FBVTtJQUNmLFlBQVksSUFBbUIsRUFBRSxNQUFjO1FBQzNDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNyQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLFNBQVMsRUFBSSxJQUFJLENBQUMsU0FBUztZQUMzQixRQUFRLEVBQUssSUFBSSxDQUFDLFFBQVE7WUFDMUIsTUFBTSxFQUFPLElBQUksQ0FBQyxNQUFNO1lBQ3hCLFFBQVEsRUFBSyxJQUFJLENBQUMsUUFBUTtZQUMxQixJQUFJLEVBQVMsSUFBSSxDQUFDLElBQUk7WUFDdEIsR0FBRyxFQUFVLElBQUksQ0FBQyxHQUFHO1lBQ3JCLEtBQUssRUFBUSxJQUFJLENBQUMsS0FBSztTQUMxQixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBOUNELDZCQThDQyJ9