import {Window, WindowContainer, WindowManager} from './window';
import {CommandManager} from './command';
import {IconManager} from './icon';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Window', () => {
    let window: Window;

    // TODO: start testing once nwmatcher/nwsapi gets updated within jsdom - https://github.com/tmpvar/jsdom/issues/2028
    /*it('can hide a window', () => {
        window = new Window();

        window.show();
        window.hide();

        expect(window.hasAttribute('hidden')).toEqual(true);
    });

    it('can show a window', () => {
        window = new Window();

        window.hide();
        window.show();

        expect(window.hasAttribute('hidden')).toEqual(false);
    });*/
});

describe('Window container', () => {
    let windowContainer: WindowContainer;
    let windowManager: jest.Mocked<WindowManager>;
    let iconManager: jest.Mocked<IconManager>;

    beforeEach(() => {
        windowManager = createMockInstance(WindowManager);
        iconManager = createMockInstance(IconManager);
        windowContainer = new WindowContainer(windowManager, iconManager);
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
        let commandManager: jest.Mocked<CommandManager> = createMockInstance(CommandManager);

        windowManager.setCommandManager(commandManager);

        expect(commandManager.on).toHaveBeenCalledWith('window.open', expect.any(Function));
    });

});
