import {Toolbar, UIElement} from '../../ui';
import {Component} from '../../component';
import {StandardToolbar} from '../toolbars';

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
