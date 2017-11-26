import {UIElement} from '../element';
import {TreeItemDefinition} from './tree-item-definition';

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
    Tree
};
