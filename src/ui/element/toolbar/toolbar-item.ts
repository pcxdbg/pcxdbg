import {UIElement} from '../element';
import {UIElementBase} from '../element-base';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {IconManager} from '../icon';
import {CommandDefinition, CommandManager} from '../../command';

/**
 * Toolbar item content
 */
class ToolbarItemContent extends UIElementBase {

    /**
     * Class constructor
     */
     constructor() {
         super('toolbar-item-content');
     }

}

/**
 * Toolbar item label
 */
class ToolbarItemLabel extends UIElementBase {

    /**
     * Class constructor
     */
    constructor() {
        super('toolbar-item-label');
    }

}


/**
 * Toolbar item
 */
class ToolbarItem extends UIElementBase {
    private commandManager: CommandManager;
    private iconManager: IconManager;
    private definition: ToolbarItemDefinition;
    private content: ToolbarItemContent;

    /**
     * Class constructor
     * @param itemDefinition Item definition
     * @param iconManager    Icon manager
     * @param commandManager Command manager
     * @param i18nManager    i18n manager
     */
    constructor(itemDefinition: ToolbarItemDefinition, iconManager: IconManager, commandManager: CommandManager) {
        super('toolbar-item');

        this.content = new ToolbarItemContent();
        this.content.attachTo(this);
        this.definition = itemDefinition;
        this.iconManager = iconManager;
        this.commandManager = commandManager;

        this.setIcon(itemDefinition.icon);

        if (itemDefinition.label) {
            this.setLabel(itemDefinition.label, itemDefinition.labelParameters, itemDefinition.command);
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
                i18nKey = 'ui:toolbar.item.command';
            }
        }

        if (this.definition.element) {
            target = new ToolbarItemLabel().attachTo(target);
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
            this.content.attach(new ToolbarItemLabel().text(labelText));
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
