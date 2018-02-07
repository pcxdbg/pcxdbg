import {ToolbarSeparator} from './toolbar-separator';

describe('Toolbar separator', () => {

    it('is an element with the toolbar-separator tag name', () => {
        // given
        let toolbarSeparator: ToolbarSeparator = new ToolbarSeparator();
        // expect
        expect(toolbarSeparator.getNativeElement().tagName).toEqual('TOOLBAR-SEPARATOR');
    });

});
