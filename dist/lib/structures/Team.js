"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const User_1 = __importDefault(require("./User"));
class Team extends Base_1.default {
    /** The icon hash of this team. */
    icon;
    /** The members of this team. */
    members;
    /** The name of this team. */
    name;
    /** The owner of this team. This can be a partial object with just an `id` property. */
    owner;
    constructor(data, client) {
        super(data.id, client);
        this.members = [];
        this.update(data);
    }
    update(data) {
        if (data.icon !== undefined)
            this.icon = data.icon;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.owner_user_id !== undefined)
            this.owner = this._client.users.get(data.owner_user_id) || { id: data.owner_user_id };
        if (data.members !== undefined) {
            for (const member of this.members) {
                if (!data.members.find(m => m.user.id === member.user.id))
                    this.members.splice(this.members.indexOf(member), 1);
            }
            for (const member of data.members) {
                if (!this.members.find(m => m.user.id === member.user.id)) {
                    this.members.push({
                        membershipState: member.membership_state,
                        permissions: member.permissions,
                        teamID: member.team_id,
                        user: this._client.users.update(member.user)
                    });
                }
            }
        }
    }
    toJSON() {
        return {
            ...super.toJSON(),
            icon: this.icon,
            members: this.members,
            name: this.name,
            owner: this.owner instanceof User_1.default ? this.owner.toJSON() : this.owner.id
        };
    }
}
exports.default = Team;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1RlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsa0RBQTBCO0FBTTFCLE1BQXFCLElBQUssU0FBUSxjQUFJO0lBQ2xDLGtDQUFrQztJQUNsQyxJQUFJLENBQWdCO0lBQ3BCLGdDQUFnQztJQUNoQyxPQUFPLENBQW9CO0lBQzNCLDZCQUE2QjtJQUM3QixJQUFJLENBQVM7SUFDYix1RkFBdUY7SUFDdkYsS0FBSyxDQUFrQjtJQUN2QixZQUFZLElBQWEsRUFBRSxNQUFjO1FBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVTLE1BQU0sQ0FBQyxJQUFzQjtRQUNuQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuRCxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDNUgsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUM1QixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ25IO1lBQ0QsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzt3QkFDZCxlQUFlLEVBQUUsTUFBTSxDQUFDLGdCQUFnQjt3QkFDeEMsV0FBVyxFQUFNLE1BQU0sQ0FBQyxXQUFXO3dCQUNuQyxNQUFNLEVBQVcsTUFBTSxDQUFDLE9BQU87d0JBQy9CLElBQUksRUFBYSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztxQkFDMUQsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFFUSxNQUFNO1FBQ1gsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixJQUFJLEVBQUssSUFBSSxDQUFDLElBQUk7WUFDbEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLElBQUksRUFBSyxJQUFJLENBQUMsSUFBSTtZQUNsQixLQUFLLEVBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxjQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtTQUM1RSxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBN0NELHVCQTZDQyJ9