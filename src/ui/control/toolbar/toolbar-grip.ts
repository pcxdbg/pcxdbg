import {UIElementBase} from '../../element';
import {Component, Scope, ScopeType} from 'es-injection';

/**
 * Toolbar grip
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class ToolbarGrip extends UIElementBase {

    /**
     * Class constructor
     */
    constructor() {
        super('toolbar-grip');
    }

}

export {
    ToolbarGrip
};
