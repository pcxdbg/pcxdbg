import {Component, componentManager} from '../component';

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
 * Accelerator
 */
interface Accelerator {
    commandId: string;
    commandParameters?: {[parameterName: string]: any};
}

/**
 * Command manager forward declaration (avoids cyclic module dependency)
 */
class CommandManager {
    executeCommand(commandId: string, commandParameters?: {[parameterName: string]: any}): void { /* unused */ }
}

let lala: number = 0;
/**
 * Accelerator manager
 */
@Component
class AcceleratorManager {
    private keydownListener: (keyboardEvent: KeyboardEvent) => any = keyboardEvent => this.onKeydown(keyboardEvent);
    private accelerators: {[combination: string]: Accelerator} = {};
    x: number;

    /**
     * Class constructor
     */
    constructor() {
        this.x = ++lala;
        document.addEventListener('keydown', this.keydownListener, false);
    }

    /**
     * Shut the manager down
     */
    shutdown(): void {
        document.removeEventListener('keydown', this.keydownListener);
    }

    /**
     * Register an accelerator
     * @param combination       Combination
     * @param commandId         Command identifier
     * @param commandParameters Command parameters
     */
    registerAccelerator(combination: string, commandId: string, commandParameters?: {[parameterName: string]: any}): void {
        if (combination in this.accelerators) {
            throw new Error('an accelerator is already registered for combination ' + combination + ': ' + this.accelerators[combination].commandId);
        }

        this.accelerators[combination] = {
            commandId: commandId,
            commandParameters: commandParameters
        };
    }

    /**
     * Get the accelerator matching a combination
     * @param combination Combination
     * @return Accelerator
     */
    getAccelerator(combination: string): Accelerator {
        return this.accelerators[combination];
    }

    /**
     * Keyboard event handling
     * @param keyboardEvent Keyboard event
     */
    private onKeydown(keyboardEvent: KeyboardEvent): void {
        let combination: string = this.buildCombinationFromKeyboardEvent(keyboardEvent);
        let accelerator: Accelerator = this.getAccelerator(combination);
        if (accelerator) {
            keyboardEvent.preventDefault();
            keyboardEvent.stopPropagation();
            keyboardEvent.returnValue = false;
            componentManager.getComponent(CommandManager).executeCommand(accelerator.commandId, accelerator.commandParameters);
        }
    }

    /**
     * Build a combination from a keyboard event
     * @param keyboardEvent Keyboard event
     * @return Combination
     */
    private buildCombinationFromKeyboardEvent(keyboardEvent: KeyboardEvent): string {
        let combinationParts: string[] = [];
        let key: number = keyboardEvent.which;

        if (keyboardEvent.ctrlKey) {
            combinationParts.push('Ctrl');
        }

        if (keyboardEvent.altKey) {
            combinationParts.push('Alt');
        }

        if (keyboardEvent.shiftKey) {
            combinationParts.push('Shift');
        }

        if (16 <= key && key <= 18) {
            // Ignore control, alt and shift as they are already taken care of
        } else if (key in KEY_MAPPING) {
            combinationParts.push(KEY_MAPPING[key]);
        } else {
            console.warn('unmapped keyboard event: ' + key, keyboardEvent);
        }

        return combinationParts.join('+');
    }

}

export {
    AcceleratorManager
};
