import { defineConfig } from "eslint/config";
import { recommended, testFileRules } from "@fbgfi/eslint-config";
import globals from "globals";

export default defineConfig([{
  ...recommended, languageOptions: {
    globals: {
      ...globals.browser
    }
  }
}, {
  ...testFileRules, languageOptions: {
    globals: {
      ...globals.browser
    }
  }
}]);