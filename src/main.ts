import {ApplicationView} from 'app';
import {ElectronHostBackend} from 'host/host-backend-electron';
import {I18nextI18nBackend} from 'i18n/i18n-backend-i18next';
import {UIManager} from 'ui';
import {applicationContext} from 'es-injection/component';

window.addEventListener('load', async () => {
    applicationContext.getComponent(ElectronHostBackend);
    applicationContext.getComponent(UIManager);
    await applicationContext.getComponent(I18nextI18nBackend).initialize();
    applicationContext.getComponent(ApplicationView);
}, false);
