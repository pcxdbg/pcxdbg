import {Component, Controller} from 'injection';
import {Window} from 'ui';

/**
 * Call stack manager
 */
@Component
class CallStackManager {

}

/**
 * Call stack view
 */
@Controller
class CallStackView extends Window {
    private callStackManager: CallStackManager;

    /**
     * Class constructor
     * @param callStackManager Call stack manager
     */
    constructor(callStackManager: CallStackManager) {
        super({
            title: 'cpu:call-stack.title'
        });
        this.callStackManager = callStackManager;
    }

}

export {
    CallStackManager,
    CallStackView
};
