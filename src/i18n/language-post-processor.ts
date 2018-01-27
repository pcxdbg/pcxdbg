
/**
 * Language post-processor
 */
class LanguagePostProcessor { // TODO: make abstract when using the external injection library
    private name: string;

    /**
     * Class constructor
     * @param name Post-processor name
     */
    protected constructor(name: string) {
        this.name = name;
    }

    /**
     * Get the post-processor name
     * @return Post-processor name
     */
    getName(): string {
        return this.name;
    }

    /**
     * Post-process an i18n value
     * @param value   Translation value
     * @param key     Translation key
     * @param options Options 
     * @return Processed value
     */
    postProcess(value: string, key?: string, options?: {}): string {
        throw new Error('LanguagePostProcessor must be overriden');
    }

}

export {
    LanguagePostProcessor
};
