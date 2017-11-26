import {PersistedWindow} from './persisted-window';
import {WindowContainerMode} from './window-container-mode';

/**
 * Persisted window container
 */
interface PersistedWindowContainer {
    mode: WindowContainerMode;
    windows: PersistedWindow[];
}

export {
    PersistedWindowContainer
};
