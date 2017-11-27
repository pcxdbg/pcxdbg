import {Icon, IconManager, UIElement} from '../../ui';
import {QuickLaunch} from './quick-launch';
import {Host} from 'host';
import {Component, Inject} from 'injection';
import {I18nManager} from 'i18n';

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
class TitleBarView extends UIElement {
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

    private maximized: boolean;
    private host: Host;

    /**
     * Class constructor
     * @param iconManager Icon manager
     * @param quickLaunch Quick launch
     */
    constructor(iconManager: IconManager, quickLaunch: QuickLaunch) {
        super('title-bar', TitleBarView.HTML);
        let controlIcons: UIElement[];
        let titleBarControlIcons: TitleBarControlIcon[] = [
            { name: TitleBarView.ICON_MINIMIZE, action: () => this.minimize() },
            { name: TitleBarView.ICON_RESTORE, action: () => this.restore() },
            { name: TitleBarView.ICON_MAXIMIZE, action: () => this.maximize() },
            { name: TitleBarView.ICON_CLOSE, action: () => this.close() }
        ];

        this.element('title-bar-application', 'title-bar-application-icon')
            .attach(iconManager.createIcon(24, 24, TitleBarView.ICON_LOGO))
        ;

        this.element('title-bar-controls')
            .attach(quickLaunch)
        ;

        controlIcons = this.elements('title-bar-controls', 'title-bar-control-icons', 'title-bar-control-icon');
        for (let i: number = 0; i !== titleBarControlIcons.length; ++i) {
            let titleBarControlIcon: TitleBarControlIcon = titleBarControlIcons[i];

            controlIcons[i]
                .attach(iconManager.createIcon(16, 16, titleBarControlIcon.name))
                .click(titleBarControlIcon.action)
            ;
        }

        this.applyTranslations();
    }

    /**
     * Set the host
     * @param host Host
     */
    @Inject
    setHost(host: Host): void {
        this.host = host;
        this.setMaximized(false); // TODO: recover from previous run
    }

    /**
     * Set the title
     * @param titleId         Title identifier
     * @param titleParameters Title parameters
     */
    setTitle(titleId: string, titleParameters?: {[parameterName: string]: any}): void {
        this.element('title-bar-application', 'title-bar-application-title').i18n(titleId, titleParameters).applyTranslations();
    }

    /**
     * Minimize the application window
     */
    private minimize(): void {
        this.host.minimize();
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
        this.host.close();
    }

    /**
     * Set the maximized state
     * @param maximized true if the application is maximized
     */
    private setMaximized(maximized: boolean): void {
        let iconMaximize: UIElement = this.element('title-bar-controls', 'title-bar-control-icons', 'title-bar-control-icon:nth-child(3)');
        let iconRestore: UIElement = this.element('title-bar-controls', 'title-bar-control-icons', 'title-bar-control-icon:nth-child(2)');
        let hidden: UIElement = maximized ? iconMaximize : iconRestore;
        let shown: UIElement = maximized ? iconRestore : iconMaximize;

        // TODO: https://gist.github.com/medmunds/fb1cd6b370a6cec5d618
        this.maximized = maximized;
        if (maximized) {
            this.host.maximize();
        } else {
            this.host.restore();
        }

        hidden.attribute('hidden', '');
        shown.removeAttribute('hidden');
    }

}

export {
    TitleBarView
};
