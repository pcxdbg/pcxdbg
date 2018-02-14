import {Button} from '../control';
import {UIElement, UIElementBase} from '../element';
import {ModalManager} from './modal-manager';
import {ModalStyle} from './modal-style';
import {Component, Inject} from 'es-injection';

/**
 * Modal view
 */
abstract class ModalView extends UIElementBase {
    private static SUFFIX_DIALOG: string = 'dialog';
    private static MODAL_HTML: string = `
        <modal-title>
            <modal-title-text></modal-title-text>
            <modal-title-controls></modal-title-controls>
        </modal-title>
        <modal-content></modal-content>
        <modal-controls></modal-controls>
    `;

    private modalManager: ModalManager;
    private id: string;
    private title: UIElement;

    /**
     * Class constructor
     * @param modalStyles Modal styles
     */
    constructor(...modalStyles: ModalStyle[]) {
        super('modal', ModalView.MODAL_HTML);
        this.id = this.buildModalId();
        this.title = this.element('modal-title', 'modal-title-text');

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
     * Set the modal manager
     * @param modalManager Modal manager
     */
    @Inject
    setModalManager(modalManager: ModalManager): void {
        this.modalManager = modalManager;
    }

    /**
     * Set the title
     * @param label           Label
     * @param labelParameters Label parameters
     */
    setTitle(label: string, labelParameters?: {[parameterName: string]: any}): void {
        this.title.i18n(label, labelParameters).applyTranslations();
    }

    /**
     * Se the title text
     * @param labelText Label text
     */
    setTitleText(labelText: string): void {
        this.title.i18n();
        this.title.text(labelText);
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
        this.modalManager.hideModal(this.id);
    }

    /**
     * Clear content, i.e. all child nodes
     * @return this
     */
    clearContent = (): UIElement => {
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
    getChildTarget = (): UIElement => {
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

export {
    ModalView
};
