import {HostExplorerTypeDictionary} from './host-explorer-type-dictionary';
import {Component, Controller, Inject} from 'es-injection';
import {Icon, IconManager, Tree, TreeItemChild, Window} from 'ui';
import {HostExplorerHostItem} from './host-explorer-host-item';
import {HostExplorerProcessItem} from './host-explorer-process-item';

/**
 * Host explorer view
 */
@Controller
class HostExplorerView extends Window {
    private iconManager: IconManager;
    private tree: Tree<HostExplorerTypeDictionary>;

    /**
     * Class constructor
     * @param iconManager Icon manager
     */
    constructor(iconManager: IconManager) { // TODO: method injection + @Order when switched to external lib
        super();
        this.iconManager = iconManager;
        this.setTitle('app:window.host-explorer.title');
    }

    /**
     * Set the tree
     * @param tree Tree
     */
    @Inject
    setTree(tree: Tree<HostExplorerTypeDictionary>) {
        this.tree = tree;
        this.tree
            .setItemTypeDefinition('host', {
                matcher: (lhs, rhs) => lhs.backend === rhs.backend && lhs.name === rhs.name,
                iconResolver: () => this.getIcon('view-host-explorer'),
                labelProvider: (element, host) => {
                    element
                        .i18n('app:window.host-explorer.tree.item.host.label', {backend: host.backend, hostName: host.name})
                        .applyTranslations()
                    ;
                },
                childNodesResolver: async hostItem => this.getProcessItems(hostItem)
            })
            .setItemTypeDefinition('process', {
                iconResolver: () => this.getIcon('object-process'),
                labelProvider: (element, process) => {
                    element
                        .i18n('app:window.host-explorer.tree.item.process.label', {id: process.id, name: process.name})
                        .applyTranslations()
                    ;
                }
            })
            .attachTo(this)
        ;

        this.tree.addRootItem('host', {
            name: 'localhost:36063',
            backend: 'pcxone'
        });
    }

    /**
     * Get processes for a host
     * @param hostItem Host item
     * @return Promise that resolves to a list of processes
     */
    private async getProcessItems(hostItem: HostExplorerHostItem): Promise<TreeItemChild<'process', HostExplorerTypeDictionary>[]> {
        return [{
            type: 'process',
            item: {
                id: '1234',
                name: 'default.xex'
            }
        }];
    }

    /**
     * Get an icon
     * @param iconName Icon name
     * @return Icon
     */
    private getIcon(iconName: string): Icon {
        return this.iconManager.createIcon(16, 16, iconName);
    }

}

export {
    HostExplorerView
};
