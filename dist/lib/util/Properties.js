"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Properties {
    obj;
    constructor(obj) {
        this.obj = obj;
    }
    static define(obj, property, value, writable = false, configurable = false, enumerable = false) {
        return new Properties(obj).define(property, value, writable, configurable, enumerable);
    }
    static looseDefine(obj, property, value, writable = false, configurable = false, enumerable = false) {
        return new Properties(obj).looseDefine(property, value, writable, configurable, enumerable);
    }
    static new(obj) {
        return new Properties(obj);
    }
    define(property, value, writable = false, configurable = false, enumerable = false) {
        Object.defineProperty(this.obj, property, { value, writable, configurable, enumerable });
        return this;
    }
    looseDefine(property, value, writable = false, configurable = false, enumerable = false) {
        Object.defineProperty(this.obj, property, { value, writable, configurable, enumerable });
        return this;
    }
}
exports.default = Properties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL1Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFxQixVQUFVO0lBQ3RCLEdBQUcsQ0FBVTtJQUNyQixZQUFZLEdBQVk7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQXVCLEdBQU0sRUFBRSxRQUFXLEVBQUUsS0FBVyxFQUFFLFFBQVEsR0FBRyxLQUFLLEVBQUUsWUFBWSxHQUFHLEtBQUssRUFBRSxVQUFVLEdBQUcsS0FBSztRQUMvSCxPQUFPLElBQUksVUFBVSxDQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFXLENBQUksR0FBTSxFQUFFLFFBQWdCLEVBQUUsS0FBYyxFQUFFLFFBQVEsR0FBRyxLQUFLLEVBQUUsWUFBWSxHQUFHLEtBQUssRUFBRSxVQUFVLEdBQUcsS0FBSztRQUN6SCxPQUFPLElBQUksVUFBVSxDQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFHLENBQUksR0FBTTtRQUNuQixPQUFPLElBQUksVUFBVSxDQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxNQUFNLENBQW9CLFFBQVcsRUFBRSxLQUFXLEVBQUUsUUFBUSxHQUFHLEtBQUssRUFBRSxZQUFZLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxLQUFLO1FBQzdHLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFnQixFQUFFLEtBQWMsRUFBRSxRQUFRLEdBQUcsS0FBSyxFQUFFLFlBQVksR0FBRyxLQUFLLEVBQUUsVUFBVSxHQUFHLEtBQUs7UUFDdkcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDekYsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0NBQ0Q7QUEzQkQsNkJBMkJDIn0=