import {UIElement} from '../element';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {IconManager} from '../icon';
import {CommandDefinition, CommandManager} from '../../command';

/**
 * Toolbar item
 */
class ToolbarItem extends UIElement {
    private commandManager: CommandManager;
    private iconManager: IconManager;
    private definition: ToolbarItemDefinition;

    /**
     * Class constructor
     * @param itemDefinition Item definition
     * @param iconManager    Icon manager
     * @param commandManager Command manager
     */
    constructor(itemDefinition: ToolbarItemDefinition, iconManager: IconManager, commandManager: CommandManager) {
        super('toolbar-item');
        this.definition = itemDefinition;
        this.iconManager = iconManager;
        this.commandManager = commandManager;

        this.setIcon(itemDefinition.icon);

        if (itemDefinition.label) {
            this.setLabel(itemDefinition.label, itemDefinition.labelParameters);
        } else if (itemDefinition.labelText) {
            this.setLabelText(itemDefinition.labelText);
        }

        if (itemDefinition.command) {
            this.setCommand(itemDefinition.command, itemDefinition.commandParameters);
        } else if (itemDefinition.handler) {
            this.setCommand(itemDefinition.handler);
        }
    }

    setIcon(icon: string): ToolbarItem {
        if (icon) {
            this.attach(this.iconManager.createIcon(16, 16, icon));
        }

        this.definition.icon = icon;

        return this;
    }

    /**
     * Set the label using i18n
     * @param labelId         Label identifier
     * @param labelParameters Label parameters
     * @param commandId       Command identifier
     */
    setLabel(labelId: string, labelParameters: {[parameterName: string]: any}, commandId?: string): ToolbarItem {
        let i18nKey: string = '[title]' + labelId;

        if (commandId) {
            let commandDefinition: CommandDefinition = this.commandManager.getCommandDefinition(commandId);
            if (commandDefinition && commandDefinition.accelerator) {
                i18nKey += ' ($cmdacc(' + commandId + '))';
            }
        }

        this.i18n(i18nKey, labelParameters).applyTranslations();

        return this;
    }

    /**
     * Set the label using plain text
     * @param labelText Label text
     */
    setLabelText(labelText: string): ToolbarItem {
        this.attribute('title', labelText);
        return this;
    }

    /**
     * Set the command to execute when selecting the toolbar item
     * @param commandId         Command identifier
     * @param commandParameters Command parameters
     * @return this
     */
    setCommand(commandId: string|{(): void}, commandParameters?: {[parameterName: string]: any}): ToolbarItem {
        if (typeof(commandId) === 'string') {
            this.click(() => this.commandManager.executeCommand(commandId, commandParameters));
        } else {
            this.click(() => commandId());
        }

        return this;
    }

}

export {
    ToolbarItem
};
