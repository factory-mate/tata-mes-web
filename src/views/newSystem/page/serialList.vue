<template>
    <div class="seriaList">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="序号" width="80" />
            <el-table-column prop="name" label="流水依据"  />
            <el-table-column prop="address" label="值" />
            <el-table-column prop="address" label="流水号" />
        </el-table>
    </div>
</template>

<script setup lang="ts">
const tableData = [
  {
    date: '03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style scoped lang="scss">

</style>