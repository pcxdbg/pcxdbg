import {Component, Inject} from 'injection';
import {CommandLanguagePostProcessor} from 'ui/command';

/**
 * UI manager
 */
@Component
class UIManager {

    /**
     * Set the command language post-processor
     * @param commandLanguagePostProcessor Command language post-processor
     */
    @Inject
    setLanguagePostProcessors(commandLanguagePostProcessor: CommandLanguagePostProcessor): void {
        // Forces injection
    }

}

export {
    UIManager
};
