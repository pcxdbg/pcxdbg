import {ToolbarItemLabel} from './toolbar-item-label';

describe('Toolbar item label', () => {

    it('is an element with the toolbar-item-label tag name', () => {
        // given
        let toolbarItemLabel: ToolbarItemLabel = new ToolbarItemLabel();
        // expect
        expect(toolbarItemLabel.getNativeElement().tagName).toEqual('TOOLBAR-ITEM-LABEL');
    });

});
