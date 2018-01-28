import {CommandDefinition, CommandManager} from '../../command';
import {UIElement} from '../element';
import {IconManager} from '../icon';
import {ToolbarItem} from './toolbar-item';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {ToolbarSeparator} from './toolbar-separator';
import {applicationContext} from 'injection';

// TODO: make a prototype component when using the external injection library (and set icon/command managers through injection)

/**
 * Toolbar
 */
class Toolbar extends UIElement {
    private static HTML: string = `
        <toolbar-grip></toolbar-grip>
    `;

    private items: {[itemId: string]: ToolbarItem} = {};

    /**
     * Class constructor
     */
    constructor() {
        super('toolbar', Toolbar.HTML);
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
     * Enable a toolbar item
     * @param itemId Item identifier
     * @return this
     */
    enable(itemId: string): Toolbar {
        return this;
    }

    /**
     * Disable a toolbar item
     * @param itemId Item identifier
     * @return this
     */
    disable(itemId: string): Toolbar {
        return this;
    }

}

export {
    Toolbar,
    ToolbarItemDefinition
};
