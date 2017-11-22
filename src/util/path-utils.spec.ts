import {PathUtils} from './path-utils';
import {Host} from '../host';
import {createMockInstance} from 'jest-create-mock-instance';
import * as path from 'path';

describe('Path utility functions', () => {
    let pathUtils: PathUtils;
    let host: jest.Mocked<Host>;

    beforeEach(() => {
        host = createMockInstance(Host);
        pathUtils = new PathUtils();
        pathUtils.setHost(host);
    });

    afterEach(() => pathUtils.shutdown());

    it('can retrieve an application relative path', () => {
        let path1: string;
        let path2: string;
        let path3: string;
        host.getApplicationPath.mockReturnValue('appdir');

        path1 = pathUtils.getApplicationRelativePath();
        path2 = pathUtils.getApplicationRelativePath('subpath');
        path3 = pathUtils.getApplicationRelativePath('subpath', 'secondsubpath');

        expect(path1).toEqual(path.join('appdir'));
        expect(path2).toEqual(path.join('appdir', 'subpath'));
        expect(path3).toEqual(path.join('appdir', 'subpath', 'secondsubpath'));
    });

    it('can retrieve a modules relative path', () => {
        let path1: string;
        let path2: string;
        let path3: string;
        host.getApplicationPath.mockReturnValue('appdir');

        path1 = pathUtils.getModulesRelativePath();
        path2 = pathUtils.getModulesRelativePath('subpath');
        path3 = pathUtils.getModulesRelativePath('subpath', 'secondsubpath');

        expect(path1).toEqual(path.join('appdir', 'node_modules'));
        expect(path2).toEqual(path.join('appdir', 'node_modules', 'subpath'));
        expect(path3).toEqual(path.join('appdir', 'node_modules', 'subpath', 'secondsubpath'));
    });

});
