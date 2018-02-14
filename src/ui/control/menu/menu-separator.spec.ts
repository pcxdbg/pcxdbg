import {MenuSeparator} from './menu-separator';

describe('Menu separator', () => {

    it('is an element with the menu-separator tag name', () => {
        // given
        let menuSeparator: MenuSeparator = new MenuSeparator();
        // expect
        expect(menuSeparator.getNativeElement().tagName).toEqual('MENU-SEPARATOR');
    });

});
