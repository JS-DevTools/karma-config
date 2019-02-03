// tslint:disable: no-default-export
import { KarmaConfig, karmaConfig } from "./karma-config";

// Export type definitions as named exports
export { Options } from "./options";
export { KarmaConfig };

// Export `buildConfig()` as a named export, so users can modify
// the output before sending it to Karma.
export { buildConfig } from "./build-config";

// Export `karmaConfig()` as a named export and the default export
export { karmaConfig };
export default karmaConfig;

// CommonJS default export hack
// tslint:disable: no-unsafe-any
if (typeof module === "object" && typeof exports === "object") {
  module.exports = exports.default;
  Object.assign(module.exports, exports);
}
