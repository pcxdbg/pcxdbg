import {app, BrowserWindow, screen} from 'electron';
import * as path from 'path';

const PLATFORM_MACOS: string = 'darwin';

const commandLineArguments: string[] = process.argv.slice(1);

let browserWindow: Electron.BrowserWindow = null;
let serveMode: boolean = commandLineArguments.some(value => value === '--serve');

if (serveMode) {
    require('electron-reload')(__dirname, {});
}

/**
 * Create the browser window
 */
function createBrowserWindow(): void {
    let electronScreen: Electron.Screen = screen;
    let workAreaSize: Electron.Size = electronScreen.getPrimaryDisplay().workAreaSize;
    let options: Electron.BrowserWindowConstructorOptions = {
        center: true,
        width: Math.floor(workAreaSize.width * 0.8),
        height: Math.floor(workAreaSize.height * 0.8),
        minWidth: 800,
        minHeight: 600,
        frame: false, // TODO: frame: true, titeBarStyle: 'hidden' for OS X?
        title: 'pcxdbg',
        backgroundColor: '#2d2d30'
    };

    browserWindow = new BrowserWindow(options);
    browserWindow.loadURL('file://' + __dirname + '/index.html');

    if (serveMode) {
        browserWindow.webContents.openDevTools();
    }

    browserWindow.on('closed', () => browserWindow = null);
}

try {
    app.on('activate', () => {
        if (browserWindow === null) {
            createBrowserWindow();
        }
    })
    app.on('ready', () => createBrowserWindow());
    app.on('window-all-closed', () => {
        if (process.platform !== PLATFORM_MACOS) {
            app.quit();
        }
    });
} catch (e) {
    throw e;
}
