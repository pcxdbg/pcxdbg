import {Window} from 'ui';
import {Component, Controller} from 'es-injection';

/**
 * Thread manager
 */
@Component
class ThreadManager {

}

/**
 * Thead list view
 */
@Controller
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
