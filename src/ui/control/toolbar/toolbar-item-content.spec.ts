import {ToolbarItemContent} from './toolbar-item-content';

describe('Toolbar item content', () => {

    it('is an element with the toolbar-item-content tag name', () => {
        // given
        let toolbarItemContent: ToolbarItemContent = new ToolbarItemContent();
        // expect
        expect(toolbarItemContent.getNativeElement().tagName).toEqual('TOOLBAR-ITEM-CONTENT');
    });

});
