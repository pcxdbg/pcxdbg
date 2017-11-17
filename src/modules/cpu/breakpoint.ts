import {Window, WindowManager} from '../../ui/window';
import {Component} from '../../component';

/**
 * Breakpoint manager
 */
@Component
class BreakpointManager {

}

/**
 * Breakpoint list view
 */
@Component
class BreakpointListView extends Window {
    private breakpointManager: BreakpointManager;

    /**
     * Class constructor
     * @param breakpointManager Breakpoint manager
     */
    constructor(breakpointManager: BreakpointManager) {
        super({
            title: 'cpu:breakpoint-list.title'
        });
        this.breakpointManager = breakpointManager;
    }

}

export {
    BreakpointListView,
    BreakpointManager
};
