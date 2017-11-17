import {Component} from '../component';
import * as moment from 'moment';
import * as i18next from 'i18next';
import * as i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import * as i18nextXHRBackend from 'i18next-xhr-backend';

/**
 * i18n manager
 */
@Component
class I18nManager {
    private static REGEXP_INSTRUCTION: RegExp = /(\[[^\]]+\])?(\([^\)]+\))?(.+)/;
    private static OPTION_HTML: string = 'html';

    /**
     * Initialize the manager
     * @return Promise that resolves once the manager is initialized
     */
    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            let i18nextOptions: i18next.InitOptions = {
                fallbackLng: 'en',
                debug: false, // TODO: switch based on release/development environment
                ns: ['ui', 'app', 'apu', 'cpu', 'gpu'],
                backend: {
                    loadPath: 'translations/{{lng}}-{{ns}}.json'
                }
            };

            i18next.on('failedLoading', (language, namespace, message) => this.onFailedLoading(language, namespace, message));
            i18next.on('initialized', () => resolve());
            i18next.on('languageChanged', language => this.onLanguageChange(language));
            i18next.on('missingKey', (language, namespace, key, result) => this.onMissingKey(<string> <any> language, namespace, key));
            i18next
                .use(i18nextXHRBackend)
                .use(i18nextBrowserLanguageDetector)
                .init(i18nextOptions)
            ;
        });
    }

    /**
     * Set the language
     * @param language Language
     */
    setLanguage(language: string): Promise<void> {
        return new Promise(resolve => i18next.changeLanguage(language, () => resolve()));
    }

    /**
     * Format a date
     * @param date          Date
     * @param formatPattern Format pattern
     */
    formatDate(date: Date, formatPattern: string): string {
        return moment(date).format(formatPattern);
    }

    /**
     * Translate a key
     * @param id Key identifier
     * @return Translation
     */
    translateKey(id: string, options?: {[key: string]: any}): string {
        let translation: string = i18next.t(id, options);
        if (translation === undefined) {
            return '???' + id + '???';
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
    private onLanguageChange(language: string): void {
        let languageId: string = language.substr(0, 2).toLowerCase();
        console.log('Language changed to ' + languageId);
        this.translateElement(document.body, true);
    }

    /**
     * Event triggered when a language resource file cannot be loaded
     * @param language  Language
     * @param namespace Namespace
     * @param message   Message
     */
    private onFailedLoading(language: string, namespace: string, message: string): void {
        if (language.length > 2) {
            return;
        }

        console.error('unable to load i18n namespace "' + namespace + '" for language "' + language + '": ' + message);
    }

    /**
     * Event triggered when a key is missing from resources
     * @param language  Language
     * @param namespace Namespace
     * @param key       Key
     */
    private onMissingKey(language: string, namespace: string, key: string): void {
        console.warn('namespace "' + namespace + '" does not have key "' + key + '" for language "' + language + '"');
    }

}

export {
    I18nManager
};
