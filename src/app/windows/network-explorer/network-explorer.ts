import {NetworkExplorerTypeDictionary} from './network-explorer-type-dictionary';
import {Component, Controller, Inject} from 'injection';
import {Tree, TreeItemTypeDefinition, Window, WindowManager} from 'ui';

/**
 * Network explorer
 */
@Component
class NetworkExplorer {

}

/**
 * Network explorer view
 */
@Controller
class NetworkExplorerView extends Window {
    private networkExplorer: NetworkExplorer;
    private tree: Tree<NetworkExplorerTypeDictionary>;

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.setTitle('app:window.network-explorer.title');
    }

    /**
     * Set the network explorer
     * @param networkExplorer Network explorer
     */
    @Inject
    setNetworkExplorer(networkExplorer: NetworkExplorer): void {
        this.networkExplorer = networkExplorer;
        this.tree = new Tree<NetworkExplorerTypeDictionary>();
        this.tree
            .setItemTypeDefinition('discovered-list', {
                labelProvider: element => {
                    element
                        .i18n('app:window.network-explorer.tree.item.discovered-list.label')
                        .applyTranslations()
                    ;
                }
            })
            .setItemTypeDefinition('host', {
                matcher: (lhs, rhs) => lhs.id === rhs.id,
                labelProvider: (element, host) => {
                    element
                        .i18n('app:window.network-explorer.tree.item.host.label', {id: host.id, hostName: host.hostName, backend: host.backend})
                        .applyTranslations()
                    ;
                }
            })
            .setItemTypeDefinition('process', {
                matcher: (lhs, rhs) => lhs.id === rhs.id,
                labelProvider: (element, process) => {
                    element
                        .i18n('app:window.network-explorer.tree.item.process.label', {name: process.name, id: process.id})
                        .applyTranslations()
                    ;
                }
            })
            .setItemTypeDefinition('saved-list', {
                labelProvider: element => {
                    element
                        .i18n('app:window.network-explorer.tree.item.saved-list.label')
                        .applyTranslations()
                    ;
                }
            })
            .addItem('saved-list', undefined)
            .addItem('discovered-list', undefined)
            .attachTo(this)
        ;
    }

}

export {
    NetworkExplorer,
    NetworkExplorerView
};
