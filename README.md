# pcxdbg
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)](https://github.com/pcxdbg/pcxdbg/blob/master/LICENSE)
[![License](https://img.shields.io/badge/Language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Known Vulnerabilities](https://snyk.io/test/github/pcxdbg/pcxdbg/badge.svg)](https://snyk.io/test/github/pcxdbg/pcxdbg)

A cross-platform debugger front-end written in [TypeScript](https://www.typescriptlang.org/) and embedded within an [Electron](https://electron.atom.io/) host.

## Development

The only requirement to build the application is to have Node.js installed. Once that is done, install all dependencies with:

```npm i```

Then an Electron host with live reload can be started using:

```npm run start```

## Packaging

The application can be packaged for any of the three supported platforms: Linux, MacOS or Windows. In each case, only the 64-bit version of those platforms is supported.

To build the Linux binaries:

```npm run electron:linux```

To build the MacOS binaries:

```npm run electron:macos```

To build the Windows binaries:

```npm run electron:win32```
