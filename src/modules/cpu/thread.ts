import {Window, WindowManager} from '../../ui/window';
import {Component} from '../../component';

/**
 * Thread manager
 */
@Component
class ThreadManager {

}

/**
 * Thead list view
 */
@Component
class ThreadListView extends Window {
    private threadManager: ThreadManager;

    /**
     * Class constructor
     * @param threadManager Thread manager
     */
    constructor(threadManager: ThreadManager) {
        super({
            title: 'cpu:thread-list.title'
        });
        this.threadManager = threadManager;
    }

}

export {
    ThreadListView,
    ThreadManager
};
