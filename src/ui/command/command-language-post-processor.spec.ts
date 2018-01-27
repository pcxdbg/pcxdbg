import {CommandLanguagePostProcessor} from './command-language-post-processor';
import {CommandManager} from './command-manager';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Command language post-processor', () => {
    let commandLanguagePostProcessor: CommandLanguagePostProcessor;

    beforeEach(() => {
        commandLanguagePostProcessor = new CommandLanguagePostProcessor();
    });

    it('does not modify values with no relevant interpolator', () => {
        // given
        let value: string = 'test random string $t(ignored)';
        // when
        let processedValue: string = commandLanguagePostProcessor.postProcess(value);
        // then
        expect(processedValue).toEqual(value);
    });

    describe('replaces command accelerator interpolator', () => {
        let commandManager: jest.Mocked<CommandManager>;

        beforeEach(() => {
            commandManager = createMockInstance(CommandManager);
            commandManager.getCommandDefinition.mockImplementation(commandId => {
                let accelerator: string;

                switch (commandId) {
                case 'test.command.id':
                    accelerator = 'Ctrl+Alt+T';
                    break;
                case 'test.command.id2':
                    accelerator = 'Alt+Shift+T';
                    break;
                default:
                    return undefined;
                }

                return {
                    accelerator: accelerator
                };
            });
            commandLanguagePostProcessor.setCommandManager(commandManager);
        });

        it('when a single interpolator is present', () => {
            // given
            let value: string = 'test random string $cmdacc(test.command.id)';
            // when
            let processedValue: string = commandLanguagePostProcessor.postProcess(value);
            // then
            expect(processedValue).toEqual('test random string Ctrl+Alt+T');
        });

        it('when multiple interpolators are present', () => {
            // given
            let value: string = 'test random string $cmdacc(test.command.id) $cmdacc(test.command.id2)';
            // when
            let processedValue: string = commandLanguagePostProcessor.postProcess(value);
            // then
            expect(processedValue).toEqual('test random string Ctrl+Alt+T Alt+Shift+T');
        });

        it('with an error string when the command identifier does not exist', () => {
            // given
            let value: string = 'test random string $cmdacc(unknown.command.id)';
            // when
            let processedValue: string = commandLanguagePostProcessor.postProcess(value);
            // then
            expect(processedValue).toEqual('test random string cmdacc-invalidid(unknown.command.id)');
        });

    });

});
