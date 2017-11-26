import {Host, HostBackend} from './host';
import {createMockInstance} from 'jest-create-mock-instance';

describe('HostBackend', () => {

    it('throws an exception when a method is not implemented', () => {
        // Given
        let hostBackend: HostBackend = new HostBackend();
        // Expect
        expect(() => hostBackend.getApplicationPath()).toThrowError(/must be overriden/);
        expect(() => hostBackend.openUrl('test')).toThrowError(/must be overriden/);
    });

});

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
            // Given
            hostBackend.getApplicationPath.mockReturnValueOnce('test-app-path');
            // When
            let appPath: string = host.getApplicationPath();
            // Then
            expect(hostBackend.getApplicationPath).toHaveBeenCalledTimes(1);
            expect(appPath).toEqual('test-app-path');
        });

        it('opening an URL', () => {
            // When
            hostBackend.openUrl('test-url');
            // Then
            expect(hostBackend.openUrl).toHaveBeenCalledWith('test-url');
        });

    });

});
