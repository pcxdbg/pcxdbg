import {Toolbar} from '../../ui';
import {Component} from '../../component';

/**
 * Standard toolbar
 */
@Component
class StandardToolbar extends Toolbar {

    /**
     * Class constructor
     */
    constructor() {
        super();

        this.item({label: 'app:toolbar.standard.navigate-backward', icon: 'view-navigate-backward', command: 'navigation.backward'})
            .item({label: 'app:toolbar.standard.navigate-forward', icon: 'view-navigate-forward', command: 'navigation.forward'})
            .separator()
            .item({label: 'app:toolbar.standard.open-file', icon: 'file-open-file', command: 'file.open'})
            .item({label: 'app:toolbar.standard.save', icon: 'file-save', command: 'file.save'})
            .item({label: 'app:toolbar.standard.save-all', icon: 'file-save-all', command: 'file.save.all'})
            .separator()
            .item({label: 'app:toolbar.standard.cut', icon: 'edit-cut', command: 'clipboard.cut'})
            .item({label: 'app:toolbar.standard.copy', icon: 'edit-copy', command: 'clipboard.copy'})
            .item({label: 'app:toolbar.standard.paste', icon: 'edit-paste', command: 'clipboard.paste'})
            .separator()
            .item({label: 'app:toolbar.standard.undo', icon: 'edit-undo', command: 'action.undo'})
            .item({label: 'app:toolbar.standard.redo', icon: 'edit-redo', command: 'action.redo'})
        ;
    }

}

export {
    StandardToolbar
};
