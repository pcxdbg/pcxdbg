import {COMMANDS} from './application-commands';
import {AboutDialog, ExtensionsDialog, OpenConnectionDialog, OptionsDialog} from './dialogs';
import {TitleBarView, MainMenuView, StatusBarView, ToolbarContainerView} from './frame';
import {HostExplorerView, NetworkExplorerView, OutputWindowView} from './windows';
import {Component, Controller, Inject, PreDestroy} from 'es-injection';
import {Host} from 'host';
import {ApuModule, CameraModule, CpuModule, GpuModule, InputModule, Module, NetworkModule, OnlineModule, StorageModule, SystemModule} from 'modules';
import {CommandManager, DocumentManager, ModalManager, UIElementBase, Window, WindowManager} from 'ui';

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
    @Inject
    setModules(apuModule: ApuModule, cameraModule: CameraModule, cpuModule: CpuModule, gpuModule: GpuModule, inputModule: InputModule, networkModule: NetworkModule, onlineModule: OnlineModule, storageModule: StorageModule, systemModule: SystemModule): void {
        // Ensures injected modules are instantiated
    }

}

/**
 * Application client area
 */
class ApplicationClientArea extends UIElementBase {

    /**
     * Class constructor
     */
    constructor() {
        super('application-client-area');
    }

}

/**
 * Application view
 */
@Controller
class ApplicationView extends UIElementBase {
    private static URL_REPORTBUG: string = 'https://github.com/pcxdbg/pcxdbg/issues/new';

    private commandManager: CommandManager;
    private windowManager: WindowManager;
    private modalManager: ModalManager;
    private application: Application;
    private clientArea: ApplicationClientArea;
    private host: Host;

    /**
     * Class constructor
     * @param application       Application
     * @param commandManager    Command manager
     * @param documentManager   Document manager
     * @param modalManager      Modal manager
     * @param windowManager     Window manager
     */
    constructor(application: Application, commandManager: CommandManager, documentManager: DocumentManager, modalManager: ModalManager, windowManager: WindowManager) {
        super('application');
        this.clientArea = new ApplicationClientArea();
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
     * Shut the application down
     */
    @PreDestroy
    shutdown(): void {
        // Nothing to do
    }

    /**
     * Set the host
     * @param host Host
     */
    @Inject
    setHost(host: Host): void {
        this.host = host;
    }

    /**
     * Set the frame components
     * @param titleBarView         Title bar view
     * @param mainMenuView         Main menu view
     * @param toolbarContainerView Toolbar container view
     * @param statusBarView        Status bar view
     */
    @Inject
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
     * @param outputWindowView    Output window view
     */
    @Inject
    setMainComponents(hostExplorerView: HostExplorerView, networkExplorerView: NetworkExplorerView, outputWindowView: OutputWindowView): void {
        [
            hostExplorerView,
            networkExplorerView,
            outputWindowView
        ].forEach(windowComponent => this.windowManager.registerWindow(windowComponent));
    }

    /**
     * Set the dialog components
     * @param aboutDialog          About dialog
     * @param extensionsDialog     Extensions dialog
     * @param openConnectionDialog Open connection dialog
     * @param optionsDialog        Options dialog
     */
    @Inject
    setDialogComponents(aboutDialog: AboutDialog, extensionsDialog: ExtensionsDialog, openConnectionDialog: OpenConnectionDialog, optionsDialog: OptionsDialog): void {
        [
            aboutDialog,
            extensionsDialog,
            openConnectionDialog,
            optionsDialog
        ].forEach(dialog => this.modalManager.registerModal(dialog));
    }

    /**
     * Set the modules
     * @param moduleList List of modules
     */
    @Inject
    setModules(...moduleList: Module[]): void {
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
            .on('external.open', parameters => this.onExternalOpenCommand(parameters.externalId))
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
            url = ApplicationView.URL_REPORTBUG;
            break;
        default:
            console.error('Unknown external identifier "' + externalId + '"');
            return;
        }

        this.host.openUrl(url);
    }

    /**
     * Handler for the view.fullscreen.toggle command
     */
    private onViewFullScreenToggleCommand(): void {
        let fullScreen: boolean = !this.host.isFullScreen();

        if (fullScreen) {
            this.attribute('full-screen');
        } else {
            this.removeAttribute('full-screen');
        }

        this.host.setFullScreen(fullScreen);
    }

}

export {
    Application,
    ApplicationView
};
