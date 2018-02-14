import {StandardToolbar} from '../toolbars';
import {UIElement, UIElementBase} from 'ui';
import {Component, Inject} from 'es-injection';

/**
 * Toolbar container view
 */
@Component
class ToolbarContainerView extends UIElementBase {
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
