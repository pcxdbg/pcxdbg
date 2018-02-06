import {Component} from 'injection';
import {ModalView, UIElementBase} from 'ui';

/**
 * Extensions dialog view
 */
class ExtensionsDialogView extends UIElementBase {
    private static HTML: string = `
        Extensions &amp; Updates.
    `;

    /**
     * Class constructor
     */
    constructor() {
        super('open-connection-dialog', ExtensionsDialogView.HTML);
    }

}

/**
 * Extensions dialog box
 */
@Component
class ExtensionsDialog extends ModalView {

    /**
     * Build the modal content
     */
    protected buildModalContent(): void {
        this.setTitle('app:dialog.extensions.title');
        this.attach(new ExtensionsDialogView());
    }

}

export {
    ExtensionsDialog
};
