import {CommandManager} from '../command';
import {UIElement} from '../element';
import {ModalView} from './modal';
import {Component, Inject} from 'injection';

/**
 * Modal manager
 */
@Component
class ModalManager {
    private modals: {[modalId: string]: ModalView} = {};
    private activeModal: ModalView = null;
    private cover: UIElement;

    /**
     * Class constructor
     */
    constructor() {
        this.cover = new UIElement('modal-cover');
        document.body.appendChild(this.cover.getNativeElement());
    }

    /**
     * Set the command manager
     * @param commandManager Command manager
     */
    @Inject
    setCommandManager(commandManager: CommandManager): void {
        commandManager
            .on('modal.open', parameters => this.showModal(parameters.modalId))
        ;
    }

    /**
     * Register a modal
     * @param modal Modal
     * @param <T>   Modal type
     */
    registerModal<T extends ModalView>(modal: T): void {
        this.modals[modal.getId()] = modal;
        this.cover.attach(modal);
    }

    /**
     * Show a modal
     * @param modalId Modal identifier
     */
    showModal(modalId: string): void {
        let modal: ModalView = this.modals[this.stripModalId(modalId)];
        if (!modal) {
            throw new Error('no modal found matching identifier "' + modalId + '"');
        }

        if (this.activeModal !== null) {
            this.activeModal.removeAttribute('active');
        }

        this.showCover();
        this.activeModal = modal;
        this.activeModal.show();
        this.activeModal.attribute('active', '');
    }

    /**
     * Hide a modal
     * @param modalId Modal identifier
     */
    hideModal(modalId: string): void {
        let modal: ModalView = this.modals[this.stripModalId(modalId)];
        if (!modal) {
            throw new Error('no modal found matching identifier "' + modalId + '"');
        }

        if (modal !== this.activeModal) {
            throw new Error('the modal matching identifier "' + modalId + '" is not the active modal');
        }

        this.activeModal.hide();
        this.activeModal = null;
        this.hideCover();
    }

    /**
     * Show the cover
     */
    private showCover(): void {
        this.cover.attribute('active');
    }

    /**
     * Hide the cover
     */
    private hideCover(): void {
        this.cover.removeAttribute('active');
    }

    /**
     * Strip a modal identifier
     * @param modalId Modal identifier
     * @return Stripped identifier
     */
    private stripModalId(modalId: string): string {
        return modalId.replace(/-/g, '');
    }

}

export {
    ModalManager
};
