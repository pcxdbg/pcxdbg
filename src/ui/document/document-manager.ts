import {CommandManager} from '../command';
import {WindowManager} from '../window';
import {Component, Inject} from 'es-injection';

/**
 * Document manager
 */
@Component
class DocumentManager {
    private windowManager: WindowManager;

    /**
     * Set the command manager
     * @param commandManager Command manager
     */
    @Inject
    setCommandManager(commandManager: CommandManager): void {
        commandManager
            .on('document.open', parameters => this.openDocument(parameters.type, parameters.parameters))
            .on('document.close', () => this.closeDocument())
        ;
    }

    /**
     * Set the window manager
     * @param windowManager Window manager
     */
    @Inject
    setWindowManager(windowManager: WindowManager): void {
        this.windowManager = windowManager;
    }

    /**
     * Register a document class
     * @param documentClass Document class
     * @param <T>           Document type
     */
    registerDocumentClass<T extends Function>(documentClass: T): void {
        // TODO
    }

    /**
     * Open a document
     * @param documentType       Document type
     * @param documentParameters Document parameters
     */
    openDocument(documentType: string, documentParameters?: {[parameterName: string]: any}): void {
        console.warn('open document not implemented', documentType, documentParameters);
    }

    /**
     * Close a document
     * @param documentId Document identifier
     */
    closeDocument(documentId?: string): void {
        // TODO
    }

}

export {
    DocumentManager
};
