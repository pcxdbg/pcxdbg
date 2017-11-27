import {Toolbar} from './toolbar';
import {Component, ClassConstructorTypeFromType} from 'injection';

/**
 * Toolbar manager
 */
@Component
class ToolbarManager {

    /**
     * Register a toolbar
     * @param toolbarClass Toolbar class
     * @param <T>          Toolbar type
     */
    registerToolbar<T extends Toolbar>(toolbarClass: ClassConstructorTypeFromType<T>): void {
        console.log('Toolbar registration not implemented');
    }

}

export {
    ToolbarManager
};
