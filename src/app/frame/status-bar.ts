import {Icon, IconManager, UIElement} from '../../ui';
import {Component} from '../../component';

/**
 * Status bar view
 */
@Component
class StatusBarView extends UIElement {
    private static HTML: string = `
        <status-bar-backgroundtasks i18n="[title]app:status-bar.background-tasks"></status-bar-backgroundtasks>
        <status-bar-label>Ready</status-bar-label>
        <div class="debug-info">
            TODO: debug-info
        </div>
        <div class="edit-info">
            <div class="line">Ln 22</div>
            <div class="column">Col 33</div>
            <div class="character">Ch 4</div>
        </div>
        <status-bar-resizer></status-bar-resizer>
    `;

    /**
     * Class constructor
     * @param iconManager Icon manager
     */
    constructor(iconManager: IconManager) {
        super('status-bar', StatusBarView.HTML);

        this.element('status-bar-backgroundtasks')
            .attach(iconManager.createIcon(16, 16, 'status-bar-background-tasks'))
            .click(() => this.onBackgroundTasks())
        ;
        this.element('status-bar-resizer')
            .attach(iconManager.createIcon(16, 16, 'status-bar-grip'))
        ;

        this.applyTranslations();
    }

    /**
     * Set the label
     * @param labelId         Label identifier
     * @param labelParameters Label parameters
     */
    setLabel(labelId: string, labelParameters?: {[parameterName: string]: string}): void {
        this.element('status-bar-label').i18n(labelId, labelParameters).applyTranslations();
    }

    /**
     * Set the label text
     * @param labelText Label text
     */
    setLabelText(labelText: string): void {
        this.element('status-bar-label').i18n().text(labelText);
    }

    /**
     * Event triggered when clicking on the background tasks icon
     */
    private onBackgroundTasks(): void {
        console.warn('Background tasks not implemented');
    }

}

export {
    StatusBarView
};
