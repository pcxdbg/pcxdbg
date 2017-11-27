import {HostBackend} from './host-backend';
import {Component, Inject, PreDestroy} from 'injection';

/**
 * Host
 */
@Component
class Host {
    private backend: HostBackend;

    /**
     * Set the backend
     * @param hostBackend Host backend
     */
    @Inject
    setBackend(hostBackend: HostBackend): void {
        this.backend = hostBackend;
    }

    /**
     * Shuts the host down
     */
    @PreDestroy
    shutdown(): void {
        // Nothing to do
    }

    /**
     * Minimize the application window
     */
    minimize(): void {
        this.backend.minimize();
    }

    /**
     * Restore the application window
     */
    restore(): void {
        this.backend.restore();
    }

    /**
     * Maximize the application window
     */
    maximize(): void {
        this.backend.maximize();
    }

    /**
     * Close the application window
     */
    close(): void {
        this.backend.close();
    }

    /**
     * Get the application path
     * @return Application path
     */
    getApplicationPath(): string {
        return this.backend.getApplicationPath();
    }

    /**
     * Open an URL
     * @param url URL
     */
    openUrl(url: string): void {
        this.backend.openUrl(url);
    }

    /**
     * Test whether the application is full-screen
     * @return true if the application is full-screen
     */
    isFullScreen(): boolean {
        return this.backend.isFullScreen();
    }

    /**
     * Set whether the application is full-screen or not
     * @param fullScreen true if the application should be full-screen
     */
    setFullScreen(fullScreen: boolean): void {
        this.backend.setFullScreen(fullScreen);
    }

}

export {
    Host,
    HostBackend
};
