
/**
 * Toolbar item definition
 */
interface ToolbarItemDefinition {
    id?: string;
    label?: string;
    labelParameters?: {[parameterName: string]: any};
    labelText?: string;
    icon?: string;
    command?: string;
    commandParameters?: {[parameterName: string]: any};
    handler?: () => void;
}

export {
    ToolbarItemDefinition
};
