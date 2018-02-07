import {ToolbarItem} from './toolbar-item';
import {ToolbarItemDefinition} from './toolbar-item-definition';
import {IconManager} from '../icon';
import {CommandDefinition, CommandManager} from '../../command';
import {createMockInstance} from 'jest-create-mock-instance'

describe('Toolbar item', () => {
    let commandManager: jest.Mocked<CommandManager> = createMockInstance(CommandManager);
    let iconManager: jest.Mocked<IconManager> = createMockInstance(IconManager);

    it('is an element with the toolbar-item tag name', () => {
        // given
        let toolbarItemDefinition: ToolbarItemDefinition = {};
        let toolbarItem: ToolbarItem = new ToolbarItem(toolbarItemDefinition, iconManager, commandManager);
        // expect
        expect(toolbarItem.getNativeElement().tagName).toEqual('TOOLBAR-ITEM');
    });

    describe.skip('can have a label', () => { // requires applicationContext mocking
        let toolbarItemDefinition: ToolbarItemDefinition = {};

        describe('as plain text', () => {

            it('with text only', () => {
                // given
                toolbarItemDefinition.labelText = 'test';
                // when
                let toolbarItem: ToolbarItem = new ToolbarItem(toolbarItemDefinition, iconManager, commandManager);
                // then
                expect(toolbarItem.getAttributeValue('title')).toEqual('test');
            });

            it('with text and a command', () => {
                // given
                toolbarItemDefinition.labelText = 'test';
                toolbarItemDefinition.command = 'test-command';
                // when
                let toolbarItem: ToolbarItem = new ToolbarItem(toolbarItemDefinition, iconManager, commandManager);
                // then
                expect(toolbarItem.getAttributeValue('title')).toEqual('test (Ctrl+T)');
            });

        });

        describe('as i18n text', () => {

            it('with text only', () => {
                // given
                toolbarItemDefinition.label = 'test.id';
                toolbarItemDefinition.labelParameters = {'test':'param'};
                // when
                let toolbarItem: ToolbarItem = new ToolbarItem(toolbarItemDefinition, iconManager, commandManager);
                // then
                expect(toolbarItem.getAttributeValue('title')).toEqual('test-id param');
            });

        });

    });

});
