import {HostExplorerTypeDictionary} from './host-explorer-type-dictionary';
import {Component, Controller, Inject} from 'injection';
import {Tree, Window} from 'ui';

/**
 * Host explorer
 */
@Component
class HostExplorer {

}

/**
 * Host explorer view
 */
@Controller
class HostExplorerView extends Window {
    private hostExplorer: HostExplorer;
    private tree: Tree<HostExplorerTypeDictionary>;

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.setTitle('app:host-explorer.title');
    }

    /**
     * Set the host explorer
     * @param hostExplorer Host explorer
     */
    @Inject
    setHostExplorer(hostExplorer: HostExplorer) {
        this.hostExplorer = hostExplorer;
        this.tree = new Tree<HostExplorerTypeDictionary>();
        this.tree
            .setItemTypeDefinition('process', {
                labelProvider: (element, process) => {
                    element
                        .i18n('app:host-explorer.tree.item.process.label', {id: process.id, name: process.name, backend: process.backend, hostName: process.hostName})
                        .applyTranslations()
                    ;
                }
            })
            .addItem('process', {
                id: '1234',
                name: 'default.xex',
                hostName: 'localhost:36063',
                backend: 'pcxone'
            })
            .attachTo(this)
        ;
    }

}

export {
    HostExplorer,
    HostExplorerView
};
