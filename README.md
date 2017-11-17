# pcxdbg

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)](https://github.com/pcxdbg/pcxdbg/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/Language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Travis CI](https://img.shields.io/travis/pcxdbg/pcxdbg.svg?style=flat-square)](https://travis-ci.org/pcxdbg/pcxdbg)
[![Known Vulnerabilities](https://snyk.io/test/github/pcxdbg/pcxdbg/badge.svg)](https://snyk.io/test/github/pcxdbg/pcxdbg)
[![Greenkeeper](https://badges.greenkeeper.io/pcxdbg/pcxdbg.svg)](https://greenkeeper.io/)

A cross-platform debugger front-end written in [TypeScript](https://www.typescriptlang.org/) and embedded within an [Electron](https://electron.atom.io/) host.

## Development

The only requirement to build the application is to have Node.js installed. Once that is done, install all dependencies with:

```npm i```

Then an Electron host with live reload can be started using:

```npm run start```

## Packaging

The application can be packaged for any of the three supported platforms: Linux, MacOS or Windows. For each platform, only 64-bit version of the binaries are built.

* Linux: ```npm run electron:linux```
* MacOS: ```npm run electron:macos```
* Windows: ```npm run electron:win32```
