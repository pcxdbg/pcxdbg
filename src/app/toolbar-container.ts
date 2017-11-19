import {UIElement} from '../ui/element';
import {Component} from '../component';
import {Toolbar} from '../ui/toolbar';
import {StandardToolbar} from './toolbars/toolbars';

/**
 * Toolbar container view
 */
@Component
class ToolbarContainerView extends UIElement {
    private static HTML: string = `
    `;

    /**
     * Class constructor
     */
    constructor() {
        super('toolbar-container', ToolbarContainerView.HTML);
    }

    /**
     * Set the application toolbars
     * @param standardToolbar Standard toolbar
     */
    @Component
    setApplicationToolbars(standardToolbar: StandardToolbar): void {
        this.attach(standardToolbar);
    }

}

export {
    ToolbarContainerView
};
