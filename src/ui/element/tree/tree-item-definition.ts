
/**
 * Tree item definition
 * @param <T> Item data type
 */
interface TreeItemDefinition<T> {
    label?: string;
    labelParameters?: {[parameterName: string]: any};
    labelText?: string;
    tooltip?: string;
    tooltipParameters?: {[parameterName: string]: any};
    tooltipText?: string;
    className?: string|{(item: T): string};
}

export {
    TreeItemDefinition
};
