<script lang="ts" setup>
import { useMouse } from '@vueuse/core'
import { useTable } from '@yy-web/use-curd-vue'

const columns = [
  {
    name: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'description',
    dataIndex: 'description',
    key: 'description',
  },
]

const { x, y } = useMouse()

const { dataSource, loading, pageConf, searchForm, searchTable, resetTable } = useTable<{ a: string }>({
  apiAction: async () => {
    return [{ description: '123123' }]
  },
  pagination: false,
})
</script>

<template>
  <div>
    {{ x }}{{ y }}{{ searchForm.a }}
    <a-input v-model:value="searchForm.a" />
  </div>
  <a-button type="primary" @click="searchTable">
    查询
  </a-button>
  <a-button @click="resetTable">
    重置{{ loading ? 'loading' : 'no loading' }}
  </a-button>
  <a-table
    v-model:current="pageConf.current" v-model:page-size="pageConf.limit" show-size-changer
    :page-size-options="[1, 2, 5, 10]"
    :total="pageConf.total" :columns="columns" :data-source="dataSource" :loading="loading"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          Name
        </span>
      </template>
    </template>
  </a-table>
</template>
