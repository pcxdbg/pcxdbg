import {Component} from 'injection';
import {ModalView, UIElementBase} from 'ui';

/**
 * Options dialog view
 */
class OptionsDialogView extends UIElementBase {
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
     * Class constructor
     */
    constructor() {
        super('options-dialog', OptionsDialogView.HTML);
    }

}

/**
 * Open connection dialog box
 */
@Component
class OptionsDialog extends ModalView {

    /**
     * Build the modal content
     */
    protected buildModalContent(): void {
        this.setTitle('app:dialog.options.title');
        this.attach(new OptionsDialogView());
    }

}

export {
    OptionsDialog
};
