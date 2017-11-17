import {Window, WindowManager} from '../../ui/window';
import {List} from '../../ui/list';
import {Component} from '../../component';

/**
 * Watch
 */
class Watch {

}

/**
 * Watch manager
 */
@Component
class WatchManager {

}

/**
 * Watch list view
 */
@Component
class WatchListView extends Window {
    private watchManager: WatchManager;
    private list: List<Watch>;

    /**
     * Class constructor
     * @param watchManager Watch manager
     */
    constructor(watchManager: WatchManager) {
        super({
            title: 'cpu:watch-list.title'
        });
        this.watchManager = watchManager;

        this.list = new List();
        this.list
            .addColumn({
                id: 'name',
                label: 'cpu:watch-list.columns.name',
                sortable: true
            })
            .addColumn({
                id: 'value',
                label: 'cpu:watch-list.columns.value',
                sortable: true
            })
            .addColumn({
                id: 'type',
                label: 'cpu:watch-list.columns.type',
                sortable: true
            })
            .attachTo(this)
        ;
    }

}

export {
    WatchListView,
    WatchManager
};
