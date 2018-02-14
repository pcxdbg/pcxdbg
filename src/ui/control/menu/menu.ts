import {UIElement, UIElementBase} from '../../element';
import {Icon, IconManager} from '../icon';
import {MenuItemDefinition} from './menu-item-definition';
import {MenuItem} from './menu-item';
import {MenuSeparator} from './menu-separator';
import {ApplicationContext, Component, Inject, Scope, ScopeType} from 'es-injection';

/**
 * Menu
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class Menu extends UIElementBase {
    private static ATTRIBUTENAME_POPUP: string = 'popup';

    private applicationContext: ApplicationContext;
    private parentMenu: Menu;
    private menuItems: {[id: string]: MenuItem} = {};

    /**
     * Class constructor
     */
    constructor() {
        super('menu');
    }

    /**
     * Set the application context
     * @param applicationContext Application context
     */
    @Inject
    setApplicationContext(applicationContext: ApplicationContext): void {
        this.applicationContext = applicationContext;
    }

    /**
     * Get the parent menu
     * @return Parent menu
     */
    getParent(): Menu {
        return this.parentMenu;
    }

    /**
     * Set the parent menu
     * @param parentMenu Parent menu
     */
    setParent(parentMenu: Menu): Menu {
        this.parentMenu = parentMenu;
        return this.asPopup();
    }

    /**
     * Set whether the menu is a popup menu
     * @param isPopup true or ommitted if the menu is a popup menu
     */
    asPopup(isPopup?: boolean): Menu {
        if (isPopup === undefined) {
            isPopup = true;
        }

        if (isPopup) {
            this.attribute(Menu.ATTRIBUTENAME_POPUP);
        } else {
            this.removeAttribute(Menu.ATTRIBUTENAME_POPUP);
        }

        return this;
    }

    /**
     * Add a menu item
     * @param menuItem Menu item
     * @return this
     */
    addItem(menuItem: MenuItem): Menu {
        this.attach(menuItem);

        let id: string = menuItem.getId();
        if (id) {
            this.menuItems[id] = menuItem;
        }

        return this;
    }

    /**
     * Add a separator
     * @return this
     */
    addSeparator(): Menu {
        let menuSeparator: MenuSeparator = this.applicationContext.getComponent(MenuSeparator);
        this.attach(menuSeparator);
        return this;
    }

    /**
     * Enable a menu item
     * @param id Menu item identifier
     * @return this
     */
    enable(id: string): Menu {
        this.getMenuItem(id).enable();
        return this;
    }

    /**
     * Disable a menu item
     * @param id Menu item identifier
     * @return this
     */
    disable(id: string): Menu {
        this.getMenuItem(id).disable();
        return this;
    }

    /**
     * Show a menu item
     * @param id Menu item identifier
     * @return this
     */
    show(id: string): Menu {
        this.getMenuItem(id).removeAttribute('hidden');
        return this;
    }

    /**
     * Hide a menu item
     * @param id Menu item identifier
     * @return this
     */
    hide(id: string): Menu {
        this.getMenuItem(id).attribute('hidden');
        return this;
    }

    /**
     * Set a menu item icon
     * @param id   Menu item identifier
     * @param icon Icon identifier
     */
    icon(id: string, icon: string): Menu {
        this.getMenuItem(id).setIcon(icon);
        return this;
    }

    /**
     * Set a menu item label using a label identifier
     * @param id              Menu item identifier
     * @param label           Label identifier
     * @param labelParameters Label parameters
     * @return this
     */
    label(id: string, label: string, labelParameters?: {[parameterName: string]: any}): Menu {
        this.getMenuItem(id).setLabel(label, labelParameters);
        return this;
    }

    /**
     * Set a menu item label with plain text
     * @param id        Menu item identifier
     * @param labelText Label text
     * @return this
     */
    labelText(id: string, labelText: string): Menu {
        this.getMenuItem(id).setLabelText(labelText);
        return this;
    }

    /**
     * Test whether the menu is a popup menu
     * @return true if the menu is a popup menu
     */
    isPopup(): boolean {
        return this.hasAttribute(Menu.ATTRIBUTENAME_POPUP);
    }

    /**
     * Test whether the menu is active
     * @return true if the menu is active
     */
    isActive(): boolean {
        return this.hasAttribute('active');
    }

    /**
     * Get a menu item
     * @param id Menu item identifier
     * @return this
     */
    private getMenuItem(id: string): MenuItem {
        return this.menuItems[id];
    }

    /**
     * Event triggered when a popup menu item is clicked
     * @param menuItem       Menu item
     * @param itemDefinition Item definition
     */
    private onPopupMenuItemClick(menuItem: MenuItem, itemDefinition: MenuItemDefinition): void {
        let activeElement: UIElement = this.element('menu-item[active]');
        let changed: boolean = !activeElement || activeElement.getNativeElement() !== menuItem.getNativeElement();

        if (changed) {
            if (activeElement) {
                activeElement.removeAttribute('active');
            }

            menuItem.activate();
            this.attribute('active', '');
        } else {
            menuItem.deactivate();
            this.removeAttribute('active');
        }
    }

    /**
     * Event triggered when the cursor enter a popup menu item's region
     * @param menuItem       Menu item
     * @param itemDefinition Item definition
     */
    private onPopupMenuItemMouseEnter(menuItem: MenuItem, itemDefinition: MenuItemDefinition): void {
        if (this.isActive() && !menuItem.isActive()) {
            this.onPopupMenuItemClick(menuItem, itemDefinition);
        }
    }

}

export {
    Menu
};
