import {TreeItemTypeDictionary} from './tree-item-type-dictionary';

/**
 * Child node
 * @param <K> Item type key within the dictionary
 * @param <D> Item dicctionary type
 */
class TreeItemChild<K extends keyof D, D extends TreeItemTypeDictionary> {
    type: K;
    item: D[K];
}

export {
    TreeItemChild
};
