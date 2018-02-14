import {I18nBackend} from './i18n-backend';
import {LanguageChangeHandler} from './language-change-handler';
import {LanguagePostProcessor} from './language-post-processor';
import {Component, Inject} from 'es-injection';
import * as i18next from 'i18next';
import * as i18nextXHRBackend from 'i18next-xhr-backend';
import * as moment from 'moment';

/**
 * i18next i18n backend
 */
@Component
class I18nextI18nBackend extends I18nBackend {
    private languageChangeHandler: LanguageChangeHandler;
    private languagePostProcessors: LanguagePostProcessor[];

    /**
     * Set the language post-processors
     * @param languagePostProcessorList List of language post-processors
     */
    @Inject
    setLanguagePostProcessors(languagePostProcessorList: LanguagePostProcessor[]): void {
        this.languagePostProcessors = languagePostProcessorList;
    }

    /**
     * Initialize the backend
     * @return Promise that resolves once the manager is initialized
     */
    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            let i18nextOptions: i18next.InitOptions = {
                fallbackLng: 'en',
                lng: 'en', // TODO: pick from preferences or navigator.language by default
                debug: false, // TODO: switch based on release/development environment
                ns: ['ui', 'app', 'apu', 'camera', 'cpu', 'gpu', 'input', 'network', 'online', 'storage', 'system'],
                backend: {
                    loadPath: 'translations/{{lng}}-{{ns}}.json'
                }
            };

            i18next.on('failedLoading', (language, namespace, message) => this.onFailedLoading(language, namespace, message));
            i18next.on('missingKey', (language, namespace, key, result) => this.onMissingKey(<string> <any> language, namespace, key));
            i18next.on('initialized', () => resolve());
            i18next.on('languageChanged', language => {
                let languageId: string = language.substr(0, 2).toLowerCase();
                if (this.languageChangeHandler) {
                    this.languageChangeHandler(languageId);
                }
            });

            i18next.use(i18nextXHRBackend);
            this.languagePostProcessors.forEach(languagePostProcessor => this.registerLanguagePostProcessor(i18nextOptions, languagePostProcessor));

            i18next.init(i18nextOptions);
        });
    }

    /**
     * Register a language change handler
     * @param handler Handler
     * @return this
     */
    onLanguageChange(handler: LanguageChangeHandler): I18nBackend {
        this.languageChangeHandler = handler;
        return this;
    }

    /**
     * Set the language
     * @param language Language
     */
    setLanguage(language: string): Promise<void> {
        return new Promise(resolve => i18next.changeLanguage(language, () => resolve()));
    }

    /**
     * Translate a key
     * @param key        Translation key
     * @param parameters Translation parameters
     * @return Translated key
     */
    translateKey(key: string, parameters?: {[parameterName: string]: any}): string {
        return i18next.t(key, parameters);
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
     * Register a language post-processor
     * @param i18nextOptions        i18next options
     * @param languagePostProcessor Language post-proccessor
     */
    private registerLanguagePostProcessor(i18nextOptions: i18next.InitOptions, languagePostProcessor: LanguagePostProcessor): void {
        let languagePostProcessorNames: string[] = i18nextOptions.postProcess = <string []> i18nextOptions.postProcess || [];
        let languagePostProcessorName: string = languagePostProcessor.getName();

        languagePostProcessorNames.push(languagePostProcessorName);

        i18next.use({
            type: 'postProcessor',
            name: languagePostProcessorName,
            process: (value, key, options) => languagePostProcessor.postProcess(value, key, options)
        });
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
    I18nextI18nBackend
};
