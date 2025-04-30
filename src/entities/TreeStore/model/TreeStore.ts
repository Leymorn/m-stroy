import { type TreeStoreItem } from '../types/TreeStoreItem'
import { type AgGridTableItem } from '../types/AgGridTableItem'

class TreeStore {
  public items: TreeStoreItem[]
  public itemMap: Map<string, TreeStoreItem>
  public childrenMap: Map<string, TreeStoreItem[]>
  public parentsMap: Map<string, TreeStoreItem[]>
  public agGridTableItemsMap: Map<string, AgGridTableItem>

  constructor(items: TreeStoreItem[]) {
    this.items = [...items]
    this.itemMap = new Map()
    this.childrenMap = new Map()
    this.parentsMap = new Map()
    this.agGridTableItemsMap = new Map()

    this.setMaps()
  }

  private setMaps() {
    this.itemMap.clear()
    this.childrenMap.clear()
    this.parentsMap.clear()
    this.agGridTableItemsMap.clear()

    this.items.forEach((item) => {
      this.itemMap.set(String(item.id), item)
      this.setChildrenMap(item)
      this.setAgGridTableItemsMap(item)
      this.setParentsMap(item)
    })
  }

  setChildrenMap(item: TreeStoreItem): void {
    if (!item.parent) return
    if (!this.childrenMap.has(String(item.parent))) {
      this.childrenMap.set(String(item.parent), [])
    }
    this.childrenMap.get(String(item.parent))?.push(item)
  }

  setParentsMap(item: TreeStoreItem) {
    const parentId = item.parent

    if (!parentId) {
      this.parentsMap.set(String(item.id), [item])
    } else if (this.parentsMap.has(String(parentId))) {
      const parent = this.parentsMap.get(String(parentId))

      if (parent) {
        this.parentsMap.set(String(item.id), [...parent, item])
      }
    }
  }

  setAgGridTableItemsMap(item: TreeStoreItem): void {
    const parentId = item.parent

    if (parentId === null) {
      this.agGridTableItemsMap.set(String(item.id), {
        id: item.id,
        name: item.label,
        path: [String(item.id)],
      })
    } else if (this.agGridTableItemsMap.has(String(parentId))) {
      const parentPath = this.agGridTableItemsMap.get(String(parentId))?.path

      if (parentPath) {
        const newPath = [...parentPath, String(item.id)]
        this.agGridTableItemsMap.set(String(item.id), {
          id: item.id,
          name: item.label,
          path: newPath,
        })
      }
    }
  }

  getAll(): TreeStoreItem[] {
    return this.items
  }

  getItem(id: number | string): TreeStoreItem | undefined {
    return this.itemMap.get(String(id))
  }

  getChildren(id: number | string): TreeStoreItem[] {
    return this.childrenMap.get(String(id)) || []
  }

  getAllChildren(id: number | string): TreeStoreItem[] {
    const result: TreeStoreItem[] = []
    const collectChildren = (parentId: number | string) => {
      const children = this.getChildren(parentId)
      result.push(...children)
      children.forEach((child) => collectChildren(child.id))
    }

    collectChildren(+id)
    return result
  }

  getAllParents(id: number | string): TreeStoreItem[] {
    const parents = this.parentsMap.get(String(id)) || []
    return parents.slice(0, -1).reverse()
  }

  getAgGridTableItems(): AgGridTableItem[] {
    return Array.from(this.agGridTableItemsMap.values())
  }

  getAgGridTableItem(id: number | string): AgGridTableItem | void {
    const item = this.agGridTableItemsMap.get(String(id))
    if (!item) {
      alert(`Айтем с id ${id} не найден`)
      return
    }
    return item
  }

  addItem(item: TreeStoreItem): void {
    if (this.itemMap.has(String(item.id))) {
      alert(`Айтем с id ${item.id} уже существует`)
      return
    }

    if (item.parent !== 'root' && !this.itemMap.has(String(item.parent))) {
      alert(`Родителя с id ${item.parent} не существует`)
      return
    }

    this.items.push(item)
    this.setMaps()
  }

  removeItem(id: number) {
    const item = this.itemMap.get(String(id))
    if (!item) {
      alert(`Айтем с id ${id} не найден`)
      return
    }

    this.items = this.items.filter((i) => i.id !== id)
    this.setMaps()
  }
}

export default TreeStore
