import {PathUtils} from './path-utils';
import {Component, Inject, PreDestroy} from 'es-injection';
import * as fs from 'fs';

/**
 * Node package
 */
interface NodePackage {
    name: string;
    description?: string;
    homepage?: string;
    license: string;
    version: string;
    dependencies?: {[dependencyName: string]: string};
}

/**
 * File utility functions
 */
@Component
class FileUtils {
    private static DEFAULT_CHARSET: string = 'utf-8';
    private static FILENAME_PACKAGEJSON: string = 'package.json';

    private pathUtils: PathUtils;

    /**
     * Set the path utility functions
     * @param pathUtils Path utility functions
     */
    @Inject
    setPathUtils(pathUtils: PathUtils): void {
        this.pathUtils = pathUtils;
    }

    /**
     * Shut the file utilities down
     */
    @PreDestroy
    shutdown(): void {
        // Nothing to do
    }

    /**
     * Get the application package
     * @return Application package
     */
    async getApplicationPackage(): Promise<NodePackage> {
        let packagePath: string = this.pathUtils.getApplicationRelativePath(FileUtils.FILENAME_PACKAGEJSON);
        return await this.getNodePackage(packagePath);
    }

    /**
     * Get a module package
     * @param moduleName Module name
     * @return Module package
     */
    async getModulePackage(moduleName: string): Promise<NodePackage> {
        let packagePath: string = this.pathUtils.getModulesRelativePath(moduleName, FileUtils.FILENAME_PACKAGEJSON);
        return await this.getNodePackage(packagePath);
    }

    /**
     * Read a file's content as JSON
     * @param fileName File name
     * @param charset  Character set
     * @return Promise that resolves to the file's parsed JSON content
     */
    async readJsonFileContent<T>(fileName: string, charset?: string): Promise<T> {
        let fileContent: string = await this.readFileContent(fileName, charset);
        return JSON.parse(fileContent);
    }

    /**
     * Read a file's content
     * @param fileName File name
     * @param charset  Character set
     * @return Promise that resolves to the file's content
     */
    readFileContent(fileName: string, charset?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, charset || FileUtils.DEFAULT_CHARSET, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Get a Node package
     * @param packagePath Package path
     * @return Package
     */
    private async getNodePackage(packagePath): Promise<NodePackage> {
        let packageContent: string = await this.readFileContent(packagePath);
        return <NodePackage> JSON.parse(packageContent);
    }

}

export {
    FileUtils,
    NodePackage
};
