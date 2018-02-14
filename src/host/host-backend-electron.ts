import {HostBackend} from './host-backend';
import {Component} from 'es-injection';
import {remote, shell} from 'electron';

/**
 * Electron host backend
 */
@Component
class ElectronHostBackend extends HostBackend {

    /**
     * Minimize the application window
     */
    minimize(): void {
        remote.getCurrentWindow().minimize();
    }

    /**
     * Restore the application window
     */
    restore(): void {
        remote.getCurrentWindow().restore();
    }

    /**
     * Maximize the application window
     */
    maximize(): void {
        remote.getCurrentWindow().maximize();
    }

    /**
     * Close the application window
     */
    close(): void {
        remote.getCurrentWindow().close();
    }

    /**
     * Get the application path
     * @return Application path
     */
    getApplicationPath(): string {
        return remote.app.getAppPath();
    }

    /**
     * Open an URL
     * @param url URL
     */
    openUrl(url: string): void {
        shell.openExternal(url);
    }

    /**
     * Test whether the application is full-screen
     * @return true if the application is full-screen
     */
    isFullScreen(): boolean {
        return remote.getCurrentWindow().isFullScreen();
    }

    /**
     * Set whether the application is full-screen or not
     * @param fullScreen true if the application should be full-screen
     */
    setFullScreen(fullScreen: boolean): void {
        remote.getCurrentWindow().setFullScreen(fullScreen);
    }

}

export {
    ElectronHostBackend
};
