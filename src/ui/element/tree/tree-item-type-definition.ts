import {UIElement} from '../element';
import {Icon} from '../icon';
import {TreeItemChild} from './tree-item-child';
import {TreeItemTypeDictionary} from './tree-item-type-dictionary';

/**
 * Tree item type definition
 * @param <K> Item type key within the dictionary
 * @param <D> Item dicctionary type
 */
interface TreeItemTypeDefinition<K extends keyof D, D extends TreeItemTypeDictionary> {
    matcher?: (lhs: D[K], rhs: D[K]) => boolean;
    labelProvider: (element: UIElement, item: D[K]) => void;
    iconResolver?: (item: D[K]) => Icon;
    childNodesResolver?: (item: D[K]) => Promise<TreeItemChild<any, D>[]>;
}

export {
    TreeItemTypeDefinition
};
