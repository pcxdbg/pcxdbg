import {Component} from '../component';

/**
 * Host backend
 */
class HostBackend {

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

}

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
    @Component
    setBackend(hostBackend: HostBackend): void {
        this.backend = hostBackend;
    }

    /**
     * Shuts the host down
     */
    shutdown(): void {
        // Nothing to do
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

}

export {
    Host,
    HostBackend
};
