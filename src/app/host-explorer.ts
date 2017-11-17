import {Window, WindowManager} from '../ui/window';
import {Component} from '../component';

/**
 * Host explorer
 */
@Component
class HostExplorer {

}

/**
 * Host explorer view
 */
@Component
class HostExplorerView extends Window {
    private hostExplorer: HostExplorer;

    /**
     * Class constructor
     * @param hostExplorer Host explorer
     */
    constructor(hostExplorer: HostExplorer) {
        super();
        this.hostExplorer = hostExplorer;
        this.setTitle('app:host-explorer.title');
    }

}

export {
    HostExplorer,
    HostExplorerView
};
