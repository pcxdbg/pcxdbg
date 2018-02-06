import {UIElement} from './element';
import {UIDragAction, UIDragActionType} from './drag-action';

/**
 * Abstract user interface element (drag)
 */
interface AbstractUIElementDrag extends UIElement { }
abstract class AbstractUIElementDrag {

    /**
     * Make the element draggable
     * @param handler Handler
     * @param <T>     Drag action data type
     * @return this
     */
    draggable<T>(handler: (dragAction: UIDragAction<T>) => void): UIElement {
        let nativeElement: HTMLElement = this.getNativeElement();

        nativeElement.setAttribute('draggable', 'true');
        nativeElement.addEventListener('dragstart', e => {
            let dragAction: UIDragAction<T> = {
                type: UIDragActionType.MOVE
            };

            handler(dragAction);

            switch (dragAction.type) {
            case UIDragActionType.COPY:
                e.dataTransfer.dropEffect = 'copy';
                break;
            case UIDragActionType.LINK:
                e.dataTransfer.dropEffect = 'link';
                break;
            case UIDragActionType.MOVE:
                e.dataTransfer.dropEffect = 'move';
                break;
            default:
                throw new Error('unknown drag action type ' + dragAction.type);
            }

            console.log('drag start', e);
        });
        nativeElement.addEventListener('dragend', e => {
            let transferId: string = e.dataTransfer.getData('plain/text');
            //let dragData: DragData = UIElement.getAndRemoveDragData(transferId);

            console.log('dragging ended');
        });

        return this;
    }

    /**
     * Make the element a drop target
     * @return this
     */
    dropTarget(): UIElement {
        let nativeElement: HTMLElement = this.getNativeElement();

        nativeElement.addEventListener('dragover', e => {
            e.preventDefault();
            console.log('drag over', e);
        }, false);

        nativeElement.addEventListener('drop', e => {
            console.log('dropped', e);
        }, false);

        return this;
    }

}

export {
    AbstractUIElementDrag
};
