import "karma";

/**
 * @see https://github.com/karma-runner/karma-sauce-launcher#saucelabs-config-properties-shared-across-all-browsers
 */
interface SauceLabsConfig {
  username?: string;
  accessKey?: string;
  proxy?: string;
  startConnect?: boolean;
  connectOptions?: object;
  connectLocationForSERelay?: string;
  connectPortForSERelay?: number;
  build?: string;
  testName?: string;
  tunnelIdentifier?: string;
  tags?: string[];
  recordVideo?: boolean;
  recordScreenshots?: boolean;
  public?: string;
  customData?: object;
}

declare module "karma" {
  interface ConfigOptions {
    sauceLabs: SauceLabsConfig;
  }

  interface CustomLauncher {
    deviceOrientation?: "portrait" | "landscape";
  }
}
