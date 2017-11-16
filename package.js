'use strict';

const packager = require('electron-packager');
const pkg = require('./package.json');
const argv = require('minimist')(process.argv.slice(1));

const PLATFORM_MACOS = 'darwin';
const PLATFORM_WIN32 = 'win32';
const PLATFORM_LINUX = 'linux';
const ARCHITECTURE_32BIT = 'ia32';
const ARCHITECTURE_64BIT = 'x64';

const appName = argv.name || pkg.name;
const appVersion = pkg.version || '1.0.0';
const useAsar = argv.asar || false;
const buildAll = argv.all || false;
const arch = argv.arch || 'all';
const platform = argv.platform || PLATFORM_WIN32;

const defaultOptions = {
    dir: './dist',
    name: appName,
    asar: useAsar,
    buildVersion: appVersion
};

function pack(platform, architecture, callback) {
    if (platform === PLATFORM_MACOS && architecture === ARCHITECTURE_32BIT) {
        return;
    }

    let icon;

    if (platform === PLATFORM_MACOS) {
        icon = 'src/ico/mac/icon.icns';
    } else if (platform === PLATFORM_WIN32) {
        icon = 'src/ico/win/icon.ico';
    } else if (platform === PLATFORM_LINUX) {
        icon = 'src/ico/png/1024x1024.png';
    }

    defaultOptions.icon = icon;

    const options = Object.assign({}, defaultOptions, {
        platform: platform,
        arch: architecture,
        prune: true,
        overwrite: true,
        all: buildAll,
        out: `build`
    });

    console.log(options);

    packager(options, callback);
}

pack(platform, arch, function done(err, applicationPath) {
    if (err) {
        console.error(err);
    } else {
        console.log('Application packaged successfuly', applicationPath);
    }
});

