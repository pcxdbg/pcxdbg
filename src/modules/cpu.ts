import {Module, ModuleInformation} from './module';
import {Component} from '../component';
import {BreakpointListView} from './cpu/breakpoint';
import {CallStackView} from './cpu/call-stack';
import {DisassemblyView} from './cpu/disassembly';
import {MemoryView} from './cpu/memory';
import {ThreadListView} from './cpu/thread';
import {WatchListView} from './cpu/watch';
import {WindowManager} from '../ui/window';

/**
 * CPU module
 */
@Component
class CpuModule implements Module {

    /**
     * Class constructor
     * @param windowManager      Window manager
     * @param breakpointListView Breakpoint list view
     * @param callStackView      Call stack view
     * @param disassemblyView    Disassembly view
     * @param memoryView         Memory view
     * @param threadListView     Thread list view
     * @param watchListView      Watch list view
     */
    constructor(windowManager: WindowManager, breakpointListView: BreakpointListView, callStackView: CallStackView, disassemblyView: DisassemblyView, memoryView: MemoryView, threadListView: ThreadListView, watchListView: WatchListView) {
        [
            breakpointListView,
            callStackView,
            disassemblyView,
            memoryView,
            threadListView,
            watchListView
        ].forEach(window => windowManager.registerWindow(window));
    }

    /**
     * Get the module name
     * @return Module name
     */
    async getInformation(): Promise<ModuleInformation> {
        return {
            name: 'CPU',
            description: 'CPU module',
            version: null
        };
    }

}

export {
    CpuModule
};
