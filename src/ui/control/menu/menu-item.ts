import {UIElementBase} from '../../element';
import {CommandDefinition, CommandManager} from '../../command';
import {IconManager} from '../icon';
import {MenuItemDefinition} from './menu-item-definition';
import {Component, Inject, Scope, ScopeType} from 'es-injection';

/**
 * Menu item
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class MenuItem extends UIElementBase {
    private static ATTRIBUTENAME_ACTIVATED: string = 'active';
    private static ATTRIBUTENAME_DISABLED: string = 'disabled';
    private static ATTRIBUTENAME_POPUP: string = 'has-popup';
    private static ICONNAME_MENUITEMEXPANDER: string = 'menu-item-expander';
    private static HTML_MENUITEM: string = `
        <menu-item-icon></menu-item-icon>
        <menu-item-label></menu-item-label>
        <menu-item-accelerator></menu-item-accelerator>
        <menu-item-expander></menu-item-expander>
    `;

    private commandManager: CommandManager;
    private iconManager: IconManager;
    private definition: MenuItemDefinition;

    /**
     * Class constructor
     */
    constructor() {
        super('menu-item', MenuItem.HTML_MENUITEM);
    }

    /**
     * Set the icon manager
     * @param iconManager Icon manager
     */
    @Inject
    setIconManager(iconManager: IconManager): void {
        this.iconManager = iconManager;
        this.element('menu-item-expander').attach(iconManager.createIcon(16, 16, MenuItem.ICONNAME_MENUITEMEXPANDER));
    }

    /**
     * Set the command manager
     * @param commandManager Command manager
     */
    @Inject
    setCommandManager(commandManager: CommandManager): void {
        this.commandManager = commandManager;
    }

    /**
     * Get the identifier
     * @return Identifier
     */
    getId(): string {
        return this.definition.id;
    }

    /**
     * Set the menu item definition
     * @param itemDefinition Menu item definition
     * @return this
     */
    setDefinition(itemDefinition: MenuItemDefinition): MenuItem {
        this.definition = itemDefinition;

        if (itemDefinition.icon) {
            this.setIcon(itemDefinition.icon);
        }

        if (itemDefinition.label) {
           this.setLabel(itemDefinition.label, itemDefinition.labelParameters);
        } else if (itemDefinition.labelText) {
           this.setLabelText(itemDefinition.labelText);
        }

        if (itemDefinition.popupMenu) {
            this
                .attribute(MenuItem.ATTRIBUTENAME_POPUP)
                .attach(itemDefinition.popupMenu)
            ;

            //TODO: this
            //    .click(e => { e.stopPropagation(); this.onPopupMenuItemClick(menuItem, itemDefinition); })
            //    .mouseEnter(() => this.onPopupMenuItemMouseEnter(menuItem, itemDefinition))
            //;
        } else if (itemDefinition.handler) {
            this.click(() => itemDefinition.handler(itemDefinition));
        } else if (itemDefinition.command) {
            let commandDefinition: CommandDefinition = this.commandManager.getCommandDefinition(itemDefinition.command);

            if (!commandDefinition) {
                throw new Error('unknown command ' + itemDefinition.command + ' referenced in menu item');
            }

            this.click(() => this.commandManager.executeCommand(itemDefinition.command, itemDefinition.commandParameters));
            if (commandDefinition.accelerator) {
                this.setAccelerator(commandDefinition.accelerator);
            }
        }

        return this;
    }

    /**
     * Set the menu item icon
     * @param icon Icon
     * @return this
     */
    setIcon(icon: string): MenuItem {
        this
            .element('menu-item-icon')
            .clearContent()
            .attach(this.iconManager.createIcon(16, 16, icon))
        ;

        return this;
    }

    /**
     * Set a label
     * @param labelId         Label identifier
     * @param labelParameters Label parameters
     * @return this
     */
    setLabel(labelId: string, labelParameters?: {[parameterName: string]: any}): MenuItem {
        this.element('menu-item-label').i18n('ui:menu.item.label', {labelId: labelId, labelParameters: labelParameters}, 'html').applyTranslations();
        return this;
    }

    /**
     * Set a label as plain text
     * @param labelText Label text
     * @return this
     */
    setLabelText(labelText: string): MenuItem {
        this.element('menu-item-label').i18n('ui:menu.item.text', {text: labelText}, 'html').applyTranslations();
        return this;
    }

    /**
     * Set the accelerator
     * @param accelerator Accelerator
     * @return this
     */
    setAccelerator(accelerator: string): MenuItem {
        this.element('menu-item-accelerator').text(accelerator);
        return this;
    }

    /**
     * Test whether the menu item is enabled
     * @return true if the menu item is enabled
     */
    isEnabled(): boolean {
        return !this.hasAttribute(MenuItem.ATTRIBUTENAME_DISABLED);
    }

    /**
     * Enable or disable the menu item
     * @param enabled true or ommited to enable
     * @return this
     */
    enable(enabled?: boolean): MenuItem {
        if (enabled === undefined) {
            enabled = true;
        }

        return this.setEnabled(enabled);
    }

    /**
     * Disable the menu item
     * @return this
     */
    disable(): MenuItem {
        return this.setEnabled(false);
    }

    /**
     * Test whether the menu item is active
     * @return true if the menu item is active
     */
    isActive(): boolean {
        return this.hasAttribute(MenuItem.ATTRIBUTENAME_ACTIVATED);
    }

    /**
     * Activate or deactivate the menu item
     * @param activated true or ommited to activate
     * @return this
     */
    activate(activated?: boolean): MenuItem {
        if (activated === undefined) {
            activated = true;
        }

        return this.setActivated(activated);
    }

    /**
     * Deactivate the menu item
     * @return this
     */
    deactivate(): MenuItem {
        return this.setActivated(false);
    }

    /**
     * Set whether the menu item is enabled or not
     * @param enabled true if enabled
     * @return this
     */
    private setEnabled(enabled: boolean): MenuItem {
        if (!enabled) {
            this.attribute(MenuItem.ATTRIBUTENAME_DISABLED);
        } else {
            this.removeAttribute(MenuItem.ATTRIBUTENAME_DISABLED);
        }

        return this;
    }

    /**
     * Set whether the menu item is activated or not
     * @param activated true if activated
     * @return this
     */
    private setActivated(activated: boolean): MenuItem {
        if (activated) {
            this.attribute(MenuItem.ATTRIBUTENAME_ACTIVATED);
        } else {
            this.removeAttribute(MenuItem.ATTRIBUTENAME_ACTIVATED);
        }

        return this;
    }

}

export {
    MenuItem
};
