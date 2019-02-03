// tslint:disable: no-default-export no-console
import { Config } from "karma";
import nodeUtil from "util";
import { buildConfig } from "./build-config";
import { Options } from "./options";

/**
 * A function that sets the Karma configuration
 */
export type KarmaConfig = (karma: Config) => void;

/**
 * Allow users to call `buildConfig()` directly, so they can modify the output
 * before sending it to Karma.
 */
export { buildConfig };

/**
 * Cretaes a Kamra configuration based on the given options.
 */
export default function karmaConfig(options: Options): KarmaConfig {
  let config = buildConfig(options);

  return function configureKarma(karma) {
    if (config.logLevel !== karma.LOG_DISABLE) {
      console.debug("Karma Config:\n", nodeUtil.inspect(config, {
        depth: 10,
        colors: true,
        compact: false,
      }));
    }

    karma.set(config);
  };
}

// CommonJS default export hack
// tslint:disable: no-unsafe-any
if (typeof module === "object" && typeof exports === "object") {
  module.exports = exports.default;
  Object.assign(module.exports, exports);
}
