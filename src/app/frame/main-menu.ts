import {ClipboardManager, CommandManager, DocumentManager, Menu, MenuManager, ModalManager, UIElement, WindowManager} from '../../ui';
import {Component} from '../../component';
import {Module} from '../../modules';

/**
 * Main menu view
 */
@Component
class MainMenuView extends UIElement {
    private commandManager: CommandManager;
    private windowManager: WindowManager;
    private modalManager: ModalManager;
    private menuManager: MenuManager;
    private modules: Module[];
    private menu: Menu;

    /**
     * Class constructor
     * @param windowManager    Window manager
     * @param modalManager     Modal manager
     * @param menuManager      Menu manager
     * @param commandManager   Command manager
     * @param clipboardManager Clipboard manager
     * @param moduleList       Module list
     */
    constructor(windowManager: WindowManager, modalManager: ModalManager, menuManager: MenuManager, commandManager: CommandManager, clipboardManager: ClipboardManager, moduleList: Module[]) {
        super('application-main-menu');
        this.commandManager = commandManager;
        this.windowManager = windowManager;
        this.modalManager = modalManager;
        this.menuManager = menuManager;
        this.modules = moduleList;
        this.menu = this.menuManager.createMenu();
        this.buildFileMenu();
        this.buildEditMenu();
        this.buildViewMenu();
        this.buildModuleMenus();
        this.buildToolsMenu();
        this.buildWindowMenu();
        this.buildHelpMenu();
        this.buildProfileMenu();
        this.menu.attachTo(this);
    }

    /**
     * Build the file menu
     */
    private buildFileMenu(): void {
        let fileRecentConnectionsMenu: Menu = this.menuManager.createPopupMenu();
        let fileRecentFilesMenu: Menu = this.menuManager.createPopupMenu();

        this.menu.popup('app:main-menu.file.label')
            .popup('app:main-menu.file.open.label')
                .item({label: 'app:main-menu.file.open.connection', command: 'connection.open', icon: 'file-open-connection'})
                .separator()
                .item({label: 'app:main-menu.file.open.file', command: 'document.open', icon: 'file-open-file'})
            .popup()
            .separator()
            .item({label: 'app:main-menu.file.close', command: 'document.close'})
            .item({label: 'app:main-menu.file.close-connection', command: 'connection.close', icon: 'file-close-connection'})
            .separator()
            .item({label: 'app:main-menu.file.save', command: 'document.save', icon: 'file-save'})
            .item({label: 'app:main-menu.file.save-as', command: 'document.save.as'})
            .item({label: 'app:main-menu.file.save-all', command: 'document.save.all', icon: 'file-save-all'})
            .separator()
            .popup('app:main-menu.file.source-control.label')
                // TODO
            .popup()
            .separator()
            .item({label: 'app:main-menu.file.page-setup', command: 'print.setup', icon: 'file-page-setup'})
            .item({label: 'app:main-menu.file.print', command: 'print', icon: 'file-print'})
            .separator()
            .popup('app:main-menu.file.recent-connections', fileRecentConnectionsMenu)
            .popup('app:main-menu.file.recent-files', fileRecentFilesMenu)
            .separator()
            .item({label: 'app:main-menu.file.exit', command: 'exit', icon: 'file-exit'})
        .popup();
    }

    /**
     * Build the edit menu
     */
    private buildEditMenu(): void {
        this.menu.popup('app:main-menu.edit.label')
            .popup('app:main-menu.edit.goto.label')
                .item({label: 'app:main-menu.edit.goto.line', command: 'goto.line'})
                .item({label: 'app:main-menu.edit.goto.function', command: 'goto.function'})
                .item({label: 'app:main-menu.edit.goto.file', command: 'goto.document'})
            .popup()
            .popup('app:main-menu.edit.find-replace.label')
                // TODO
            .popup()
            .separator()
            .item({label: 'app:main-menu.edit.undo', command: 'action.undo', icon: 'edit-undo'})
            .item({label: 'app:main-menu.edit.redo', command: 'action.redo', icon: 'edit-redo'})
            .separator()
            .item({label: 'app:main-menu.edit.cut', command: 'clipboard.cut', icon: 'edit-cut'})
            .item({label: 'app:main-menu.edit.copy', command: 'clipboard.copy', icon: 'edit-copy'})
            .item({label: 'app:main-menu.edit.paste', command: 'clipboard.paste', icon: 'edit-paste'})
            .item({label: 'app:main-menu.edit.delete', command: 'edit.delete', icon: 'edit-delete'})
            .separator()
            .item({label: 'app:main-menu.edit.select-all', command: 'edit.select-all', icon: 'edit-select-all'})
        .popup();
    }

