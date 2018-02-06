import {Component, Inject} from 'injection';
import {ConnectionManager} from 'network';
import {Icon, IconManager, UIElement, UIElementBase} from 'ui';

/**
 * Status bar view
 */
@Component
class StatusBarView extends UIElementBase {
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

    private label: UIElement;

    /**
     * Class constructor
     */
    constructor(iconManager: IconManager) {
        super('status-bar', StatusBarView.HTML);
        this.label = this.element('status-bar-label');
        this.applyTranslations();
    }

    /**
     * Set the icon manager
     * @param iconManager Icon manager
     */
    @Inject
    setIconManager(iconManager: IconManager): void {
        this.element('status-bar-backgroundtasks')
            .click(() => this.onBackgroundTasks())
            .attach(iconManager.createIcon(16, 16, 'status-bar-background-tasks'))
        ;
        this.element('status-bar-resizer')
            .attach(iconManager.createIcon(16, 16, 'status-bar-grip'))
        ;
    }

    /**
     * Set the connection manager
     * @param connectionManager Connection manager
     */
    @Inject
    setConnectionManager(connectionManager: ConnectionManager): void {
        // TODO: register event handlers
    }

    /**
     * Set the label
     * @param labelId         Label identifier
     * @param labelParameters Label parameters
     */
    setLabel(labelId: string, labelParameters?: {[parameterName: string]: string}): void {
        this.label.i18n(labelId, labelParameters).applyTranslations();
    }

    /**
     * Set the label text
     * @param labelText Label text
     */
    setLabelText(labelText: string): void {
        this.label.i18n();
        this.label.text(labelText);
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
