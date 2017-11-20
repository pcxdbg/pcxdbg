import {CommandDefinition} from '../ui';

const COMMANDS: CommandDefinition[] = [{
    id: 'action.redo',
    accelerator: 'Ctrl+Y',
    label: 'app:command.action.redo.label',
    description: 'app:command.action.redo.description'
}, {
    id: 'action.undo',
    accelerator: 'Ctrl+Z',
    label: 'app:command.action.redo.label',
    description: 'app:command.action.redo.description'
}, {
    id: 'clipboard.copy',
    accelerator: 'Ctrl+C',
    label: 'app:command.clipboard.copy.label',
    description: 'app:command.clipboard.copy.description'
}, {
    id: 'clipboard.cut',
    accelerator: 'Ctrl+X',
    label: 'app:command.clipboard.cut.label',
    description: 'app:command.clipboard.cut.description'
}, {
    id: 'clipboard.paste',
    accelerator: 'Ctrl+V',
    label: 'app:command.clipboard.paste.label',
    description: 'app:command.clipboard.paste.description'
}, {
    id: 'connection.close',
    accelerator: 'Ctrl+Shift+F4',
    label: 'app:command.connection.close.label',
    description: 'app:command.connection.close.description'
}, {
    id: 'connection.open',
    accelerator: 'Ctrl+Shift+O',
    label: 'app:command.connection.open.label',
    description: 'app:command.connection.open.description'
}, {
    id: 'document.close.all',
    label: 'app:command.document.close.all.label',
    description: 'app:command.document.close.all.description'
}, {
    id: 'document.list',
    accelerator: 'Alt+Shift+M',
    label: 'app:command.document.list.label',
    description: 'app:command.document.list.description'
}, {
    id: 'document.open.type',
    label: 'app:command.document.open.default.label',
    description: 'app:command.document.open.default.description'
}, {
    id: 'document.open.help',
    accelerator: 'F1',
    label: 'app:command.document.open.help.label',
    description: 'app:command.document.open.help.description',
    aliasFor: {
        command: 'document.open.type',
        parameters: {documentId: 'help'}
    }
}, {
    id: 'edit.delete',
    accelerator: 'Del',
    label: 'app:command.edit.delete.label',
    description: 'app:command.edit.delete.description'
}, {
    id: 'edit.select-all',
    accelerator: 'Ctrl+A',
    label: 'app:command.edit.select-all.label',
    description: 'app:command.edit.select-all.description'
}, {
    id: 'exit',
    accelerator: 'Alt+F4',
    label: 'app:command.exit.label',
    description: 'app:command.exit.description'
}, {
    id: 'external.open',
    label: 'app:command.external.open.default.label',
    description: 'app:command.external.open.default.description'
}, {
    id: 'external.open.report-bug',
    label: 'app:command.external.open.report-bug.label',
    description: 'app:command.external.open.report-bug.description',
    aliasFor: {
        command: 'external.open',
        parameters: {externalId: 'report-bug'}
    }
}, {
    id: 'document.close',
    accelerator: 'Ctrl+F4',
    label: 'app:command.close.label',
    description: 'app:command.close.description'
}, {
    id: 'document.open',
    accelerator: 'Ctrl+O',
    label: 'app:command.document.open.label',
    description: 'app:command.document.open.description'
}, {
    id: 'document.save',
    accelerator: 'Ctrl+S',
    label: 'app:command.document.save.default.label',
    description: 'app:command.document.save.default.description'
}, {
    id: 'document.save.all',
    accelerator: 'Ctrl+Shift+S',
    label: 'app:command.document.save.all.label',
    description: 'app:command.document.save.all.description'
}, {
    id: 'document.save.as',
    label: 'app:command.document.save.as.label',
    description: 'app:command.document.save.as.description'
}, {
    id: 'goto.document',
    accelerator: 'Ctrl+Alt+Shift+G',
    label: 'app:command.goto.document.label',
    description: 'app:command.goto.document.description'
}, {
    id: 'goto.function',
    accelerator: 'Ctrl+Shift+G',
    label: 'app:command.goto.function.label',
    description: 'app:command.edit.goto.function.description'
}, {
    id: 'goto.line',
    accelerator: 'Ctrl+G',
    label: 'app:command.edit.goto.line.label',
    description: 'app:command.edit.goto.line.description'
}, {
    id: 'modal.open'
}, {
    id: 'modal.open.about',
    label: 'app:command.modal.open.about.label',
    description: 'app:command.modal.open.about.description',
    aliasFor: {
        command: 'modal.open',
        parameters: {modalId: 'about'}
    }
}, {
    id: 'modal.open.customize',
    label: 'app:command.modal.open.customize.label',
    description: 'app:command.modal.open.customize.description',
    aliasFor: {
        command: 'modal.open',
        parameters: {modalId: 'customize'}
    }
}, {
    id: 'modal.open.extensions',
    label: 'app:command.modal.open.extensions.label',
    description: 'app:command.modal.open.extensions.description',
    aliasFor: {
        command: 'modal.open',
        parameters: {modalId: 'extensions'}
    }
}, {
    id: 'modal.open.options',
    label: 'app:command.modal.open.options.label',
    description: 'app:command.modal.open.options.description',
    aliasFor: {
        command: 'modal.open',
        parameters: {modalId: 'options'}
    }
}, {
    id: 'modal.open.profile.preferences',
    label: 'app:command.modal.open.profile.preferences.label',
    description: 'app:command.modal.open.profile.preferences.description',
    aliasFor: {
        command: 'modal.open',
        parameters: {modalId: 'preferences'}
    }
}, {
    id: 'modal.open.profile.rights',
    label: 'app:command.modal.open.profile.rights.label',
    description: 'app:command.modal.open.profile.rights.description',
    aliasFor: {
        command: 'modal.open',
        parameters: {modalId: 'rights'}
    }
}, {
    id: 'navigation.backward',
    accelerator: 'Ctrl+-',
    label: 'app:command.navigation.backward.label',
    description: 'app:command.navigation.backward.description'
}, {
    id: 'navigation.forward',
    accelerator: 'Ctrl+Shift-',
    label: 'app:command.navigation.forward.label',
    description: 'app:command.navigation.forward.description'
}, {
    id: 'print',
    accelerator: 'Ctrl+P',
    label: 'app:command.print.default.label',
    description: 'app:command.print.default.description'
}, {
    id: 'print.setup',
    label: 'app:command.print.setup.label',
    description: 'app:command.print.setup.description'
}, {
    id: 'profile.signout',
    label: 'app:command.profile.signout.label',
    description: 'app:command.profile.signout.description'
}, {
    id: 'toolbar.open'
}, {
    id: 'toolbar.open.standard',
    label: 'app:command.toolbar.open.standard.label',
    description: 'app:command.toolbar.open.standard.description',
    aliasFor: {
        command: 'toolbar.open',
        parameters: {toolbarId: 'standard'}
    }
}, {
    id: 'view.fullscreen.toggle',
    accelerator: 'Alt+Shift+Enter',
    label: 'app:command.view.fullscreen.toggle.label',
    description: 'app:command.view.fullscreen.toggle.description'
}, {
    id: 'window.auto-hide.all',
    label: 'app:command.window.auto-hide.all.label',
    description: 'app:command.window.auto-hide.all.description'
}, {
    id: 'window.auto-hide.current',
    label: 'app:command.window.auto-hide.current.label',
    description: 'app:command.window.auto-hide.current.description'
}, {
    id: 'window.dock',
    label: 'app:command.window.dock.label',
    description: 'app:command.window.dock.description'
}, {
    id: 'window.float',
    label: 'app:command.window.float.label',
    description: 'app:command.window.float.description'
}, {
    id: 'window.hide',
    label: 'app:command.window.hide.label',
    description: 'app:command.window.hide.description'
}, {
    id: 'window.layout.list',
    label: 'app:command.window.layout.list.label',
    description: 'app:command.window.layout.list.description'
}, {
    id: 'window.layout.reset',
    label: 'app:command.window.layout.reset.label',
    description: 'app:command.window.layout.reset.description'
}, {
    id: 'window.layout.save',
    label: 'app:command.window.layout.save.label',
    description: 'app:command.window.layout.save.description'
}, {
    id: 'window.new',
    label: 'app:command.window.new.label',
    description: 'app:command.window.new.description'
}, {
    id: 'window.open',
    label: 'app:command.window.open.default.label',
    description: 'app:command.window.open.default.description'
}, {
    id: 'window.open.bookmark-window',
    accelerator: 'Ctrl+K',
    label: 'app:command.window.open.bookmark-window.label',
    description: 'app:command.window.open.bookmark-window.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'bookmark-window'}
    }
}, {
    id: 'window.open.call-hierarchy',
    accelerator: 'Ctrl+Alt+K',
    label: 'app:command.window.open.call-hierarchy.label',
    description: 'app:command.window.open.call-hierarchy.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'call-hierarchy'}
    }
}, {
    id: 'window.open.chat',
    accelerator: 'Alt+9',
    label: 'app:command.window.open.chat.label',
    description: 'app:command.window.open.chat.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'chat'}
    }
}, {
    id: 'window.open.command-window',
    accelerator: 'Alt+0',
    label: 'app:command.window.open.command-window.label',
    description: 'app:command.window.open.command-window.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'command-window'}
    }
}, {
    id: 'window.open.error-list',
    accelerator: 'Alt+1',
    label: 'app:command.window.open.error-list.label',
    description: 'app:command.window.open.error-list.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'error-list'}
    }
}, {
    id: 'window.open.host-explorer',
    accelerator: 'Ctrl+Alt+L',
    label: 'app:command.window.open.host-explorer.label',
    description: 'app:command.window.open.host-explorer.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'host-explorer'}
    }
}, {
    id: 'window.open.network-explorer',
    accelerator: 'Ctrl+M',
    label: 'app:command.window.open.network-explorer.label',
    description: 'app:command.window.open.network-explorer.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'network-explorer'}
    }
}, {
    id: 'window.open.notifications',
    accelerator: 'Alt+3',
    label: 'app:command.window.open.notifications.label',
    description: 'app:command.window.open.notifications.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'notifications'}
    }
}, {
    id: 'window.open.object-browser',
    accelerator: 'Ctrl+Alt+J',
    label: 'app:command.window.open.object-browser.label',
    description: 'app:command.window.open.object-browser.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'object-browser'}
    }
}, {
    id: 'window.open.output',
    accelerator: 'Alt+2',
    label: 'app:command.window.open.output.label',
    description: 'app:command.window.open.output.description',
    aliasFor: {
        command: 'window.open',
        parameters: {windowId: 'output'}
    }
}, {
    id: 'window.pin-tab',
    label: 'app:command.window.pin-tab.label',
    description: 'app:command.window.pin-tab.description'
}, {
    id: 'window.split',
    label: 'app:command.window.split.label',
    description: 'app:command.window.split.description'
}, {
    id: 'window.tab-group.new.horizontal',
    label: 'app:command.window.tab-group.new.horizontal.label',
    description: 'app:command.window.tab-group.new.horizontal.description'
}, {
    id: 'window.tab-group.new.vertical',
    label: 'app:command.window.tab-group.new.vertical.label',
    description: 'app:command.window.tab-group.new.vertical.description'
}];

export {
    COMMANDS
};
