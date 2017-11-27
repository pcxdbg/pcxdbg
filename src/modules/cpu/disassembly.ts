import {Component, Controller} from 'injection';
import {Window} from 'ui';

/**
 * Disassembly manager
 */
@Component
class DisassemblyManager {

}

/**
 * Disassembly view
 */
@Controller
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
