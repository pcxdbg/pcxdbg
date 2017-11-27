import {Component, Controller} from 'injection';
import {Window} from 'ui';

/**
 * Breakpoint manager
 */
@Component
class BreakpointManager {

    /**
     * Delete all breakpoints
     */
    deleteAll(): void {
        console.warn('Deleting all breakpoints is not implemented');
    }

    /**
     * Disable all breakpoints
     */
    disableAll(): void {
        console.warn('Disabling all breakpoints is not implemented');
    }

}

/**
 * Breakpoint list view
 */
@Controller
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
