import {UIElementBase} from '../../element';
import {ToolbarGrip} from './toolbar-grip';
import {ToolbarItem} from './toolbar-item';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {ToolbarSeparator} from './toolbar-separator';
import {ApplicationContext, Component, Inject, Scope, ScopeType} from 'es-injection';

/**
 * Toolbar
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class Toolbar extends UIElementBase {
    private applicationContext: ApplicationContext;
    private items: {[itemId: string]: ToolbarItem} = {};

    /**
     * Class constructor
     */
    constructor() {
        super('toolbar');
    }

    /**
     * Set the toolbar grip
     * @param toolbarGrip Toolbar grip
     */
    @Inject
    setToolbarGrip(toolbarGrip: ToolbarGrip): void {
        this.attach(toolbarGrip);
    }

    /**
     * Set the application context
     * @param applicationContext Application context
     */
    @Inject
    setApplicationContext(applicationContext: ApplicationContext): void {
        this.applicationContext = applicationContext;
    }

    /**
     * Add an item
     * @param itemDefinition Item definition
     * @return this
     */
    item(itemDefinition: ToolbarItemDefinition): Toolbar {
        let toolbarItem: ToolbarItem = this.applicationContext.getComponent(ToolbarItem);

        toolbarItem.setDefinition(itemDefinition);

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
        let toolbarSeparator: ToolbarSeparator = this.applicationContext.getComponent(ToolbarSeparator);
        this.attach(toolbarSeparator);
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
