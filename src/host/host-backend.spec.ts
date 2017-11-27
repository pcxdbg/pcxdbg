import {HostBackend} from './host-backend';

describe('Host backend', () => {

    it('throws an exception when a method is not implemented', () => {
        // given
        let hostBackend: HostBackend = new HostBackend();
        // expect
        expect(() => hostBackend.getApplicationPath()).toThrowError(/must be overriden/);
        expect(() => hostBackend.openUrl('test')).toThrowError(/must be overriden/);
        expect(() => hostBackend.isFullScreen()).toThrowError(/must be overriden/);
        expect(() => hostBackend.setFullScreen(false)).toThrowError(/must be overriden/);
    });

});
