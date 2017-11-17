import {UIElement} from './element';

/**
 * Button
 */
class Button extends UIElement {

    /**
     * Class constructor
     */
    constructor() {
        super('button');
    }

    /**
     * Set the label
     * @param labelId         Label identifier
     * @param labelParameters Label parameters
     * @return this
     */
    label(labelId: string, labelParameters?: {[parameterName: string]: any}): Button {
        this.i18n(labelId, labelParameters).applyTranslations();
        return this;
    }

    /**
     * Set the label
     * @param labelText Label text
     * @return this
     */
    labelText(labelText: string): Button {
        this.i18n().text(labelText);
        return this;
    }

}

export {
    Button
};
