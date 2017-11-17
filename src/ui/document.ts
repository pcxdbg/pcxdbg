import {Component} from '../component';

/**
 * Document manager
 */
@Component
class DocumentManager {

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

}

/**
 * Document
 */
class Document {

}

/**
 * Document container
 */
@Component
class DocumentContainer {

}

export {
    Document,
    DocumentContainer,
    DocumentManager
};
