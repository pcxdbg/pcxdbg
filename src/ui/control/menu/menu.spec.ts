import {Menu} from './menu';

describe('Menu', () => {

    it('is an element with the menu tag name', () => {
        // given
        let menu: Menu = new Menu();
        // expect
        expect(menu.getNativeElement().tagName).toEqual('MENU');
    });

});
