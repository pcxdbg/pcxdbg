import {ModalView, UIElement} from '../../ui';
import {Component} from '../../component';

/**
 * Extensions dialog box
 */
@Component
class ExtensionsDialog extends ModalView {
    private static HTML: string = `
        Extensions &amp; Updates.
    `;

    /**
     * Build the modal content
     */
    protected buildModalContent(): void {
        let dialogElement: UIElement = new UIElement('open-connection-dialog', ExtensionsDialog.HTML);

        this.setTitle('app:dialog.extensions.title');

        this.attach(dialogElement);
    }

}

export {
    ExtensionsDialog
};
