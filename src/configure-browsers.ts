import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./normalize-options";
import { readPackageJson } from "./package-json";
import { addPlugin, mergeConfig } from "./util";

/**
 * Configures the browsers for the current platform
 */
export function configureBrowsers(config: ConfigOptions, options: NormalizedOptions): ConfigOptions {
  if (config.browsers) {
    // The user has already specified the browsers
    return config;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  let { CI, browsers: { chrome, firefox, safari, edge, ie }} = options;
  let browsers = config.browsers = [] as string[];

  chrome && addPlugin(config, "karma-chrome-launcher");
  firefox && addPlugin(config, "karma-firefox-launcher");
  safari && addPlugin(config, "karma-safari-launcher");
  edge && addPlugin(config, "karma-edge-launcher");
  ie && addPlugin(config, "karma-ie-launcher");

  if (CI) {
    chrome && browsers.push("ChromeHeadless");
    firefox && browsers.push("FirefoxHeadless");
  }
  else {
    chrome && browsers.push("Chrome");
    firefox && browsers.push("Firefox");
  }

  safari && browsers.push("Safari");
  edge && browsers.push("Edge");
  ie && browsers.push("IE");

  return config;
}
