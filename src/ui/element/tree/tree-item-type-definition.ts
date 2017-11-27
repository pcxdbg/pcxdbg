import {UIElement} from '../element';
import {Icon} from '../icon';
import {TreeItemTypeDictionary} from './tree-item-type-dictionary';

/**
 * Tree item type definition
 */
interface TreeItemTypeDefinition<T> {
    matcher?: (lhs: T, rhs: T) => boolean;
    labelProvider: (element: UIElement, item: T) => void;
    iconResolver?: (item: T) => Promise<Icon>;
    childNodesResolver?: (item: T) => Promise<T[]>;
}

export {
    TreeItemTypeDefinition
};
