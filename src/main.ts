import {ApplicationView} from './app';
import {I18nextI18nBackend} from './lng/i18n-backend-i18next';
import {ElectronHostBackend} from './host/host-backend-electron';
import {componentManager} from './component';

window.addEventListener('load', async () => {
    componentManager.getComponent(ElectronHostBackend);
    await componentManager.getComponent(I18nextI18nBackend).initialize();
    componentManager.getComponent(ApplicationView);
}, false);
