import {BreakpointListView, BreakpointManager} from './breakpoint';
import {CallStackView} from './call-stack';
import {COMMANDS} from './cpu-commands';
import {DisassemblyView} from './disassembly';
import {MemoryView} from './memory';
import {Module} from '../module';
import {ModuleInformation} from '../module-information';
import {ThreadListView} from './thread';
import {WatchListView} from './watch';
import {CommandManager, MenuBuilder, WindowManager} from 'ui';
import {Component, Inject} from 'es-injection';

/**
 * CPU module
 */
@Component
class CpuModule extends Module {
    private breakpointListView: BreakpointListView;
    private disassemblyView: DisassemblyView;
    private threadListView: ThreadListView;
    private callStackView: CallStackView;
    private watchListView: WatchListView;
    private memoryView: MemoryView;

    /**
     * Set the window components
     * @param breakpointListView Breakpoint list view
     * @param callStackView      Call stack view
     * @param disassemblyView    Disassembly view
     * @param memoryView         Memory view
     * @param threadListView     Thread list view
     * @param watchListView      Watch list view
     */
    @Inject
    setWindowComponents(breakpointListView: BreakpointListView, callStackView: CallStackView, disassemblyView: DisassemblyView, memoryView: MemoryView, threadListView: ThreadListView, watchListView: WatchListView): void {
        this.breakpointListView = breakpointListView;
        this.callStackView = callStackView;
        this.disassemblyView = disassemblyView;
        this.memoryView = memoryView;
        this.threadListView = threadListView;
        this.watchListView = watchListView;
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
     * @param menuBuilder Menu builder
     */
    buildMenu(menuBuilder: MenuBuilder): void {
        menuBuilder.popup('app:main-menu.debug.label')
            .popup('app:main-menu.debug.windows.label')
                .item({label: 'app:main-menu.debug.windows.breakpoints', command: 'window.open.cpu.breakpoints', icon: 'debug-windows-breakpoints'})
                .item({label: 'app:main-menu.debug.windows.output', command: 'window.open.cpu.output', icon: 'debug-windows-output'})
                .separator()
                .item({label: 'app:main-menu.debug.windows.watches', command: 'window.open.cpu.watches', icon: 'debug-windows-watches'})
                .item({label: 'app:main-menu.debug.windows.autos', command: 'window.open.cpu.autos', icon: 'debug-windows-autos'})
                .item({label: 'app:main-menu.debug.windows.locals', command: 'window.open.cpu.locals', icon: 'debug-windows-locals'})
                .item({label: 'app:main-menu.debug.windows.immediates', command: 'window.open.cpu.immediates', icon: 'debug-windows-immediates'})
                .separator()
                .item({label: 'app:main-menu.debug.windows.call-stack', command: 'window.open.cpu.call-stack', icon: 'debug-windows-call-stack'})
                .item({label: 'app:main-menu.debug.windows.threads', command: 'window.open.cpu.threads', icon: 'debug-windows-threads'})
                .item({label: 'app:main-menu.debug.windows.modules', command: 'window.open.cpu.modules', icon: 'debug-windows-modules'})
                .item({label: 'app:main-menu.debug.windows.processes', command: 'window.open.cpu.processes', icon: 'debug-windows-processes'})
                .separator()
                .item({label: 'app:main-menu.debug.windows.memory', command: 'window.open.cpu.memory', icon: 'debug-windows-memory'})
                .item({label: 'app:main-menu.debug.windows.disassembly', command: 'window.open.cpu.disassembly', icon: 'debug-windows-disassembly'})
                .item({label: 'app:main-menu.debug.windows.registers', command: 'window.open.cpu.registers', icon: 'debug-windows-registers'})
            .popup()
            .separator()
            // TODO
            .item({label: 'app:main-menu.debug.continue', command: 'cpu.execution.continue', icon: 'debug-continue'})
            .item({label: 'app:main-menu.debug.break-all', command: 'cpu.execution.break-all', icon: 'debug-break-all'})
            .item({label: 'app:main-menu.debug.stop', command: 'cpu.execution.stop', icon: 'debug-stop'})
            .item({label: 'app:main-menu.debug.detach-all', command: 'cpu.execution.detach-all', icon: 'debug-detach-all'})
            .item({label: 'app:main-menu.debug.terminate-all', command: 'cpu.execution.terminate-all'})
            .item({label: 'app:main-menu.debug.restart', command: 'cpu.execution.restart', icon: 'debug-restart',})
            .separator()
            .item({label: 'app:main-menu.debug.step-into', command: 'cpu.execution.step.into', icon: 'debug-step-into'})
            .item({label: 'app:main-menu.debug.step-over', command: 'cpu.execution.step.over', icon: 'debug-step-over'})
            .item({label: 'app:main-menu.debug.step-out', command: 'cpu.execution.step.out', icon: 'debug-step-out'})
            .separator()
            .item({label: 'app:main-menu.debug.toggle-breakpoint', command: 'cpu.breakpoint.toggle'})
            .popup('app:main-menu.debug.new-breakpoint.label')
                .item({label: 'app:main-menu.debug.new-breakpoint.function', command: 'cpu.breakpoint.new.function'})
                .item({label: 'app:main-menu.debug.new-breakpoint.data', command: 'cpu.breakpoint.new.data'})
            .popup()
            .item({label: 'app:main-menu.debug.delete-all-breakpoints', command: 'cpu.breakpoint.delete-all', icon: 'debug-delete-all-breakpoints'})
            .item({label: 'app:main-menu.debug.disable-all-breakpoints', command: 'cpu.breakpoint.disable-all', icon: 'debug-disable-all-breakpoints'})
        .popup();
    }

    /**
     * Register commands
     * @param commandManager Command manager
     */
    registerCommands(commandManager: CommandManager): void {
        COMMANDS.forEach(command => commandManager.registerCommand(command));
    }

    /**
     * Register windows
     * @param windowManager Window manager
     */
    registerWindows(windowManager: WindowManager): void {
        [
            this.breakpointListView,
            this.callStackView,
            this.disassemblyView,
            this.memoryView,
            this.threadListView,
            this.watchListView
        ].forEach(window => windowManager.registerWindow(window));
    }

}

export {
    CpuModule
};
