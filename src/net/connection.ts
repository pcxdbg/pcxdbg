import {Component} from '../component';
import {CommandManager, ModalManager} from '../ui';

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
    @Component
    setCommandManager(commandManager: CommandManager): void {
        commandManager
            .on('connection.open', () => this.onConnectionOpenCommand())
            .on('connection.close', () => this.onConnectionCloseCommand())
        ;
    }

    /**
     * Set the modal manager
     * @param modalManager Modal manager
     */
    @Component
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
