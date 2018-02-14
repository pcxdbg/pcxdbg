import {UIElement} from './element';
import {I18nManager} from 'i18n';
import {Inject} from 'es-injection';

/**
 * User interface element (i18n)
 */
interface AbstractUIElementI18n extends UIElement { }
abstract class AbstractUIElementI18n {
    private i18nManager: I18nManager;

    /**
     * Set the i18n manager
     * @param i18nManager i18n manager
     */
    @Inject
    setI18nManager(i18nManager: I18nManager): void {
        this.i18nManager = i18nManager;
    }

    /**
     * Set the i18n properties for the element
     * @param key        Key
     * @param parameters Optional parameters
     * @param options    Options
     * @return this
     */
    i18n(key?: string, parameters?: {[parameterName: string]: any}, ...options: string[]): UIElement {
        let attributeValue: string;
        let nativeElement: HTMLElement = this.getNativeElement();

        if (key === undefined) {
            nativeElement.removeAttribute('i18n');
            return this;
        }

        attributeValue = this.getI18nParametersString(parameters, ...options) + key;

        nativeElement.setAttribute('i18n', attributeValue);

        return this;
    }

    /**
     * Apply translations to the element and all its descendants
     * @return this
     */
    applyTranslations(): UIElement {
        if (this.i18nManager) { // FIXME
            this.i18nManager.translateElement(this.getNativeElement(), true);
        }

        return this;
    }

    /**
     * Get an i18n parameters string
     * @param parameters Parameters
     * @param options    Options
     * @return i18n parameters string
     */
    private getI18nParametersString(parameters?: {[parameterName: string]: any}, ...options: string[]): string {
        let parametersString: string = '';

        if (parameters) {
            parametersString = '(' + JSON.stringify(parameters) + ')';
        }

        if (options && options.length > 0) {
            if (options.length > 1) {
                throw new Error('multiple i18n options not supported yet');
            }

            parametersString = '[' + options[0] + ']' + parametersString;
        }

        return parametersString;
    }

}

export {
    AbstractUIElementI18n
};
