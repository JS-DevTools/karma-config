"use strict";

const karmaConfig = require("../../");
const { expect } = require("chai");
const { defaultConfig, mergeConfig } = require("../fixtures/config");
const envVars = require("../fixtures/env-vars");

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
      browsers: ["Firefox", "Chrome", "Safari"]
    });
  });

  it("should log the config if the logLevel is set", () => {
    let originalConsoleDebug = console.debug;
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

    let json = JSON.parse(args[1]);
    expect(json).to.deep.equal(defaultConfig);
  });

});
