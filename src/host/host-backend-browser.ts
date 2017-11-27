import {HostBackend} from './host-backend';
import {Component} from 'injection';

/**
 * Browser host back-end
 */
@Component
class BrowserHostBackend extends HostBackend {

    /**
     * Minimize the application window
     */
    minimize(): void {
        // TODO
    }

    /**
     * Restore the application window
     */
    restore(): void {
        // TODO
    }

    /**
     * Maximize the application window
     */
    maximize(): void {
        // TODO
    }

    /**
     * Close the application window
     */
    close(): void {
        // TODO
    }

    /**
     * Get the application path
     * @return Application path
     */
    getApplicationPath(): string {
        return window.location.toString();
    }

    /**
     * Open an URL
     * @param url URL
     */
    openUrl(url: string): void {
        window.open(url, '_blank');
    }

    /**
     * Test whether the application is full-screen
     * @return true if the application is full-screen
     */
    isFullScreen(): boolean {
        // TODO
        return false;
    }

    /**
     * Set whether the application is full-screen or not
     * @param fullScreen true if the application should be full-screen
     */
    setFullScreen(fullScreen: boolean): void {
        // TODO
    }

}

export {
    BrowserHostBackend
};
