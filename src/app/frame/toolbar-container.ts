import {StandardToolbar} from '../toolbars';
import {Component, Inject} from 'injection';
import {UIElement} from 'ui';

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
    @Inject
    setApplicationToolbars(standardToolbar: StandardToolbar): void {
        this.attach(standardToolbar);
    }

}

export {
    ToolbarContainerView
};
