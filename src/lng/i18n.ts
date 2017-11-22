import {Component} from '../component';

/**
 * Language change handler
 */
type LanguageChangeHandler = (languageId: string) => void;

/**
 * i18n backend interface
 */
class I18nBackend {

    /**
     * Initialize the backend
     * @return Promise that resolves once the manager is initialized
     */
    initialize(): Promise<void> {
        throw new Error('I18nBackend.initialize must be overriden');
    }

    /**
     * Register a language change handler
     * @param handler Handler
     * @return this
     */
    onLanguageChange(handler: LanguageChangeHandler): I18nBackend {
        throw new Error('I18nBackend.onLanguageChange must be overriden');
    }

    /**
     * Set the language
     * @param language Language
     */
    setLanguage(language: string): Promise<void> {
        throw new Error('I18nBackend.setLanguage must be overriden');
    }

    /**
     * Translate a key
     * @param key        Translation key
     * @param parameters Translation parameters
     * @return Translated key
     */
    translateKey(key: string, parameters?: {[parameterName: string]: any}): string {
        throw new Error('I18nBackend.translateKey must be overriden');
    }

    /**
     * Format a date
     * @param date          Date
     * @param formatPattern Format pattern
     */
    formatDate(date: Date, formatPattern: string): string {
        throw new Error('I18nBackend.formatDate must be overriden');
    }

}

/**
 * i18n manager
 */
@Component
class I18nManager {
    private static REGEXP_INSTRUCTION: RegExp = /(\[[^\]]+\])?(\([^\)]+\))?(.+)/;
    private static OPTION_HTML: string = 'html';

    private backend: I18nBackend;

    /**
     * Set the backend
     * @param i18nBackend Backend
     */
    @Component
    setBackend(i18nBackend: I18nBackend): void {
        this.backend = i18nBackend;
    }

    /**
     * Shuts the manager down
     */
    shutdown(): void {
        // Nothing to do
    }

    /**
     * Set the language
     * @param language Language
     */
    async setLanguage(language: string): Promise<void> {
        await this.backend.setLanguage(language);
    }

    /**
     * Format a date
     * @param date          Date
     * @param formatPattern Format pattern
     */
    formatDate(date: Date, formatPattern: string): string {
        return this.backend.formatDate(date, formatPattern);
    }

    /**
     * Translate a key
     * @param key        Translation key
     * @param parameters Translation parameters
     * @return Translated key
     */
    translateKey(key: string, parameters?: {[parameterName: string]: any}): string {
        let translation: string = this.backend.translateKey(key, parameters);
        if (translation === undefined) {
            return '???' + key + '???';
        }

        return translation;
    }

    /**
     * Translate an element
     * @param element Element to translate
     * @param recurse If true, include all descendants when looking for translation attributes
     */
    translateElement(element: HTMLElement, recurse?: boolean): void {
        if (element.hasAttribute('i18n')) {
            this.translateApplicableElement(element);
        }

        element.querySelectorAll(':scope [i18n]').forEach(applicableElement => this.translateApplicableElement(<HTMLElement> applicableElement));
    }

    /**
     * Translate an element that has an i18n attribute
     * @param element Element
     */
    private translateApplicableElement(element: HTMLElement): void {
        let i18nAttribute: string = element.getAttribute('i18n');
        let i18nInstructions: string[] = i18nAttribute.split(';');
        i18nInstructions.forEach(i18nInstruction => this.translateApplicableElementInstruction(element, i18nInstruction));
    }

    /**
     * Translate an element using a specific instruction
     * @param element         Element
     * @param i18nInstruction Instruction
     */
    private translateApplicableElementInstruction(element: HTMLElement, i18nInstruction: string): void {
        let matches: string[] = i18nInstruction.match(I18nManager.REGEXP_INSTRUCTION);
        let options: string = matches[1];
        let parameters: string = matches[2];
        let stringId: string = matches[3];
        let translation: string;

        if (options) {
            options = options.substring(1, options.length - 1);
        }

        if (parameters) {
            parameters = parameters.substring(1, parameters.length - 1);
        }

        translation = this.translateKey(stringId, parameters && JSON.parse(parameters));
        if (options) {
            if (options === I18nManager.OPTION_HTML) {
                element.innerHTML = translation;
            } else {
                element.setAttribute(options, translation);
            }
        } else {
            element.innerText = translation;
        }
    }

    /**
     * Event triggered upon language change
     * @param language Language
     */
    private onLanguageChange(languageId: string): void {
        console.log('Language changed to ' + languageId);
        this.translateElement(document.body, true);
    }

}

export {
    I18nBackend,
    I18nManager,
    LanguageChangeHandler
};
