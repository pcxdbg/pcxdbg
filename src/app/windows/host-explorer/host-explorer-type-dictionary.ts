import {HostExplorerHostItem} from './host-explorer-host-item';
import {HostExplorerProcessItem} from './host-explorer-process-item';
import {TreeItemTypeDictionary} from 'ui';

/**
 * Host explorer type dictionary
 */
interface HostExplorerTypeDictionary extends TreeItemTypeDictionary {
    // NOTE: this should be more dynamic, i.e. modules (cpu/gpu/etc.) define the extra item types
    'gpu-buffer-list': string;
    'gpu-buffer': string;
    'gpu-shader-fragment': string;
    'gpu-shader-list': string;
    'gpu-shader-program': string;
    'gpu-shader-program-list': string;
    'gpu-shader-vertex': string;
    'gpu-texture': string;
    'gpu': undefined;
    'host': HostExplorerHostItem;
    'input-device-list': undefined;
    'input-device': string;
    'input': undefined;
    'module-data-list': string;
    'module-data': string;
    'module-function': string;
    'module-function-list': string;
    'module-list': undefined;
    'module': string;
    'network-connection-incoming': string;
    'network-connection-list': string;
    'network-connection-outgoing': string;
    'network-socket-list': string;
    'network-socket': string;
    'network': undefined;
    'process': HostExplorerProcessItem;
}

export {
    HostExplorerTypeDictionary
};
