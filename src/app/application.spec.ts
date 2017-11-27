import {Application, ApplicationView} from './application';
import {AboutDialog, ExtensionsDialog, OpenConnectionDialog, OptionsDialog} from './dialogs';
import {Host} from 'host';
import {createMockInstance} from 'jest-create-mock-instance';
import {Module} from 'modules';
import {CommandManager, DocumentManager, ModalManager, WindowManager} from 'ui';

describe('Application view', () => {
    let applicationView: ApplicationView;
    let application: jest.Mocked<Application>;
    let commandManager: jest.Mocked<CommandManager>;
    let documentManager: jest.Mocked<DocumentManager>;
    let modalManager: jest.Mocked<ModalManager>;
    let windowManager: jest.Mocked<WindowManager>;
    let host: jest.Mocked<Host>;

    beforeEach(() => {
        application = createMockInstance(Application);
        commandManager = createMockInstance(CommandManager);
        documentManager = createMockInstance(DocumentManager);
        modalManager = createMockInstance(ModalManager);
        windowManager = createMockInstance(WindowManager);
        host = createMockInstance(Host);

        commandManager.on.mockReturnThis();

        applicationView = new ApplicationView(application, commandManager, documentManager, modalManager, windowManager);
        applicationView.setHost(host);
    });

    afterEach(() => {
        applicationView.shutdown();
    });

    describe('registers', () => {

        it('dialog box components', () => {
            // Given
            let aboutDialog: jest.Mocked<AboutDialog> = createMockInstance(AboutDialog);
            let extensionsDialog: jest.Mocked<ExtensionsDialog> = createMockInstance(ExtensionsDialog);
            let openConnectionDialog: jest.Mocked<OpenConnectionDialog> = createMockInstance(OpenConnectionDialog);
            let optionsDialog: jest.Mocked<OptionsDialog> = createMockInstance(OptionsDialog);
            // When
            applicationView.setDialogComponents(aboutDialog, extensionsDialog, openConnectionDialog, optionsDialog);
            // Then
            expect(modalManager.registerModal).toHaveBeenCalledTimes(4);
        });

        it('module components', () => {
            // Given
            let mockModule: jest.Mocked<Module> = createMockInstance(Module);
            // When
            applicationView.setModules(mockModule);
            // Then
            expect(mockModule.registerCommands).toHaveBeenCalledWith(commandManager);
            expect(mockModule.registerWindows).toHaveBeenCalledWith(windowManager);
        });

    });

});
