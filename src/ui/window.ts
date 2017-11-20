import {UIElement} from './element';
import {Component} from '../component';
import {Icon, IconManager} from './icon';
import {CommandManager} from './command';

/**
 * Window manager
 */
@Component
class WindowManager {
    private windowComponents: {[componentId: string]: Window} = {};
    private windowContainer: WindowContainer;
    private commandManager: CommandManager;
    private targetElement: UIElement = null;
    private focusWindow: Window = null;

    /**
     * Set the command manager
     * @param commandManager Command manager
     */
    @Component
    setCommandManager(commandManager: CommandManager): void {
        commandManager.on('window.open', parameters => this.openWindow(<string> parameters.windowId));
    }

    /**
     * Set the available area
     * @param targetElement Target element
     * @param areaPadding   Area padding
     */
    setAvailableArea(targetElement: UIElement): void {
        let windowContainerElement: HTMLElement;

        this.targetElement = targetElement;
        this.windowContainer = new WindowContainer(this);
        windowContainerElement = this.windowContainer.getNativeElement();
        windowContainerElement.style.position = 'absolute';
        windowContainerElement.style.top =
        windowContainerElement.style.left =
        windowContainerElement.style.right =
        windowContainerElement.style.bottom = '0px'; // TODO: dynamic based on the window layout

        this.windowContainer.attachTo(targetElement);
    }

    /**
     * Register a window component
     * @param windowComponent Window component
     */
    registerWindow<T extends Window>(windowComponent: T): void {
        let componentId: string = this.buildComponentId(windowComponent);
        this.windowComponents[componentId] = windowComponent;
        this.openWindow(componentId); // TODO: remove once information is persisted
    }

    /**
     * Open a window component
     * @param componentId Component identifier
     */
    openWindow(componentId: string): void {
        let strippedComponentId: string = this.stripComponentId(componentId);
        let windowComponent: Window;

        if (!(strippedComponentId in this.windowComponents)) {
            throw new Error('No window component found matching id "' + componentId + '"');
        }

        windowComponent = this.windowComponents[strippedComponentId];
        this.windowContainer.addWindow(windowComponent);
    }

    /**
     * Test whether the window has focus
     * @param window Window
     */
    hasFocus(window: Window): boolean {
        return this.focusWindow === window;
    }

    /**
     * Set the focus to a window
     * @param window Window
     * @return true if a window has focus
     */
    setFocus(window: Window): boolean {
        if (this.focusWindow) {
            this.focusWindow.setFocus(false);
        }

        this.focusWindow = window;

        return !!this.focusWindow;
    }

    /**
     * Build a component identifier
     * @param windowComponent Window component
     * @param <T>             Window component type
     * @return Component identifier
     */
    private buildComponentId<T extends Window>(windowComponent: T): string {
        let componentId: string = windowComponent.constructor.name.toLowerCase();

        if (componentId.lastIndexOf('view') === componentId.length - 4) {
            componentId = componentId.substr(0, componentId.length - 4);
        }

        return componentId;
    }

    /**
     * Strip a component identifier
     * @param componentId Component identifier
     * @return Stripped component identifier
     */
    private stripComponentId(componentId: string): string {
        return componentId.replace(/-/g, '').toLowerCase();
    }

}

/**
 * Window style
 */
const enum WindowStyle {
    NO_AUTOHIDE,
    NO_CLOSE,
    NO_MOVE,
    NO_POSITION
}

/**
 * Window properties
 */
interface WindowProperties {
    title?: string;
    titleParameters?: {[parameterName: string]: string};
    titleText?: string;
    styles?: WindowStyle[];
}

/**
 * Window control properties
 */
class WindowControlProperties {
    label: string;
    icon: string;
    handler: () => void;
}

/**
 * Window
 */
class Window extends UIElement { // TODO: window-* tags
    private static HTML: string = `
        <window-titlebar>
            <window-titlebar-text></window-titlebar-text>
            <window-titlebar-controls></window-titlebar-controls>
        </window-titlebar>
        <window-content></window-content>
    `;

    private windowManager: WindowManager;
    private properties: WindowProperties;
    private clickListener: (event: MouseEvent) => void;

    /**
     * Class constructor
     * @param styles Window styles
     */
    constructor(windowProperties?: WindowProperties) {
        super('window', Window.HTML);
        this.properties = windowProperties;

        this.clickListener = e => { this.setFocus(true); e.stopPropagation(); };
        this.mouseDown(this.clickListener);

        if (!this.hasStyle(WindowStyle.NO_MOVE)) {
            this.attribute('can-move');
        }

        if (windowProperties && windowProperties.title) {
            this.setTitle(windowProperties.title, windowProperties.titleParameters);
        }
    }

    /**
     * Set the window manager
     * @param windowManager Window manager
     */
    @Component
    setWindowManager(windowManager: WindowManager): void {
        this.windowManager = windowManager;
    }

