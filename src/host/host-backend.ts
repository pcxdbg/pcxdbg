
/**
 * Host backend
 */
class HostBackend { // TODO: replace with an interface once the external injection library is used

    /**
     * Minimize the application window
     */
    minimize(): void {
        throw new Error('HostBackend.minimize must be overriden');
    }

    /**
     * Restore the application window
     */
    restore(): void {
        throw new Error('HostBackend.restore must be overriden');
    }

    /**
     * Maximize the application window
     */
    maximize(): void {
        throw new Error('HostBackend.maximize must be overriden');
    }

    /**
     * Close the application window
     */
    close(): void {
        throw new Error('HostBackend.close must be overriden');
    }

    /**
     * Get the application path
     * @return Application path
     */
    getApplicationPath(): string {
        throw new Error('HostBackend.getApplicationPath must be overriden');
    }

    /**
     * Open an URL
     * @param url URL
     */
    openUrl(url: string): void {
        throw new Error('HostBackend.openUrl must be overriden');
    }

    /**
     * Test whether the application is full-screen
     * @return true if the application is full-screen
     */
    isFullScreen(): boolean {
        throw new Error('HostBackend.isFullScreen must be overriden');
    }

    /**
     * Set whether the application is full-screen or not
     * @param fullScreen true if the application should be full-screen
     */
    setFullScreen(fullScreen: boolean): void {
        throw new Error('HostBackend.setFullScreen must be overriden');
    }

}

export {
    HostBackend
};
