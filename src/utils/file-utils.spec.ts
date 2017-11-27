import {FileUtils, NodePackage} from './file-utils';
import {PathUtils} from './path-utils';
import {createMockInstance} from 'jest-create-mock-instance';
import fs from 'jest-plugin-fs';
import * as path from 'path';

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

    describe('can retrieve', () => {

        it('an application package', async () => {
            // given
            pathUtils.getApplicationRelativePath.mockImplementation((...subPaths: string[]) => '/' + path.join('app', ...subPaths));
            fs.mock({ app: { 'package.json': createPackageJsonContent() } });
            // when
            let nodePackage: NodePackage = await fileUtils.getApplicationPackage();
            // then
            expect(nodePackage).not.toBeNull();
            expect(nodePackage.name).toEqual('test-name');
            expect(nodePackage.description).toEqual('test-desc');
            expect(nodePackage.version).toEqual('test-ver');
            expect(nodePackage.license).toEqual('test-lic');
            expect(nodePackage.homepage).toEqual('http://test');
        });

        it('a module package', async () => {
            // given
            pathUtils.getModulesRelativePath.mockImplementation((...subPaths: string[]) => '/' + path.join('test', ...subPaths));
            fs.mock({ test: { module: { 'package.json': createPackageJsonContent() } } });
            // when
            let nodePackage: NodePackage = await fileUtils.getModulePackage('module');
            // then
            expect(nodePackage).not.toBeNull();
            expect(nodePackage.name).toEqual('test-name');
            expect(nodePackage.description).toEqual('test-desc');
            expect(nodePackage.version).toEqual('test-ver');
            expect(nodePackage.license).toEqual('test-lic');
            expect(nodePackage.homepage).toEqual('http://test');
        });

    });

    describe('can read a file\'s content', () => {

        it('as text', async () => {
            // given
            fs.mock({ 'test.txt': 'test content' });
            // when
            let fileContent: string = await fileUtils.readFileContent('/test.txt');
            // then
            expect(fileContent).toEqual('test content');
        });

        it('as JSON', async () => {
            // given
            fs.mock({ 'test.json': '{"test":"value"}' });
            // when
            let fileContent: any = await fileUtils.readJsonFileContent('/test.json');
            // then
            expect(fileContent).not.toBeNull();
            expect(fileContent.test).toEqual('value');
        });

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
