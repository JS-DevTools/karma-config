"use strict";

const karmaConfig = require("../../");
const { expect } = require("chai");
const { mergeConfig } = require("../utils/config");
const envVars = require("../utils/env-vars");

describe("karmaConfig()", () => {
  beforeEach(envVars.override);
  afterEach(envVars.restore);

  function testConfigureKarma (fn, expected) {
    let actual;
    expect(fn).to.be.a("function").with.property("name", "configureKarma");
    fn({ set (config) { actual = config; } });
    expect(actual).to.deep.equal(mergeConfig(expected));
  }

  it("should work without any arguments", () => {
    let fn;

    function noArgs () {
      fn = karmaConfig();
    }

    expect(noArgs).not.to.throw();
    testConfigureKarma(fn);
  });

  it("should work with an empty options object", () => {
    let fn;

    function emptyOptions () {
      fn = karmaConfig({});
    }

    expect(emptyOptions).not.to.throw();
    testConfigureKarma(fn);
  });

  it("should accept an options object", () => {
    let fn;

    function withOptions () {
      fn = karmaConfig({
        platform: "MacOS"
      });
    }

    expect(withOptions).not.to.throw();
    testConfigureKarma(fn, {
      browsers: ["Safari"]
    });
  });

  it("should log the config if the logLevel is set", () => {
    let originalConsoleDebug = console.debug;
    let nodeVersion = parseFloat(process.version.substr(1));
    let args;

    console.debug = function mockConsoleDebug () {
      args = arguments;
    };

    karmaConfig()({
      LOG_DISABLE: 1,
      set () {},
    });

    console.debug = originalConsoleDebug;

    expect(args).to.be.an("arguments");
    expect(args.length).to.equal(2);
    expect(args[0]).to.equal("Karma Config:\n");

    if (nodeVersion >= 9.9) {
      expect(args[1]).to.contain(
        "  frameworks: [\n" +
        "    \u001b[32m'mocha'\u001b[39m,\n" +
        "    \u001b[32m'host-environment'\u001b[39m\n" +
        "  ],\n"
      );
    }
    else {
      // The `compact: false` option isn't supported on older versions of Node
      expect(args[1]).to.contain(
        "frameworks: [ \u001b[32m\'mocha\'\u001b[39m, \u001b[32m\'host-environment\'\u001b[39m ],\n"
      );
    }
  });

});
