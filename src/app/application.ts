import {CommandManager, ModalManager, UIElement, Window, WindowManager} from '../ui';
import {Component} from '../component';
import {TitleBarView, MainMenuView, StatusBarView, ToolbarContainerView} from './frame';
import {ApuModule, CameraModule, CpuModule, GpuModule, InputModule, Module, NetworkModule, OnlineModule, StorageModule, SystemModule} from '../modules';
import {AboutDialog, OpenConnectionDialog} from './dialogs';
import {HostExplorerView} from './host-explorer';
import {NetworkExplorerView} from './network-explorer';
import {COMMANDS} from './application-commands';
import {remote, shell} from 'electron';

/**
 * Application
 */
@Component
class Application {

    /**
     * Set the modules
     * @param apuModule     APU module
     * @param cameraModule  Camera module
     * @param cpuModule     CPU module
     * @param gpuModule     GPU module
     * @param inputModule   Input module
     * @param networkModule Network module
     * @param onlineModule  Online module
     * @param storageModule Storage module
     * @param systemModule  System module
     */
    @Component
    setModules(apuModule: ApuModule, cameraModule: CameraModule, cpuModule: CpuModule, gpuModule: GpuModule, inputModule: InputModule, networkModule: NetworkModule, onlineModule: OnlineModule, storageModule: StorageModule, systemModule: SystemModule): void {
        // Ensures injected modules are instantiated
    }

}

/**
 * Application view
 */
@Component
class ApplicationView extends UIElement {
    private commandManager: CommandManager;
    private windowManager: WindowManager;
    private modalManager: ModalManager;
    private application: Application;
    private clientArea: UIElement;

    /**
     * Class constructor
     * @param application    Application
     * @param commandManager Command manager
     * @param windowManager  Window manager
     * @param modalManager   Modal manager
     */
    constructor(application: Application, commandManager: CommandManager, windowManager: WindowManager, modalManager: ModalManager) {
        super('application');
        this.clientArea = new UIElement('application-client-area');
        this.commandManager = commandManager;
        this.modalManager = modalManager;
        this.windowManager = windowManager;
        this.windowManager.setAvailableArea(this.clientArea);

        window.addEventListener('focus', () => this.setFocus(true), false);
        window.addEventListener('blur', () => this.setFocus(false), false);
        if (document.hasFocus()) {
            this.setFocus(true);
        }

        this.registerCommands();
    }

    /**
     * Set the frame components
     * @param titleBarView         Title bar view
     * @param mainMenuView         Main menu view
     * @param toolbarContainerView Toolbar container view
     * @param statusBarView        Status bar view
     */
    @Component
    setFrameComponents(titleBarView: TitleBarView, mainMenuView: MainMenuView, toolbarContainerView: ToolbarContainerView, statusBarView: StatusBarView): void {
        [
            titleBarView,
            mainMenuView,
            toolbarContainerView,
            this.clientArea,
            statusBarView
        ].forEach(view => view.attachTo(this));

        document.body.appendChild(this.getNativeElement());
    }

    /**
     * Set the main components
     * @param hostExplorerView    Host explorer view
     * @param networkExplorerView Network explorer view
     */
    @Component
    setMainComponents(hostExplorerView: HostExplorerView, networkExplorerView: NetworkExplorerView): void {
        [
            hostExplorerView, networkExplorerView
        ].forEach(windowComponent => this.windowManager.registerWindow(windowComponent));
    }

    /**
     * Set the dialog components
     * @param aboutDialog About dialog
     */
    @Component
    setDialogComponents(aboutDialog: AboutDialog): void {
        [
            aboutDialog
        ].forEach(dialog => this.modalManager.registerModal(dialog));
    }

    /**
     * Set the modules
     * @param moduleList List of modules
     */
    @Component
    setModules(moduleList: Module[]): void {
        moduleList.forEach(module => {
            module.registerCommands(this.commandManager);
            module.registerWindows(this.windowManager);
        });
    }

    /**
     * Register commands
     */
    private registerCommands(): void {
        COMMANDS.forEach(command => this.commandManager.registerCommand(command));

        this.commandManager
            .on('external.open', (command, parameters) => this.onExternalOpenCommand(parameters.externalId))
            .on('view.fullscreen.toggle', () => this.onViewFullScreenToggleCommand())
        ;
    }

    /**
     * Set focus on the application
     * @param focus true if the application has focus
     */
    private setFocus(focus: boolean): void {
        if (focus) {
            this.attribute('has-focus', '');
        } else {
            this.removeAttribute('has-focus');
        }
    }

    /**
     * Handler for the external.open.* commands
     * @param externalId External identifier
     */
    private onExternalOpenCommand(externalId: string): void {
        let url: string;

        switch (externalId) {
        case 'report-bug':
            url = 'https://github.com/pcxdbg/pcxdbg/issues/new';
            break;
        default:
            console.error('Unknown external identifier "' + externalId + '"');
            return;
        }

        shell.openExternal(url);
    }

    /**
     * Handler for the view.fullscreen.toggle command
     */
    private onViewFullScreenToggleCommand(): void {
        let browserWindow: Electron.BrowserWindow = remote.getCurrentWindow();
        let fullScreen: boolean = !browserWindow.isFullScreen();

        if (fullScreen) {
            this.attribute('full-screen');
        } else {
            this.removeAttribute('full-screen');
        }

        browserWindow.setFullScreen(fullScreen);
    }

}

export {
    Application,
    ApplicationView
};
