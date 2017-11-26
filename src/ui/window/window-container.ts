import {Icon, IconManager, UIElement} from '../element';
import {Window} from './window';
import {WindowContainerAnchor} from './window-container-anchor';
import {WindowContainerMode} from './window-container-mode';

/**
 * Window container
 */
class WindowContainer extends UIElement {
    private static HTML: string = `
        <window-container-position-overlay>
            <window-container-position class="top"></window-container-position>
            <window-container-position class="right"></window-container-position>
            <window-container-position class="bottom"></window-container-position>
            <window-container-position class="left"></window-container-position>
            <window-container-position class="center"></window-container-position>
        </window-container-position-overlay>
        <window-container-headers>
            <window-container-headers-tabs></window-container-headers-tabs>
        </window-container-headers>
        <window-container-windows></window-container-windows>
    `;

    private iconManager: IconManager;
    private selectedIndex: number;
    private windows: Window[];

    /**
     * Class constructor
     * @param iconManager Icon manager
     */
    constructor(iconManager: IconManager) {
        super('window-container', WindowContainer.HTML);
        this.iconManager = iconManager;
        this.windows = [];
        this.selectedIndex = -1;

        ['top', 'right', 'bottom', 'left', 'center'].forEach(side => {
            let container: UIElement = this.element('window-container-position-overlay', 'window-container-position.' + side);
            let icon: Icon = iconManager.createIcon(32, 32, 'window-container-position-' + side);

            container.attach(icon);
            container.dropTarget();
        });
    }

    /**
     * Add a window
     * @param window Window
     */
    addWindow(window: Window): void {
        let windowTitle: string = window.getTitle(); // TODO: register for title changes
        let tabElement: UIElement = new UIElement('window-container-tab')
            .click(() => this.select(window))
            .attribute('title', windowTitle)
            .text(windowTitle)
            .attach(this.iconManager.createIcon(16, 16, 'window-unpinned').i18n('[title]ui:window-container.tab.control.pin'))
            .attach(this.iconManager.createIcon(16, 16, 'window-pinned').i18n('[title]ui:window-container.tab.control.unpin'))
            .attach(this.iconManager.createIcon(16, 16, 'window-close').i18n('[title]ui:window-container.tab.control.close'))
            .applyTranslations()
            .attachTo(this.element('window-container-headers', 'window-container-headers-tabs'))
        ;

        this.windows.push(window);
        if (this.selectedIndex !== -1) {
            window.hide();
        }

        window.attachTo(this.element('window-container-windows'));

        if (this.selectedIndex === -1) {
            this.select(window);
        }

        window
            .on('close', () => this.onWindowClosed(window))
            .on('title-change', () => this.onWindowTitleChange(window))
        ;
    }

    /**
     * Set the mode
     * @param mode Mode
     */
    setMode(mode: WindowContainerMode): void {
        let modeString: string;

        switch (mode) {
        case WindowContainerMode.AUTO_HIDE:
            modeString = 'auto-hide';
            break;
        case WindowContainerMode.DOCKED:
            modeString = 'docked';
            break;
        case WindowContainerMode.DOCKED_DOCUMENT:
            modeString = 'docked-document';
            break;
        default:
            // TODO: remove once https://github.com/palantir/tslint/pull/3370 is done
            throw new Error('unknown window container mode ' + mode);
        }

        this.attribute('mode', modeString);
    }

    /**
     * Get the mode
     * @return Mode
     */
    getMode(): WindowContainerMode {
        let modeString: string = this.getAttributeValue('mode');

        switch (modeString) {
        case 'auto-hide':
            return WindowContainerMode.AUTO_HIDE;
        case 'docked':
            return WindowContainerMode.DOCKED;
        case 'docked-document':
            return WindowContainerMode.DOCKED_DOCUMENT;
        default:
            throw new Error('unknown window container mode attribute ' + modeString);
        }
    }

    /**
     * Set the anchor
     * @param anchor Anchor
     */
    setAnchor(anchor: WindowContainerAnchor): void {
        let anchorString: string;

        switch (anchor) {
        case WindowContainerAnchor.BOTTOM:
            anchorString = 'bottom';
            break;
        case WindowContainerAnchor.LEFT:
            anchorString = 'left';
            break;
        case WindowContainerAnchor.NONE:
            anchorString = 'none';
            break;
        case WindowContainerAnchor.RIGHT:
            anchorString = 'right';
            break;
        default:
            // TODO: remove once https://github.com/palantir/tslint/pull/3370 is done
            throw new Error('unknown window container anchor ' + anchor);
        }

        this.attribute('anchor', anchorString);
    }

    /**
     * Get the anchor
     * @return Anchor
     */
    getAnchor(): WindowContainerAnchor {
        let anchorString: string = this.getAttributeValue('anchor');

        switch (anchorString) {
        case 'bottom':
            return WindowContainerAnchor.BOTTOM;
        case 'left':
            return WindowContainerAnchor.LEFT;
        case 'none':
            return WindowContainerAnchor.NONE;
        case 'right':
            return WindowContainerAnchor.RIGHT;
        default:
            throw new Error('unknown window container anchor attribute ' + anchorString);
        }
    }

    /**
     * Select a window
     * @param window Window
     */
    select(window: Window): void {
        this.selectIndex(this.getWindowIndex(window));
    }

    /**
     * Select a window by index
     * @param windowIndex Window index
     */
    selectIndex(windowIndex: number): void {
        if (this.selectedIndex === windowIndex) {
            return;
        }

        if (this.selectedIndex !== -1) {
            this.getTab(this.selectedIndex).removeAttribute('selected');
            this.windows[this.selectedIndex].hide();
        }

        if (windowIndex !== -1) {
            let selectedWindow: Window;

            selectedWindow = this.windows[windowIndex];
            selectedWindow.show();
            selectedWindow.setFocus(true);

            this.getTab(windowIndex).attribute('selected');
        }

        this.selectedIndex = windowIndex;
    }

    /**
     * Event triggered when a window is closed
     * @param window Window
     */
    private onWindowClosed(window: Window): void {
        let windowIndex: number = this.getWindowIndex(window);
        let tabElement: UIElement = this.getTab(windowIndex);

        if (windowIndex === this.selectedIndex) {
            if ((this.selectedIndex + 1) < this.windows.length) {
                this.selectIndex(this.selectedIndex + 1);
                --this.selectedIndex;
            } else if (this.selectedIndex > 0) {
                this.selectIndex(this.selectedIndex - 1);
            }
        }

        tabElement.detach();
        this.windows.splice(windowIndex, 1);
    }

    /**
     * Event triggered when a window title changes
     * @param window Window
     */
    private onWindowTitleChange(window: Window): void {
        let windowIndex: number = this.getWindowIndex(window);
        let windowTitle: string = window.getTitle();
        let tabElement: UIElement = this.getTab(windowIndex);

        tabElement
            .attribute('title', windowTitle)
            .text(windowTitle)
        ;
    }

    /**
     * Get a tab element
     * @param windowIndex Window index
     * @return Tab element
     */
    private getTab(windowIndex: number): UIElement {
        return this.element('window-container-headers', 'window-container-headers-tabs', 'window-container-tab:nth-of-type(' + (windowIndex + 1) + ')');
    }

    /**
     * Get a window's index
     * @param window Window
     * @return window index
     */
    private getWindowIndex(window: Window): number {
        return this.windows.indexOf(window);
    }

}

export {
    WindowContainer
};
