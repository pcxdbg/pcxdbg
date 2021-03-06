import {OutputWindowOutput} from './output-window-output';
import {Toolbar, UIElementBase, Window, WindowStyle} from 'ui';
import {Component, Controller, Inject} from 'es-injection';

/**
 * Output window view
 */
@Controller
class OutputWindowView extends Window {
    private static ID_WORDWRAP: string = 'wordwrap';

    private toolbar: Toolbar;
    private output: OutputWindowOutput;

    /**
     * Class constructor
     */
    constructor() {
        super({styles: [WindowStyle.FLEXIBLE_LAYOUT]});
        this.setTitle('app:window.output-window.title');
    }

    /**
     * Set the toolbar
     * @param toolbar Toolbar
     */
    @Inject
    setToolbar(toolbar: Toolbar): void {
        this.toolbar = toolbar;
        this.toolbar
            .item({label: 'app:window.output-window.toolbar.show-from', element: new UIElementBase('select')})
            .separator()
            .item({label: 'app:window.output-window.toolbar.clear-all', icon: 'output-window-clear-all', handler: () => this.clearAll()})
            .separator()
            .item({id: OutputWindowView.ID_WORDWRAP, label: 'app:window.output-window.toolbar.word-wrap', icon: 'output-window-word-wrap', handler: () => this.toggleWordWrap()})
            .attachTo(this)
        ;
    }

    /**
     * Set the output window output
     * @param outputWindowOutput Output window output
     */
    @Inject
    setOutputWindowOutput(outputWindowOutput: OutputWindowOutput): void {
        this.output = outputWindowOutput;
        this.output.attachTo(this);
    }

    /**
     * Clear all output
     */
    private clearAll(): void {
        this.output.clearContent();
    }

    /**
     * Toggle word wrapping
     */
    private toggleWordWrap(): void {
        let enabled: boolean = this.output.toggleWordWrap();
        this.toolbar.check(OutputWindowView.ID_WORDWRAP, enabled);
    }

}

export {
    OutputWindowView
};
