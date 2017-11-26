import {Component, componentManager} from '../../component';
import {Accelerator} from './accelerator';
import {KeyMapping} from './key-mapping';

/**
 * Command manager forward declaration (will be removed once using the external injection library and interfaces)
 */
class CommandManager {
    executeCommand(commandId: string, commandParameters?: {[parameterName: string]: any}): void { /* unused */ }
}

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

        this.addKeyboardEventModifiers(combinationParts, keyboardEvent);

        if (16 <= key && key <= 18) {
            // Ignore control, alt and shift as they are already taken care of
        } else if (key in KeyMapping) {
            combinationParts.push(KeyMapping[key]);
        } else {
            console.warn('unmapped keyboard event: ' + key, keyboardEvent);
        }

        return combinationParts.join('+');
    }

    /**
     * Add the keyboard modifiers to the list of combination parts
     * @param combinationParts Combination parts
     * @param keyboardEvent    Keyboard event
     */
    private addKeyboardEventModifiers(combinationParts: string[], keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.ctrlKey) {
            combinationParts.push('Ctrl');
        }

        if (keyboardEvent.altKey) {
            combinationParts.push('Alt');
        }

        if (keyboardEvent.shiftKey) {
            combinationParts.push('Shift');
        }
    }

}

export {
    AcceleratorManager
};
