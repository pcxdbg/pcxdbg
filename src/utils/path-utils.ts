import {Component, Inject, PreDestroy} from 'injection';
import {Host} from 'host';
import * as path from 'path';

/**
 * Path utility functions
 */
@Component
class PathUtils {
    private static PATH_NODEMODULES: string = '/node_modules';

    private host: Host;

    /**
     * Set the host
     * @param host Host
     */
    @Inject
    setHost(host: Host): void {
        this.host = host;
    }

    /**
     * Shut the utility functions down
     */
    @PreDestroy
    shutdown(): void {
        // Nothing to do
    }

    /**
     * Get a path relative to the application path
     * @param subPaths Sub paths
     * @return Relative path
     */
    getApplicationRelativePath(...subPaths: string[]): string {
        return path.join(this.host.getApplicationPath(), ...subPaths);
    }

    /**
     * Get a path relative to the modules path
     * @param subPaths Sub paths
     * @return Relative path
     */
    getModulesRelativePath(...subPaths: string[]): string {
        return this.getApplicationRelativePath(PathUtils.PATH_NODEMODULES, ...subPaths);
    }

}

export {
    PathUtils
};
