import {UIElement} from '../element';

/**
 * List column definition
 * @param <T> Item data type
 */
interface ListColumnDefinition<T> {
    id: string;
    label?: string;
    labelParameters?: {[parameterName: string]: string};
    labelText?: string;
    className?: string;
    sortable?: boolean | {(lhs: T, rhs: T): number};
    provider?: {(item: T, cell: UIElement): void};
}

export {
    ListColumnDefinition
};
