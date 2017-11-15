import {ApplicationView} from './app/application';
import {I18nManager} from './lng/i18n';
import {componentManager} from './component';

window.addEventListener('load', async () => {
    await componentManager.getComponent(I18nManager).initialize();
    componentManager.getComponent(ApplicationView);
}, false);
