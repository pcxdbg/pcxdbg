import {AcceleratorManager} from './accelerator-manager';
import {CommandManager} from '../command';
import {componentManager} from '../../component';
import {createMockInstance} from 'jest-create-mock-instance';

const KEY_SHIFT: number = 16;
const KEY_CONTROL: number = 17;
const KEY_ALT: number = 18;
const KEY_A: number = 65;
const KEY_B: number = 66;

/**
 * Build a keyboard event
 * @param key      Key code
 * @param ctrlKey  true if the control key is pressed
 * @param altKey   true if the alt key is pressed
 * @param shiftKey true if the shift is pressed
 * @return Keyboard event
 */
function createEvent(key: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean): KeyboardEvent {
    let evt: Event = <KeyboardEvent> new Event('keydown');

    evt.preventDefault = jest.fn();
    evt.stopPropagation = jest.fn();
    evt['which'] = key;
    evt['ctrlKey'] = ctrlKey || false;
    evt['altKey'] = altKey || false;
    evt['shiftKey'] = shiftKey || false;

    return <KeyboardEvent> evt;
}

describe('Accelerator manager', () => {
    let acceleratorManager: AcceleratorManager;
    let commandManager: jest.Mocked<CommandManager>;

    beforeEach(() => {
        acceleratorManager = new AcceleratorManager();
        commandManager = createMockInstance(CommandManager);
        componentManager.getComponent = () => <any> commandManager;
    });

    afterEach(() => acceleratorManager.shutdown());

    it('can register multiple accelerators', () => {
        acceleratorManager.registerAccelerator('A', 'test-a');
        acceleratorManager.registerAccelerator('B', 'test-b');
    });

    it('cannot register the same accelerator more than once', () => {
        acceleratorManager.registerAccelerator('A', 'test');

        expect(() => acceleratorManager.registerAccelerator('A', 'test')).toThrowError(/already registered/);
    });

    it('ignores combinations with no registered accelerator', () => {
        let keyboardEvent: KeyboardEvent = createEvent(KEY_B);

        acceleratorManager.registerAccelerator('A', 'test');
        document.dispatchEvent(keyboardEvent);

        expect(commandManager.executeCommand).not.toHaveBeenCalled();
    });

    it('executes the registered command for a matching combination', () => {
        let keyboardEvent: KeyboardEvent = createEvent(KEY_A);

        acceleratorManager.registerAccelerator('A', 'test', {x: 1});
        document.dispatchEvent(keyboardEvent);

        expect(commandManager.executeCommand).toHaveBeenCalledWith('test', {x: 1});
    });

    it('cancels default behavior for registered combinations', () => {
        let keyboardEvent: KeyboardEvent = createEvent(KEY_A);

        acceleratorManager.registerAccelerator('A', 'test');
        document.dispatchEvent(keyboardEvent);

        expect(keyboardEvent.preventDefault).toHaveBeenCalled();
        expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
        expect(keyboardEvent.returnValue).toEqual(false);
    });

    it('does not cancel default behavior for unregistered combinations', () => {
        let keyboardEvent: KeyboardEvent = createEvent(KEY_B);

        acceleratorManager.registerAccelerator('A', 'test');
        document.dispatchEvent(keyboardEvent);

        expect(keyboardEvent.preventDefault).not.toHaveBeenCalled();
        expect(keyboardEvent.stopPropagation).not.toHaveBeenCalled();
        expect(keyboardEvent.returnValue).toEqual(undefined);
    });

    describe('ignores modifier keys when building a combination', () => {

        it('Ctrl key', () => {
            // given
            let keyboardEvent: KeyboardEvent = createEvent(KEY_CONTROL, true, true, false);
            // when
            acceleratorManager.registerAccelerator('Ctrl+Alt', 'test');
            document.dispatchEvent(keyboardEvent);
            // then
            expect(commandManager.executeCommand).toHaveBeenCalledWith('test', undefined);
        });

        it('Alt key', () => {
            // given
            let keyboardEvent: KeyboardEvent = createEvent(KEY_ALT, true, true, false);
            // when
            acceleratorManager.registerAccelerator('Ctrl+Alt', 'test');
            document.dispatchEvent(keyboardEvent);
            // then
            expect(commandManager.executeCommand).toHaveBeenCalledWith('test', undefined);
        });

        it('Shift key', () => {
            // given
            let keyboardEvent: KeyboardEvent = createEvent(KEY_SHIFT, true, false, true);
            // when
            acceleratorManager.registerAccelerator('Ctrl+Shift', 'test');
            document.dispatchEvent(keyboardEvent);
            // then
            expect(commandManager.executeCommand).toHaveBeenCalledWith('test', undefined);
        });

    });

});
