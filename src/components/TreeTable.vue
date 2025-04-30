<script setup lang="ts">
import { type TreeStoreItem } from '@/entities/TreeStore/types/TreeStoreItem';
import TreeStore from '@/entities/TreeStore/model/TreeStore'
import { ref } from 'vue'
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry, GetDataPath, GridApi } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule]);

const items: TreeStoreItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: 2, parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: 2, label: 'Айтем 4' },
  { id: 5, parent: 2, label: 'Айтем 5' },
  { id: 6, parent: 2, label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
];
const ts = new TreeStore(items);
const newRowData = ref(ts.getAgGridTableItems());
const gridApi = ref<GridApi | null>(null);
const isEditMode = ref<boolean>(false);
const getDataPath = ref<GetDataPath>((data) => data.path);
const getRowId = (params) => String(params.data.id);

const colDefs = ref([
  { field: "id", headerName: "ID", width: 80 },
  {
    headerName: "Категория",
    field: "name",
    cellRenderer: "agGroupCellRenderer",
    showRowGroup: true,
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: (params) => {
        const id = params.data?.id;
        const name = params.data?.name;

        if (!id || !name) {
          return '';
        }

        let label = params.node.group && params.node.allChildrenCount > 0
          ? `Группа`
          : `Элемент`;

        if (isEditMode.value) {
          label = `
            <div style="display: flex; align-items: center; gap: 8px; justify-content: space-between;">
              <span>${label}</span>
              <button style="background: transparent; border: none; color: blue; cursor: pointer;" data-action="add" data-id="${id}">➕</button>
              <button style="background: transparent; border: none; color: red; cursor: pointer;" data-action="remove" data-id="${id}">❌</button>
            </div>
          `;
        }

        return label;
      }
    },
  },
  { field: "name", headerName: "Название" }
])

const onGridReady = (params) => {
  gridApi.value = params.api
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
  gridApi.value?.refreshCells({ force: true });
}

const handleCellClicked = (event: MouseEvent) => {
  const target = event.event.target;
  const action = target.getAttribute("data-action");
  const itemId = +target.getAttribute("data-id");

  const lastItemId = ts.items.at(-1)?.id || 0;

  if (action === "add") {
    const newItemId = lastItemId + 1;
    const newItem = { id: newItemId, parent: itemId, label: `Айтем ${newItemId}` };
    ts.addItem(newItem);

    const newGridItem = ts.getAgGridTableItem(newItem.id);
    gridApi.value.applyTransaction({ add: [newGridItem] });
  }

  if (action === "remove") {
    const allChildren = ts.getAllChildren(itemId);
    const idsToRemove = [itemId, ...allChildren.map(child => child.id)];

    idsToRemove.forEach(id => {
      ts.removeItem(id);
    });

    gridApi.value.applyTransaction({
      remove: idsToRemove.map(id => ({ id }))
    });
  }
};
</script>

<template>
  <div class="table">
    <div class="controls">
      <button @click="toggleEditMode()">{{ isEditMode ? 'Режим: редактированиe' : 'Режим: просмотр' }}</button>
    </div>
    <ag-grid-vue v-model="newRowData" :columnDefs="colDefs" :treeData="true" :getDataPath="getDataPath"
      groupDisplayType="custom" @grid-ready="onGridReady" @cell-clicked="handleCellClicked" domLayout="autoHeight"
      :getRowId="getRowId" :undoRedoCellEditing="true" :undoRedoCellEditingLimit="5" style=" width: 100%" />
  </div>
</template>

<style scoped>
.table {
  display: flex;
  flex-direction: column;
  background-color: #e0cbba;
  padding: 8px;
  border-radius: 8px;
  height: fit-content;
  gap: 8px;
}

.table button {
  background: transparent;
  border: 0;
  color: blue;
  font-weight: 600;
  cursor: pointer;
}
</style>
