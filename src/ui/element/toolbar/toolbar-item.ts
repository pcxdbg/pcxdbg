import {UIElement} from '../element';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {IconManager} from '../icon';
import {CommandDefinition, CommandManager} from '../../command';

/**
 * Toolbar item
 */
class ToolbarItem extends UIElement {
    private static HTML_TOOLBARITEM: string = '<toolbar-item-content></toolbar-item-content>';

    private commandManager: CommandManager;
    private iconManager: IconManager;
    private definition: ToolbarItemDefinition;
    private content: UIElement;

    /**
     * Class constructor
     * @param itemDefinition Item definition
     * @param iconManager    Icon manager
     * @param commandManager Command manager
     */
    constructor(itemDefinition: ToolbarItemDefinition, iconManager: IconManager, commandManager: CommandManager) {
        super('toolbar-item', ToolbarItem.HTML_TOOLBARITEM);

        this.content = this.element('toolbar-item-content');
        this.definition = itemDefinition;
        this.iconManager = iconManager;
        this.commandManager = commandManager;

        this.setIcon(itemDefinition.icon);

        if (itemDefinition.label) {
            this.setLabel(itemDefinition.label, itemDefinition.labelParameters);
        } else if (itemDefinition.labelText) {
            this.setLabelText(itemDefinition.labelText);
        }

        if (itemDefinition.element) {
            this.attach(itemDefinition.element);
        }

        if (itemDefinition.command) {
            this.setCommand(itemDefinition.command, itemDefinition.commandParameters);
        } else if (itemDefinition.handler) {
            this.setCommand(itemDefinition.handler);
        }
    }

    /**
     * Set the icon
     * @param icon Icon
     * @return this
     */
    setIcon(icon: string): ToolbarItem {
        if (icon) {
            this.content.attach(this.iconManager.createIcon(16, 16, icon));
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
        let i18nKey: string = labelId;
        let target: UIElement = this.content;

        if (commandId) {
            let commandDefinition: CommandDefinition = this.commandManager.getCommandDefinition(commandId);
            if (commandDefinition && commandDefinition.accelerator) {
                i18nKey += ' ($cmdacc(' + commandId + '))';
            }
        }

        if (this.definition.element) {
            target = new UIElement('label').attachTo(target);
        } else {
            i18nKey = '[title]' + i18nKey;
        }

        target.i18n(i18nKey, labelParameters).applyTranslations();

        return this;
    }

    /**
     * Set the label using plain text
     * @param labelText Label text
     */
    setLabelText(labelText: string): ToolbarItem {
        if (this.definition.element) {
            this.attach(new UIElement('label').text(labelText));
        } else {
            this.attribute('title', labelText);
        }

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
