import {UIElement} from '../ui/element';
import {Component} from '../component';
import {Toolbar} from '../ui/toolbar';

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

}

export {
    ToolbarContainerView
};
