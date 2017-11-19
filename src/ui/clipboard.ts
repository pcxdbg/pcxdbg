import {Component} from '../component';
import {clipboard} from 'electron';

/**
 * Clipboard manager
 */
@Component
class ClipboardManager {

    paste(): void {
        window.addEventListener('cut', () => {
            console.log('CUUUUT');
        }, false);
    }

}

export {
    ClipboardManager
};
