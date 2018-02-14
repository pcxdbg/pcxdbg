import {TreeItem} from './tree-item';

describe('Tree item', () => {

    it('is an element with the tree-item tag name', () => {
        // given
        let treeItem: TreeItem<any, any> = new TreeItem();
        // expect
        expect(treeItem.getNativeElement().tagName).toEqual('TREE-ITEM');
    });

});
