import {UIElement, UIElementBase} from '../../element';
import {ToolbarItemContent} from './toolbar-item-content';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {ToolbarItemLabel} from './toolbar-item-label';
import {IconManager} from '../icon';
import {CommandDefinition, CommandManager} from '../../command';
import {Component, Inject, Scope, ScopeType} from 'es-injection';

/**
 * Toolbar item
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class ToolbarItem extends UIElementBase {
    private static ATTRIBUTENAME_CHECKED: string = 'checked';
    private static ATTRIBUTENAME_DISABLED: string = 'disabled';

    private commandManager: CommandManager;
    private iconManager: IconManager;
    private definition: ToolbarItemDefinition;
    private content: ToolbarItemContent;
    private label: ToolbarItemLabel;

    /**
     * Class constructor
     */
    constructor() {
        super('toolbar-item');
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
     * Set the icon manager
     * @param iconManager Icon manager
     */
    @Inject
    setIconManager(iconManager: IconManager): void {
        this.iconManager = iconManager;
    }

    /**
     * Set the item definition
     * @param itemDefinition Item definition
     */
    setDefinition(itemDefinition: ToolbarItemDefinition): ToolbarItem {
        this.content = new ToolbarItemContent();
        this.label = new ToolbarItemLabel();
        this.label.attachTo(this.content);
        this.content.attachTo(this);
        this.definition = itemDefinition;

        if (itemDefinition.element) {
            this.content.attach(itemDefinition.element);
        }

        if (itemDefinition.icon) {
            this.setIcon(itemDefinition.icon);
        }

        if (itemDefinition.label) {
            this.setLabel(itemDefinition.label, itemDefinition.labelParameters);
        } else if (itemDefinition.labelText) {
            this.setLabelText(itemDefinition.labelText);
        }

        if (itemDefinition.command) {
            this.setCommand(itemDefinition.command, itemDefinition.commandParameters);
        } else if (itemDefinition.handler) {
            this.setHandler(itemDefinition.handler);
        }

        return this;
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
     * @param commandId         Command identifier
     * @param commandParameters Command parameters
     * @return this
     */
    setCommand(commandId: string, commandParameters?: {[parameterName: string]: any}): ToolbarItem {
        this.click(() => this.commandManager.executeCommand(commandId, commandParameters));
        return this;
    }

    /**
     * Set the handler to call when selecting the toolbar item
     * @param handler Handler
     * @return this
     */
    setHandler(handler: () => void): ToolbarItem {
        this.click(() => handler());
        return this;
    }

    /**
     * Set whether the item is enabled or disabled
     * @param enabled true if the item is enabled
     * @return this
     */
    setEnabled(enabled: boolean): ToolbarItem {
        if (!enabled) {
            this.attribute(ToolbarItem.ATTRIBUTENAME_DISABLED);
        } else {
            this.removeAttribute(ToolbarItem.ATTRIBUTENAME_DISABLED);
        }

        return this;
    }

    /**
     * Set whether the item is checked or unchecked
     * @param checked true if the item is checked
     * @return this
     */
    setChecked(checked: boolean): ToolbarItem {
        if (checked) {
            this.attribute(ToolbarItem.ATTRIBUTENAME_CHECKED);
        } else {
            this.removeAttribute(ToolbarItem.ATTRIBUTENAME_CHECKED);
        }

        return this;
    }

    /**
     * Set an i18n label
     * @param i18nKey         i18n key
     * @param labelParameters Label parameters
     * @return this
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
