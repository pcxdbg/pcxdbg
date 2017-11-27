import {Host} from './host';
import {HostBackend} from './host-backend';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Host', () => {
    let host: Host;
    let hostBackend: jest.Mocked<HostBackend>;

    beforeEach(() => {
        hostBackend = createMockInstance(HostBackend);
        host = new Host();
        host.setBackend(hostBackend);
    });

    describe('delegates to its backend when', () => {

        it('retrieving the application path', () => {
            // given
            hostBackend.getApplicationPath.mockReturnValueOnce('test-app-path');
            // when
            let appPath: string = host.getApplicationPath();
            // then
            expect(hostBackend.getApplicationPath).toHaveBeenCalledTimes(1);
            expect(appPath).toEqual('test-app-path');
        });

        it('opening an URL', () => {
            // when
            hostBackend.openUrl('test-url');
            // then
            expect(hostBackend.openUrl).toHaveBeenCalledTimes(1);
            expect(hostBackend.openUrl).toHaveBeenCalledWith('test-url');
        });

        it('testing whether the application is full-screen', () => {
            // given
            hostBackend.isFullScreen.mockReturnValueOnce(true);
            // when
            let isFullScreen: boolean = host.isFullScreen();
            // then
            expect(hostBackend.isFullScreen).toHaveBeenCalledTimes(1);
            expect(isFullScreen).toEqual(true);
        });

        it('setting whether the application is full-screen', () => {
            // when
            host.setFullScreen(true);
            // then
            expect(hostBackend.setFullScreen).toHaveBeenCalledTimes(1);
            expect(hostBackend.setFullScreen).toHaveBeenCalledWith(true);
        });

    });

});
