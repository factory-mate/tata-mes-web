<template>
  <div style="padding: 20px">
    <el-card class="search">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="name" label="">
          <el-date-picker
            v-model="value1"
            type="month"
            placeholder="Pick a Date"
          />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" :icon="Search" @click="handleQuery"
            >搜索</el-button
          >
          <el-button :icon="Refresh" @click="resetQuery" type="primary"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="calendar">
      <el-calendar style="text-align: center" v-model="nowdate">
        <template #date-cell="{ data }">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
          </p>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-around;
              margin: 10px 0;
            "
          >
            <div @click="data1(data)" style="color: red">
              <span>维修</span><br />
              <span>0/1</span>
            </div>
            <div style="color: blue" @click="poll">
              <span>巡检</span><br />
              <span>0/1</span>
            </div>
            <div style="color: green" @click="upkeep">
              <span>保养</span><br />
              <span>0/1</span>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-card>
    <el-drawer v-model="drawer" title="当日维修明细" direction="btt" size="70%">
      <MyTable
        v-if="tabType"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :selection="true"
        @dblclick="doubleThing()"
      >
        <template #handler>
          <el-table-column
            label="操作"
            fixed="right"
            width="300px"
            align="center"
          >
            <template #header
              ><span>操作</span>
              <myPopup :list="tableColumns" @newList="newList"></myPopup>
            </template>
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                :icon="Edit"
                @click="handleEdit(scope.$index, scope.row)"
                >新增</el-button
              >
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.$index, scope.row)"
                >完工</el-button
              >
            </template>
          </el-table-column>
        </template>
      </MyTable>
    </el-drawer>
    <el-drawer
      v-model="drawer1"
      title="当日巡检明细"
      direction="btt"
      size="70%"
    >
      <MyTable
        v-if="tabType1"
        :tableData="tableData1"
        :tableColumns="tableColumns1"
        :selection="true"
        @dblclick="doubleThing()"
      >
        <template #handler>
          <el-table-column
            label="操作"
            fixed="right"
            width="300px"
            align="center"
          >
            <template #header
              ><span>操作</span>
              <myPopup :list="tableColumns" @newList="newList1"></myPopup>
            </template>
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                :icon="Edit"
                @click="handleEdit(scope.$index, scope.row)"
                >新增</el-button
              >
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.$index, scope.row)"
                >完工</el-button
              >
            </template>
          </el-table-column>
        </template>
      </MyTable>
    </el-drawer>
    <el-drawer
      v-model="drawer2"
      title="当日保养明细"
      direction="btt"
      size="70%"
    >
      <MyTable
        v-if="tabType2"
        :tableData="tableData2"
        :tableColumns="tableColumns2"
        :selection="true"
        @dblclick="doubleThing()"
      >
        <template #handler>
          <el-table-column
            label="操作"
            fixed="right"
            width="300px"
            align="center"
          >
            <template #header
              ><span>操作</span>
              <myPopup :list="tableColumns" @newList="newList2"></myPopup>
            </template>
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                :icon="Edit"
                @click="handleEdit(scope.$index, scope.row)"
                >新增</el-button
              >
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.$index, scope.row)"
                >完工</el-button
              >
            </template>
          </el-table-column>
        </template>
      </MyTable>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { reactive, toRefs, ref, computed, nextTick } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';
