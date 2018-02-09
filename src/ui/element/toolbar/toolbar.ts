import {CommandDefinition, CommandManager} from '../../command';
import {UIElementBase} from '../element-base';
import {IconManager} from '../icon';
import {ToolbarGrip} from './toolbar-grip';
import {ToolbarItem} from './toolbar-item';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {ToolbarSeparator} from './toolbar-separator';
import {applicationContext} from 'injection';

// TODO: make a prototype component when using the external injection library (and set icon/command managers through injection)

/**
 * Toolbar
 */
class Toolbar extends UIElementBase {
    private items: {[itemId: string]: ToolbarItem} = {};

    /**
     * Class constructor
     */
    constructor() { // TODO: configurable grip display
        super('toolbar');
        this.attach(new ToolbarGrip());
    }

    /**
     * Add an item
     * @param itemDefinition Item definition
     * @return this
     */
    item(itemDefinition: ToolbarItemDefinition): Toolbar {
        let commandManager: CommandManager = applicationContext.getComponent(CommandManager);
        let iconManager: IconManager = applicationContext.getComponent(IconManager);
        let toolbarItem: ToolbarItem = new ToolbarItem(itemDefinition, iconManager, commandManager);

        if (itemDefinition.id) {
            this.items[itemDefinition.id] = toolbarItem;
        }

        this.attach(toolbarItem);

        return this;
    }

    /**
     * Add a separator
     * @return this
     */
    separator(): Toolbar {
        this.attach(new ToolbarSeparator());
        return this;
    }

    /**
     * Enable or disable a toolbar item
     * @param itemId  Item identifier
     * @param enabled true if the item is enabled
     * @return this
     */
    enable(itemId: string, enabled?: boolean): Toolbar {
        if (enabled === undefined) {
            enabled = true;
        }

        return this.setEnabled(itemId, enabled);
    }

    /**
     * Disable a toolbar item
     * @param itemId Item identifier
     * @return this
     */
    disable(itemId: string): Toolbar {
        return this.setEnabled(itemId, false);
    }

    /**
     * Check or uncheck a toolbar item
     * @param itemId  Item identifier
     * @param checked true if the item is checked
     */
    check(itemId: string, checked?: boolean): Toolbar {
        if (checked === undefined) {
            checked = true;
        }

        return this.setChecked(itemId, checked);
    }

    /**
     * Uncheck a toolbar item
     * @param itemId Item identifier
     * @return this
     */
    uncheck(itemId: string): Toolbar {
        return this.setChecked(itemId, false);
    }

    /**
     * Set whether a toolbar item is enabled or disabled
     * @param itemId  Item identifier
     * @param enabled true if the item is enabled
     * @return this
     */
    private setEnabled(itemId: string, enabled: boolean): Toolbar {
        this.getItem(itemId).setEnabled(enabled);
        return this;
    }

    /**
     * Set whether a toolbar item is checked or unchecked
     * @param itemId  Item identifier
     * @param checked true if the item is checked
     * @return this
     */
    private setChecked(itemId: string, checked: boolean): Toolbar {
        this.getItem(itemId).setChecked(checked);
        return this;
    }

    /**
     * Get a toolbar item by identifier
     * @param itemId Item identifier
     * @return Toolbar item
     */
    private getItem(itemId: string): ToolbarItem {
        let toolbarItem: ToolbarItem = this.items[itemId];
        if (!toolbarItem) {
            throw new Error('toolbar item ' + itemId + ' not found');
        }

        return toolbarItem;
    }

}

export {
    Toolbar
};
