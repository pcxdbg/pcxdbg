import {CommandManager, CommandDefinition} from '../../command';
import {UIElement} from '../element';
import {Icon, IconManager} from '../icon';
import {MenuItemDefinition} from './menu-item-definition';
import {MenuManager} from './menu-manager';
import {I18nManager} from 'i18n';
import {applicationContext} from 'injection';

/**
 * Menu item data
 */
class MenuItemData {
    definition: MenuItemDefinition;
    element: UIElement;
}

/**
 * Menu
 */
class Menu extends UIElement {
    private commandManager: CommandManager;
    private iconManager: IconManager;
    private menuManager: MenuManager;
    private parentMenu: Menu;
    private popupMenu: boolean;
    private menuItems: {[id: string]: MenuItemData} = {};

    /**
     * Class constructor
     * @param menuManager    Menu manager
     * @param commandManager Command manager
     * @param iconManager    Icon manager
     * @param popupMenu      true if the menu is a popup menu
     * @param parentMenu     Parent menu
     */
    constructor(menuManager: MenuManager, commandManager: CommandManager, iconManager: IconManager, popupMenu: boolean, parentMenu?: Menu) {
        super('menu');
        this.commandManager = commandManager;
        this.menuManager = menuManager;
        this.iconManager = iconManager;
        this.parentMenu = parentMenu;
        this.popupMenu = popupMenu;

        if (popupMenu) {
            this.attribute('popup', '');
        }
    }

