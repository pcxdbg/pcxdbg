import {Application, ApplicationView} from './application';
import {AboutDialog, ExtensionsDialog, OpenConnectionDialog, OptionsDialog} from './dialogs';
import {CommandManager, ModalManager, WindowManager} from '../ui';
import {Module} from '../modules';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Application view', () => {
    let applicationView: ApplicationView;
    let application: jest.Mocked<Application>;
    let commandManager: jest.Mocked<CommandManager>;
    let windowManager: jest.Mocked<WindowManager>;
    let modalManager: jest.Mocked<ModalManager>;

    beforeEach(() => {
        application = createMockInstance(Application);
        commandManager = createMockInstance(CommandManager);
        commandManager.on.mockReturnThis();
        windowManager = createMockInstance(WindowManager);
        modalManager = createMockInstance(ModalManager);
        applicationView = new ApplicationView(application, commandManager, windowManager, modalManager);
    });

    afterEach(() => applicationView.shutdown());

    it('registers dialog box components', () => {
        let aboutDialog: jest.Mocked<AboutDialog> = createMockInstance(AboutDialog);
        let extensionsDialog: jest.Mocked<ExtensionsDialog> = createMockInstance(ExtensionsDialog);
        let openConnectionDialog: jest.Mocked<OpenConnectionDialog> = createMockInstance(OpenConnectionDialog);
        let optionsDialog: jest.Mocked<OptionsDialog> = createMockInstance(OptionsDialog);

        applicationView.setDialogComponents(aboutDialog, extensionsDialog, openConnectionDialog, optionsDialog);

        expect(modalManager.registerModal).toHaveBeenCalledTimes(4);
    });

    it('registers module components', () => {
        let mockModule: jest.Mocked<Module> = createMockInstance(Module);

        applicationView.setModules(mockModule);

        expect(mockModule.registerCommands).toHaveBeenCalledWith(commandManager);
        expect(mockModule.registerWindows).toHaveBeenCalledWith(windowManager);
    });

});
