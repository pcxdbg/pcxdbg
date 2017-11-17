import {UIElement} from './element';

/**
 * List column definition
 * @param <T> Element type
 */
interface ListColumnDefinition<T> {
    id: string;
    label?: string;
    labelParameters?: {[parameterName: string]: string};
    labelText?: string;
    className?: string;
    sortable?: boolean | {(lhs: T, rhs: T): number};
    provider?: {(item: T, cell: UIElement): void};
}

/**
 * List item definition
 */
interface ListItemDefinition<T> {
    click?: {(item: T): void};
    provider?: {(item: T, row: UIElement): void};
}

/**
 * List
 * @param <T> Element type
 */
class List<T> extends UIElement {
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
        let columnElement: UIElement = new UIElement('th');
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
        let rowElement: UIElement = new UIElement('tr');

        rowElement.click(() => this.onItemClick(rowElement, item, definition));

        this.columnDefinitions.forEach(columnDefinition => {
            let cellElement: UIElement = new UIElement('td');
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
    List,
    ListColumnDefinition,
    ListItemDefinition
};
