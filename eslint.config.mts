import baseConfig from "@uwu-codes/eslint-config";
import { defineConfig } from "eslint/config";
import importNewlines from "eslint-plugin-import-newlines";
import jsdoc from "eslint-plugin-jsdoc";

const files = ["**/*.ts", "**/*.mts", "**/*.cts"];

// the /node preset is not used since it adds .js to relative imports, which breaks commonjs resolution
export default defineConfig(
    baseConfig,
    {
        files,
        plugins: {
            "import-newlines": importNewlines,
            jsdoc,
        },
        rules: {
            "import-newlines/enforce": ["error", 4],
            "jsdoc/check-alignment": "error",
            "jsdoc/check-indentation": "error",
            "jsdoc/no-types": "error",
            "jsdoc/tag-lines": "error",
            "import/extensions": "off",
            // bracket notation is used to access private/protected members of other classes
            "@typescript-eslint/dot-notation": [
                "error",
                {
                    allowPrivateClassPropertyAccess: true,
                    allowProtectedClassPropertyAccess: true,
                },
            ],
            // we still have to populate our own deprecated properties
            "@typescript-eslint/no-deprecated": "off",
            // raw gateway values are compared against enums
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
            // flags type parameters that only exist to narrow the return type, e.g. Channel.from<TextChannel>()
            "@typescript-eslint/no-unnecessary-type-parameters": "off",
            // files are named after their class, e.g. DiscordHTTPError.ts
            "unicorn/filename-case": "off",
            // constructors that only call super() are used to narrow parameter types
            "@typescript-eslint/no-useless-constructor": "off",
            "@typescript-eslint/no-invalid-void-type": [
                "error",
                {
                    allowAsThisParameter: true,
                    allowInGenericTypeArguments: true,
                },
            ],
            "@typescript-eslint/no-dynamic-delete": "off",
        },
    },
    {
        // flags above bit 31 need 2 ** n, which is not considered a literal
        files: ["lib/Constants.ts"],
        rules: {
            "@typescript-eslint/prefer-literal-enum-member": "off",
        },
    },
);
