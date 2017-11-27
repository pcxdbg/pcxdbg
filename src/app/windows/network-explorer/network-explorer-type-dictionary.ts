import {NetworkExplorerHostItem} from './network-explorer-host-item';
import {NetworkExplorerProcessItem} from './network-explorer-process-item';
import {TreeItemTypeDictionary} from 'ui';

/**
 * Network explorer type dictionary
 */
interface NetworkExplorerTypeDictionary extends TreeItemTypeDictionary {
    'discovered-list': undefined;
    'host': NetworkExplorerHostItem;
    'process': NetworkExplorerProcessItem;
    'saved-list': undefined;
}

export {
    NetworkExplorerTypeDictionary
};
