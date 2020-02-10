Change Log
====================================================================================================
All notable changes will be documented in this file.
Karma Config adheres to [Semantic Versioning](http://semver.org/).



[v3.0.0](https://github.com/JS-DevTools/karma-config/tree/v3.0.0) (2020-02-09)
----------------------------------------------------------------------------------------------------

### Breaking Changes

- The `browsers` flags now indicate _exactly_ which browsers to run, _regardless_ of the operating system. In previous versions, these flags simply hinted at which browsers to run, but Karma-Config actually chose the browsers based on the operating system.

- Dropped support for the `KARMA_PLATFORM` environment variable. In previous versions, this environment variable was necessary to run SauceLabs tests for Windows browsers on non-windows systems. This is no longer necessary.

[Full Changelog](https://github.com/JS-DevTools/karma-config/compare/v2.0.0...v3.0.0)



[v2.0.0](https://github.com/JS-DevTools/karma-config/tree/v2.0.0) (2020-01-30)
----------------------------------------------------------------------------------------------------

### Breaking Changes

- Dropped support for Node 8.  Now requires Node 10+

### Other Changes

- The "karma-config" package is now just a wrapper around the scoped "@jsdevtools/karma-config" package

[Full Changelog](https://github.com/JS-DevTools/karma-config/compare/v1.5.8...v2.0.0)
