import {Component} from '../component';
import {remote} from 'electron';
import * as path from 'path';

const PATH_NODEMODULES: string = '/node_modules';

/**
 * Path utility functions
 */
@Component
class PathUtils {

    /**
     * Get a path relative to the application path
     * @param subPaths Sub paths
     * @return Relative path
     */
    getApplicationRelativePath(...subPaths: string[]): string {
        return path.join(remote.app.getAppPath(), ...subPaths);
    }

    /**
     * Get a path relative to the modules path
     * @param subPaths Sub paths
     * @return Relative path
     */
    getModulesRelativePath(...subPaths: string[]): string {
        return this.getApplicationRelativePath(PATH_NODEMODULES, ...subPaths);
    }

}

export {
    PathUtils
};
