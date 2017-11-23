import {UIElement} from './element';
import {Component, componentManager} from '../component';
import {Button} from './button';
import {CommandManager} from './command';

/**
 * Modal style
 */
const enum ModalStyle {
    NO_BORDER,
    NO_CONTROLS,
    NO_TITLE
}

/**
 * Modal view
 */
abstract class ModalView extends UIElement {
    private static SUFFIX_DIALOG: string = 'dialog';
    private static MODAL_HTML: string = `
        <modal-title>
            <modal-title-text></modal-title-text>
            <modal-title-controls></modal-title-controls>
        </modal-title>
        <modal-content></modal-content>
        <modal-controls></modal-controls>
    `;

    private id: string;

    /**
     * Class constructor
     * @param modalStyles Modal styles
     */
    constructor(...modalStyles: ModalStyle[]) {
        super('modal', ModalView.MODAL_HTML);
        this.id = this.buildModalId();

        for (let modalStyle of modalStyles) {
            switch (modalStyle) {
            case ModalStyle.NO_BORDER:
                this.attribute('no-border');
                break;
            case ModalStyle.NO_CONTROLS:
                this.attribute('no-controls');
                break;
            case ModalStyle.NO_TITLE:
                this.attribute('no-title');
                break;
            default:
                break;
            }
        }
    }

    /**
     * Set the title
     * @param label           Label
     * @param labelParameters Label parameters
     */
    setTitle(label: string, labelParameters?: {[parameterName: string]: any}): void {
        this.element('modal-title', 'modal-title-text').i18n(label, labelParameters).applyTranslations();
    }

    /**
     * Se the title text
     * @param labelText Label text
     */
    setTitleText(labelText: string): void {
        this.element('modal-title', 'modal-title-text').i18n().text(labelText);
    }

    /**
     * Add a button
     * @param button Button
     * @return this
     */
    addButton(button: Button): ModalView {
        this.element('modal-controls').attach(button);
        return this;
    }

    /**
     * Add a cancel button
     * @return this
     */
    addCancelButton(): ModalView {
        let button: Button = new Button();

        button
            .label('ui:modal.control.cancel')
            .click(() => this.close())
        ;

        this.addButton(button);

        return this;
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
     * Clear content, i.e. all child nodes
     * @return this
     */
    clearContent(): UIElement {
        super.clearContent();
        this.element('modal-controls').clearContent();
        return this;
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
        if (modalId.substr(-6) === ModalView.SUFFIX_DIALOG) {
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
    ModalStyle,
    ModalView
};
