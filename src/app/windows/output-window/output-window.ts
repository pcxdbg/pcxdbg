import {Component, Controller, Inject} from 'injection';
import {Toolbar, UIElement, Window, WindowStyle} from 'ui';
import {OutputWindowOutput} from './output-window-output';

/**
 * Output window
 */
@Component
class OutputWindow {

}

/**
 * Output window view
 */
@Controller
class OutputWindowView extends Window {
    private outputWindow: OutputWindow;
    private toolbar: Toolbar;
    private output: OutputWindowOutput;

    /**
     * Class constructor
     */
    constructor() {
        super({styles: [WindowStyle.FLEXIBLE_LAYOUT]});
        this.setTitle('app:window.output-window.title');
        this.toolbar = new Toolbar();
        this.toolbar
            .item({label: 'app:window.output-window.toolbar.show-from', element: new UIElement('select')})
            .separator()
            .item({label: 'app:window.output-window.toolbar.clear-all', icon: 'output-window-clear-all', handler: () => this.clearAll()})
            .separator()
            .item({label: 'app:window.output-window.toolbar.word-wrap', icon: 'output-window-word-wrap', handler: () => this.toggleWordWrap()})
            .attachTo(this)
        ;
        this.output = new OutputWindowOutput();
        this.output.attachTo(this);
    }

    /**
     * Set the output window
     * @param outputWindow Output window
     */
    @Inject
    setOutputWindow(outputWindow: OutputWindow): void {
        this.outputWindow = outputWindow;
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
        console.warn('output window word wrap toggle not implemented');
    }

}

export {
    OutputWindow,
    OutputWindowView
};
