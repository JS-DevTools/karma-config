"use strict";

const karmaConfig = require("../../");
const { expect } = require("chai");

describe("package exports", () => {

  it("should export the karmaConfig function as a CommonJS export", () => {
    expect(karmaConfig).to.be.a("function");
    expect(karmaConfig.name).to.equal("karmaConfig");
    expect(karmaConfig.length).to.equal(1);
  });

  it("should export the karmaConfig function as the default ESM export", () => {
    expect(karmaConfig).to.have.property("default");
    expect(karmaConfig.default).to.be.a("function");
    expect(karmaConfig.default).to.equal(karmaConfig);
  });

  it("should export the buildConfig function", () => {
    expect(karmaConfig).to.have.property("buildConfig");
    expect(karmaConfig.buildConfig).to.be.a("function");
    expect(karmaConfig.buildConfig.name).to.equal("buildConfig");
    expect(karmaConfig.buildConfig.length).to.equal(1);
  });

  it("should not export anything else", () => {
    expect(karmaConfig).to.have.keys([
      "default",
      "buildConfig"
    ]);
  });

});
