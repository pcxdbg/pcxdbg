import {UIElement} from '../element';
import {IconManager} from '../icon';
import {TreeItemTypeDefinition} from './tree-item-type-definition';
import {applicationContext} from 'injection';

/**
 * Tree item
 * @param <K> Item type key within the dictionary
 * @param <D> Item dictionary type
 */
class TreeItem<K extends keyof D, D> extends UIElement {
    private static HTML: string = `
        <tree-item-content>
            <tree-item-expander></tree-item-expander>
            <tree-item-icon>Icon</tree-item-icon>
            <tree-item-label></tree-item-label>
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
        let expanderElement: UIElement = this.element('tree-item-content', 'tree-item-expander');
        let labelElement: UIElement = this.element('tree-item-content', 'tree-item-label');
        let iconElement: UIElement = this.element('tree-item-content', 'tree-item-icon');
        let iconManager: IconManager = applicationContext.getComponent(IconManager);

        itemTypeDefinition.labelProvider(labelElement, <any> itemData);

        expanderElement
            .attach(iconManager.createIcon(16, 16, 'tree-expand'))
            .attach(iconManager.createIcon(16, 16, 'tree-expanded'))
            .click(() => this.attribute('expanded'))
        ;

        this.click(() => this.attribute('selected'));
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
