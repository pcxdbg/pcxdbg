import {Menu} from './menu';
import {MenuItem} from './menu-item';
import {MenuItemDefinition} from './menu-item-definition';
import {ApplicationContext, Component, Inject, Scope, ScopeType} from 'es-injection';

/**
 * Menu builder
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class MenuBuilder {
    private applicationContext: ApplicationContext;
    private currentMenu: Menu;

    /**
     * Set the application context
     * @param applicationContext Application context
     */
    @Inject
    setApplicationContext(applicationContext: ApplicationContext): void {
        this.applicationContext = applicationContext;
    }

    /**
     * Set the menu
     * @param menu Menu
     */
    @Inject
    setMenu(menu: Menu): void {
        this.currentMenu = menu;
    }

    /**
     * Get the menu
     * @return Current menu
     */
    getMenu(): Menu {
        return this.currentMenu;
    }

    /**
     * Begin a popup menu using a label
     * @param labelText Label text
     * @param popupMenu Popup menu
     * @return Popup menu builder
     */
    popupText(labelText: string, popupMenu?: Menu): MenuBuilder {
        let menuItemDefinition: MenuItemDefinition = {
            labelText: labelText,
            popupMenu: popupMenu
        };

        return this.popup(menuItemDefinition);
    }

    /**
     * Begin a popup menu using a label identifier
     * @param label     Label identifier or menu item definition
     * @param popupMenu Popup menu
     * @return Popup menu builder
     */
    popup(label?: string|MenuItemDefinition, popupMenu?: Menu): MenuBuilder {
        if (label === undefined) {
            return this.popupEnd();
        }

        return this.popupBegin(label, popupMenu);
    }

    /**
     * Add an item
     * @param item Menu item definition
     * @return this
     */
    item(itemDefinition: MenuItemDefinition): MenuBuilder {
        let menuItem: MenuItem = this.applicationContext.getComponent(MenuItem);
        menuItem.setDefinition(itemDefinition);
        this.currentMenu.addItem(menuItem);
        return this;
    }

    /**
     * Add a separator
     * @return this
     */
    separator(): MenuBuilder {
        this.currentMenu.addSeparator();
        return this;
    }

    /**
     * Mark the beginning of a popup DSL section
     * @param label     Label identifier or menu item definition
     * @param popupMenu Popup menu
     * @return Builder for the sub menu
     */
    private popupBegin(label: string|MenuItemDefinition, popupMenu?: Menu): MenuBuilder {
        if (typeof(label) === 'string') {
            return this.popupBeginLabel(label, popupMenu);
        } else {
            return this.popupBeginDefinition(label);
        }
    }

    /**
     * Mark the beginning of a popup DSL section using a label
     * @param label     Label identifier
     * @param popupMenu Popup menu
     * @return Builder for the sub menu
     */
    private popupBeginLabel(label: string, popupMenu?: Menu): MenuBuilder {
        let subMenuBuilder: MenuBuilder;
        let menuItemDefinition: MenuItemDefinition = {
            label: label,
            popupMenu: popupMenu
        };

        subMenuBuilder = this.popup(menuItemDefinition);

        if (popupMenu) {
            popupMenu.setParent(this.currentMenu);
            return subMenuBuilder.popup();
        }

        return subMenuBuilder;
    }

    /**
     * Mark the beginning of a popup DSL section using an item definition
     * @param menuItemDefinition Menu item definition
     * @param popupMenu          Popup menu
     * @return Builder for the Sub menu
     */
    private popupBeginDefinition(menuItemDefinition: MenuItemDefinition): MenuBuilder {
        let subMenu: Menu;
        let subMenuBuilder: MenuBuilder;

        subMenu = menuItemDefinition.popupMenu;
        if (!subMenu) {
            subMenu = menuItemDefinition.popupMenu = this.applicationContext.getComponent(Menu);
            subMenu.setParent(this.currentMenu);
        }

        subMenuBuilder = this.applicationContext.getComponent(MenuBuilder);
        subMenuBuilder.setMenu(subMenu);

        this.item(menuItemDefinition);

        return subMenuBuilder;
    }

    /**
     * Mark the end a popup DSL section
     * @return Menu builder for the parent menu
     */
    private popupEnd(): MenuBuilder {
        let menuBuilder: MenuBuilder = this.applicationContext.getComponent(MenuBuilder);
        menuBuilder.setMenu(this.currentMenu.getParent());
        return menuBuilder;
    }

}

export {
    MenuBuilder
};
