import {WindowStyle} from './window-style';

/**
 * Window properties
 */
interface WindowProperties {
    title?: string;
    titleParameters?: {[parameterName: string]: string};
    titleText?: string;
    styles?: WindowStyle[];
}

export {
    WindowProperties
};
