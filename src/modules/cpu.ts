import {Module, ModuleInformation} from './module';
import {Component} from '../component';
import {BreakpointListView, BreakpointManager} from './cpu/breakpoint';
import {CallStackView} from './cpu/call-stack';
import {DisassemblyView} from './cpu/disassembly';
import {MemoryView} from './cpu/memory';
import {ThreadListView} from './cpu/thread';
import {WatchListView} from './cpu/watch';
import {WindowManager} from '../ui/window';
import {Menu} from '../ui/menu';

/**
 * CPU module
 */
@Component
class CpuModule extends Module {
    private breakpointManager: BreakpointManager;
    private windowManager: WindowManager;

    /**
     * Class constructor
     * @param windowManager     Window manager
     * @param breakpointManager Breakpoint manager
     */
    constructor(windowManager: WindowManager, breakpointManager: BreakpointManager) {
        super();
        this.breakpointManager = breakpointManager;
        this.windowManager = windowManager;
    }

    /**
     * Set the window components
     * @param breakpointListView Breakpoint list view
     * @param callStackView      Call stack view
     * @param disassemblyView    Disassembly view
     * @param memoryView         Memory view
     * @param threadListView     Thread list view
     * @param watchListView      Watch list view
     */
    @Component
    setWindowComponents(breakpointListView: BreakpointListView, callStackView: CallStackView, disassemblyView: DisassemblyView, memoryView: MemoryView, threadListView: ThreadListView, watchListView: WatchListView): void {
        [
            breakpointListView,
            callStackView,
            disassemblyView,
            memoryView,
            threadListView,
            watchListView
        ].forEach(window => this.windowManager.registerWindow(window));
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

    /**
     * Build menu entries
     * @param menu Menu
     */
    buidMenuEntries(menu: Menu): void {
        // TODO: move to the CPU module
        menu.popup('app:main-menu.debug.label')
            .popup('app:main-menu.debug.windows.label')
                .item({id: 'debug-windows-breakpoints', label: 'app:main-menu.debug.windows.breakpoints', handler: () => this.openWindow('breakpoint-list'), icon: 'debug-windows-breakpoints', shortcut: 'Alt+F9'})
                .item({id: 'debug-windows-output', label: 'app:main-menu.debug.windows.output', handler: () => this.openWindow('output'), icon: 'debug-windows-output'})
                .separator()
                .item({id: 'debug-windows-watches', label: 'app:main-menu.debug.windows.watches', handler: () => this.openWindow('watch-list'), icon: 'debug-windows-watches'})
                .item({id: 'debug-windows-auto', label: 'app:main-menu.debug.windows.autos', handler: () => this.openWindow('auto-list'), icon: 'debug-windows-autos'})
                .item({id: 'debug-windows-locals', label: 'app:main-menu.debug.windows.locals', handler: () => this.openWindow('local-list'), icon: 'debug-windows-locals', shortcut: 'Alt+4'})
                .item({id: 'debug-windows-immediates', label: 'app:main-menu.debug.windows.immediates', handler: () => this.openWindow('immediate-list'), icon: 'debug-windows-immediates', shortcut: 'Ctrl+Alt+I'})
                .separator()
                .item({id: 'debug-windows-callstack', label: 'app:main-menu.debug.windows.call-stack', handler: () => this.openWindow('call-stack'), icon: 'debug-windows-call-stack', shortcut: 'Alt+7'})
                .item({id: 'debug-windows-threads', label: 'app:main-menu.debug.windows.threads', handler: () => this.openWindow('thread-list'), icon: 'debug-windows-threads', shortcut: 'Ctrl+Alt+H'})
                .item({id: 'debug-windows-modules', label: 'app:main-menu.debug.windows.modules', handler: () => this.openWindow('module-list'), icon: 'debug-windows-modules', shortcut: 'Ctrl+Alt+U'})
                .item({id: 'debug-windows-processes', label: 'app:main-menu.debug.windows.processes', handler: () => this.openWindow('process-list'), icon: 'debug-windows-processes', shortcut: 'Ctrl+Alt+Shift+P'})
                .separator()
                .item({id: 'debug-windows-memory', label: 'app:main-menu.debug.windows.memory', handler: () => this.openWindow('memory'), icon: 'debug-windows-memory'})
                .item({id: 'debug-windows-disassembly', label: 'app:main-menu.debug.windows.disassembly', handler: () => this.openWindow('disassembly'), icon: 'debug-windows-disassembly'})
                .item({id: 'debug-windows-registers', label: 'app:main-menu.debug.windows.registers', handler: () => this.openWindow('register-list'), icon: 'debug-windows-registers'})
            .popup()
            .separator()
            // TODO
            .item({id: 'debug-continue', label: 'app:main-menu.debug.continue', handler: () => this.onDebugContinue(), icon: 'debug-continue', shortcut: 'F5'})
            .item({id: 'debug-breakall', label: 'app:main-menu.debug.break-all', handler: () => this.onDebugBreakAll(), icon: 'debug-break-all', shortcut: 'Ctrl+Alt+Break'})
            .item({id: 'debug-stop', label: 'app:main-menu.debug.stop', handler: () => this.onDebugStop(), icon: 'debug-stop', shortcut: 'Shift+F5'})
            .item({id: 'debug-detachall', label: 'app:main-menu.debug.detach-all', handler: () => this.onDebugDetachAll(), icon: 'debug-detach-all'})
            .item({id: 'debug-terminateall', label: 'app:main-menu.debug.terminate-all', handler: () => this.onDebugTerminateAll(), icon: 'debug-terminate-all'})
            .item({id: 'debug-restart', label: 'app:main-menu.debug.restart', handler: () => this.onDebugRestart(), icon: 'debug-restart', shortcut: 'Ctrl+Shift+F5'})
            .separator()
            .item({id: 'debug-stepinto', label: 'app:main-menu.debug.step-into', handler: () => this.onDebugStepInto(), icon: 'debug-step-into', shortcut: 'F11'})
            .item({id: 'debug-stepover', label: 'app:main-menu.debug.step-over', handler: () => this.onDebugStepOver(), icon: 'debug-step-over', shortcut: 'F10'})
            .item({id: 'debug-stepout', label: 'app:main-menu.debug.step-out', handler: () => this.onDebugStepOut(), icon: 'debug-step-out', shortcut: 'Shift+F11'})
            .separator()
            .item({id: 'debug-togglebreakpoint', label: 'app:main-menu.debug.toggle-breakpoint', handler: () => this.onDebugToggleBreakpoint(), icon: 'debug-toggle-breakpoint', shortcut: 'F9'})
            .popup('app:main-menu.debug.new-breakpoint.label')
                .item({id: 'debug-newfunctionbreakpoint', label: 'app:main-menu.debug.new-breakpoint.function', handler: () => this.onDebugNewBreakpointFunction(), shortcut: 'Ctrl+B'})
                .item({id: 'debug-newdatabreakpoint', label: 'app:main-menu.debug.new-breakpoint.data', handler: () => this.onDebugNewBreakpointData()})
            .popup()
            .item({id: 'debug-deleteallbreakpoints', label: 'app:main-menu.debug.delete-all-breakpoints', handler: () => this.breakpointManager.deleteAll(), icon: 'debug-delete-all-breakpoints', shortcut: 'Ctrl+Shift+F9'})
            .item({id: 'debug-disableallbreakpoints', label: 'app:main-menu.debug.disable-all-breakpoints', handler: () => this.breakpointManager.disableAll(), icon: 'debug-disable-all-breakpoints'})
        .popup();
    }

    /**
     * Callback triggered when Debug => Windows => ? is selected
     */
    private openWindow(componentId): void {
        this.windowManager.openWindow('memory');
    }

    /**
     * Callback triggered when Debug => Continue is selected
     */
    private onDebugContinue(): void {
        console.warn('Debug => Continue not implemented');
    }

    /**
     * Callback triggered when Debug => Break All is selected
     */
    private onDebugBreakAll(): void {
        console.warn('Debug => Break All not implemented');
    }
    /**
     * Callback triggered when Debug => Stop is selected
     */
    private onDebugStop(): void {
        console.warn('Debug => Stop not implemented');
    }
    /**
     * Callback triggered when Debug => Detach All is selected
     */
    private onDebugDetachAll(): void {
        console.warn('Debug => Detach All not implemented');
    }
    /**
     * Callback triggered when Debug => Terminate All is selected
     */
    private onDebugTerminateAll(): void {
        console.warn('Debug => Terminate All not implemented');
    }
    /**
     * Callback triggered when Debug => Restart is selected
     */
    private onDebugRestart(): void {
        console.warn('Debug => Restart not implemented');
    }

    /**
     * Callback triggered when Debug => Step Into is selected
     */
    private onDebugStepInto(): void {
        console.warn('Debug => Step Into not implemented');
    }

    /**
     * Callback triggered when Debug => Step Over is selected
     */
    private onDebugStepOver(): void {
        console.warn('Debug => Step Into not implemented');
    }

    /**
     * Callback triggered when Debug => Step Out is selected
     */
    private onDebugStepOut(): void {
        console.warn('Debug => Step Out not implemented');
    }

    /**
     * Callback triggered when Debug => New Breakpoint => Function Breakpoint is selected
     */
    private onDebugNewBreakpointFunction(): void {
        console.warn('Debug => Break at Function not implemented');
    }

    /**
     * Callback triggered when Debug => New Breakpoint => Data Breakpoint is selected
     */
    private onDebugNewBreakpointData(): void {
        console.warn('Debug => New Data Breakpoint not implemented');
    }

    /**
     * Callback triggered when Debug => Toggle Breakpoint is selected
     */
    private onDebugToggleBreakpoint(): void {
        console.warn('Debug => Toggle Breakpoint not implemented');
    }

}

export {
    CpuModule
};
