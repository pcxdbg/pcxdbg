import {Window, WindowManager} from '../../ui/window';
import {Component} from '../../component';

/**
 * Disassembly manager
 */
@Component
class DisassemblyManager {

}

/**
 * Disassembly view
 */
@Component
class DisassemblyView extends Window {
    private disassemblyManager: DisassemblyManager;

    /**
     * Class constructor
     * @param disassemblyManager Disassembly manager
     */
    constructor(disassemblyManager: DisassemblyManager) {
        super({
            title: 'cpu:disassembly.title'
        });
        this.disassemblyManager = disassemblyManager;
    }

}

export {
    DisassemblyManager,
    DisassemblyView
};
