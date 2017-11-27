import {ApplicationView} from 'app';
import {ElectronHostBackend} from 'host/host-backend-electron';
import {applicationContext} from 'injection';
import {I18nextI18nBackend} from 'i18n/i18n-backend-i18next';

window.addEventListener('load', async () => {
    applicationContext.getComponent(ElectronHostBackend);
    await applicationContext.getComponent(I18nextI18nBackend).initialize();
    applicationContext.getComponent(ApplicationView);
}, false);
