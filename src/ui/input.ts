import {UIElement} from './element';

/**
 * Input
 */
class Input extends UIElement {

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
