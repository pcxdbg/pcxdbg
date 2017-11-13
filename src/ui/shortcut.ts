import {Component} from '../component';

const KEY_MAPPING: {[keyValue: number]: string} = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    32: 'Space',
    33: 'PageUp',
    34: 'PageDown',
    36: 'Home',
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',
    45: 'Insert',
    46: 'Delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    145: 'ScrollLock',
    173: 'VolumeMute',
    174: 'VolumeDown',
    175: 'VolumeUp',
    176: 'MediaNext',
    177: 'MediaPrevious',
    178: 'MediaStop',
    179: 'MediaPlay'
};

/**
 * Shortcut handler
 */
type ShortcutHandler = (combination?: string) => void;

/**
 * Shortcut manager
 */
@Component
class ShortcutManager {
    private registeredShortcuts: {[combination: string]: ShortcutHandler} = {};
    private keydownListener: (keyboardEvent: KeyboardEvent) => any = keyboardEvent => this.onKeydown(keyboardEvent);

    /**
     * Class constructor
     */
    constructor() {
      document.addEventListener('keydown', this.keydownListener, false);
    }
  
    /**
     * Register a shortcut
     * @param combination Combination
     * @param handler     Shortcut handler
     */
    registerShortcut(combination: string, handler: ShortcutHandler) {
      this.registeredShortcuts[combination] = handler;
    }
  
    /**
     * Unregister a shortcut
     * @param combination Combination
     */
    unregisterShortcut(combination: string) {
      delete this.registeredShortcuts;
    }

    /**
     * Keyboard event handling
     * @param keyboardEvent Keyboard event 
     */
    onKeydown(keyboardEvent: KeyboardEvent) {
        let combination: string[] = [];
        let combinationName: string = '';

        if (keyboardEvent.ctrlKey) {
            combination.push('Ctrl');
        }

        if (keyboardEvent.altKey) {
            combination.push('Alt');
        }

        if (keyboardEvent.shiftKey) {
            combination.push('Shift');
        }

        if (keyboardEvent.which in KEY_MAPPING) {
            combination.push(KEY_MAPPING[keyboardEvent.which]);
        } else {
            console.warn('unmapped keyboard event: ' + keyboardEvent.which, keyboardEvent);
        }
  
        combinationName = combination.join('+');
        if (combinationName in this.registeredShortcuts) {
            this.registeredShortcuts[combinationName](combinationName);
            keyboardEvent.preventDefault();
            keyboardEvent.stopPropagation();
            keyboardEvent.returnValue = false;
        }
    }

}

export {
    ShortcutHandler,
    ShortcutManager
};
