import {ModalView, UIElement} from '../../ui';
import {Component} from '../../component';

/**
 * Open connection dialog box
 */
@Component
class OpenConnectionDialog extends ModalView {
    private static HTML: string = `
        TODO:
        <h3>New connection button leading to a second panel with inputs</h3>
        <ul>
            <li>Host and port</li>
            <li>Protocol: protobuf+ws(s)</li>
            <li>Authentication details</li>
        </ul>
        <h3>Merged list</h3>
        <ul>
            <li>Hosts saved (favorite connections)</li>
            <li>Hosts discovered through multicast</li>
            <li>Hosts recently connected to</li>
        </ul>
    `;

    /**
     * Build the modal content
     */
    protected buildModalContent(): void {
        let dialogElement: UIElement = new UIElement('open-connection-dialog', OpenConnectionDialog.HTML);

        this.setTitle('app:dialog.options.title');

        this.attach(dialogElement);
    }

}

export {
    OpenConnectionDialog
};
