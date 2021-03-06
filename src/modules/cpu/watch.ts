import {List, Window} from 'ui';
import {Component, Controller, Inject} from 'es-injection';

/**
 * Watch
 */
class Watch {

}

/**
 * Watch list view
 */
@Controller
class WatchListView extends Window {
    private list: List<Watch>;

    /**
     * Class constructor
     */
    constructor() {
        super({
            title: 'cpu:watch-list.title'
        });
    }

    /**
     * Set the list
     * @param list List
     */
    @Inject
    setList(list: List<any>): void {
        this.list = list;
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
    WatchListView
};
