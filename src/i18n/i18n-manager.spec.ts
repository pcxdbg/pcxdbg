import {I18nBackend} from './i18n-backend';
import {I18nManager} from './i18n-manager';
import {createMockInstance} from 'jest-create-mock-instance';

/**
 * Create an HTML element
 * @param tagName     Tag name
 * @param htmlContent HTML content
 * @return HTML element
 */
function createElement(tagName: string, htmlContent?: string): HTMLElement {
    let element: HTMLElement = document.createElement(tagName);
    if (htmlContent) {
        element.innerHTML = htmlContent;
    }

    return element;
}

describe('i18n manager', () => {
    let i18nManager: I18nManager;
    let backend: jest.Mocked<I18nBackend> = createMockInstance(I18nBackend);

    beforeEach(() => {
        backend = createMockInstance(I18nBackend);
        i18nManager = new I18nManager();
        i18nManager.setBackend(<I18nBackend> <any> backend);
    });

    afterEach(() => i18nManager.shutdown());

    it('can delegate key translation to its backend', () => {
        backend.translateKey.mockReturnValueOnce('test');

        let result: string = i18nManager.translateKey('key', {x: 1});

        expect(backend.translateKey).toHaveBeenCalledWith('key', {x: 1});
        expect(result).toEqual('test');
    });

    it('can tag unknown translation keys', () => {
        backend.translateKey.mockReturnValueOnce(undefined);

        let result: string = i18nManager.translateKey('key', {x: 1});

        expect(backend.translateKey).toHaveBeenCalledWith('key', {x: 1});
        expect(result).toEqual('???key???');
    });

    it('can delegate date formatting to its backend', () => {
        backend.formatDate.mockReturnValueOnce('test');

        let date: Date = new Date();
        let result: string = i18nManager.formatDate(date, 'abcdef');

        expect(backend.formatDate).toHaveBeenCalledWith(date, 'abcdef');
        expect(result).toEqual('test');
    });

});
