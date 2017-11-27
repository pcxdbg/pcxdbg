import {Component} from 'injection';
import {ModalView, UIElement} from 'ui';

/**
 * Open connection dialog box
 */
@Component
class OptionsDialog extends ModalView {
    private static HTML: string = `
        <options-dialog-navigation>
            <options-dialog-navigation-filter></options-dialog-navigation-filter>
            <options-dialog-navigation-tree></options-dialog-navigation-tree>
        </options-dialog-navigation>
        <options-dialog-panels>
            Panels
        </options-dialog-panels>
    `;

    /**
     * Build the modal content
     */
    protected buildModalContent(): void {
        let dialogElement: UIElement = new UIElement('options-dialog', OptionsDialog.HTML);

        this.setTitle('app:dialog.options.title');

        this.attach(dialogElement);
    }

}

export {
    OptionsDialog
};
