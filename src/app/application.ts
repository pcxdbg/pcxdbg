import {UIElement} from '../ui/element';
import {Component} from '../component';
import {Window, WindowManager} from '../ui/window';
import {ModalManager} from '../ui/modal';
import {TitleBarView, MainMenuView, StatusBarView, ToolbarContainerView} from './frame';
import {HostExplorerView} from './host-explorer';
import {NetworkExplorerView} from './network-explorer';
import {AboutDialog, OpenConnectionDialog} from './dialogs';
import {ApuModule, CameraModule, CpuModule, GpuModule, InputModule, NetworkModule, OnlineModule, StorageModule, SystemModule} from '../modules';

/**
 * Application
 */
@Component
class Application {

}

/**
 * Application view
 */
@Component
class ApplicationView extends UIElement {
    private windowManager: WindowManager;
    private modalManager: ModalManager;
    private application: Application;
    private clientArea: UIElement;

    /**
     * Class constructor
     * @param application   Application
     * @param windowManager Window manager
     * @param modalManager  Modal manager
     */
    constructor(application: Application, windowManager: WindowManager, modalManager: ModalManager) {
        super('application');
        this.clientArea = new UIElement('application-client-area');
        this.modalManager = modalManager;
        this.windowManager = windowManager;
        this.windowManager.setAvailableArea(this.clientArea);

        window.addEventListener('focus', () => this.setFocus(true), false);
        window.addEventListener('blur', () => this.setFocus(false), false);
        if (document.hasFocus()) {
            this.setFocus(true);
        }
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

}

export {
    Application,
    ApplicationView
};
