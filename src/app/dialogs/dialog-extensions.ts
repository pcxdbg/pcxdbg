import {ModalView} from '../../ui';
import {Component} from '../../component';

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
    }

}

export {
    ExtensionsDialog
};
