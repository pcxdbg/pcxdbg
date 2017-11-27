import {UIElement} from '../element';
import {TreeItemTypeDefinition} from './tree-item-type-definition';

/**
 * Tree item
 * @param <K> Item type key within the dictionary
 * @param <D> Item dictionary type
 */
class TreeItem<K extends keyof D, D> extends UIElement {
    private static HTML: string = `
        <tree-item-content>
            <tree-item-expander>+</tree-item-expander>
            <tree-item-icon>Icon</tree-item-icon>
            <tree-item-label>Tree Item Label</tree-item-label>
        </tree-item-content>
        <tree-item-children>Child Nodes</tree-item-children>
    `;

    private data: D[K];

    /**
     * Class constructor
     * @param itemTypeDefinition Item type definition
     * @param itemData           Item data
     */
    constructor(itemTypeDefinition: TreeItemTypeDefinition<D>, itemData: D[K]) {
        super('tree-item', TreeItem.HTML);
        this.click(() => this.attribute('selected'));
        itemTypeDefinition.labelProvider(this.element('tree-item-content', 'tree-item-label'), <any> itemData);
    }

    /**
     * Get the data
     * @return Item data
     */
    getData(): D[K] {
        return this.data;
    }

}

export {
    TreeItem
};
