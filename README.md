# pcxdbg

[![AppVeyor](https://img.shields.io/appveyor/ci/rraziel/pcxdbg/master.svg?label=Win32&style=flat)](https://ci.appveyor.com/project/rraziel/pcxdbg)
[![CircleCI](https://img.shields.io/circleci/project/github/pcxdbg/pcxdbg/master.svg?label=MacOS&style=flat)](https://circleci.com/gh/pcxdbg/pcxdbg)
[![Travis CI](https://img.shields.io/travis/pcxdbg/pcxdbg/master.svg?label=Linux&style=flat)](https://travis-ci.org/pcxdbg/pcxdbg)
[![AppVeyor tests](https://img.shields.io/appveyor/tests/rraziel/pcxdbg/master.svg?label=Tests&style=flat)](https://ci.appveyor.com/project/rraziel/pcxdbg/build/tests)
[![Codecov](https://img.shields.io/codecov/c/github/pcxdbg/pcxdbg.svg?label=Coverage&style=flat)](https://codecov.io/gh/pcxdbg/pcxdbg)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/pcxdbg/pcxdbg.svg?label=Maintainability&style=flat)](https://codeclimate.com/github/pcxdbg/pcxdbg)
[![Code Climate](https://img.shields.io/codeclimate/issues/github/pcxdbg/pcxdbg.svg?label=Code%20Issues&style=flat)](https://codeclimate.com/github/pcxdbg/pcxdbg/issues)

[![Dependencies](https://img.shields.io/david/pcxdbg/pcxdbg.svg?label=Dependencies&style=flat)](https://david-dm.org/pcxdbg/pcxdbg)
[![Development dependencies](https://img.shields.io/david/dev/pcxdbg/pcxdbg.svg?label=Dev%20Dependencies&style=flat)](https://david-dm.org/pcxdbg/pcxdbg?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/pcxdbg/pcxdbg/badge.svg)](https://snyk.io/test/github/pcxdbg/pcxdbg)
[![Greenkeeper](https://badges.greenkeeper.io/pcxdbg/pcxdbg.svg)](https://greenkeeper.io/)

A cross-platform debugger front-end written in [TypeScript](https://www.typescriptlang.org/) and embedded within an [Electron](https://electron.atom.io/) host.

## Development

Install all dependencies with `npm install`, then an Electron host with live-reload can be started using:
 
```
npm run start
```

It is also possible to keep unit tests executing whenever code changes:

```
npm run test
```

## Packaging

The application can be packaged for any of the three supported platforms: Linux, MacOS or Windows.

```
npm run electron:win32
npm run electron:macos
npm run electron:linux
```

Note: only 64-bit binaries are built.
