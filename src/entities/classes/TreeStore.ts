import { Item } from "../types/Item";

class TreeStore {
    public items: Item[];
    public itemMap: Map<number | string, Item>;
    public childrenMap: Map<number | string, Item[]>;

    constructor(items: Item[]) {
        this.items = items;
        this.itemMap = new Map();
        this.childrenMap = new Map();

        this.items.forEach(item => {
            this.itemMap.set(item.id, item);

            if (!this.childrenMap.has(item.parent)) {
                this.childrenMap.set(item.parent, []);
            }
            this.childrenMap.get(item.parent)?.push(item);
        });
    }

    getAll(): Item[] {
        return this.items;
    }

    getItem(id: number | string): Item | undefined {
        return this.itemMap.get(id);
    }

    getChildren(id: number | string): Item[] {
        return this.childrenMap.get(id) || [];
    }

    getAllChildren(id: number | string): Item[] {
        const result: Item[] = [];
        const collectChildren = (parentId: number | string) => {
            const children = this.getChildren(parentId);
            result.push(...children);
            children.forEach(child => collectChildren(child.id));
        };

        collectChildren(id);
        return result;
    }

    getAllParents(id: number | string): Item[] {
        const result: Item[] = [];
        let currentItem = this.getItem(id);

        while (currentItem && currentItem.parent !== 'root') {
            const parent = this.getItem(currentItem.parent);
            if (parent) {
                result.push(parent);
            }
            currentItem = parent;
        }

        return result;
    }
}

export {TreeStore}