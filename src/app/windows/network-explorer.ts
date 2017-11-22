import {Window, WindowManager} from '../../ui';
import {Component} from '../../component';

/**
 * Network explorer
 */
@Component
class NetworkExplorer {

}

/**
 * Network explorer
 */
@Component
class NetworkExplorerView extends Window {
    private networkExplorer: NetworkExplorer;

    /**
     * Class constructor
     * @param networkExplorer Network explorer
     */
    constructor(networkExplorer: NetworkExplorer) {
        super();
        this.networkExplorer = networkExplorer;
        this.setTitle('app:network-explorer.title');
    }

}

export {
    NetworkExplorer,
    NetworkExplorerView
};
