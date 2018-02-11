import {MenuItemLanguagePostProcessor} from './menu-item-language-post-processor';

describe('Menu item language post-processor', () => {
    let menuItemLanguagePostProcessor: MenuItemLanguagePostProcessor;

    beforeEach(() => {
        menuItemLanguagePostProcessor = new MenuItemLanguagePostProcessor();
    });

    it('does not modify values with no relevant interpolator', () => {
        // given
        let value: string = 'test random string $t(ignored)';
        // when
        let processedValue: string = menuItemLanguagePostProcessor.postProcess(value);
        // then
        expect(processedValue).toEqual(value);
    });

});