    /**
     * Begin a popup menu using a label
     * @param labelText Label text
     * @param popupMenu Popup menu
     * @return Popup menu builder
     */
    popupText(labelText: string, popupMenu?: Menu): Menu {
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
    popup(label?: string|MenuItemDefinition, popupMenu?: Menu): Menu {
        if (label === undefined) {
            return this.parentMenu;
        }

        let menuItemDefinition: MenuItemDefinition;
        let subMenu: Menu;

        if (typeof(label) === 'string') {
            menuItemDefinition = {
                label: label,
                popupMenu: popupMenu
            };

            subMenu = this.popup(menuItemDefinition);

            if (popupMenu) {
                popupMenu.parentMenu = this;
                return subMenu.popup();
            }

            return subMenu;
        }

        menuItemDefinition = <MenuItemDefinition> label;
        subMenu = menuItemDefinition.popupMenu;
        if (!subMenu) {
            subMenu = menuItemDefinition.popupMenu = this.menuManager.createPopupMenu(this);
        }

        this.item(menuItemDefinition);

        return subMenu;
    }

    private static HTML_MENUITEM: string = `
        <menu-item-icon></menu-item-icon>
        <menu-item-label></menu-item-label>
    `;

    /**
     * Add an item
     * @param item Menu item definition
     * @return this
     */
    item(itemDefinition: MenuItemDefinition): Menu {
        let menuItem: UIElement = new UIElement('menu-item', Menu.HTML_MENUITEM);
        let menuItemData: MenuItemData = {
            definition: itemDefinition,
            element: menuItem
        };

        if (itemDefinition.icon) {
            menuItem.element('menu-item-icon').attach(this.iconManager.createIcon(16, 16, itemDefinition.icon));
        }

        if (itemDefinition.label || itemDefinition.labelText) {
            this.applyLabel(menuItemData);
        }

        if (itemDefinition.popupMenu) {
            menuItem
                .click(e => { e.stopPropagation(); this.onPopupMenuItemClick(menuItem, itemDefinition); })
                .mouseEnter(() => this.onPopupMenuItemMouseEnter(menuItem, itemDefinition))
                .attach(itemDefinition.popupMenu)
            ;
        } else if (itemDefinition.handler) {
            menuItem.click(() => itemDefinition.handler(itemDefinition));
        } else if (itemDefinition.command) {
            let commandDefinition: CommandDefinition = this.commandManager.getCommandDefinition(itemDefinition.command);

            if (!commandDefinition) {
                throw new Error('unknown command ' + itemDefinition.command + ' referenced in menu item');
            }

            menuItem.click(() => this.commandManager.executeCommand(itemDefinition.command, itemDefinition.commandParameters));
            if (commandDefinition.accelerator) {
                new UIElement('menu-item-shortcut')
                    .text(commandDefinition.accelerator)
                    .attachTo(menuItem)
                ;
            }
        }

        if (this.popup && itemDefinition.popupMenu) {
            new UIElement('menu-item-expander')
                .attach(this.iconManager.createIcon(16, 16, 'menu-item-expander'))
                .attachTo(menuItem)
            ;
        }

        if (itemDefinition.id) {
            this.menuItems[itemDefinition.id] = menuItemData;
        }

        this.attach(menuItem);

        return this;
    }

    /**
     * Add a separator
     * @return this
     */
    separator(): Menu {
        this.getNativeElement().appendChild(document.createElement('menu-separator'));
        return this;
    }

    /**
     * Enable a menu item
     * @param id Menu item identifier
     * @return this
     */
    enable(id: string): Menu {
        this.getItemData(id).element.removeAttribute('disabled');
        return this;
    }

    /**
     * Disable a menu item
     * @param id Menu item identifier
     * @return this
     */
    disable(id: string): Menu {
        this.getItemData(id).element.attribute('disabled');
        return this;
    }

    /**
     * Show a menu item
     * @param id Menu item identifier
     * @return this
     */
    show(id: string): Menu {
        this.getItemData(id).element.removeAttribute('hidden');
        return this;
    }

    /**
     * Hide a menu item
     * @param id Menu item identifier
     * @return this
     */
    hide(id: string): Menu {
        this.getItemData(id).element.attribute('hidden');
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
        this.setLabel(id, label, labelParameters, undefined);
        return this;
    }

    /**
     * Set a menu item label with plain text
     * @param id        Menu item identifier
     * @param labelText Label text
     * @return this
     */
    labelText(id: string, labelText: string): Menu {
        this.setLabel(id, undefined, undefined, labelText);
        return this;
    }

    /**
     * Set a menu item's label data
     * @param id              Menu item identifier
     * @param label           Label
     * @param labelParameters Label parameters
     * @param labelText       Label text
     */
    private setLabel(id: string, label: string, labelParameters: {[parameterName: string]: any}, labelText: string): void {
        let itemData: MenuItemData = this.getItemData(id);

        itemData.definition.label = undefined;
        itemData.definition.labelParameters = undefined;
        itemData.definition.labelText = labelText;

        this.applyLabel(itemData);
    }

    /**
     * Set a menu item label
     * @param itemData Item data
     */
    private applyLabel(itemData: MenuItemData): void {
        let itemDefinition: MenuItemDefinition = itemData.definition;
        let labelElement: UIElement = itemData.element.element('menu-item-label');
        let labelText: string;
        let n: number;

        if (itemDefinition.label) {
            labelText = applicationContext.getComponent(I18nManager).translateKey(itemDefinition.label, itemDefinition.labelParameters);
        } else {
            labelText = itemDefinition.labelText;
        }

        n = labelText.indexOf('&');
        if (n !== -1) {
            let boundKey: string = labelText.substr(n + 1, 1);
            let labelHtml: string = labelText.replace(/&[a-zA-Z]{1}/, '<menu-item-label-key>' + boundKey + '</menu-item-label-key>');
            // TODO: properly escape possible & and < in the text
            labelElement.html(labelHtml);
        } else {
            labelElement.text(labelText);
        }
    }

    /**
     * Set a menu item icon
     * @param id   Menu item identifier
     * @param icon Icon identifier
     */
    icon(id: string, icon: string): Menu {
        let itemData: MenuItemData = this.getItemData(id);

        if (itemData.definition.icon !== icon) {
            itemData.definition.icon = icon;
            // TODO: remove the previous icon
            itemData.element.element('menu-item-icon').attach(this.iconManager.createIcon(16, 16, icon));
        }

        return this;
    }

    /**
     * Test whether the menu is a popup menu
     * @return true if the menu is a popup menu
     */
    isPopup(): boolean {
        return this.popupMenu;
    }

    /**
     * Test whether the menu is active
     * @return true if the menu is active
     */
    isActive(): boolean {
        return this.hasAttribute('active');
    }

    /**
     * Get menu item data
     * @param id Menu item identifier
     * @return Menu item data
     */
    private getItemData(id: string): MenuItemData {
        return this.menuItems[id];
    }

    /**
     * Event triggered when a popup menu item is clicked
     * @param menuItem       Menu item
     * @param itemDefinition Item definition
     */
    private onPopupMenuItemClick(menuItem: UIElement, itemDefinition: MenuItemDefinition): void {
        let activeElement: UIElement = this.element('menu-item[active]');
        let changed: boolean = !activeElement || activeElement.getNativeElement() !== menuItem.getNativeElement();

        if (changed) {
            if (activeElement) {
                activeElement.removeAttribute('active');
            }

            menuItem.attribute('active', '');
            this.attribute('active', '');
        } else {
            menuItem.removeAttribute('active');
            this.removeAttribute('active');
        }
    }

    /**
     * Event triggered when the cursor enter a popup menu item's region
     * @param menuItem       Menu item
     * @param itemDefinition Item definition
     */
    private onPopupMenuItemMouseEnter(menuItem: UIElement, itemDefinition: MenuItemDefinition): void {
        if (this.isActive() && !this.isMenuItemActive(menuItem)) {
            this.onPopupMenuItemClick(menuItem, itemDefinition);
        }
    }

    /**
     * Test whether a menu item is active
     * @param menuItem Menu item
     * @return true if the menu item is active
     */
    private isMenuItemActive(menuItem: UIElement): boolean {
        return menuItem.hasAttribute('active');
    }

}

export {
    Menu,
    MenuManager
};
