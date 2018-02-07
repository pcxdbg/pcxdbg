import {UIElement} from '../element';
import {UIElementBase} from '../element-base';
import {ToolbarItemContent} from './toolbar-item-content';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {ToolbarItemLabel} from './toolbar-item-label';
import {IconManager} from '../icon';
import {CommandDefinition, CommandManager} from '../../command';

/**
 * Toolbar item
 */
class ToolbarItem extends UIElementBase {
    private commandManager: CommandManager;
    private iconManager: IconManager;
    private definition: ToolbarItemDefinition;
    private content: ToolbarItemContent;
    private label: ToolbarItemLabel;

    /**
     * Class constructor
     * @param itemDefinition Item definition
     * @param iconManager    Icon manager
     * @param commandManager Command manager
     */
    constructor(itemDefinition: ToolbarItemDefinition, iconManager: IconManager, commandManager: CommandManager) {
        super('toolbar-item');
        this.content = new ToolbarItemContent();
        this.label = new ToolbarItemLabel();
        this.label.attachTo(this.content);
        this.content.attachTo(this);
        this.definition = itemDefinition;
        this.iconManager = iconManager;
        this.commandManager = commandManager;

        if (itemDefinition.icon) {
            this.setIcon(itemDefinition.icon);
        }

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
     */
    setLabel(labelId: string, labelParameters: {[parameterName: string]: any}): ToolbarItem {
        let commandId: string = this.definition.command;
        let i18nKey: string;
        let target: UIElement = this.definition.element ? this.label : this.content;

        labelParameters = {
            labelId: labelId,
            labelParameters: labelParameters
        };

        if (commandId && this.commandManager.hasAccelerator(commandId)) {
            i18nKey = 'ui:toolbar.item.label-accelerator';
            labelParameters.commandId = commandId;
            labelParameters.commandParameters = this.definition.commandParameters;
        } else {
            i18nKey = 'ui:toolbar.item.label';
        }

        return this.setI18nLabel(i18nKey, labelParameters);
    }

    /**
     * Set the label using plain text
     * @param labelText Label text
     */
    setLabelText(labelText: string): ToolbarItem {
        let commandId: string = this.definition.command;
        let i18nKey: string;
        let labelParameters: {[parameterName: string]: any} = {
            text: labelText
        };

        if (commandId && this.commandManager.hasAccelerator(commandId)) {
            i18nKey = 'ui:toolbar.item.text-accelerator';
            labelParameters.commandId = commandId;
            labelParameters.commandParameters = this.definition.commandParameters;
        } else {
            i18nKey = 'ui:toolbar.item.text';
        }

        return this.setI18nLabel(i18nKey, labelParameters);
    }

    /**
     * Set the command to execute when selecting the toolbar item
     * @param commandId         Command identifier or handler
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

    /**
     * Set an i18n label
     * @param i18nKey         i18n key
     * @param labelParameters Label parameters
     */
    private setI18nLabel(i18nKey: string, labelParameters: {[parameterName: string]: any}): ToolbarItem {
        let options: string[] = [];

        if (!this.definition.element) {
            options.push('title');
        }

        this.getLabelTarget().i18n(i18nKey, labelParameters, ...options).applyTranslations();

        return this;
    }

    /**
     * Get a label target element
     * @return Label target element
     */
    private getLabelTarget(): UIElement {
        return this.definition.element ? this.label : this.content;
    }

}

export {
    ToolbarItem
};
