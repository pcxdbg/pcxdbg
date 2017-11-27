import {Menu} from './menu';

/**
 * Menu item definition
 */
interface MenuItemDefinition {
    id?: string;
    label?: string;
    labelParameters?: {[parameterName: string]: any};
    labelText?: string;
    handler?: (itemDefinition: MenuItemDefinition) => void;
    icon?: string;
    command?: string;
    commandParameters?: {[parameterName: string]: any};
    popupMenu?: Menu;
}

export {
    MenuItemDefinition
};
