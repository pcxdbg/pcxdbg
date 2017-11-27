import {Component, Inject} from 'injection';
import {CommandManager, ModalManager} from 'ui';

/**
 * Connection manager
 */
@Component
class ConnectionManager {
    private modalManager: ModalManager;

    /**
     * Set the command manager
     * @param commandManager Command manager
     */
    @Inject
    setCommandManager(commandManager: CommandManager): void {
        // TODO: these should go in app, not the network transport
        commandManager
            .on('connection.open', () => this.onConnectionOpenCommand())
            .on('connection.close', () => this.onConnectionCloseCommand())
        ;
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
     * Handler for the connection.open command
     */
    private onConnectionOpenCommand(): void {
        this.modalManager.showModal('open-connection');
    }

    /**
     * Handler for the connection.close command
     */
    private onConnectionCloseCommand(): void {
        console.warn('Closing a connection is not implemented');
    }

}

export {
    ConnectionManager
};
