import {MenuItem} from './menu-item';

describe('Menu item', () => {

    it('is an element with the menu-item tag name', () => {
        // given
        let menuItem: MenuItem = new MenuItem();
        // expect
        expect(menuItem.getNativeElement().tagName).toEqual('MENU-ITEM');
    });

    describe('can be', () => {
        let menuItem: MenuItem = new MenuItem();

        it('implicitely enabled', () => {
            // given
            menuItem.enable();
            // expect
            expect(menuItem.isEnabled()).toEqual(true);
            expect(menuItem.hasAttribute('disabled')).toEqual(false);
        });

        it('explicitely enabled', () => {
            // given
            menuItem.enable(true);
            // expect
            expect(menuItem.isEnabled()).toEqual(true);
            expect(menuItem.hasAttribute('disabled')).toEqual(false);
        });

        it('explicitely disabled', () => {
            // given
            menuItem.enable(true);
            menuItem.disable();
            // expect
            expect(menuItem.isEnabled()).toEqual(false);
            expect(menuItem.hasAttribute('disabled')).toEqual(true);
        });

        it('implicitely activated', () => {
            // given
            menuItem.activate();
            // expect
            expect(menuItem.isActive()).toEqual(true);
            expect(menuItem.hasAttribute('active')).toEqual(true);
        });

        it('explicitely activated', () => {
            // given
            menuItem.activate(true);
            // expect
            expect(menuItem.isActive()).toEqual(true);
            expect(menuItem.hasAttribute('active')).toEqual(true);
        });

        it('explicitely deactivated', () => {
            // given
            menuItem.activate(true);
            menuItem.deactivate();
            // expect
            expect(menuItem.isActive()).toEqual(false);
            expect(menuItem.hasAttribute('active')).toEqual(false);
        });

    });

});
