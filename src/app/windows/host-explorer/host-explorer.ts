import {HostExplorerHostItem} from './host-explorer-host-item';
import {HostExplorerProcessItem} from './host-explorer-process-item';
import {HostExplorerTypeDictionary} from './host-explorer-type-dictionary';
import {Component, Controller, Inject} from 'injection';
import {Icon, IconManager, Tree, Window} from 'ui';

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
    private iconManager: IconManager;
    private iconHost: Icon;
    private tree: Tree<HostExplorerTypeDictionary>;

    /**
     * Class constructor
     * @param iconManager Icon manager
     */
    constructor(iconManager: IconManager) {
        super();
        this.setTitle('app:window.host-explorer.title');
    }

    /**
     * Set the host explorer
     * @param hostExplorer Host explorer
     */
    @Inject
    setHostExplorer(hostExplorer: HostExplorer) {
        let processItem: HostExplorerProcessItem;
        let hostItem: HostExplorerHostItem;

        this.hostExplorer = hostExplorer;
        this.tree = new Tree<HostExplorerTypeDictionary>();
        this.tree
            .setItemTypeDefinition('host', {
                matcher: (lhs, rhs) => lhs.backend === rhs.backend && lhs.name === rhs.name,
                labelProvider: (element, host) => {
                    element
                        .i18n('app:window.host-explorer.tree.item.host.label', {backend: host.backend, hostName: host.name})
                        .applyTranslations()
                    ;
                }
            })
            .setItemTypeDefinition('process', {
                labelProvider: (element, process) => {
                    element
                        .i18n('app:window.host-explorer.tree.item.process.label', {id: process.id, name: process.name})
                        .applyTranslations()
                    ;
                }
            })
            .attachTo(this)
        ;

        hostItem = {
            name: 'localhost:36063',
            backend: 'pcxone'
        };
        processItem = {
            id: '1234',
            name: 'default.xex'
        };

        this.tree
            .addItem('host', hostItem)
            .addItem('process', processItem, 'host', hostItem)
        ;
    }

}

export {
    HostExplorer,
    HostExplorerView
};
