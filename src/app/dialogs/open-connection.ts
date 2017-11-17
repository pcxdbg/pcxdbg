import {ModalManager, ModalView} from '../../ui/modal';
import {Component} from '../../component';
import {UIElement} from '../../ui/element';

/**
 * Open connection dialog box
 */
@Component
class OpenConnectionDialog extends ModalView {
    private static HTML: string = `
        hello world
    `;

    /**
     * Class constructor
     * @param modalManager Modal manager
     */
    constructor(modalManager: ModalManager) {
        super(modalManager);

        this.buildDialog();
    }

    /**
     * Build the dialog box
     */
    private buildDialog(): void {
        let dialogElement: UIElement = new UIElement('open-connection-dialog', OpenConnectionDialog.HTML);

        this.attach(dialogElement);
    }

}

export {
    OpenConnectionDialog
};
