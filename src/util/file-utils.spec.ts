import {FileUtils, NodePackage} from './file-utils';
import {PathUtils} from './path-utils';
import {createMockInstance} from 'jest-create-mock-instance';
import * as path from 'path';
import fs from 'jest-plugin-fs';

jest.mock('fs', () => require('jest-plugin-fs/mock'));

/**
 * Create a sample package.json file content
 * @return package.json file content
 */
function createPackageJsonContent(): string {
    let nodePackage: NodePackage = {
        name: 'test-name',
        description: 'test-desc',
        version: 'test-ver',
        license: 'test-lic',
        homepage: 'http://test'
    };

    return JSON.stringify(nodePackage);
}

describe('File utility functions', () => {
    let fileUtils: FileUtils;
    let pathUtils: jest.Mocked<PathUtils>;

    beforeEach(() => {
        fs.mock();
        pathUtils = createMockInstance(PathUtils);
        fileUtils = new FileUtils();
        fileUtils.setPathUtils(pathUtils);
    });

    afterEach(() => {
        fileUtils.shutdown();
        fs.restore();
    });

    it('can retrieve an application package', async () => {
        let nodePackage: NodePackage;
        pathUtils.getApplicationRelativePath.mockImplementation((...subPaths: string[]) => '/' + path.join('app', ...subPaths));
        fs.mock({
            app: {
                'package.json': createPackageJsonContent()
            }
        });

        nodePackage = await fileUtils.getApplicationPackage();

        expect(nodePackage).not.toBeNull();
        expect(nodePackage.name).toEqual('test-name');
        expect(nodePackage.description).toEqual('test-desc');
        expect(nodePackage.version).toEqual('test-ver');
        expect(nodePackage.license).toEqual('test-lic');
        expect(nodePackage.homepage).toEqual('http://test');
    });

    it('can retrieve a module package', async () => {
        let nodePackage: NodePackage;
        pathUtils.getModulesRelativePath.mockImplementation((...subPaths: string[]) => '/' + path.join('test', ...subPaths));
        fs.mock({
            test: {
                module: {
                    'package.json': createPackageJsonContent()
                }
            }
        });

        nodePackage = await fileUtils.getModulePackage('module');

        expect(nodePackage).not.toBeNull();
        expect(nodePackage.name).toEqual('test-name');
        expect(nodePackage.description).toEqual('test-desc');
        expect(nodePackage.version).toEqual('test-ver');
        expect(nodePackage.license).toEqual('test-lic');
        expect(nodePackage.homepage).toEqual('http://test');
    });

    it('can read a file\'s content', async () => {
        let fileContent: string;
        fs.mock({
            'test.txt': 'test content'
        });

        fileContent = await fileUtils.readFileContent('/test.txt');

        expect(fileContent).toEqual('test content');
    });

    it('can read a file\'s content as JSON', async () => {
        let fileContent: any;
        fs.mock({
            'test.json': '{"test":"value"}'
        });

        fileContent = await fileUtils.readJsonFileContent('/test.json');

        expect(fileContent).not.toBeNull();
        expect(fileContent.test).toEqual('value');
    });

    it('throws an exception when attempting to read a file that does not exist', async () => {
        // TODO: uncomment once a new version of jest is released - https://github.com/facebook/jest/pull/4884
        // await expect(fileUtils.readFileContent('/inexisting-file')).rejects.toThrow(/no such file/);
        let caughtError: Error;

        try {
            await fileUtils.readFileContent('/inexisting-file');
        } catch (e) {
            caughtError = e;
        }

        expect(caughtError.message).toMatch(/no such file/);
    });

});
