<script setup lang="ts">
import { Item } from '../entities/types/Item';
import { TreeStore } from '../entities/classes/TreeStore';

const items: Item[] = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },
    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },
    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items);

console.log(ts.getAll());
console.log(ts.getItem(7)); 
console.log(ts.getChildren(4));
console.log(ts.getAllChildren(2));
console.log(ts.getAllParents(1));
console.log(ts.childrenMap);
console.log(ts.itemMap);

</script>

<template>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
