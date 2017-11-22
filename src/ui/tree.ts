import {UIElement} from './element';

/**
 * Tree item definition
 * @param <T> Item data type
 */
interface TreeItemDefinition<T> {
    label?: string;
    labelParameters?: {[parameterName: string]: any};
    labelText?: string;
    tooltip?: string;
    tooltipParameters?: {[parameterName: string]: any};
    tooltipText?: string;
    className?: string|{(item: T): string};
}

/**
 * Tree
 * @param <T> Item data type
 */
class Tree<T> extends UIElement {
    private static HTML: string = `
        tree
    `;

    /**
     * Class constructor
     */
    constructor() {
        super('tree', Tree.HTML);
    }

    /**
     * Add an item
     * @param itemDefinition Item definition
     * @param itemData       Item data
     */
    addItem(itemDefinition: TreeItemDefinition<T>, itemData?: T): Tree<T> {
        return this;
    }

}

export {
    Tree,
    TreeItemDefinition
};
