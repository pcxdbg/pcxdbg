import {UIElement, UIElementBase} from '../../element';
import {Icon, IconManager} from '../icon';
import {TreeItemTypeDefinition} from './tree-item-type-definition';
import {Component, Inject, Scope, ScopeType} from 'es-injection';

/**
 * Tree item
 * @param <K> Item type key within the dictionary
 * @param <D> Item dictionary type
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class TreeItem<K extends keyof D, D> extends UIElementBase {
    private static HTML: string = `
        <tree-item-content>
            <tree-item-expander></tree-item-expander>
            <tree-item-icon></tree-item-icon>
            <tree-item-label></tree-item-label>
        </tree-item-content>
        <tree-item-children></tree-item-children>
    `;

    private typeDefinition: TreeItemTypeDefinition<K, D>;
    private data: D[K];

    /**
     * Class constructor
     */
    constructor() {
        super('tree-item', TreeItem.HTML);
        this.click(e => {
            e.stopPropagation();
            this.attribute('selected');
        });
    }

    /**
     * Set the icon manager
     * @param iconManager Icon manager
     */
    @Inject
    setIconManager(iconManager: IconManager): void {
        this.element('tree-item-content', 'tree-item-expander')
            .click(e => {
                e.stopPropagation();
                this.toggleAttribute('expanded');
            })
            .attach(iconManager.createIcon(16, 16, 'tree-expand'))
            .attach(iconManager.createIcon(16, 16, 'tree-expanded'))
        ;
    }

    /**
     * Set the item type definition
     * @param itemTypeDefinition Item type definition
     */
    setItemTypeDefinition(itemTypeDefinition: TreeItemTypeDefinition<K, D>): TreeItem<K, D> {
        this.typeDefinition = itemTypeDefinition;
        return this;
    }

    /**
     * Get the item data
     * @return Item data
     */
    getItemData(): D[K] {
        return this.data;
    }

    /**
     * Set the item data
     * @param itemData 
     */
    setItemData(itemData: D[K]): TreeItem<K, D> {
        let labelElement: UIElement = this.element('tree-item-content', 'tree-item-label');

        this.typeDefinition.labelProvider(labelElement, <any> itemData);

        if (this.typeDefinition.iconResolver) {
            let icon: Icon = this.typeDefinition.iconResolver(itemData);

            this.element('tree-item-content', 'tree-item-icon')
                .clearContent()
                .attach(icon)
            ;
        }

        this.data = itemData;

        return this;
    }

    /**
     * Get the child target
     * @return Child target
     */
    getChildTarget = (): UIElement => {
        return this.element('tree-item-children');
    }

}

export {
    TreeItem
};
