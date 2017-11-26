import {CommandManager} from './command-manager';
import {CommandDefinition} from './command-definition';
import {AcceleratorManager} from '../accelerator';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Command manager', () => {
    let commandManager: CommandManager;

    beforeEach(() => {
        commandManager = new CommandManager();
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
        let acceleratorManager: jest.Mocked<AcceleratorManager> = createMockInstance(AcceleratorManager);
        commandManager.setAcceleratorManager(acceleratorManager);

        commandManager.registerCommand(commandDefinition);

        expect(acceleratorManager.registerAccelerator).toHaveBeenCalledWith('A', 'test');
    });

    it('can register a handler for an existing command', () => {
        let commandDefinition: CommandDefinition = {id: 'test'};
        let handler: () => void = jest.fn();

        commandManager.registerCommand(commandDefinition);
        commandManager.on('test', handler);

        expect(handler).not.toHaveBeenCalled();
    });

    it('can register a handler for a command that has not yet been registered', () => {
        let commandDefinition: CommandDefinition = {id: 'test'};
        let handler: () => void = jest.fn();

        commandManager.on('test', handler);
        commandManager.registerCommand(commandDefinition);

        expect(handler).not.toHaveBeenCalled();
    });

    it('can execute a command', () => {
        let commandDefinition: CommandDefinition = {id: 'test'};
        let handler: () => void = jest.fn();

        commandManager.registerCommand(commandDefinition);
        commandManager.on('test', handler);
        commandManager.executeCommand('test', {x: 1});

        expect(handler).toHaveBeenCalledWith({x: 1}, 'test');
    });

    it('can execute a command alias', () => {
        let commandDefinition: CommandDefinition = {id: 'test'};
        let commandDefinition2: CommandDefinition = {id: 'test-alias', aliasFor: {command: 'test', parameters: {x: 1}}};
        let handler: () => void = jest.fn();

        commandManager.registerCommand(commandDefinition);
        commandManager.registerCommand(commandDefinition2);
        commandManager.on('test', handler);
        commandManager.executeCommand('test-alias');

        expect(handler).toHaveBeenCalledWith({x: 1}, 'test');
    });

    it('ignores executed commands with no registered handler', () => {
        let commandDefinition: CommandDefinition = {id: 'test'};

        commandManager.registerCommand(commandDefinition);
        commandManager.executeCommand('test', {x: 1});
    });

    it('throws an exception when registering multiple handlers for the same command', () => {
        let commandDefinition: CommandDefinition = {id: 'test'};
        let handler1: () => void = jest.fn();
        let handler2: () => void = jest.fn();

        commandManager.registerCommand(commandDefinition);
        commandManager.on('test', handler1);

        expect(() => commandManager.on('test', handler2)).toThrowError(/already registered/);
    });

    it('throws an exception when executing an unknown command', () => {
        expect(() => commandManager.executeCommand('test')).toThrowError(/unknown command/);
    });

});
