import {UIElementBase} from '../../element';

/**
 * Input
 */
class Input extends UIElementBase {

    /**
     * Class constructor
     */
    constructor() {
        super('input');
        this.attribute('type', 'text');
    }

}

export {
    Input
};
