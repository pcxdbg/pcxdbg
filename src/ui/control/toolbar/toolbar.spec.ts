import {Toolbar} from './toolbar';

describe('Toolbar', () => {

    it('is an element with the toolbar tag name', () => {
        // given
        let toolbar: Toolbar = new Toolbar();
        // expect
        expect(toolbar.getNativeElement().tagName).toEqual('TOOLBAR');
    });

});
