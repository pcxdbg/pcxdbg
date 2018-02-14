import {UIElement, UIElementBase} from '../../element';
import {ListColumnDefinition} from './list-column-definition';
import {ListItemDefinition} from './list-item-definition';
import {Component, Inject, Scope, ScopeType} from 'es-injection';

/**
 * List
 * @param <T> Item data type
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class List<T> extends UIElementBase {
    private static HTML: string = `
	    <table>
            <thead>
                <tr></tr>
            </thead>
            <tbody></tbody>
        </table>
    `;

    private columnDefinitions: ListColumnDefinition<T>[] = [];
    private columnsContainer: UIElement;
    private rowsContainer: UIElement;

    /**
     * Class constructor
     */
    constructor() {
        super('list', List.HTML);
        this.columnsContainer = this.element('table', 'thead', 'tr');
        this.rowsContainer = this.element('table', 'tbody');
    }

    /**
     * Add columns
     * @param columnDefinitions Column definitions
     * @return this
     */
    addColumns(...columnDefinitions: ListColumnDefinition<T>[]): List<T> {
        columnDefinitions.forEach(columnDefinition => this.addColumn(columnDefinition));
        return this;
    }

    /**
     * Add a column
     * @param columnDefinition Column definition
     * @return this
     */
    addColumn(columnDefinition: ListColumnDefinition<T>): List<T> {
        let columnElement: UIElement = new UIElementBase('th');
        let classNames: string[] = [columnDefinition.id];

        if (columnDefinition.className) {
            classNames.push(columnDefinition.className);
        }

        columnElement.class(...classNames);

        if (columnDefinition.sortable) {
            columnElement.attribute('can-sort', '');
        }

        if (columnDefinition.label) {
            columnElement.i18n(columnDefinition.label, columnDefinition.labelParameters).applyTranslations();
        } else if (columnDefinition.labelText) {
            columnElement.text(columnDefinition.labelText);
        }

        this.columnDefinitions.push(columnDefinition);
        this.columnsContainer.attach(columnElement);

        return this;
    }

    /**
     * Add an item
     * @param item       Item
     * @param definition Item definition
     * @return this
     */
    addItem(item: T, definition?: ListItemDefinition<T>): List<T> {
        let rowElement: UIElement = new UIElementBase('tr');

        rowElement.click(() => this.onItemClick(rowElement, item, definition));

        this.columnDefinitions.forEach(columnDefinition => {
            let cellElement: UIElement = new UIElementBase('td');
            let classNames: string[] = [columnDefinition.id];

            if (columnDefinition.className) {
                classNames.push(columnDefinition.className);
            }

            cellElement.class(...classNames);

            if (columnDefinition.provider) {
                columnDefinition.provider(item, cellElement);
            } else {
                cellElement.text(item[columnDefinition.id]);
            }

            rowElement.attach(cellElement);
        });

        if (definition && definition.provider) {
            definition.provider(item, rowElement);
        }

        this.rowsContainer.attach(rowElement);

        return this;
    }

    /**
     * Event triggered when a list row is clicked
     * @param rowElement Row element
     * @param item       Item
     * @param definition Item definition
     */
    private onItemClick(rowElement: UIElement, item: T, definition?: ListItemDefinition<T>): void {
        let selectedRow: UIElement = this.rowsContainer.element('tr[selected]');
        let change: boolean = !selectedRow || selectedRow.getNativeElement() !== rowElement.getNativeElement();

        if (change) {
            if (selectedRow) {
                selectedRow.removeAttribute('selected');
            }

            rowElement.attribute('selected', '');
            if (definition && definition.click) {
                definition.click(item);
            }
        }
    }

}

export {
    List
};
