import { TreeStore } from "./TreeStore";

describe('TreeTest', () => {
    const items = [
        { id: 1, parent: 'root' },
        { id: 2, parent: 1, type: 'test' },
        { id: 3, parent: 1, type: 'test' },
        { id: 4, parent: 2, type: 'test' },
        { id: 5, parent: 2, type: 'test' },
        { id: 6, parent: 2, type: 'test' },
        { id: 7, parent: 4, type: null },
        { id: 8, parent: 4, type: null },
    ];

    let ts: TreeStore;

    beforeEach(() => {
        ts = new TreeStore(items);
    });

    test('getAll() should return all items', () => {
        expect(ts.getAll()).toEqual(items);
    });

    test('getItem(id) should return the item with the specified id', () => {
        expect(ts.getItem(7)).toEqual({ id: 7, parent: 4, type: null });
        expect(ts.getItem(3)).toEqual({ id: 3, parent: 1, type: 'test' });
        expect(ts.getItem(999)).toBeUndefined();
    });

    test('getChildren(id) should return all direct children of the item', () => {
        expect(ts.getChildren(1)).toEqual([
            { id: 2, parent: 1, type: 'test' },
            { id: 3, parent: 1, type: 'test' },
        ]);
        expect(ts.getChildren(4)).toEqual([
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ]);
        expect(ts.getChildren(5)).toEqual([]);
    });

    test('getAllChildren(id) should return all children, including nested ones', () => {
        expect(ts.getAllChildren(2)).toEqual([
            { id: 4, parent: 2, type: 'test' },
            { id: 5, parent: 2, type: 'test' },
            { id: 6, parent: 2, type: 'test' },
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ]);

        expect(ts.getAllChildren(4)).toEqual([
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ]);

        expect(ts.getAllChildren(5)).toEqual([]);
    });

    test('getAllParents(id) should return all parents up to the root', () => {
        expect(ts.getAllParents(7)).toEqual([
            { id: 4, parent: 2, type: 'test' },
            { id: 2, parent: 1, type: 'test' },
            { id: 1, parent: 'root' },
        ]);

        expect(ts.getAllParents(4)).toEqual([
            { id: 2, parent: 1, type: 'test' },
            { id: 1, parent: 'root' },
        ]);

        expect(ts.getAllParents(1)).toEqual([]);
    });
});