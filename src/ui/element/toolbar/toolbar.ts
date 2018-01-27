import {CommandDefinition, CommandManager} from '../../command';
import {UIElement} from '../element';
import {IconManager} from '../icon';
import {ToolbarItem} from './toolbar-item';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {applicationContext} from 'injection';

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
        let commandManager: CommandManager = applicationContext.getComponent(CommandManager);

        if (itemDefinition.icon) {
            itemElement.attach(applicationContext.getComponent(IconManager).createIcon(16, 16, itemDefinition.icon));
        }

        if (itemDefinition.command) {
            commandManager = applicationContext.getComponent(CommandManager);
            itemElement.click(() => commandManager.executeCommand(itemDefinition.command, itemDefinition.commandParameters));
        } else if (itemDefinition.handler) {
            itemElement.click(() => itemDefinition.handler());
        }

        if (itemDefinition.label) {
            let i18nKey: string = '[title]' + itemDefinition.label;

            if (itemDefinition.command) {
                let commandDefinition: CommandDefinition = commandManager.getCommandDefinition(itemDefinition.command);
                if (commandDefinition && commandDefinition.accelerator) {
                    i18nKey += ' ($cmdacc(' + itemDefinition.command + '))';
                }
            }

            itemElement.i18n(i18nKey, itemDefinition.labelParameters).applyTranslations();
        } else if (itemDefinition.labelText) {
            itemElement.attribute('title', itemDefinition.labelText);
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
