import {UIElement} from '../ui/element';
import {ClipboardManager} from '../ui/clipboard';
import {Menu, MenuManager} from '../ui/menu';
import {CommandManager} from '../ui/command';
import {DocumentManager} from '../ui/document';
import {ModalManager} from '../ui/modal';
import {WindowManager} from '../ui/window';
import {Component} from '../component';
import {Module} from '../modules/module';
import {remote, shell} from 'electron';

/**
 * Main menu view
 */
@Component
class MainMenuView extends UIElement {
    private commandManager: CommandManager;
    private windowManager: WindowManager;
    private modalManager: ModalManager;
    private menuManager: MenuManager;
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
        super('main-menu');
        this.commandManager = commandManager;
        this.windowManager = windowManager;
        this.modalManager = modalManager;
        this.menuManager = menuManager;
        this.menu = this.menuManager.createMenu();
        this.buildFileMenu();
        this.buildEditMenu();
        this.buildViewMenu();
        this.buildModuleMenus();
        this.buildToolsMenu();
        this.buildWindowMenu();
        this.buildHelpMenu();
        this.buildProfileMenu();
        console.log('modules', moduleList);
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
                .item({id: 'file-openconnection', label: 'app:main-menu.file.open.connection', handler: () => this.onFileOpenConnection(), icon: 'file-open-connection', shortcut: 'Ctrl+Shift+O'})
                .separator()
                .item({id: 'file-openfile', label: 'app:main-menu.file.open.file', handler: () => this.onFileOpenFile(), icon: 'file-open-file', shortcut: 'Ctrl+O'})
            .popup()
            .separator()
            .item({id: 'file-close', label: 'app:main-menu.file.close', handler: () => this.onFileClose(), shortcut: 'Ctrl+F4'})
            .item({id: 'file-closeconnection', label: 'app:main-menu.file.close-connection', handler: () => this.onFileCloseConnection(), icon: 'file-close-connection', shortcut: 'Ctrl+Shift+F4'})
            .separator()
            .item({id: 'file-save', label: 'app:main-menu.file.save', handler: () => this.onFileSave(), icon: 'file-save', shortcut: 'Ctrl+S'})
            .item({id: 'file-saveas', label: 'app:main-menu.file.save-as', handler: () => this.onFileSaveAs()})
            .item({id: 'file-saveall', label: 'app:main-menu.file.save-all', handler: () => this.onFileSaveAll(), icon: 'file-save-all', shortcut: 'Ctrl+Shift+S'})
            .separator()
            .popup('app:main-menu.file.source-control.label')
                // TODO
            .popup()
            .separator()
            .item({id: 'file-pagesetup', label: 'app:main-menu.file.page-setup', handler: () => this.onFilePageSetup(), icon: 'file-page-setup'})
            .item({id: 'file-print', label: 'app:main-menu.file.print', handler: () => this.onFilePrint(), icon: 'file-print', shortcut: 'Ctrl+P'})
            .separator()
            .popup('app:main-menu.file.recent-connections', fileRecentConnectionsMenu)
            .popup('app:main-menu.file.recent-files', fileRecentFilesMenu)
            .separator()
            .item({id: 'file-exit', label: 'app:main-menu.file.exit', handler: () => this.onFileExit(), icon: 'file-exit', shortcut: 'Alt+F4'})
        .popup();
    }

    /**
     * Build the edit menu
     */
    private buildEditMenu(): void {
        this.menu.popup('app:main-menu.edit.label')
            .popup('app:main-menu.edit.goto.label')
                .item({id: 'edit-gotoline', label: 'app:main-menu.edit.goto.line', handler: () => this.onEditGotoLine(), shortcut: 'Ctrl+G'})
                .item({id: 'edit-gotofunction', label: 'app:main-menu.edit.goto.function', handler: () => this.onEditGotoFunction(), shortcut: 'Ctrl+Shift+G'})
                .item({id: 'edit-gotofile', label: 'app:main-menu.edit.goto.file', handler: () => this.onEditGotoFile(), shortcut: 'Ctrl+Alt+Shift+G'})
            .popup()
            .popup('app:main-menu.edit.find-replace.label')
            .popup()
            .separator()
            .item({id: 'edit-undo', label: 'app:main-menu.edit.undo', handler: () => this.onEditUndo(), icon: 'edit-undo', shortcut: 'Ctrl+Z'})
            .item({id: 'edit-redo', label: 'app:main-menu.edit.redo', handler: () => this.onEditRedo(), icon: 'edit-redo', shortcut: 'Ctrl+Y'})
            .separator()
            .item({id: 'edit-cut', label: 'app:main-menu.edit.cut', handler: () => this.onEditCut(), icon: 'edit-cut', shortcut: 'Ctrl+X'})
            .item({id: 'edit-copy', label: 'app:main-menu.edit.copy', handler: () => this.onEditCopy(), icon: 'edit-copy', shortcut: 'Ctrl+C'})
            .item({id: 'edit-paste', label: 'app:main-menu.edit.paste', handler: () => this.onEditPaste(), icon: 'edit-paste', shortcut: 'Ctrl+V'})
            .item({id: 'edit-delete', label: 'app:main-menu.edit.delete', handler: () => this.onEditDelete(), icon: 'edit-delete', shortcut: 'Del'})
            .separator()
            .item({id: 'edit-selectall', label: 'app:main-menu.edit.select-all', handler: () => this.onEditSelectAll(), icon: 'edit-select-all', shortcut: 'Ctrl+A'})
        .popup();
    }

    /**
     * Build the view menu
     */
    private buildViewMenu(): void {
        this.menu.popup('app:main-menu.view.label')
            .item({label: 'app:main-menu.view.host-explorer', handler: () => this.onViewHostExplorer(), icon: 'view-host-explorer', shortcut: 'Ctrl+Alt+L'})
            .item({label: 'app:main-menu.view.network-explorer', handler: () => this.onViewNetworkExplorer(), icon: 'view-network-explorer', shortcut: 'Ctrl+M'})
            .separator()
            .item({label: 'app:main-menu.view.bookmark-window', handler: () => this.onViewBookmarkWindow(), icon: 'view-bookmark-window', shortcut: 'Ctrl+K'})
            .item({label: 'app:main-menu.view.call-hierarchy', handler: () => this.onViewCallHierarchy(), icon: 'view-call-hierarchy', shortcut: 'Ctrl+Alt+K'})
            .item({label: 'app:main-menu.view.object-browser', handler: () => this.onViewObjectBrowser(), icon: 'view-object-browser', shortcut: 'Ctrl+Alt+J'})
            .separator()
            .item({label: 'app:main-menu.view.command-window', handler: () => this.onViewCommandWindow(), icon: 'view-command-window', shortcut: 'Alt+0'})
            .item({label: 'app:main-menu.view.error-list', handler: () => this.onViewErrorList(), icon: 'view-error-list', shortcut: 'Alt+1'})
            .item({label: 'app:main-menu.view.output', handler: () => this.onViewOutput(), icon: 'view-output', shortcut: 'Alt+2'})
            .item({label: 'app:main-menu.view.notifications', handler: () => this.onViewNotifications(), icon: 'view-notifications', shortcut: 'Alt+3'})
            .item({label: 'app:main-menu.view.chat', handler: () => this.onViewChat(), icon: 'view-chat', shortcut: 'Alt+4'})
            .separator()
            .popup('app:main-menu.view.toolbars.label')
                // TODO: retrieve available toolbars from modules
                .item({id: 'view-toolbarsstandard', label: 'app:main-menu.view.toolbars.standard', handler: () => this.onViewToolbar('standard'), icon: 'menuitem-checked'})
            .popup()
            .item({id: 'view-fullscreen', label: 'app:main-menu.view.fullscreen', handler: () => this.onViewFullScreen(), icon: 'view-fullscreen', shortcut: 'Alt+Shift+Enter'})
            .item({id: 'view-allwindows', label: 'app:main-menu.view.all-windows', handler: () => this.onViewAllWindows(), icon: 'view-all-windows', shortcut: 'Alt+Shift+M'})
            .separator()
            .item({id: 'view-navigatebackward', label: 'app:main-menu.view.navigate-backward', handler: () => this.onViewNavigateBackward(), icon: 'view-navigate-backward', shortcut: 'Ctrl+-'})
            .item({id: 'view-navigateforward', label: 'app:main-menu.view.navigate-forward', handler: () => this.onViewNavigateForward(), icon: 'view-navigate-forward', shortcut: 'Ctrl+Shift+-'})
        .popup();
    }

    /**
     * Build the module menus
     */
    private buildModuleMenus(): void {
        // TODO
    }

    /**
     * Build the tools menu
     */
    private buildToolsMenu(): void {
        this.menu.popup('app:main-menu.tools.label')
            .item({label: 'app:main-menu.tools.extensions', handler: () => this.onToolsExtensions(), icon: 'tools-extensions'})
            .separator()
            .item({label: 'app:main-menu.tools.customize', handler: () => this.onToolsCustomize(), icon: 'tools-customize'})
            .item({label: 'app:main-menu.tools.options', handler: () => this.onToolsOptions(), icon: 'tools-options'})
        .popup();
    }

    /**
     * Build the window menu
     */
    private buildWindowMenu(): void {
        this.menu.popup('app:main-menu.window.label')
            .item({id: 'window-newwindow', label: 'app:main-menu.window.new-window', handler: () => this.onWindowNewWindow(), icon: 'window-new-window'})
            .item({id: 'window-split', label: 'app:main-menu.window.split', handler: () => this.onWindowSplit(), icon: 'window-split'})
            .separator()
            .item({id: 'window-float', label: 'app:main-menu.window.float', handler: () => this.onWindowFloat()})
            .item({id: 'window-dock', label: 'app:main-menu.window.dock', handler: () => this.onWindowDock()})
            .item({id: 'window-autohide', label: 'app:main-menu.window.auto-hide', handler: () => this.onWindowAutoHide()})
            .item({id: 'window-hide', label: 'app:main-menu.window.hide', handler: () => this.onWindowHide(), icon: 'window-hide'})
            .separator()
            .item({label: 'app:main-menu.window.pin-tab', handler: () => this.onWindowPinTab(), icon: 'window-pin-tab'})
            .separator()
            .item({label: 'app:main-menu.window.save-window-layout', handler: () => this.onWindowSaveWindowLayout()})
            .popup('app:main-menu.window.apply-window-layout.label')
                .item({label: 'app:main-menu.window.apply-window-layout.none-saved'})
            .popup()
            .item({label: 'app:main-menu.window.manage-window-layouts', handler: () => this.onWindowManageWindowLayouts()})
            .item({label: 'app:main-menu.window.reset-window-layout', handler: () => this.onWindowResetWindowLayout()})
            .separator()
            .item({id: 'window-autohideall', label: 'app:main-menu.window.auto-hide-all', handler: () => this.onWindowAutoHideAll()})
            .item({id: 'window-newhorizontaltabgroup', label: 'app:main-menu.window.new-horizontal-tab-group', handler: () => this.onWindowNewHorizontalTabGroup(), icon: 'window-new-horizontal-tab-group'})
            .item({id: 'window-newverticaltabgroup', label: 'app:main-menu.window.new-vertical-tab-group', handler: () => this.onWindowNewVerticalTabGroup(), icon: 'window-new-vertical-tab-group'})
            .item({id: 'window-closeall', label: 'app:main-menu.window.close-all-documents', handler: () => this.onWindowCloseAllDocuments(), icon: 'window-close-all-documents'})
            .separator()
            // TODO: list of documents opened
            .item({label: 'app:main-menu.window.windows', handler: () => this.onWindowWindows()})
        .popup();
    }

    /**
     * Build the help menu
     */
    private buildHelpMenu(): void {
        this.menu.popup('app:main-menu.help.label')
            .popup('app:main-menu.help.feedback.label')
                .item({label: 'app:main-menu.help.feedback.report-bug', handler: () => this.onHelpFeedbackReportBug(), icon: 'help-feedback-report-bug'})
            .popup()
            .separator()
            .item({label: 'app:main-menu.help.view', handler: () => this.onHelpShow(), icon: 'help-view', shortcut: 'F1'})
            .separator()
            .item({label: 'app:main-menu.help.about', handler: () => this.onHelpAbout()})
        .popup();
    }

    /**
     * Build the profile menu
     */
    private buildProfileMenu(): void {
        this.menu.popupText('<username>')
            .item({id: 'profile-preferences', label: 'app:main-menu.profile.preferences', handler: () => this.onProfilePreferences()})
            .item({id: 'profile-rights', label: 'app:main-menu.profile.rights', handler: () => this.onProfileRights()})
            .separator()
            .item({id: 'profile-logout', label: 'app:main-menu.profile.logout', handler: () => this.onProfileLogout()})
        .popup();
    }

    /**
     * Callback triggered when File => Open => Connection is selected
     */
    private onFileOpenConnection(): void {
        console.warn('File => Open => Connection not implemented');
    }

    /**
     * Callback triggered when File => Open => File is selected
     */
    private onFileOpenFile(): void {
        console.warn('File => Open => File not implemented');
    }

    /**
     * Callback triggered when File => Close is selected
     */
    private onFileClose(): void {
        console.warn('File => Close not implemented');
    }

    /**
     * Callback triggered when File => Close Connection is selected
     */
    private onFileCloseConnection(): void {
        console.warn('File => Close Connection not implemented');
    }

    /**
     * Callback triggered when File => Save is selected
     */
    private onFileSave(): void {
        console.warn('File => Save not implemented');
    }

    /**
     * Callback triggered when File => Save As is selected
     */
    private onFileSaveAs(): void {
        console.warn('File => Save As not implemented');
    }

    /**
     * Callback triggered when File => Save All is selected
     */
    private onFileSaveAll(): void {
        console.warn('File => Save All not implemented');
    }

    /**
     * Callback triggered when File => Page Setup is selected
     */
    private onFilePageSetup(): void {
        console.warn('File => Page Setup not implemented');
    }

    /**
     * Callback triggered when File => Print is selected
     */
    private onFilePrint(): void {
        console.warn('File => Print not implemented');
    }

    /**
     * Callback triggered when File => Exit is selected
     */
    private onFileExit(): void {
       remote.getCurrentWindow().close();
    }

    /**
     * Callback triggered when Edit => Go To => Line is selected
     */
    private onEditGotoLine(): void {
        console.warn('Edit => Go To => Line not implemented');
    }

    /**
     * Callback triggered when Edit => Go To => Function is selected
     */
    private onEditGotoFunction(): void {
        console.warn('Edit => Go To => Function not implemented');
    }

    /**
     * Callback triggered when Edit => Go To => File is selected
     */
    private onEditGotoFile(): void {
        console.warn('Edit => Go To => File not implemented');
    }

    /**
     * Callback triggered when Edit => Undo is selected
     */
    private onEditUndo(): void {
        console.warn('Edit => Undo not implemented');
    }

    /**
     * Callback triggered when Edit => Redo is selected
     */
    private onEditRedo(): void {
        console.warn('Edit => Redo not implemented');
    }

    /**
     * Callback triggered when Edit => Cut is selected
     */
    private onEditCut(): void {
        console.warn('Edit => Cut not implemented');
    }

    /**
     * Callback triggered when Edit => Copy is selected
     */
    private onEditCopy(): void {
        console.warn('Edit => Copy not implemented');
    }

    /**
     * Callback triggered when Edit => Paste is selected
     */
    private onEditPaste(): void {
        console.warn('Edit => Paste not implemented');
    }

    /**
     * Callback triggered when Edit => Delete is selected
     */
    private onEditDelete(): void {
        console.warn('Edit => Delete not implemented');
    }

    /**
     * Callback triggered when Edit => Select All is selected
     */
    private onEditSelectAll(): void {
        console.warn('Edit => Select All not implemented');
    }

    /**
     * Callback triggered when View => Host Explorer is selected
     */
    private onViewHostExplorer(): void {
        this.windowManager.openWindow('host-explorer');
    }

    /**
     * Callback triggered when View => Network Explorer is selected
     */
    private onViewNetworkExplorer(): void {
        this.windowManager.openWindow('network-explorer');
    }

    /**
     * Callback triggered when View =>    is selected
     */
    private onViewBookmarkWindow(): void {
        console.warn('View => Bookmark Window not implemented');
    }

    /**
     * Callback triggered when View => Call Hierarchy is selected
     */
    private onViewCallHierarchy(): void {
        console.warn('View => Call Hierarchy not implemented');
    }

    /**
     * Callback triggered when View => Object Browser is selected
     */
    private onViewObjectBrowser(): void {
        console.warn('View => Object Browser not implemented');
    }

    /**
     * Callback triggered when View => Command Window is selected
     */
    private onViewCommandWindow(): void {
        console.warn('View => Command Window not implemented');
    }

    /**
     * Callback triggered when View => Error List is selected
     */
    private onViewErrorList(): void {
        this.windowManager.openWindow('error-list');
        console.warn('View => Error List not implemented');
    }

    /**
     * Callback triggered when View => Output is selected
     */
    private onViewOutput(): void {
        console.warn('View => Output not implemented');
    }

    /**
     * Callback triggered when View => Notifications is selected
     */
    private onViewNotifications(): void {
        console.warn('View => Notifications not implemented');
    }

    /**
     * Callback triggered when View => Chat is selected
     */
    private onViewChat(): void {
        console.warn('View => Chat not implemented');
    }

    /**
     * Callback triggered when View => Toolbars => ? is selected
     * @param toolbarId Toolbar identifier
     */
    private onViewToolbar(toolbarId: string): void {
        console.warn('View => Toolbar => ' + toolbarId.substr(0, 1).toUpperCase() + toolbarId.substr(1) + ' not implemented');
    }

    /**
     * Callback triggered when View => Full Screen is selected
     */
    private onViewFullScreen(): void {
        let applicationElement: Element = <Element> document.body.querySelector('application');
        let browserWindow: Electron.BrowserWindow = remote.getCurrentWindow();
        let fullScreen: boolean = !browserWindow.isFullScreen();

        if (fullScreen) {
            applicationElement.setAttribute('full-screen', '');
        } else {
            applicationElement.removeAttribute('full-screen');
        }

        browserWindow.setFullScreen(fullScreen);
    }

    /**
     * Callback triggered when View => All Windows is selected
     */
    private onViewAllWindows(): void {
        console.warn('View => All Windows not implemented');
    }

    /**
     * Callback triggered when View => Navigate Backward is selected
     */
    private onViewNavigateBackward(): void {
        console.warn('View => Navigate Backward not implemented');
    }

    /**
     * Callback triggered when View => Navigte Forward is selected
     */
    private onViewNavigateForward(): void {
        console.warn('View => Navigate Forward not implemented');
    }

    /**
     * Callback triggered when Tools => Extensions is selected
     */
    private onToolsExtensions(): void {
        console.warn('Tools => Extensions not implemented');
    }

    /**
     * Callback triggered when Tools => Customize is selected
     */
    private onToolsCustomize(): void {
        console.warn('Tools => Customize not implemented');
    }

    /**
     * Callback triggered when Tools => Options is selected
     */
    private onToolsOptions(): void {
        console.warn('Tools => Options not implemented');
    }

    /**
     * Callback triggered when Window => New Window is selected
     */
    private onWindowNewWindow(): void {
        console.warn('Window => New Window not implemented');
    }

    /**
     * Callback triggered when Window => Split is selected
     */
    private onWindowSplit(): void {
        console.warn('Window => Split not implemented');
    }

    /**
     * Callback triggered when Window =>  is selected
     */
    private onWindowFloat(): void {
        console.warn('Window => Float not implemented');
    }

    /**
     * Callback triggered when Window => Dock is selected
     */
    private onWindowDock(): void {
        console.warn('Window => Dock not implemented');
    }

    /**
     * Callback triggered when Window => Auto Hide is selected
     */
    private onWindowAutoHide(): void {
        console.warn('Window => Auto Hide not implemented');
    }

    /**
     * Callback triggered when Window => New Horizontal Tab Group is selected
     */
    private onWindowNewHorizontalTabGroup(): void {
        console.warn('Window => New Horizontal Tab Group not implemented');
    }

    /**
     * Callback triggered when Window => New Vertical Tab Group is selected
     */
    private onWindowNewVerticalTabGroup(): void {
        console.warn('Window => New Vertical Tab Group not implemented');
    }

    /**
     * Callback triggered when Window => Hide is selected
     */
    private onWindowHide(): void {
        console.warn('Window => Hide not implemented');
    }

    /**
     * Callback triggered when Window => Pin Tab is selected
     */
    private onWindowPinTab(): void {
        console.warn('Window => Pin Tab not implemented');
    }

    /**
     * Callback triggered when Window => Save Window Layout is selected
     */
    private onWindowSaveWindowLayout(): void {
        console.warn('Window => Save Window Layout not implemented');
    }

    /**
     * Callback triggered when Window => Manage Window Layouts is selected
     */
    private onWindowManageWindowLayouts(): void {
        console.warn('Window => Manage Window Layouts not implemented');
    }

    /**
     * Callback triggered when Window => Reset Window Layout is selected
     */
    private onWindowResetWindowLayout(): void {
        console.warn('Window => Reset Window Layout not implemented');
    }

    /**
     * Callback triggered when Window => Auto Hide All is selected
     */
    private onWindowAutoHideAll(): void {
        console.warn('Window => Auto Hide All not implemented');
    }

    /**
     * Callback triggered when Window => Close All Documents is selected
     */
    private onWindowCloseAllDocuments(): void {
        console.warn('Window => Close All Documents not implemented');
    }

    /**
     * Callback triggered when Window => Windows is selected
     */
    private onWindowWindows(): void {
        console.warn('Window => Windows not implemented');
    }

    /**
     * Callback triggered when Help => Feedback => Report Bug is selected
     */
    private onHelpFeedbackReportBug(): void {
        shell.openExternal('https://github.com/pcxdbg/pcxdbg/issues/new');
    }

    /**
     * Callback triggered when Help => Show is selected
     */
    private onHelpShow(): void {
        console.warn('Help => Show not implemented');
    }

    /**
     * Callback triggered when Help => About is selected
     */
    private onHelpAbout(): void {
        this.modalManager.showModal('about');
    }

    /**
     * Callback triggered when Profile => Preferences is selected
     */
    private onProfilePreferences(): void {
        console.warn('Profile => Preferences not implemented');
    }

    /**
     * Callback triggered when Profile => Rights is selected
     */
    private onProfileRights(): void {
        console.warn('Profile => Rights not implemented');
    }

    /**
     * Callback triggered when Profile => Logout is selected
     */
    private onProfileLogout(): void {
        console.warn('Profile => Logout not implemented');
    }

}

export {
    MainMenuView
};
