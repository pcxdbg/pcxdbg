import {UIElement} from '../element';
import {ToolbarItem} from './toolbar-item';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {IconManager} from '../icon';
import {CommandManager} from '../../command';
import {componentManager} from '../../../component';

/**
 * Toolbar
 */
class Toolbar extends UIElement {
    private static HTML: string = `
        <toolbar-grip></toolbar-grip>
    `;

    private items: {[itemId: string]: ToolbarItem};

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
        let itemElement: UIElement = new UIElement('toolbar-item');

        if (itemDefinition.icon) {
            itemElement.attach(componentManager.getComponent(IconManager).createIcon(16, 16, itemDefinition.icon));
        }

        if (itemDefinition.command) {
            itemElement.click(() => componentManager.getComponent(CommandManager).executeCommand(itemDefinition.command, itemDefinition.commandParameters));
        } else if (itemDefinition.handler) {
            itemElement.click(() => itemDefinition.handler());
        }

        this.attach(itemElement);

        return this;
    }

    /**
     * Add a separator
     * @return this
     */
    separator(): Toolbar {
        this.attach(new UIElement('toolbar-separator'));
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
