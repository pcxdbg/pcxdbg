import {UIElement, UIElementBase} from 'ui';

/**
 * Output window output
 */
class OutputWindowOutput extends UIElementBase {
    private static HTML_OUTPUTWINDOWOUTPUT: string = '<output-window-output-content></output-window-output-content>';

    private outputContent: UIElement;

    /**
     * Class constructor
     */
    constructor() {
        super('output-window-output', OutputWindowOutput.HTML_OUTPUTWINDOWOUTPUT);
        this.outputContent = this.element('output-window-output-content');
        for (let i: number = 0; i !== 4; ++i) {
            this.outputContent.attach(new UIElementBase('output-window-output-message', 'Output message #' + (i + 1)));
        }
    }

    /**
     * Clear all content
     */
    clear(): void {
        this.outputContent.clearContent();
    }

}

export {
    OutputWindowOutput
};