    /**
     * Build the view menu
     */
    private buildViewMenu(): void {
        this.menu.popup('app:main-menu.view.label')
            .item({label: 'app:main-menu.view.host-explorer', command: 'window.open.host-explorer', icon: 'view-host-explorer'})
            .item({label: 'app:main-menu.view.network-explorer', command: 'window.open.network-explorer', icon: 'view-network-explorer'})
            .separator()
            .item({label: 'app:main-menu.view.bookmark-window', command: 'window.open.bookmark-window', icon: 'view-bookmark-window'})
            .item({label: 'app:main-menu.view.call-hierarchy', command: 'window.open.call-hierarchy', icon: 'view-call-hierarchy'})
            .item({label: 'app:main-menu.view.object-browser', command: 'window.open.object-browser', icon: 'view-object-browser'})
            .separator()
            .item({label: 'app:main-menu.view.command-window', command: 'window.open.command-window', icon: 'view-command-window'})
            .item({label: 'app:main-menu.view.error-list', command: 'window.open.error-list', icon: 'view-error-list'})
            .item({label: 'app:main-menu.view.output', command: 'window.open.output', icon: 'view-output'})
            .item({label: 'app:main-menu.view.notifications', command: 'window.open.notifications', icon: 'view-notifications'})
            .item({label: 'app:main-menu.view.chat', command: 'window.open.chat', icon: 'view-chat'})
            .separator()
            .popup('app:main-menu.view.toolbars.label')
                // TODO: retrieve available toolbars from modules
                .item({label: 'app:main-menu.view.toolbars.standard', command: 'toolbar.open.standard', icon: 'menuitem-checked'})
            .popup()
            .item({label: 'app:main-menu.view.fullscreen', command: 'view.fullscreen.toggle', icon: 'view-fullscreen'})
            .item({label: 'app:main-menu.view.all-windows', command: 'document.list', icon: 'view-all-windows'})
            .separator()
            .item({label: 'app:main-menu.view.navigate-backward', command: 'navigation.backward', icon: 'view-navigate-backward'})
            .item({label: 'app:main-menu.view.navigate-forward', command: 'navigation.forward', icon: 'view-navigate-forward'})
        .popup();
    }

    /**
     * Build the module menus
     */
    private buildModuleMenus(): void {
        // this.modules.forEach(module => module.buidMenu(this.menu));
    }

    /**
     * Build the tools menu
     */
    private buildToolsMenu(): void {
        this.menu.popup('app:main-menu.tools.label')
            .item({label: 'app:main-menu.tools.extensions', command: 'modal.open.extensions', icon: 'tools-extensions'})
            .separator()
            .item({label: 'app:main-menu.tools.customize', command: 'modal.open.customize'})
            .item({label: 'app:main-menu.tools.options', command: 'modal.open.options', icon: 'tools-options'})
        .popup();
    }

    /**
     * Build the window menu
     */
    private buildWindowMenu(): void {
        this.menu.popup('app:main-menu.window.label')
            .item({label: 'app:main-menu.window.new-window', command: 'window.new', icon: 'window-new-window'})
            .item({label: 'app:main-menu.window.split', command: 'window.split', icon: 'window-split'})
            .separator()
            .item({label: 'app:main-menu.window.float', command: 'window.float'})
            .item({label: 'app:main-menu.window.dock', command: 'window.dock'})
            .item({label: 'app:main-menu.window.auto-hide', command: 'window.auto-hide.current'})
            .item({label: 'app:main-menu.window.hide', command: 'window.hide', icon: 'window-hide'})
            .separator()
            .item({label: 'app:main-menu.window.pin-tab', command: 'window.pin-tab', icon: 'window-pin-tab'})
            .separator()
            .item({label: 'app:main-menu.window.save-window-layout', command: 'window.layout.save'})
            .popup('app:main-menu.window.apply-window-layout.label')
                .item({label: 'app:main-menu.window.apply-window-layout.none-saved'})
            .popup()
            .item({label: 'app:main-menu.window.manage-window-layouts', command: 'window.layout.list'})
            .item({label: 'app:main-menu.window.reset-window-layout', command: 'window.layout.reset'})
            .separator()
            .item({label: 'app:main-menu.window.auto-hide-all', command: 'window.auto-hide.all'})
            .item({label: 'app:main-menu.window.new-horizontal-tab-group', command: 'window.tab-group.new.horizontal', icon: 'window-new-horizontal-tab-group'})
            .item({label: 'app:main-menu.window.new-vertical-tab-group', command: 'window.tab-group.new.vertical', icon: 'window-new-vertical-tab-group'})
            .item({label: 'app:main-menu.window.close-all-documents', command: 'document.close.all', icon: 'window-close-all-documents'})
            .separator()
            // TODO: list of documents opened
            .item({label: 'app:main-menu.window.windows', command: 'document.list'})
        .popup();
    }

    /**
     * Build the help menu
     */
    private buildHelpMenu(): void {
        this.menu.popup('app:main-menu.help.label')
            .popup('app:main-menu.help.feedback.label')
                .item({label: 'app:main-menu.help.feedback.report-bug', command: 'external.open.report-bug', icon: 'help-feedback-report-bug'})
            .popup()
            .separator()
            .item({label: 'app:main-menu.help.view', command: 'document.open.help', icon: 'help-view'})
            .separator()
            .item({label: 'app:main-menu.help.about', command: 'modal.open.about'})
        .popup();
    }

    /**
     * Build the profile menu
     */
    private buildProfileMenu(): void {
        this.menu.popupText('<username>')
            .item({label: 'app:main-menu.profile.preferences', command: 'modal.open.profile.preferences'})
            .item({label: 'app:main-menu.profile.rights', command: 'modal.open.profile.rights'})
            .separator()
            .item({label: 'app:main-menu.profile.logout', command: 'profile.signout'})
        .popup();
    }

}

export {
    MainMenuView
};
