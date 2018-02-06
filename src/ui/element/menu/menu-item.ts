import {UIElementBase} from '../element-base';
import {IconManager} from '../icon';

// TODO: prototype component through external injection library

/**
 * Menu item
 */
class MenuItem extends UIElementBase {
    private static HTML_MENUITEM: string = `
        <menu-item-icon></menu-item-icon>
        <menu-item-label></menu-item-label>
    `;

    private iconManager: IconManager;

    /**
     * Class constructor
     * @param iconManager Icon manager
     */
    constructor(iconManager: IconManager) {
        super('menu-item', MenuItem.HTML_MENUITEM);
        this.iconManager = iconManager;
    }

    /**
     * Set the menu item icon
     * @param icon Icon
     */
    setIcon(icon: string): void {
        this
            .element('menu-item-icon')
            .attach(this.iconManager.createIcon(16, 16, icon))
        ;
    }

}

export {
    MenuItem
};
