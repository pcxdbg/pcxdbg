import {Window, WindowManager} from './window';
import {CommandManager} from '../command';
import {IconManager} from '../element';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Window', () => {
    let window: Window;

    it('can hide a window', () => {
        // given
        window = new Window();
        // when
        window.show();
        window.hide();
        // then
        expect(window.hasAttribute('hidden')).toEqual(true);
    });

    it('can show a window', () => {
        // given
        window = new Window();
        // when
        window.hide();
        window.show();
        // then
        expect(window.hasAttribute('hidden')).toEqual(false);
    });

});

describe('Window manager', () => {
    let windowManager: WindowManager = new WindowManager();
    let iconManager: jest.Mocked<IconManager>;

    beforeEach(() => {
        iconManager = createMockInstance(IconManager);
        windowManager = new WindowManager();
        windowManager.setIconManager(iconManager);
    });

    it('registers for the set of commands it handles', () => {
        // given
        let commandManager: jest.Mocked<CommandManager> = createMockInstance(CommandManager);
        // when
        windowManager.setCommandManager(commandManager);
        // then
        expect(commandManager.on).toHaveBeenCalledWith('window.open', expect.any(Function));
    });

});
