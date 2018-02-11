import {Component} from 'injection';
import {LanguagePostProcessor} from 'i18n';

/**
 * Menu item language post-processor
 */
@Component
class MenuItemLanguagePostProcessor extends LanguagePostProcessor {
    private static REGEXP_MENUITEM: RegExp = /\$menuitem\(([^\)]+)\)/g;

    /**
     * Class constructor
     */
    constructor() {
        super('ui-menu-item');
    }

    /**
     * Post-process an i18n value
     * @param value   Translation value
     * @param key     Translation key
     * @param options Options
     * @return Processed value
     */
    postProcess(value: string, key?: string, options?: {}): string {
        return value.replace(MenuItemLanguagePostProcessor.REGEXP_MENUITEM, (substring, text) => this.prepareMenuItemText(text));
    }

    /**
     * Prepare menu item text to highlight quick access keys
     * @param text Text
     * @return Prepared text
     */
    private prepareMenuItemText(text: string): string {
        let accessKeyMarkerIndex: number;

        accessKeyMarkerIndex = text.indexOf('&');
        if (accessKeyMarkerIndex !== -1) {
            let accessKey: string = text.substr(accessKeyMarkerIndex + 1, 1);
            text = text.replace(/&[a-zA-Z0-9]{1}/, '<menu-item-label-key>' + accessKey + '</menu-item-label-key>');
        }

        return text;
    }

}

export {
    MenuItemLanguagePostProcessor
};
