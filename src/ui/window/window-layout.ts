import {WindowLayoutOrientation} from './window-layout-orientation';

/**
 * Window layout for containers
 */
interface WindowLayout {
    orientation: WindowLayoutOrientation;
    thickness: number;
    windows: Window[];
    windowsThickness: number[];
}

export {
    WindowLayout
};
