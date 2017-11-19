import {UIElement} from './element';
import {IconManager} from './icon';
import {Component, componentManager, ClassConstructorTypeFromType} from '../component';

/**
 * Toolbar item definition
 */
interface ToolbarItemDefinition {
    id?: string;
    label?: string;
    labelParameters?: {[parameterName: string]: any};
    icon?: string;
}

/**
 * Toolbar item
 */
class ToolbarItem {
    element: UIElement;
    definition: ToolbarItemDefinition;
}

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

        this.attach(itemElement);

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

/**
 * Toolbar manager
 */
@Component
class ToolbarManager {

    /**
     * Register a toolbar
     * @param toolbarClass Toolbar class
     * @param <T>          Toolbar type
     */
    registerToolbar<T extends Toolbar>(toolbarClass: ClassConstructorTypeFromType<T>): void {
        console.log('Toolbar registration not implemented');
    }

}

export {
    Toolbar,
    ToolbarManager
};
