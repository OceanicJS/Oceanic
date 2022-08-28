"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
class Util {
    static formatComponents(components) {
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
            })
        }));
    }
}
exports.default = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL1V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBNEQ7QUFHNUQsTUFBcUIsSUFBSTtJQUNyQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBMkQ7UUFDL0UsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxQixJQUFJLEVBQVEsR0FBRyxDQUFDLElBQUk7WUFDcEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssMEJBQWMsQ0FBQyxNQUFNLEVBQUU7b0JBQzFDLElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyx3QkFBWSxDQUFDLElBQUk7d0JBQUUsT0FBTyxTQUFTLENBQUM7O3dCQUN2RCxPQUFPOzRCQUNSLFNBQVMsRUFBRSxTQUFTLENBQUMsUUFBUTs0QkFDN0IsUUFBUSxFQUFHLFNBQVMsQ0FBQyxRQUFROzRCQUM3QixLQUFLLEVBQU0sU0FBUyxDQUFDLEtBQUs7NEJBQzFCLEtBQUssRUFBTSxTQUFTLENBQUMsS0FBSzs0QkFDMUIsS0FBSyxFQUFNLFNBQVMsQ0FBQyxLQUFLOzRCQUMxQixJQUFJLEVBQU8sU0FBUyxDQUFDLElBQUk7eUJBQzVCLENBQUM7aUJBQ0w7cUJBQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLDBCQUFjLENBQUMsV0FBVyxFQUFFO29CQUN0RCxPQUFPO3dCQUNILFNBQVMsRUFBSSxTQUFTLENBQUMsUUFBUTt3QkFDL0IsUUFBUSxFQUFLLFNBQVMsQ0FBQyxRQUFRO3dCQUMvQixVQUFVLEVBQUcsU0FBUyxDQUFDLFNBQVM7d0JBQ2hDLFVBQVUsRUFBRyxTQUFTLENBQUMsU0FBUzt3QkFDaEMsT0FBTyxFQUFNLFNBQVMsQ0FBQyxPQUFPO3dCQUM5QixXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVc7d0JBQ2xDLElBQUksRUFBUyxTQUFTLENBQUMsSUFBSTtxQkFDOUIsQ0FBQztpQkFDTDtxQkFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssMEJBQWMsQ0FBQyxVQUFVLEVBQUU7b0JBQ3JELE9BQU87d0JBQ0gsU0FBUyxFQUFJLFNBQVMsQ0FBQyxRQUFRO3dCQUMvQixLQUFLLEVBQVEsU0FBUyxDQUFDLEtBQUs7d0JBQzVCLFVBQVUsRUFBRyxTQUFTLENBQUMsU0FBUzt3QkFDaEMsVUFBVSxFQUFHLFNBQVMsQ0FBQyxTQUFTO3dCQUNoQyxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVc7d0JBQ2xDLFFBQVEsRUFBSyxTQUFTLENBQUMsUUFBUTt3QkFDL0IsS0FBSyxFQUFRLFNBQVMsQ0FBQyxLQUFLO3dCQUM1QixJQUFJLEVBQVMsU0FBUyxDQUFDLElBQUk7d0JBQzNCLEtBQUssRUFBUSxTQUFTLENBQUMsS0FBSztxQkFDL0IsQ0FBQztpQkFDTDtZQUNMLENBQUMsQ0FBQztTQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztDQUNKO0FBekNELHVCQXlDQyJ9