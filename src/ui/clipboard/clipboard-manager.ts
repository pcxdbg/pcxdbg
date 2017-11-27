import {Component} from 'injection';

/**
 * Clipboard manager
 */
@Component
class ClipboardManager {

    paste(): void {
        window.addEventListener('cut', () => {
            console.log('cut event received on the window');
        }, false);
    }

}

export {
    ClipboardManager
};