    /**
     * Set the icon manager
     * @param iconManager Icon manager
     */
    @Component
    setIconManager(iconManager: IconManager): void {
        let controls: UIElement = this.element('window-titlebar', 'window-titlebar-controls');
        let controlProperties: WindowControlProperties[] = [{
            label: 'ui:window.title-bar.position',
            icon: 'window-position',
            handler: () => { /* TODO */ }
        }, {
            label: 'ui:window.title-bar.auto-hide.on',
            icon: 'window-auto-hide-on',
            handler: () => this.setAutoHide(true)
        }, {
            label: 'ui:window.title-bar.auto-hide.off',
            icon: 'window-auto-hide-off',
            handler: () => this.setAutoHide(false)
        }, {
            label: 'ui:window.title-bar.close',
            icon: 'window-close',
            handler: () => this.close()
        }];

/*
    <icon src="ui/window/auto-hide-on.svg" title="Enable Auto Hide" (click)="setAutoHide(true)" [hidden]="autoHide || noAutoHide"></icon>
    <icon src="ui/window/auto-hide-off.svg" title="Disable Auto Hide" (click)="setAutoHide(false)" [hidden]="!autoHide || noAutoHide"></icon>
*/

        for (let controlProperty of controlProperties) {
            iconManager.createIcon(16, 16, controlProperty.icon)
                .click(controlProperty.handler)
                .attachTo(controls)
            ;
        }
    }

    /**
     * Set the parent of a window
     * @param parentWindow Parent window
     */
    setParent(parentWindow: Window): void {
        if (parentWindow) {
            parentWindow.attach(this);
        } else {
            document.body.appendChild(this.getNativeElement());
        }
    }

    /**
     * Set the window title
     * @param title           Title
     * @param titleParameters Title parameters
     */
    setTitle(title: string, titleParameters?: {[parameterName: string]: string}): void {
        this.element('window-titlebar', 'window-titlebar-text').i18n(title, titleParameters).applyTranslations();
    }

    /**
     * Get the window title
     */
    getTitle(): string {
        return this.element('window-titlebar', 'window-titlebar-text').getText();
    }

    /**
     * Test whether the window has a set of styles
     * @param styles List of styles
     * @return true if the window has all the specified styles
     */
    hasStyle(...styles: WindowStyle[]): boolean {
        if (this.properties && this.properties.styles) {
            for (let style of styles) {
                if (this.properties.styles.indexOf(style) === -1) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Show the window
     */
    show(): void {
        this.removeAttribute('hidden');
    }

    /**
     * Hide the window
     */
    hide(): void {
        this.attribute('hidden');
    }

    /**
     * Enable or disable auto-hide
     * @param enabled true if enabled
     */
    setAutoHide(enabled: boolean): void {
        if (enabled) {
            this.attribute('auto-hide');
        } else {
            this.removeAttribute('auto-hide');
        }
    }

    /**
     * Test whether the window has focus
     * @return true if the window has focus
     */
    hasFocus(): boolean {
        return this.windowManager.hasFocus(this);
    }

    /**
     * Set or kill focus
     * @param focus true if the window has focus
     */
    setFocus(focus: boolean): void {
        let hadFocus: boolean = this.hasFocus();
        let targetFocus: boolean = focus;

        if (!hadFocus && focus) {
            targetFocus = this.windowManager.setFocus(this);
        }

        if (targetFocus) {
            this.attribute('has-focus');
        } else {
            this.removeAttribute('has-focus');
        }
    }

    /**
     * Close the window
     */
    close(): void {
        let element: HTMLElement = this.getNativeElement();

        element.removeEventListener('click', this.clickListener);
        element.parentNode.removeChild(element);
        element.remove();
    }

    /**
     * Get the child target
     * @return Child target
     */
    getChildTarget(): UIElement {
        return this.element('window-content');
    }

}

/**
 * Window container
 */
class WindowContainer extends UIElement {
    private static HTML: string = `
        <window-container-headers>
            <window-container-headers-tabs></window-container-headers-tabs>
        </window-container-headers>
        <window-container-windows></window-container-windows>
    `;

    private windowManager: WindowManager;
    private selectedIndex: number;
    private windows: Window[];

    /**
     * Class constructor
     * @param windowManager Window manager
     */
    constructor(windowManager: WindowManager) {
        super('window-container', WindowContainer.HTML);
        this.windowManager = windowManager;
        this.windows = [];
        this.selectedIndex = -1;
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
    }

    /**
     * Remove a window
     * @param window Window
     */
    removeWindow(window: Window): void {
        console.warn('Removing a window from a window container is not implemented');
    }

    /**
     * Select a window
     * @param window Window
     */
    select(window: Window): void {
        let windowIndex: number = this.windows.indexOf(window);
        this.selectIndex(windowIndex);
    }

    /**
     * Select a window
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

        let selectedWindow: Window;

        selectedWindow = this.windows[windowIndex];
        selectedWindow.show();
        selectedWindow.setFocus(true);

        this.selectedIndex = windowIndex;
        this.getTab(windowIndex).attribute('selected');
    }

    /**
     * Get a tab element
     * @param windowIndex Window index
     * @return Tab element
     */
    private getTab(windowIndex: number): UIElement {
        return this.element('window-container-headers', 'window-container-headers-tabs', 'window-container-tab:nth-of-type(' + (windowIndex + 1) + ')');
    }

}

export {
    Window,
    WindowContainer,
    WindowManager,
    WindowStyle
};
