import {PathUtils} from './path-utils';
import {Host} from 'host';
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

    afterEach(() => {
        pathUtils.shutdown();
    });

    it('can retrieve an application relative path', () => {
        // given
        host.getApplicationPath.mockReturnValue('appdir');
        // when
        let path1: string = pathUtils.getApplicationRelativePath();
        let path2: string = pathUtils.getApplicationRelativePath('subpath');
        let path3: string = pathUtils.getApplicationRelativePath('subpath', 'secondsubpath');
        // then
        expect(path1).toEqual(path.join('appdir'));
        expect(path2).toEqual(path.join('appdir', 'subpath'));
        expect(path3).toEqual(path.join('appdir', 'subpath', 'secondsubpath'));
    });

    it('can retrieve a modules relative path', () => {
        // given
        host.getApplicationPath.mockReturnValue('appdir');
        // when
        let path1: string = pathUtils.getModulesRelativePath();
        let path2: string = pathUtils.getModulesRelativePath('subpath');
        let path3: string = pathUtils.getModulesRelativePath('subpath', 'secondsubpath');
        // then
        expect(path1).toEqual(path.join('appdir', 'node_modules'));
        expect(path2).toEqual(path.join('appdir', 'node_modules', 'subpath'));
        expect(path3).toEqual(path.join('appdir', 'node_modules', 'subpath', 'secondsubpath'));
    });

});
