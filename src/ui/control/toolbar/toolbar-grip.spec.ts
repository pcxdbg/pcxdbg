import {ToolbarGrip} from './toolbar-grip';

describe('Toolbar grip', () => {

    it('is an element with the toolbar-grip tag name', () => {
        // given
        let toolbarGrip: ToolbarGrip = new ToolbarGrip();
        // expect
        expect(toolbarGrip.getNativeElement().tagName).toEqual('TOOLBAR-GRIP');
    });

});
