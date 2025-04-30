import TreeStore from '@/entities/TreeStore/model/TreeStore'
import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStoreItem } from '@/entities/TreeStore/types/TreeStoreItem'

describe('TreeTest', () => {
  const items: TreeStoreItem[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: 2, parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: 2, label: 'Айтем 4' },
    { id: 5, parent: 2, label: 'Айтем 5' },
    { id: 6, parent: 2, label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ]

  let ts: TreeStore

  beforeEach(() => {
    ts = new TreeStore(items)
  })

  it('getAll() должен вернуть все айтемы', () => {
    expect(ts.getAll()).toEqual(items)
  })

  it('getItem(id) должен вернуть айтем по айди', () => {
    expect(ts.getItem(7)).toEqual({ id: 7, parent: 4, label: 'Айтем 7' })
    expect(ts.getItem(3)).toEqual({ id: 3, parent: 1, label: 'Айтем 3' })
    expect(ts.getItem(999)).toBeUndefined()
  })

  it('getChildren(id) должен вернуть всех потомков айтема по id', () => {
    expect(ts.getChildren(1)).toEqual([
      { id: 2, parent: 1, label: 'Айтем 2' },
      { id: 3, parent: 1, label: 'Айтем 3' },
    ])
    expect(ts.getChildren(4)).toEqual([
      { id: 7, parent: 4, label: 'Айтем 7' },
      { id: 8, parent: 4, label: 'Айтем 8' },
    ])
    expect(ts.getChildren(5)).toEqual([])
  })

  it('getAllChildren(id) должен вернуть всех потомков, даже не прямых', () => {
    expect(ts.getAllChildren(2)).toEqual([
      { id: 4, parent: 2, label: 'Айтем 4' },
      { id: 5, parent: 2, label: 'Айтем 5' },
      { id: 6, parent: 2, label: 'Айтем 6' },
      { id: 7, parent: 4, label: 'Айтем 7' },
      { id: 8, parent: 4, label: 'Айтем 8' },
    ])

    expect(ts.getAllChildren(4)).toEqual([
      { id: 7, parent: 4, label: 'Айтем 7' },
      { id: 8, parent: 4, label: 'Айтем 8' },
    ])

    expect(ts.getAllChildren(5)).toEqual([])
  })

  it('getAllParents(id) должен вернуть всех родителей до первого', () => {
    expect(ts.getAllParents(7)).toEqual([
      { id: 4, parent: 2, label: 'Айтем 4' },
      { id: 2, parent: 1, label: 'Айтем 2' },
      { id: 1, parent: null, label: 'Айтем 1' },
    ])

    expect(ts.getAllParents(4)).toEqual([
      { id: 2, parent: 1, label: 'Айтем 2' },
      { id: 1, parent: null, label: 'Айтем 1' },
    ])

    expect(ts.getAllParents(1)).toEqual([])
  })
  it('addItem(item) должен добавить новый айтем', () => {
    const newItem = { id: 9, parent: 1, label: 'Айтем 9' }
    ts.addItem(newItem)

    expect(ts.getItem(9)).toEqual(newItem)
  })

  it('addItem(item) не должен добавить айтем с уже существующим id', () => {
    const duplicateItem = { id: 2, parent: 1, label: 'Дубликат айтема 2' }
    ts.addItem(duplicateItem)

    expect(ts.getItem(2)).toEqual({ id: 2, parent: 1, label: 'Айтем 2' })
  })

  it('removeItem(id) должен удалить айтем', () => {
    ts.removeItem(5)

    expect(ts.getItem(5)).toBeUndefined()
  })

  it('removeItem(id) не должен упасть при попытке удалить несуществующий айтем', () => {
    expect(() => ts.removeItem(999)).not.toThrow()
  })

  it('getAgGridTableItems() должен вернуть все элементы для ag-Grid', () => {
    const agGridItems = ts.getAgGridTableItems()

    expect(agGridItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, name: 'Айтем 1', path: ['1'] }),
        expect.objectContaining({ id: 2, name: 'Айтем 2', path: ['1', '2'] }),
        expect.objectContaining({ id: 7, name: 'Айтем 7', path: ['1', '2', '4', '7'] }),
      ]),
    )
  })

  it('getAgGridTableItem(id) должен вернуть конкретный элемент для ag-Grid', () => {
    const agGridItem = ts.getAgGridTableItem(7)

    expect(agGridItem).toEqual({
      id: 7,
      name: 'Айтем 7',
      path: ['1', '2', '4', '7'],
    })
  })
})
