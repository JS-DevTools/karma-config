import { Config } from "karma";
import * as nodeUtil from "util";
import { buildConfig } from "./build-config";
import { Options } from "./options";

/**
 * A function that sets the Karma configuration
 */
export type KarmaConfig = (karma: Config) => void;

/**
 * Cretaes a Kamra configuration based on the given options.
 */
export function karmaConfig(options?: Options): KarmaConfig {
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
