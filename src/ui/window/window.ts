import {Icon, IconManager, UIElement} from '../element';
import {WindowContainer} from './window-container';
import {Component} from '../../component';
import {CommandManager} from '../command';
import {WindowStyle} from './window-style';

/**
 * Window layout orientation
 */
enum WindowLayoutOrientation {
    HORIZONTAL,
    VERTICAL
}

/**
 * Window layout for containers
 */
interface WindowLayout {
    orientation: WindowLayoutOrientation;
    thickness: number;
    windows: Window[];
    windowsThickness: number[];
}

/**
 * Window manager
 */
@Component
class WindowManager {
    private static PADDING_WINDOW: number = 6;

    private windowComponents: {[componentId: string]: Window} = {};
    private windowContainers: WindowContainer[];
    private commandManager: CommandManager;
    private iconManager: IconManager;
    private targetElement: UIElement = null;
    private focusWindow: Window = null;

    /**
     * Set the command manager
     * @param commandManager Command manager
     */
    @Component
    setCommandManager(commandManager: CommandManager): void {
        commandManager
            .on('window.open', parameters => this.openWindow(<string> parameters.windowId))
        ;
    }

    /**
     * Set the icon manager
     * @param iconManager Icon manager
     */
    @Component
    setIconManager(iconManager: IconManager): void {
        this.iconManager = iconManager;
    }

    /**
     * Set the available area
     * @param targetElement Target element
     */
    setAvailableArea(targetElement: UIElement): void {
        let nativeElement: HTMLElement;

        this.targetElement = targetElement;
        this.windowContainers = [
            new WindowContainer(this.iconManager),
            new WindowContainer(this.iconManager),
            new WindowContainer(this.iconManager),
            new WindowContainer(this.iconManager)
        ];

        // TODO: dynamic based on the window layout
        nativeElement = this.windowContainers[0].attribute('mode', 'docked').attribute('anchor', 'left').getNativeElement();
        nativeElement.style.position = 'absolute';
        nativeElement.style.top = '6px';
        nativeElement.style.left = '6px';
        nativeElement.style.bottom = '6px';
        nativeElement.style.width = '320px';
        nativeElement = this.windowContainers[1].attribute('mode', 'docked-document').attribute('anchor', 'center').getNativeElement();
        nativeElement.style.position = 'absolute';
        nativeElement.style.top = '6px';
        nativeElement.style.left = '332px';
        nativeElement.style.bottom = '332px';
        nativeElement.style.right = '31px';
        nativeElement = this.windowContainers[2].attribute('mode', 'auto-hide').attribute('anchor', 'right').getNativeElement();
        nativeElement.style.position = 'absolute';
        nativeElement.style.top = '6px';
        nativeElement.style.width = '25px';
        nativeElement.style.bottom = '6px';
        nativeElement.style.right = '0px';
        nativeElement = this.windowContainers[3].attribute('mode', 'docked').attribute('anchor', 'bottom').getNativeElement();
        nativeElement.style.position = 'absolute';
        nativeElement.style.height = '320px';
        nativeElement.style.left = '332px';
        nativeElement.style.bottom = '6px';
        nativeElement.style.right = '31px';

        this.windowContainers.forEach(windowContainer => targetElement.attach(windowContainer));
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
        this.windowContainers[Math.floor(Math.random() * 100) % 4].addWindow(windowComponent);
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
class Window extends UIElement {
    private static HTML_WINDOW: string = `
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
        super('window', Window.HTML_WINDOW);
        this.properties = windowProperties;

        this.clickListener = e => { this.setFocus(true); e.stopPropagation(); };
        this.mouseDown(this.clickListener);

        if (this.hasStyle(WindowStyle.NO_AUTOHIDE)) {
            this.attribute('no-auto-hide');
        }

        if (this.hasStyle(WindowStyle.NO_BACKGROUND)) {
            this.attribute('no-background');
        }

        if (this.hasStyle(WindowStyle.NO_CLOSE)) {
            this.attribute('no-close');
        }

        if (this.hasStyle(WindowStyle.NO_MOVE)) {
            this.attribute('no-move');
        } else {
            this.element('window-titlebar').draggable(() => {
                console.log('wee');
            });
        }

        if (this.hasStyle(WindowStyle.NO_POSITION)) {
            this.attribute('no-position');
        }

        if (this.hasStyle(WindowStyle.NO_TITLE)) {
            this.attribute('no-title');
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
        if (!this.properties || !this.properties.styles) {
            return false;
        }

        for (let style of styles) {
            if (this.properties.styles.indexOf(style) === -1) {
                return false;
            }
        }

        return true;
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

        this.emitEvent('close');
    }

    /**
     * Get the child target
     * @return Child target
     */
    getChildTarget(): UIElement {
        return this.element('window-content');
    }

}

export {
    Window,
    WindowManager
};
