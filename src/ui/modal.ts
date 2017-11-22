import {UIElement} from './element';
import {Component, componentManager} from '../component';
import {CommandManager} from './command';

const SUFFIX_DIALOG: string = 'dialog';

/**
 * Modal view
 */
abstract class ModalView extends UIElement {
    private static MODAL_HTML: string = `
        <modal-title></modal-title>
        <modal-content></modal-content>
        <modal-controls></modal-controls>
    `;

    private contentElement: UIElement;
    private id: string;

    /**
     * Class constructor
     */
    constructor() {
        super('modal', ModalView.MODAL_HTML);
        this.id = this.buildModalId();
    }

    /**
     * Set the title
     * @param label           Label
     * @param labelParameters Label parameters
     */
    setTitle(label: string, labelParameters?: {[parameterName: string]: any}): void {
        this.element('modal-title').i18n(label, labelParameters).applyTranslations();
    }

    /**
     * Se the title text
     * @param labelText Label text
     */
    setTitleText(labelText: string): void {
        this.element('modal-title').i18n().text(labelText);
    }

    /**
     * Get the modal identifier
     * @return Modal identifier
     */
    getId(): string {
        return this.id;
    }

    /**
     * Show the modal
     */
    show(): void {
        this.buildModalContent();
        this.attribute('active');
    }

    /**
     * Hide the modal
     */
    hide(): void {
        this
            .removeAttribute('active')
            .clearContent()
        ;
    }

    /**
     * Close the modal
     */
    close(): void {
        componentManager.getComponent(ModalManager).hideModal(this.id);
    }

    /**
     * Build the modal content
     */
    protected abstract buildModalContent(): void;

    /**
     * Get the child target
     * @return Child target
     */
    protected getChildTarget(): UIElement {
        return this.element('modal-content');
    }

    /**
     * Build the modal identifier
     * @return Modal identifier
     */
    private buildModalId(): string {
        let modalId: string = this.constructor.name.toLowerCase();
        if (modalId.substr(-6) === SUFFIX_DIALOG) {
            modalId = modalId.substr(0, modalId.length - 6);
        }

        return modalId;
    }

}

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
    @Component
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
    ModalManager,
    ModalView
};
