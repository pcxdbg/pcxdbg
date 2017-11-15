import {Component} from '../component';
import * as fs from 'fs';

const DEFAULT_CHARSET: string = 'utf-8';

/**
 * File utility functions
 */
@Component
class FileUtils {

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
            fs.readFile(fileName, charset || DEFAULT_CHARSET, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }

}

export {
    FileUtils
};
