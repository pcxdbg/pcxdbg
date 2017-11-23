import {Button, ModalView, UIElement} from '../../ui';
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

    private buttonNext: Button;
    private buttonNew: Button;

    /**
     * Build the modal content
     */
    protected buildModalContent(): void {
        let dialogElement: UIElement = new UIElement('open-connection-dialog', OpenConnectionDialog.HTML);

        this.buttonNew = new Button();
        this.buttonNew.label('app:dialog.open-connection.control.new');
        this.buttonNew.click(() => this.onButtonNew());
        this.buttonNext = new Button();
        this.buttonNext.label('ui:modal.control.next');
        this.buttonNext.click(() => this.onButtonNext());

        [
            this.buttonNew,
            this.buttonNext
        ].forEach(button => this.addButton(button));

        this.addCancelButton();

        this.setTitle('app:dialog.options.title');

        this.attach(dialogElement);
    }

    /**
     * Event triggered when the new button is clicked
     */
    private onButtonNew(): void {
        console.warn('New connection not implemented');
    }

    /**
     * Event triggered when the next button is clicked
     */
    private onButtonNext(): void {
        console.warn('Next not implemented');
    }

}

export {
    OpenConnectionDialog
};
