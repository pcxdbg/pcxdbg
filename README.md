# pcxdbg

[![AppVeyor](https://img.shields.io/appveyor/ci/rraziel/pcxdbg.svg?label=Win32&style=flat)](https://ci.appveyor.com/project/rraziel/pcxdbg)
[![CircleCI](https://img.shields.io/circleci/project/github/pcxdbg/pcxdbg.svg?label=MacOS&style=flat)](https://circleci.com/gh/pcxdbg/pcxdbg)
[![Travis CI](https://img.shields.io/travis/pcxdbg/pcxdbg.svg?label=Linux&style=flat)](https://travis-ci.org/pcxdbg/pcxdbg)
[![AppVeyor tests](https://img.shields.io/appveyor/tests/rraziel/pcxdbg.svg?label=Tests&style=flat)](https://ci.appveyor.com/project/rraziel/pcxdbg/build/tests)
[![Codecov](https://img.shields.io/codecov/c/github/pcxdbg/pcxdbg.svg?label=Coverage&style=flat)](https://codecov.io/gh/pcxdbg/pcxdbg)
[![Greenkeeper](https://badges.greenkeeper.io/pcxdbg/pcxdbg.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/pcxdbg/pcxdbg/badge.svg)](https://snyk.io/test/github/pcxdbg/pcxdbg)

A cross-platform debugger front-end written in [TypeScript](https://www.typescriptlang.org/) and embedded within an [Electron](https://electron.atom.io/) host.

## Development

The only requirement to build the application is to have Node.js installed. Once that is done, install all dependencies with:

```npm i```

Then an Electron host with live reload can be started using:

```npm run start```

## Packaging

The application can be packaged for any of the three supported platforms: Linux, MacOS or Windows.

* Linux: ```npm run electron:linux```
* MacOS: ```npm run electron:macos```
* Windows: ```npm run electron:win32```

Note: only 64-bit binaries are built.
