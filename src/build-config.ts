import { ConfigOptions, FilePattern } from "karma";
import { configureBrowsers } from "./configure-browsers";
import { configureCoverage } from "./configure-coverage";
import { configureWebpack } from "./configure-webpack";
import { normalizeOptions } from "./normalize-options";
import { Options } from "./options";
import { addPlugin, mergeConfig } from "./util";

/**
 * Builds the Kamra configuration object based on the given options.
 */
export function buildConfig(options?: Options): ConfigOptions {
  let opts = normalizeOptions(options);

  let config = mergeConfig(opts.config, {
    frameworks: ["mocha", "host-environment"],
    reporters: ["verbose"],
    files: opts.fixtures.concat(opts.tests, opts.serve.map(serveFile)),
    plugins: [],
  });

  addPlugin(config, "@jsdevtools/karma-host-environment");
  addPlugin(config, "karma-verbose-reporter");
  addPlugin(config, "karma-mocha");

  config = configureWebpack(config, opts);
  config = configureBrowsers(config, opts);
  config = configureCoverage(config, opts);

  return config;
}

/**
 * Returns a FilePattern that serves the specified file, but does not include it by default.
 */
function serveFile(file: string | FilePattern): FilePattern {
  if (typeof file === "string") {
    return { pattern: file, included: false, served: true };
  }
  else {
    file.served = true;
    return file;
  }
}
