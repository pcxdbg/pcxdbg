import {CommandManager} from '../../command';
import {IconManager} from '../icon';
import {Menu} from './menu';
import {Component} from 'injection';

/**
 * Menu manager
 */
@Component
class MenuManager {
    private commandManager: CommandManager;
    private iconManager: IconManager;

    /**
     * Class constructor
     * @param commandManager     Command manager
     * @param iconManager        Icon manager
     */
    constructor(commandManager: CommandManager, iconManager: IconManager) {
        this.commandManager = commandManager;
        this.iconManager = iconManager;
    }

    /**
     * Create a menu
     * @return Menu
     */
    createMenu(): Menu {
        return new Menu(this, this.commandManager, this.iconManager, false);
    }

    /**
     * Create a popup menu
     * @return Popup menu
     */
    createPopupMenu(parentMenu?: Menu): Menu {
        return new Menu(this, this.commandManager, this.iconManager, true, parentMenu);
    }

}

export {
    MenuManager
};
