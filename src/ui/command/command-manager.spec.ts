import {AcceleratorManager} from '../accelerator';
import {CommandManager} from './command-manager';
import {CommandDefinition} from './command-definition';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Command manager', () => {
    let commandManager: CommandManager;

    beforeEach(() => {
        commandManager = new CommandManager();
    });

    afterEach(() => commandManager.shutdown());

    it('can register a command', () => {
        // given
        let commandDefinition: CommandDefinition = {id: 'test'};
        // when
        commandManager.registerCommand(commandDefinition);
        // then
        expect(commandManager.getCommandDefinition('test')).not.toBeNull();
    });

    it('throws an exception if the same command is registered more than once', () => {
        // given
        let commandDefinition1: CommandDefinition = {id: 'test'};
        let commandDefinition2: CommandDefinition = {...commandDefinition1};
        // when
        commandManager.registerCommand(commandDefinition1);
        // then
        expect(() => commandManager.registerCommand(commandDefinition2)).toThrowError(/already registered/);
    });

    it('registers an accelerator if a command definition specifies one', () => {
        // given
        let commandDefinition: CommandDefinition = {id: 'test',  accelerator: 'A'};
        let acceleratorManager: jest.Mocked<AcceleratorManager> = createMockInstance(AcceleratorManager);
        commandManager.setAcceleratorManager(acceleratorManager);
        // when
        commandManager.registerCommand(commandDefinition);
        // then
        expect(acceleratorManager.registerAccelerator).toHaveBeenCalledWith('A', 'test');
    });

    it('can register a handler for an existing command', () => {
        // given
        let commandDefinition: CommandDefinition = {id: 'test'};
        let handler: () => void = jest.fn();
        // when
        commandManager.registerCommand(commandDefinition);
        commandManager.on('test', handler);
        // then
        expect(handler).not.toHaveBeenCalled();
    });

    it('can register a handler for a command that has not yet been registered', () => {
        // given
        let commandDefinition: CommandDefinition = {id: 'test'};
        let handler: () => void = jest.fn();
        // when
        commandManager.on('test', handler);
        commandManager.registerCommand(commandDefinition);
        // then
        expect(handler).not.toHaveBeenCalled();
    });

    it('can execute a command', () => {
        // given
        let commandDefinition: CommandDefinition = {id: 'test'};
        let handler: () => void = jest.fn();
        // when
        commandManager.registerCommand(commandDefinition);
        commandManager.on('test', handler);
        commandManager.executeCommand('test', {x: 1});
        // then
        expect(handler).toHaveBeenCalledWith({x: 1}, 'test');
    });

    it('can execute a command alias', () => {
        // given
        let commandDefinition: CommandDefinition = {id: 'test'};
        let commandDefinition2: CommandDefinition = {id: 'test-alias', aliasFor: {command: 'test', parameters: {x: 1}}};
        let handler: () => void = jest.fn();
        // when
        commandManager.registerCommand(commandDefinition);
        commandManager.registerCommand(commandDefinition2);
        commandManager.on('test', handler);
        commandManager.executeCommand('test-alias');
        // then
        expect(handler).toHaveBeenCalledWith({x: 1}, 'test');
    });

    it('ignores executed commands with no registered handler', () => {
        // given
        let commandDefinition: CommandDefinition = {id: 'test'};
        // when
        commandManager.registerCommand(commandDefinition);
        // then
        expect(() => commandManager.executeCommand('test', {x: 1})).not.toThrow();
    });

    it('throws an exception when registering multiple handlers for the same command', () => {
        // given
        let commandDefinition: CommandDefinition = {id: 'test'};
        let handler1: () => void = jest.fn();
        let handler2: () => void = jest.fn();
        // when
        commandManager.registerCommand(commandDefinition);
        commandManager.on('test', handler1);
        // then
        expect(() => commandManager.on('test', handler2)).toThrowError(/already registered/);
    });

    it('throws an exception when executing an unknown command', () => {
        // expect
        expect(() => commandManager.executeCommand('test')).toThrowError(/unknown command/);
    });

});
