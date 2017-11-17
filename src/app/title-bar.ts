import {AttachableElement, ContainerElement} from '../ui/element';
import {Component} from '../component';
import {Icon, IconManager} from '../ui/icon';
import {I18nManager} from '../lng/i18n';
import {QuickLaunch} from './quick-launch';
import {remote} from 'electron';

/**
 * Title bar control icon
 */
class TitleBarControlIcon {
    name: string;
    action: () => void;
}

/**
 * Title bar view
 */
@Component
class TitleBarView extends AttachableElement {
    private static ICON_LOGO: string = 'title-bar-logo';
    private static ICON_MINIMIZE: string = 'title-bar-minimize';
    private static ICON_RESTORE: string = 'title-bar-restore';
    private static ICON_MAXIMIZE: string = 'title-bar-maximize';
    private static ICON_CLOSE: string = 'title-bar-close';
    private static HTML: string = `
        <title-bar-application>
            <title-bar-application-icon></title-bar-application-icon>
            <title-bar-application-title i18n="app:title-bar.label"></title-bar-application-title>
        </title-bar-application>
        <title-bar-controls>
            <title-bar-control-icons>
                <title-bar-control-icon i18n="[title]app:title-bar.controls.minimize"></title-bar-control-icon>
                <title-bar-control-icon i18n="[title]app:title-bar.controls.restore"></title-bar-control-icon>
                <title-bar-control-icon i18n="[title]app:title-bar.controls.maximize"></title-bar-control-icon>
                <title-bar-control-icon i18n="[title]app:title-bar.controls.close"></title-bar-control-icon>
            </title-bar-control-icons>
        </title-bar-controls>
    `;

    private labelTitle: ContainerElement;
    private maximized: boolean;
    private iconLogo: Icon;

    /**
     * Class constructor
     * @param iconManager Icon manager
     * @param quickLaunch Quick launch
     */
    constructor(iconManager: IconManager, quickLaunch: QuickLaunch) {
        super('title-bar', TitleBarView.HTML);
        let iconContainers: ContainerElement[];
        let titleBarControlIcons: TitleBarControlIcon[] = [
            { name: TitleBarView.ICON_MINIMIZE, action: () => this.minimize() },
            { name: TitleBarView.ICON_RESTORE, action: () => this.restore() },
            { name: TitleBarView.ICON_MAXIMIZE, action: () => this.maximize() },
            { name: TitleBarView.ICON_CLOSE, action: () => this.close() }
        ];

        iconManager.createIcon(24, 24, TitleBarView.ICON_LOGO).attachTo(this.selectContainer(':scope > title-bar-application > title-bar-application-icon'));

        this.labelTitle = this.selectContainer(':scope > title-bar-application > title-bar-application-title');

        this.selectContainer(':scope > title-bar-controls').attach(quickLaunch);

        iconContainers = this.selectContainers(':scope > title-bar-controls > title-bar-control-icons > title-bar-control-icon');
        for (let i: number = 0; i !== titleBarControlIcons.length; ++i) {
            let titleBarControlIcon: TitleBarControlIcon = titleBarControlIcons[i];
            let iconContainer: ContainerElement = iconContainers[i];

            iconContainer.click(titleBarControlIcon.action);
            iconManager.createIcon(16, 16, titleBarControlIcon.name).attachTo(iconContainer);
        }

        this.setMaximized(false); // TODO: recover from previous run
        this.i18n();
    }

    /**
     * Set the title
     * @param titleId         Title identifier
     * @param titleParameters Title parameters
     */
    setTitle(titleId: string, titleParameters?: {[parameterName: string]: any}): void {
        this.labelTitle.setI18n(titleId, titleParameters).i18n();
    }

    /**
     * Minimize the application window
     */
    private minimize(): void {
        remote.getCurrentWindow().minimize();
    }

    /**
     * Restore the application window
     */
    private restore(): void {
        this.setMaximized(false);
    }

    /**
     * Maximize the application window
     */
    private maximize(): void {
        this.setMaximized(true);
    }

    /**
     * Close the application window
     */
    private close(): void {
        remote.getCurrentWindow().close();
    }

    /**
     * Set the maximized state
     * @param maximized true if the application is maximized
     */
    private setMaximized(maximized: boolean): void {
        let currentWindow: Electron.BrowserWindow = remote.getCurrentWindow();
        let iconMaximize: ContainerElement = this.selectContainer(':scope > title-bar-controls > title-bar-control-icons > title-bar-control-icon:nth-child(3)');
        let iconRestore: ContainerElement = this.selectContainer(':scope > title-bar-controls > title-bar-control-icons > title-bar-control-icon:nth-child(2)');
        let hidden: ContainerElement = maximized ? iconMaximize : iconRestore;
        let shown: ContainerElement = maximized ? iconRestore : iconMaximize;
        
        // TODO: https://gist.github.com/medmunds/fb1cd6b370a6cec5d618
        this.maximized = maximized;
        if (maximized) {
            currentWindow.maximize();
        } else {
            currentWindow.restore();
        }

        hidden.attribute('hidden', '');
        shown.removeAttribute('hidden');
    }

}

export {
    TitleBarView
};
