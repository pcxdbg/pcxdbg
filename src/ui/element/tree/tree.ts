import {UIElement} from '../element';
import {TreeItem} from './tree-item';
import {TreeItemTypeDefinition} from './tree-item-type-definition';
import {TreeItemTypeDictionary} from './tree-item-type-dictionary';

/**
 * Tree
 * @param <D> Dictionary of possible item types
 */
class Tree<D extends TreeItemTypeDictionary> extends UIElement {
    private itemTypeDefinitions: {[typeName: string]: TreeItemTypeDefinition<any, D>} = {};

    /**
     * Class constructor
     */
    constructor() {
        super('tree');
    }

    /**
     * Set an item type definition
     * @param itemType           Item type
     * @param itemTypeDefinition Item type definition
     * @param <K>                Item type key within the dictionary
     * @return this
     */
    setItemTypeDefinition<K extends keyof D>(itemType: K, itemTypeDefinition: TreeItemTypeDefinition<K, D>): Tree<D> {
        this.itemTypeDefinitions[itemType] = itemTypeDefinition;
        return this;
    }

    /**
     * Add a root item
     * @param itemType       Item type
     * @param item           Item
     * @param parentItemType Parent item type
     * @param parentItem     Parent item
     * @param <K>            Item type key within the dictionary
     * @param <PK>           Parent item type key within the dictionary
     * @return this
     */
    addRootItem<K extends keyof D, PK extends keyof D>(itemType: K, item: D[K], parentItemType?: PK, parentItem?: D[PK]): Tree<D> {
        let treeItem: TreeItem<K, D> = this.createTreeItem<K>(itemType, item);

        this.attach(treeItem);

        return this;
    }

    /**
     * Remove an item
     * @param itemType Item type
     * @param item     Item
     * @param <K>      Item type key within the dictionary
     * @return this
     */
    removeItem<K extends keyof D>(itemType: K, item: D[K]): Tree<D> {
        return this;
    }

    /**
     * Create a tree item
     * @param itemType Item type
     * @param itemData Item data
     * @param <K>      Item type key within the dictionary
     * @return Tree item
     */
    private createTreeItem<K extends keyof D>(itemType: K, itemData: D[K]): TreeItem<K, D> {
        let treeItemTypeDefinition: TreeItemTypeDefinition<K, D> = this.getTreeItemTypeDefinition(itemType);
        let treeItem: TreeItem<K, D> = new TreeItem<K, D>(treeItemTypeDefinition, itemData);

        if (treeItemTypeDefinition.childNodesResolver) {
            treeItemTypeDefinition.childNodesResolver(itemData).then(childItems => {
                childItems.forEach(childItem => {
                    let childTreeItem: TreeItem<any, D> = this.createTreeItem(childItem.type, childItem.item);
                    treeItem.attach(childTreeItem);
                });
            })
        }
        
        return treeItem;
    }

    /**
     * Get a tree item type definition
     * @param itemType Item type
     * @param <K>      Item type key within the dictionary
     * @return Tree item type definition
     */
    private getTreeItemTypeDefinition<K extends keyof D>(itemType: K): TreeItemTypeDefinition<K, D> {
        let treeItemTypeDefinition: TreeItemTypeDefinition<K, D> = this.itemTypeDefinitions[itemType];
        if (!treeItemTypeDefinition) {
            throw new Error('unknown tree item type ' + itemType);
        }

        return treeItemTypeDefinition;
    }

}

export {
    Tree
};
