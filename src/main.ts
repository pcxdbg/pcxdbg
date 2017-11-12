import {Application} from './app/application';
import {I18nManager} from './lng/i18n';
import {ComponentManager} from './component';

window.addEventListener('load', async () => {
    let i18nManager: I18nManager = <I18nManager> <any> ComponentManager.getComponent(I18nManager);
    await i18nManager.initialize();
    ComponentManager.getComponent(Application);
}, false);