import { buttonTypes } from 'element-plus';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import { Edit, Delete, MoreFilled } from '@element-plus/icons-vue';
import myPopup from '@/components/Popup/index.vue';
// 表格数据类型
interface dataType {
  id?: string;
  date?: string;
  name?: string;
  name3?: string;
  address?: string;
}
interface columnType {
  label: string;
  prop: string;
  width?: string;
  headerSlot?: boolean;
  slotName?: string;
  fixed?: string;
  minwidth?: string;
  sortable?: boolean;
  checkType?: boolean;
  slot?: number;
}
const tableData: dataType[] = [
  {
    id: '001',
    name: '传感设备',
    date: '备注备注'
  },
  {
    id: '002',
    name: '传感设备',
    date: '备注备注'
  },
  {
    id: '003',
    name: '传感设备',
    date: '备注备注'
  }
];
const dataVal: columnType[] = [
  // 表格配置数据
  {
    checkType: true,
    label: '项目编码',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '项目名称',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '原因分类名称',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '避免方案',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '解决方案',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '描述',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '操作',
    prop: 'name4',
    minwidth: '300',
    slotName: 'handler',
    headerSlot: true
  }
];
const tableColumns = ref(dataVal);
const tableData1: dataType[] = [
  {
    id: '001',
    name: '传感设备',
    date: '备注备注'
  },
  {
    id: '002',
    name: '传感设备',
    date: '备注备注'
  },
  {
    id: '003',
    name: '传感设备',
    date: '备注备注'
  }
];
const dataVal1: columnType[] = [
  // 表格配置数据
  {
    checkType: true,
    label: '上次巡检时间',
    prop: 'id',
    headerSlot: true,
    slot: 0,
    minwidth: '170'
  },
  {
    checkType: true,
    label: '项目编码',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '项目名称',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '优先级',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '实际巡检人',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '开始时间',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '结束时间',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '是否巡检完成',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '170'
  },
  {
    checkType: true,
    label: '巡检结果',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '原因名称',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '避免方案',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '操作',
    prop: 'name4',
    minwidth: '300',
    slotName: 'handler',
    headerSlot: true
  }
];
const tableColumns1 = ref(dataVal1);

const tableData2: dataType[] = [
  {
    id: '001',
    name: '传感设备',
    date: '备注备注'
  },
  {
    id: '002',
    name: '传感设备',
    date: '备注备注'
  },
  {
    id: '003',
    name: '传感设备',
    date: '备注备注'
  }
];
const dataVal2: columnType[] = [
  // 表格配置数据
  {
    checkType: true,
    label: '上次保养时间',
    prop: 'id',
    headerSlot: true,
    slot: 0,
    minwidth: '170'
  },
  {
    checkType: true,
    label: '项目编码',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '项目名称',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '优先级',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '实际保养人',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '开始时间',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '结束时间',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '是否保养完成',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '170'
  },
  {
    checkType: true,
    label: '保养结果',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '原因名称',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '避免方案',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '解决方案',
    prop: 'name',
    headerSlot: true,
    slot: 0,
    minwidth: '150'
  },
  {
    checkType: true,
    label: '操作',
    prop: 'name4',
    minwidth: '300',
    slotName: 'handler',
    headerSlot: true
  }
];
const tableColumns2 = ref(dataVal2);
const tabType = ref(true);
const tabType1 = ref(true);
const tabType2 = ref(true);
// 表单类型
interface PageQuery {
  pageNum: number;
  pageSize: number;
  keywords?: string;
}
const drawer = ref(false);
const drawer1 = ref(false);
const drawer2 = ref(false);
const nowdate = ref();
const value1 = computed({
  get() {
    return nowdate.value;
  },
  set(value) {
    console.log(value);
    return (nowdate.value = value);
  }
});
const state = reactive({
  // 日期选择器
  // 表单数据
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as PageQuery
});
const { queryParams } = toRefs(state);
// 方法
// 搜索
const handleQuery = () => {
  console.log(1111);
};
// 重置
const resetQuery = () => {};
// 点击日历内容
const data1 = (data: any) => {
  drawer.value = true;
};
const poll = () => {
  drawer1.value = true;
};
const upkeep = () => {
  drawer2.value = true;
};

const doubleThing = () => {};

const handleEdit = (index: any, row: any) => {
  console.log(index, row);
  // EditFormVisible.value = true
};
const handleDelete = (index: any, row: any) => {
  console.log(index, row);
};

const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
  });
};
const newList1 = (val: any) => {
  tabType1.value = false;
  nextTick(() => {
    tableColumns1.value = val.list;
    tabType.value = true;
  });
};
const newList2 = (val: any) => {
  tabType2.value = false;
  nextTick(() => {
    tableColumns2.value = val.list;
    tabType.value = true;
  });
};
</script>

<style lang="scss" scoped>
html {
  overflow-x: hidden; //隐藏水平滚动条
  overflow-y: hidden; //隐藏垂直滚动条
}
.is-selected {
  color: #1989fa;
}

:deep(.el-calendar-table .el-calendar-day) {
  padding: 0;
}
</style>
