<template>
    <div class="codeMain">
        <el-card class="codeMain_L">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        </el-card>
        <el-card class="codeMain_R">
            <el-tabs type="border-card">
                <el-tab-pane label="规则定义">
                    <ruleDef></ruleDef>
                </el-tab-pane>
                <el-tab-pane label="查看流水号">
                    <serialList></serialList>
                </el-tab-pane>
                <el-tab-pane label="退号查询">Role</el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import ruleDef from './page/ruleDef.vue';
import serialList from './page/serialList.vue';

interface Tree {
  label: string
  children?: Tree[]
}
const handleNodeClick = (data: Tree) => {
  console.log(data)
}
const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

const defaultProps = {
  children: 'children',
  label: 'label',
}

</script>

<style scoped lang="scss">
 .codeMain{
    margin: 20px;
    display: flex;
    height: 100%;
    .codeMain_L{
        min-height: 700px;
        height: 100%;
        margin-right: 20px;
        width: 200px;
    }
    .codeMain_R{
        min-height: 700px;
        height: 100%;
        flex: 1;
    }
 }
</style>