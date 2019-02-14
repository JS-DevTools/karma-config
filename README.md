Karma-Config
==============================

### Karma configuration builder with sensible defaults to minimize boilerplate

[![Cross-Platform Compatibility](https://jsdevtools.org/img/badges/os-badges.svg)](https://travis-ci.com/JS-DevTools/karma-config)
[![Build Status](https://api.travis-ci.com/JS-DevTools/karma-config.svg?branch=master)](https://travis-ci.com/JS-DevTools/karma-config)

[![Coverage Status](https://coveralls.io/repos/github/JS-DevTools/karma-config/badge.svg?branch=master)](https://coveralls.io/github/JS-DevTools/karma-config?branch=master)
[![Dependencies](https://david-dm.org/JS-DevTools/karma-config.svg)](https://david-dm.org/JS-DevTools/karma-config)

[![npm](https://img.shields.io/npm/v/karma-config.svg?maxAge=43200)](https://www.npmjs.com/package/karma-config)
[![License](https://img.shields.io/npm/l/karma-config.svg?maxAge=2592000)](LICENSE)



[**Karma**](https://karma-runner.github.io/3.0/index.html) can be [**configured**](https://karma-runner.github.io/3.0/config/configuration-file.html) to do pretty much anything you can imagine, but you'll probably find yourself repeating the same boilerplate configuration in every project.

Karma-Config eliminates the redundancy and boilerplate by applying sensible defaults so you only need to specify the one-off settings that are particular to your project.  It can reduce a typical `karma.config.js` file from dozens of lines to just two or three lines.



Features
--------------------------
- Applies sensible defaults, but will never override your settings
- Uses the appropraite browsers for the platform (e.g. Safari on Mac, Edge on Windows)
- Uses headless browsers when running in CI/CD
- Produces code-coverage reports if `KARMA_COVERAGE` env var is set, or if you add `--coverage` when running Karma


Related Projects
--------------------------
- [karma-host-environment](https://jsdevtools.org/karma-host-environment)<br>
  Provides host environment info (user agent, Node.js version, environment variables, etc.)



Installation
--------------------------
Use [npm](https://docs.npmjs.com/about-npm/) to install Karma-Config as a dev dependency.  Be sure to install [karma](https://www.npmjs.com/package/karma) and [karma-cli](https://www.npmjs.com/package/karma-cli) too.

```bash
npm install --save-dev karma karma-cli karma-config
```



Usage
--------------------------

### Using Default values
For typical projects, the defaults may be all you need, in which case your config can be one line:

**karma.conf.js**

```javascript
module.exports = require("karma-config")();
```

Depending on the operating system and whether its running in a CI/CD environment, the above code will produce this config:

```javascript
{
  // Defaults to the Karma-Verbose-Reporter
  // See https://www.npmjs.com/package/karma-verbose-reporter
  reporters: ["verbose"],

  // The browsers will vary depending on the OS.
  // In CI/CD environments, FirefoxHeadless and ChromeHeadless are used instead.
  browsers: ["Firefox", "Chrome"],

  frameworks: [
    // Defaults to the Mocha test framework.
    "mocha",

    // This makes it easy to detect which browser your tests are running in.
    // Also provides access to environment variables.
    // See https://jsdevtools.org/karma-host-environment
    "host-environment"
  ],

  files: [
    // Assumes your tests are under the "test" folder and are named *.spec.js
    // or *.test.js.  (.mjs and .jsx file extensions are also supported)
    "test/**/*.+(spec|test).+(js|jsx|mjs)",

    // Allows your tests to dynamically access any file in the "test" folder.
    // Useful for loading test data from CSV or JSON files.
    { pattern: "test/**/*", included: false, served: true }
  ],

  preprocessors: {
    // Uses Webpack to bundle your tests and their dependencies
    "test/**/*.+(spec|test).+(js|jsx|mjs)": ["webpack"]
  },

  webpack: {
    // Webpack development mode it easier to debug failing tests
    mode: "development",

    // Inlne source maps ensure proper stack traces in errors,
    // and allow you to debug your original source code rather than bundled code.
    devtool: "inline-source-map",
  }
}
```



### Adding or Overriding Settings
You can explicitly specify any Karma settings, and Karma-Config will honor them.  Your settings will be merged with the settings that Karma-Config generates.  This allows you to add additional settings that aren't normally set by Karma-Config.  It also allows you to override anything that Karma-Config would normally generate.

**karma.conf.js**

```javascript
module.exports = require("karma-config")({
  config: {
    port: 12345,                                // Set Karma's port number
    browserNoActivityTimeout: 5000,             // Set Karma's inactivity timeout
    browsers: ["Opera", "Safari"]               // Always use these browsers, regardless of OS
    webpack: {
      mode: "production",                       // Override the default Webpack mode
      module: {
        rules: [
          { test: /\.ts$/, use: "ts-loader" }   // Configure Webpack to support TypeScript
        ]
      }
    }
  }
});
```

Another option is to use Karma-Config's `buildConfig` function, which returns the generated config object.  You can then make whatever modifications you want to it before passing it to Karma.

**karma.conf.js**

```javascript
const { buildConfig } = require("karma-config");

module.exports = (karma) => {
  // Let Karma-Config generate its config, as usual
  let config = buildConfig();

  // Modify the config object however you want
  config.port = 12345;
  config.browserNoActivityTimeout = 5000;
  config.browsers.push("Opera");
  config.webpack.mode = "production";
  config.webpack.module.rules.push({ test: /\.ts$/, use: "ts-loader" });

  // Pass the final config to Karma
  karma.set(config);
});
```



Options
--------------------------
Karma-Config exposes a few options that allow you to control the config that it generates. Here's an example that demonstrates setting a few options:

**karma.conf.js**

```javascript
module.exports = require("karma-config")({
  sourceDir: "my/source/dir",             // Override the default sourceDir ("src")
  testDir: "my/test/dir",                 // Override the default testDir ("test")
  coverage: true,                         // Always produce a code-coverage report
  browsers: {
    firefox: false,                       // Don't test in Firefox on any OS
    ie: true,                             // Test in Internet Explorer on Windows
  }
});
```

### All Options

|Option            |Type              |Default Value            |Description
|:-----------------|:-----------------|:------------------------|:------------------------------------------------
|`browsers`        |`object`          |                         |This object allows you to specify which browsers you support.
|`browsers.chrome` |`boolean`         |`true`                   |Indicates whether Chrome is supported. If `true`, then tests will be run in Chrome on all OSes.
|`browsers.firefox`|`boolean`         |`true`                   |Indicates whether Firefox is supported. If `true`, then tests will be run in Firefox on all OSes.
|`browsers.safari` |`boolean`         |`true`                   |Indicates whether Safari is supported. If `true`, then tests will be run in Safari when on a Mac.
|`browsers.edge`   |`boolean`         |`true`                   |Indicates whether Edge is supported. If `true`, then tests will be run in Edge when on Windows.
|`browsers.ie`     |`boolean`         |`false`                  |Indicates whether Internet Explorer is supported. If `true`, then tests will be run in Internet Explorer when on Windows.
|`sourceDir`       |`string`          |`src`                    |The relative path of the source directory.
|`testDir`         |`string`          |`test`                   |The relative path of the test directory.
|`tests`           |`string` `string[]` `object` `object[]`|`${testDir}/**/*.spec.js` `${testDir}/**/*.test.js` `${testDir}/**/*.spec.jsx` `${testDir}/**/*.test.jsx` `${testDir}/**/*.spec.mjs` `${testDir}/**/*.test.mjs`|One or more [file patterns](https://karma-runner.github.io/3.0/config/files.html) that specify your test files. These are the files that will be bundled by Webpack and run by Karma.
|`serve`           |`string` `string[]` `object` `object[]`|`${testDir}/**/*`|One or more [file patterns](https://karma-runner.github.io/3.0/config/files.html) that Karma will allow to be served. This is useful for loading test data from CSV or JSON files.
|`transpile`       |`boolean`         |`false`*                 |Indicates whether your source code should be transpiled to ES5 syntax to support older web browsers. If set to `true`, then Webpack will be configured to use Babel.<br><br>* If the `browsers.ie` option is set to `true`, then this option also defaults to `true`. You can explicitly set it to `false` if desired.
|`coverage`        |`boolean`         |`false`                  |Indicates whether code coverage analysis should be performed. If set to `true`, then Webpack will be configured to inject code-coverage instrumentation and write code-coverage reports in the `./coverage/` directory.<br><br>This option can also be enabled by setting the `KARMA_COVERAGE` environment variable, or by using the `--coverage` command-line flag when running Karma.
|`platform`        |`string`          |[`process.platform`](https://nodejs.org/api/process.html#process_process_platform) |The operating system platform (e.g. "linux", "win32", "darwin", etc.). This determines which browsers will be launched by Karma.<br><br>This option can also be set via the `KARMA_PLATFORM` environment variable.
|`CI`              |`boolean`         |`false`                  |Indicates whether Karma is running in a CI environment. If set to `true`, then Karma will be configured to run headless browsers where possible.<br><br>This option can also be enabled by setting the `CI` or `KARMA_CI` environment variables.  Most CI/CD servers automatically set the `CI` environment variable.
|`config`          |`object`          |`{}`                     |Explicit Karma configuration settings. This is useful for adding additional settings that aren't normally set by Karma-Config, or for overriding Karma-Config's settings.



Contributing
--------------------------
Contributions, enhancements, and bug-fixes are welcome! [File an issue](https://github.com/JS-DevTools/karma-config/issues) on GitHub and [submit a pull request](https://github.com/JS-DevTools/karma-config/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. __Clone this repo__<br>
`git clone hhttps://github.com/JS-DevTools/karma-config.git`

2. __Install dependencies__<br>
`npm install`

3. __Build the code__<br>
`npm run build`

4. __Run the tests__<br>
`npm test`



License
--------------------------
karma-config is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.



Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jsdevtools.org/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jsdevtools.org/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jsdevtools.org/img/badges/coveralls.svg)](https://coveralls.io)
