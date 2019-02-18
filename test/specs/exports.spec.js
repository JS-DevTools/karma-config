"use strict";

const commonJSExport = require("../../");
const { default: defaultExport, karmaConfig: namedExport, buildConfig } = require("../../");
const { expect } = require("chai");

describe("package exports", () => {

  it("should export the karmaConfig function the default CommonJS export", () => {
    expect(commonJSExport).to.be.a("function");
    expect(commonJSExport.name).to.equal("karmaConfig");
    expect(commonJSExport.length).to.equal(1);
  });

  it("should export the karmaConfig function as the default ESM export", () => {
    expect(defaultExport).to.be.a("function");
    expect(defaultExport).to.equal(commonJSExport);
  });

  it("should export the karmaConfig function as a named ESM export", () => {
    expect(namedExport).to.be.a("function");
    expect(namedExport).to.equal(defaultExport);
  });

  it("should export the buildConfig function", () => {
    expect(buildConfig).to.be.a("function");
    expect(buildConfig.name).to.equal("buildConfig");
    expect(buildConfig.length).to.equal(1);
  });

  it("should not export anything else", () => {
    expect(commonJSExport).to.have.keys([
      "default",
      "buildConfig",
      "karmaConfig",
    ]);
  });

});
