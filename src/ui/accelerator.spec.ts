import {AcceleratorManager} from './accelerator';

describe('Accelerator manager', () => {
    let acceleratorManager: AcceleratorManager;

    beforeEach(() => {
        acceleratorManager = new AcceleratorManager();
    });

    it('can register multiple accelerators', () => {
        acceleratorManager.registerAccelerator('A', 'test-a');
        acceleratorManager.registerAccelerator('B', 'test-b');
    });

    it('cannot register the same accelerator more than once', () => {
        acceleratorManager.registerAccelerator('A', 'test');
        expect(() => {
            acceleratorManager.registerAccelerator('A', 'test');
        }).toThrowError(/already registered/);
    });

});
