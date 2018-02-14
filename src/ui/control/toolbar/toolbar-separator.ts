import {UIElementBase} from '../../element';
import {Component, Scope, ScopeType} from 'es-injection';

/**
 * Toolbar separator
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class ToolbarSeparator extends UIElementBase {

    /**
     * Class constructor
     */
    constructor() {
        super('toolbar-separator');
    }

}

export {
    ToolbarSeparator
};
