import {UIElementBase} from '../../element';
import {Component, Scope, ScopeType} from 'es-injection';

/**
 * Menu separator
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class MenuSeparator extends UIElementBase {

    /**
     * Class constructor
     */
    constructor() {
        super('menu-separator');
    }

}

export {
    MenuSeparator
};
