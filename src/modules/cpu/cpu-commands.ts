import {CommandDefinition} from '../../ui';

const COMMANDS: CommandDefinition[] = [{
    id: 'cpu.breakpoint.delete-all',
    accelerator: 'Ctrl+Shift+F9',
    label: 'cpu:command.breakpoint.delete-all.label',
    description: 'cpu:command.breakpoint.delete-all.description'
}, {
    id: 'cpu.breakpoint.disable-all',
    label: 'cpu:command.breakpoint.disable-all.label',
    description: 'cpu:command.breakpoint.disable-all.description'
}, {
    id: 'cpu.breakpoint.new.data',
    label: 'cpu:command.breakpoint.new.data.label',
    description: 'cpu:command.breakpoint.new.data.description'
}, {
    id: 'cpu.breakpoint.new.function',
    accelerator: 'Ctrl+B',
    label: 'cpu:command.breakpoint.new.function.label',
    description: 'cpu:command.breakpoint.new.function.description'
}, {
    id: 'cpu.breakpoint.toggle',
    accelerator: 'F9',
    label: 'cpu:command.breakpoint.toggle.label',
    description: 'cpu:command.breakpoint.toggle.description'
}, {
    id: 'cpu.execution.break-all',
    accelerator: 'Ctrl+Alt+Break',
    label: 'cpu:command.execution.break-all.label',
    description: 'cpu:command.execution.break-all.description'
}, {
    id: 'cpu.execution.continue',
    accelerator: 'F5',
    label: 'cpu:command.execution.continue.label',
    description: 'cpu:command.execution.continue.description'
}, {
    id: 'cpu.execution.detach-all',
    label: 'cpu:command.execution.detach-all.label',
    description: 'cpu:command.execution.detach-all.description'
}, {
    id: 'cpu.execution.restart',
    accelerator: 'Ctrl+Shift+F5',
    label: 'cpu:command.execution.restart.label',
    description: 'cpu:command.execution.restart.description'
}, {
    id: 'cpu.execution.step.into',
    accelerator: 'F11',
    label: 'cpu:command.execution.step.into.label',
    description: 'cpu:command.execution.step.into.description'
}, {
    id: 'cpu.execution.step.out',
    accelerator: 'Shift+F11',
    label: 'cpu:command.execution.step.out.label',
    description: 'cpu:command.execution.step.out.description'
}, {
    id: 'cpu.execution.step.over',
    accelerator: 'F10',
    label: 'cpu:command.execution.step.over.label',
    description: 'cpu:command.execution.step.over.description'
}, {
    id: 'cpu.execution.stop',
    accelerator: 'Shift+F5',
    label: 'cpu:command.execution.stop.label',
    description: 'cpu:command.execution.stop.description'
}, {
    id: 'cpu.execution.terinate-all',
    label: 'cpu:command.execution.terminate-all.label',
    description: 'cpu:command.execution.terminate-all.description'
}, {
    id: 'window.open.cpu.autos',
    label: 'cpu:command.window.autos.label',
    description: 'cpu:command.window.autos.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'auto-list'}
    }
}, {
    id: 'window.open.cpu.breakpoints',
    accelerator: 'Alt+F9',
    label: 'cpu:command.window.breakpoints.label',
    description: 'cpu:command.window.breakpoints.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'breakpoint-list'}
    }
}, {
    id: 'window.open.cpu.call-stack',
    accelerator: 'Alt+7',
    label: 'cpu:command.window.call-stack.label',
    description: 'cpu:command.window.call-stack.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'call-stack'}
    }
}, {
    id: 'window.open.cpu.disassembly',
    label: 'cpu:command.window.disassembly.label',
    description: 'cpu:command.window.disassembly.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'disassembly'}
    }
}, {
    id: 'window.open.cpu.immediates',
    accelerator: 'Ctrl+Alt+I',
    label: 'cpu:command.window.immediates.label',
    description: 'cpu:command.window.immediates.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'immediate-list'}
    }
}, {
    id: 'window.open.cpu.locals',
    accelerator: 'Alt+4',
    label: 'cpu:command.window.locals.label',
    description: 'cpu:command.window.locals.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'local-list'}
    }
}, {
    id: 'window.open.cpu.memory',
    label: 'cpu:command.window.memory.label',
    description: 'cpu:command.window.memory.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'memory'}
    }
}, {
    id: 'window.open.cpu.modules',
    accelerator: 'Ctrl+Alt+U',
    label: 'cpu:command.window.modules.label',
    description: 'cpu:command.window.modules.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'module-list'}
    }
}, {
    id: 'window.open.cpu.output',
    label: 'cpu:command.window.output.label',
    description: 'cpu:command.window.output.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'output'}
    }
}, {
    id: 'window.open.cpu.processes',
    accelerator: 'Ctrl+Alt+Shift+P',
    label: 'cpu:command.window.processes.label',
    description: 'cpu:command.window.processes.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'process-list'}
    }
}, {
    id: 'window.open.cpu.registers',
    label: 'cpu:command.window.registers.label',
    description: 'cpu:command.window.registers.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'register-list'}
    }
}, {
    id: 'window.open.cpu.threads',
    accelerator: 'Ctrl+Alt+H',
    label: 'cpu:command.window.threads.label',
    description: 'cpu:command.window.threads.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'thread-list'}
    }
}, {
    id: 'window.open.cpu.watches',
    label: 'cpu:command.window.watches.label',
    description: 'cpu:command.window.watches.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'watch-list'}
    }
}];

export {
    COMMANDS
};
