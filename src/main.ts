import {ApplicationView} from './app';
import {I18nI18nextBackend} from './lng';
import {componentManager} from './component';

window.addEventListener('load', async () => {
    await componentManager.getComponent(I18nI18nextBackend).initialize();
    componentManager.getComponent(ApplicationView);
}, false);
