import {Component, Inject} from 'injection';
import {CommandLanguagePostProcessor} from './command';
import {MenuItemLanguagePostProcessor} from './element/menu/menu-item-language-post-processor';

/**
 * UI manager
 */
@Component
class UIManager {

    /**
     * Set the command language post-processor
     * @param commandLanguagePostProcessor  Command language post-processor
     * @param menuItemLanguagePostProcessor Menu item language post-processor
     */
    @Inject
    setLanguagePostProcessors(commandLanguagePostProcessor: CommandLanguagePostProcessor, menuItemLanguagePostProcessor: MenuItemLanguagePostProcessor): void {
        // Forces injection
    }

}

export {
    UIManager
};
