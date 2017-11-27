import {LanguageChangeHandler} from './language-change-handler';

/**
 * i18n backend interface
 */
class I18nBackend { // TODO: switch to an interface one the external injection library is used

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

export {
    I18nBackend
};
