import {AttachableElement} from '../ui/element';
import {Menu, MenuManager} from '../ui/menu';
import {DocumentManager} from '../ui/document';
import {ModalManager} from '../ui/modal';
import {WindowManager} from '../ui/window';
import {Component} from '../component';
import {remote, shell} from 'electron';

/**
 * Main menu view
 */
@Component
class MainMenuView extends AttachableElement {
    private windowManager: WindowManager;
    private modalManager: ModalManager;
    private menuManager: MenuManager;
    private menu: Menu;

    /**
     * Class constructor
     * @param windowManager Window manager
     * @param modalManager  Modal manager
     * @param menuManager   Menu manager
     */
    constructor(windowManager: WindowManager, modalManager: ModalManager, menuManager: MenuManager) {
        super('main-menu');
        this.windowManager = windowManager;
        this.modalManager = modalManager;
        this.menuManager = menuManager;
        this.menu = this.buildMenu();
        this.menu.attachTo(this.selectContainer(null));
    }

    /**
     * Build the menu
     * @return Menu
     */
    private buildMenu(): Menu {
        let fileRecentConnectionsMenu: Menu = this.menuManager.createPopupMenu();
        let fileRecentFilesMenu: Menu = this.menuManager.createPopupMenu();

        return this.menuManager.createMenu()
            .popup('app:main-menu.file.label')
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
            .popup()
            .popup('app:main-menu.edit.label')
                .item({id: 'edit-undo', label: 'app:main-menu.edit.undo', handler: () => this.onEditUndo(), icon: 'edit-undo', shortcut: 'Ctrl+Z'})
                .item({id: 'edit-redo', label: 'app:main-menu.edit.redo', handler: () => this.onEditRedo(), icon: 'edit-redo', shortcut: 'Ctrl+Y'})
                .separator()
                .item({id: 'edit-cut', label: 'app:main-menu.edit.cut', handler: () => this.onEditCut(), icon: 'edit-cut', shortcut: 'Ctrl+X'})
                .item({id: 'edit-copy', label: 'app:main-menu.edit.copy', handler: () => this.onEditCopy(), icon: 'edit-copy', shortcut: 'Ctrl+C'})
                .item({id: 'edit-paste', label: 'app:main-menu.edit.paste', handler: () => this.onEditPaste(), icon: 'edit-paste', shortcut: 'Ctrl+V'})
                .item({id: 'edit-delete', label: 'app:main-menu.edit.delete', handler: () => this.onEditDelete(), icon: 'edit-delete', shortcut: 'Del'})
                .separator()
                .item({id: 'edit-selectall', label: 'app:main-menu.edit.select-all', handler: () => this.onEditSelectAll(), icon: 'edit-select-all', shortcut: 'Ctrl+A'})
            .popup()
            .popup('app:main-menu.view.label')
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
                    // TODO
                .popup()
                .item({id: 'view-fullscreen', label: 'app:main-menu.view.fullscreen', handler: () => this.onViewFullScreen(), icon: 'view-fullscreen', shortcut: 'Alt+Shift+Enter'})
                .separator()
                .item({id: 'view-navigatebackward', label: 'app:main-menu.view.navigate-backward', handler: () => this.onViewNavigateBackward(), icon: 'view-navigate-backward', shortcut: 'Ctrl+-'})
                .item({id: 'view-navigateforward', label: 'app:main-menu.view.navigate-forward', handler: () => this.onViewNavigateForward(), icon: 'view-navigate-forward', shortcut: 'Ctrl+Shift+-'})
            .popup()
            .popup('app:main-menu.debug.label')
                .popup('app:main-menu.debug.windows.label')
                    .item({id: 'debug-windows-breakpoints', label: 'app:main-menu.debug.windows.breakpoints', handler: () => this.onDebugWindowsBreakpoints(), icon: 'debug-windows-breakpoints', shortcut: 'Alt+F9'})
                    .item({id: 'debug-windows-output', label: 'app:main-menu.debug.windows.output', handler: () => this.onDebugWindowsOutput(), icon: 'debug-windows-output'})
                    .separator()
                    .item({id: 'debug-windows-watches', label: 'app:main-menu.debug.windows.watches', handler: () => this.onDebugWindowsWatches(), icon: 'debug-windows-watches'})
                    .item({id: 'debug-windows-auto', label: 'app:main-menu.debug.windows.autos', handler: () => this.onDebugWindowsAutos(), icon: 'debug-windows-autos'})
                    .item({id: 'debug-windows-locals', label: 'app:main-menu.debug.windows.locals', handler: () => this.onDebugWindowsLocals(), icon: 'debug-windows-locals', shortcut: 'Alt+4'})
                    .item({id: 'debug-windows-immediates', label: 'app:main-menu.debug.windows.immediates', handler: () => this.onDebugWindowsImmediates(), icon: 'debug-windows-immediates', shortcut: 'Ctrl+Alt+I'})
                    .separator()
                    .item({id: 'debug-windows-callstack', label: 'app:main-menu.debug.windows.call-stack', handler: () => this.onDebugWindowsCallStack(), icon: 'debug-windows-call-stack', shortcut: 'Alt+7'})
                    .item({id: 'debug-windows-threads', label: 'app:main-menu.debug.windows.threads', handler: () => this.onDebugWindowsThreads(), icon: 'debug-windows-threads', shortcut: 'Ctrl+Alt+H'})
                    .item({id: 'debug-windows-modules', label: 'app:main-menu.debug.windows.modules', handler: () => this.onDebugWindowsModules(), icon: 'debug-windows-modules', shortcut: 'Ctrl+Alt+U'})
                    .item({id: 'debug-windows-processes', label: 'app:main-menu.debug.windows.processes', handler: () => this.onDebugWindowsProcesses(), icon: 'debug-windows-processes', shortcut: 'Ctrl+Alt+Shift+P'})
                    .separator()
                    .item({id: 'debug-windows-memory', label: 'app:main-menu.debug.windows.memory', handler: () => this.onDebugWindowsMemory(), icon: 'debug-windows-memory'})
                    .item({id: 'debug-windows-disassembly', label: 'app:main-menu.debug.windows.disassembly', handler: () => this.onDebugWindowsDisassembly(), icon: 'debug-windows-disassembly'})
                    .item({id: 'debug-windows-registers', label: 'app:main-menu.debug.windows.registers', handler: () => this.onDebugWindowsRegisters(), icon: 'debug-windows-registers'})
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
                .item({id: 'debug-deleteallbreakpoints', label: 'app:main-menu.debug.delete-all-breakpoints', handler: () => this.onDebugDeleteAllBreakpoints(), icon: 'debug-delete-all-breakpoints', shortcut: 'Ctrl+Shift+F9'})
            .popup()
            .popup('app:main-menu.tools.label')
                .separator()
                .item({label: 'app:main-menu.tools.customize', handler: () => this.onToolsCustomize(), icon: 'tools-customize'})
                .item({label: 'app:main-menu.tools.options', handler: () => this.onToolsOptions(), icon: 'tools-options'})
            .popup()
            .popup('app:main-menu.window.label')
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
                .item({id: 'window-closeall', label: 'app:main-menu.window.close-all-documents', handler: () => this.onWindowCloseAllDocuments(), icon: 'window-close-all-documents'})
                .separator()
                // TODO: list of documents opened
                .item({label: 'app:main-menu.window.windows', handler: () => this.onWindowWindows()})
            .popup()
            .popup('app:main-menu.help.label')
                .popup('app:main-menu.help.feedback.label')
                    .item({label: 'app:main-menu.help.feedback.report-bug', handler: () => this.onHelpFeedbackReportBug(), icon: 'help-feedback-report-bug'})
                .popup()
                .separator()
                .item({label: 'app:main-menu.help.view', handler: () => this.onHelpShow(), icon: 'help-view', shortcut: 'F1'})
                .separator()
                .item({label: 'app:main-menu.help.about', handler: () => this.onHelpAbout()})
            .popup()
            .popupText('<username>')
                .item({id: 'profile-preferences', label: 'app:main-menu.profile.preferences', handler: () => this.onProfilePreferences()})
                .item({id: 'profile-rights', label: 'app:main-menu.profile.rights', handler: () => this.onProfileRights()})
                .separator()
                .item({id: 'profile-logout', label: 'app:main-menu.profile.logout', handler: () => this.onProfileLogout()})
            .popup()
        ;
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
     * Callback triggered when Debug => Windows => Breakpoints is selected
     */
    private onDebugWindowsBreakpoints(): void {
        console.warn('Debug => Windows => Breakpoints not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Output is selected
     */
    private onDebugWindowsOutput(): void {
        console.warn('Debug => Windows => Output not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Watches is selected
     */
    private onDebugWindowsWatches(): void {
        console.warn('Debug => Windows => Watches not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Autos is selected
     */
    private onDebugWindowsAutos(): void {
        console.warn('Debug => Windows => Autos not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Locals is selected
     */
    private onDebugWindowsLocals(): void {
        console.warn('Debug => Windows => Locals not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Immediates is selected
     */
    private onDebugWindowsImmediates(): void {
        console.warn('Debug => Windows => Immediates not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Call Stack is selected
     */
    private onDebugWindowsCallStack(): void {
        console.warn('Debug => Windows => Call Stack not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Threads is selected
     */
    private onDebugWindowsThreads(): void {
        console.warn('Debug => Windows => Threads not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Modules is selected
     */
    private onDebugWindowsModules(): void {
        console.warn('Debug => Windows => Modules not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Processes is selected
     */
    private onDebugWindowsProcesses(): void {
        console.warn('Debug => Windows => Processes not implemented');
    }

    /**
     * Callback triggered when Debug => Windows => Memory is selected
     */
    private onDebugWindowsMemory(): void {
        this.windowManager.openWindow('memory');
    }

    /**
     * Callback triggered when Debug => Windows => Disassembly is selected
     */
    private onDebugWindowsDisassembly(): void {
        this.windowManager.openWindow('disassembly');
    }

    /**
     * Callback triggered when Debug => Windows => Registers is selected
     */
    private onDebugWindowsRegisters(): void {
        console.warn('Debug => Windows => Registers not implemented');
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

    /**
     * Callback triggered when Debug => Delete All Breakpoints is selected
     */
    private onDebugDeleteAllBreakpoints(): void {
        console.warn('Debug => Delete All Breakpoints not implemented');
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
