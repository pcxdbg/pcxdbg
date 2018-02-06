import {UIElementBase} from '../element-base';

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
