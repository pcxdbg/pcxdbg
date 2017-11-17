import {UIElement} from '../ui/element';
import {Window, WindowManager} from '../ui/window';
import {ModalManager} from '../ui/modal';
import {TitleBarView} from './title-bar';
import {MainMenuView} from './main-menu';
import {StatusBarView} from './status-bar';
import {HostExplorerView} from './host-explorer';
import {NetworkExplorerView} from './network-explorer';
import {AboutDialog} from './dialogs/about-dialog';
import {ApuModule} from '../modules/apu';
import {CameraModule} from '../modules/camera';
import {CpuModule} from '../modules/cpu';
import {GpuModule} from '../modules/gpu';
import {InputModule} from '../modules/input';
import {NetworkModule} from '../modules/network';
import {OnlineModule} from '../modules/online';
import {StorageModule} from '../modules/storage';
import {SystemModule} from '../modules/system';
import {Component} from '../component';

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

    /**
     * Class constructor
     * @param application   Application
     * @param windowManager Window manager
     * @param modalManager  Modal manager
     */
    constructor(application: Application, windowManager: WindowManager, modalManager: ModalManager) {
        super('application');
        this.modalManager = modalManager;
        this.windowManager = windowManager;
        this.windowManager.setAvailableArea(this, {
            top: 88,
            right: 6,
            bottom: 29,
            left: 6
        });

        window.addEventListener('focus', () => this.setFocus(true), false);
        window.addEventListener('blur', () => this.setFocus(false), false);
        if (document.hasFocus()) {
            this.setFocus(true);
        }

        document.body.appendChild(this.getNativeElement());
    }

    /**
     * Set the frame components
     * @param titleBarView  Title bar view
     * @param mainMenuView  Main menu view
     * @param statusBarView Status bar view
     */
    @Component
    setFrameComponents(titleBarView: TitleBarView, mainMenuView: MainMenuView, statusBarView: StatusBarView): void {
        titleBarView.attachTo(this);
        mainMenuView.attachTo(this);
        statusBarView.attachTo(this);
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
