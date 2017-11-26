import {UIElement} from '../element';

/**
 * List item definition
 * @param <T> Item data type
 */
interface ListItemDefinition<T> {
    click?: {(item: T): void};
    provider?: {(item: T, row: UIElement): void};
}

export {
    ListItemDefinition
};
