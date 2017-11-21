import {CommandDefinition, CommandManager} from './command';
import {AcceleratorManager} from './accelerator';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Command manager', () => {
    let commandManager: CommandManager;
    let acceleratorManager: jest.Mocked<AcceleratorManager>;

    beforeEach(() => {
        commandManager = new CommandManager();
        acceleratorManager = createMockInstance(AcceleratorManager);
        commandManager.setAcceleratorManager(acceleratorManager);
    });

    afterEach(() => commandManager.shutdown());

    it('can register a command', () => {
        let commandDefinition: CommandDefinition = {id: 'test'};

        commandManager.registerCommand(commandDefinition);

        expect(commandManager.getCommandDefinition('test')).not.toBeNull();
    });

    it('throws an exception if the same command is registered more than once', () => {
        let commandDefinition1: CommandDefinition = {id: 'test'};
        let commandDefinition2: CommandDefinition = {...commandDefinition1};

        commandManager.registerCommand(commandDefinition1);

        expect(() => commandManager.registerCommand(commandDefinition2)).toThrowError(/already registered/);
    });

    it('registers an accelerator if a command definition specifies one', () => {
        let commandDefinition: CommandDefinition = {
            id: 'test',
            accelerator: 'A'
        };

        commandManager.registerCommand(commandDefinition);

        expect(acceleratorManager.registerAccelerator).toHaveBeenCalledWith('A', 'test');
    });

});
