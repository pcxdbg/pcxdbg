import {Window, WindowManager} from '../../ui/window';
import {UIElement} from '../../ui/element';
import {Component} from '../../component';

/**
 * Memory manager
 */
@Component
class MemoryManager {

}

/**
 * Memory view
 */
@Component
class MemoryView extends Window {
    private static REGEXP_NONASCII: RegExp = /[\x00-\x1F\x7F-\xFF]/;
    private static HTML_TABLE: string = `
        <tbody></tbody>
    `;

    private tableElement: UIElement;
    private columns: number;
    private offset: number;
    private size: number;

    /**
     * Class constructor
     * @param memoryManager Memory manager
     */
    constructor(memoryManager: MemoryManager) {
        super({
            title: 'cpu:memory.title'
        });

        this.offset = 0x82000000;
        this.size = 0x400;
        this.columns = 32;
        this.tableElement = new UIElement('table', MemoryView.HTML_TABLE);
        this.tableElement.class('memory-view');

        for (let rowIndex: number = 0, rows: number = this.size / this.columns; rowIndex !== rows; ++rowIndex) {
            this.addRow(rowIndex);
        }

        this.attach(this.tableElement);
    }

    /**
     * Add a row
     * @param rowIndex Row index
     */
    private addRow(rowIndex: number): void {
        let cellAddr: HTMLTableDataCellElement = document.createElement('td');
        let cellIcon: HTMLTableDataCellElement = document.createElement('td');
        let cellData: HTMLTableDataCellElement = document.createElement('td');
        let cellChar: HTMLTableDataCellElement = document.createElement('td');
        let row: HTMLTableRowElement = document.createElement('tr');

        cellIcon.className = 'icon';
        cellAddr.className = 'addr';
        cellData.className = 'data';
        cellChar.className = 'char';

        cellAddr.innerText = this.hexFromData(this.offset + rowIndex * this.columns, undefined, true);

        for (let columnIndex: number = 0; columnIndex !== this.columns; ++columnIndex) {
            let spanData: HTMLSpanElement = document.createElement('span');
            let spanChar: HTMLSpanElement = document.createElement('span');
            let tempValue: number = Math.floor(Math.random() * 0xff);

            spanData.innerText = this.hexFromData(tempValue, 2);
            spanChar.innerText = this.charFromData(tempValue);

            [
                spanData,
                spanChar
            ].forEach(span => span.addEventListener('click', () => this.selectData(rowIndex, columnIndex), false));

            cellData.appendChild(spanData);
            cellChar.appendChild(spanChar);
        }

        row.addEventListener('click', () => this.selectRow(rowIndex), false);
        row.appendChild(cellIcon);
        row.appendChild(cellAddr);
        row.appendChild(cellData);
        row.appendChild(cellChar);

        this.tableElement.selectNativeElement<HTMLTableSectionElement>('tbody').appendChild(row);
    }

    /**
     * Event triggered when a row gets selected
     * @param rowIndex Row index
     */
    private selectRow(rowIndex: number): void {
        let selectedRow: HTMLTableRowElement;

        selectedRow = this.tableElement.selectNativeElement<HTMLTableRowElement>('tbody', 'tr[selected]');
        if (selectedRow) {
            selectedRow.removeAttribute('selected');
        }

        if (rowIndex !== -1) {
            console.log('hmpf');
            selectedRow = this.tableElement.selectNativeElement<HTMLTableRowElement>('tbody', 'tr:nth-child(' + (rowIndex + 1) + ')');
            selectedRow.setAttribute('selected', '');
        }
    }

    /**
     * Event triggered when data gets selected
     * @param rowIndex    Row index
     * @param columnIndex Column index
     */
    private selectData(rowIndex: number, columnIndex: number): void {
        // TODO
    }

    /**
     * Get a hex representation from a value
     * @param value Value
     * @param width String width
     * @param prefix Prefix the string with 0x
     * @return Hexadecimal representation
     */
    private hexFromData(value: number, width?: number, prefix?: boolean): string {
        let str: string = value.toString(16);
        let pfx: string = prefix ? '0x' : '';

        width = width || 8;

        if (width && str.length < width) {
            for (let i: number = 0, end: number = width - str.length; i !== end; ++i) {
                pfx += '0';
            }
        }

        return pfx + str;
    }

    /**
     * Get a character from an ASCII value
     * @param value Value
     * @return Character
     */
    private charFromData(value: number): string {
        let char: string = String.fromCharCode(value);
        if (MemoryView.REGEXP_NONASCII.test(char)) {
            return '.';
        }

        return char;
    }

}

export {
    MemoryView
};
