<template>
  <!-- 巡线计划页面 -->
  <div class="maintain">
    <!-- 搜索区域 -->
    <FilterForm
      ref="filterRef"
      :Filter="Filter"
      @ClickSearch="ClickSearch"
      @resetForm="resetForm"
    ></FilterForm>
    <el-card>
      <!-- 按钮区域 -->
      <div class="bot-btn1">
        <ButtonViem
          :ToolBut="But"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @clickAddConvert="clickAddConvert"
          @Scheduling="Scheduling"
          @BarcodeMake="BarcodeMake"
          @Revoke="Revoke"
          @BarcodeRevoke="BarcodeRevoke"
          @Stop="Stop"
          @Schedule="Schedule"
          @BarcodeStatus="BarcodeStatus"
          @SetLine="SetLine"
          @ExportAll="ExportAll"
        />
      </div>
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        ref="headRef"
        :disabled="disabled"
        :dialogFormVisible="dialogFormVisible"
        @RoleBut="RoleBut"
      ></Head-View>
      <!-- 表格区域 -->
      <!-- <div style="float:right;margin:10px 0"  v-if="tableColumns.length">
                <el-button type="primary" size="small" :disabled="disabled"  @click="clickTableAdd()">添加</el-button>
            </div> -->
      <myTable
        ref="TabRef"
        :tableData="tableData"
        :selectionType="true"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
        @handleSelectionChange="handleSelectionChange"
      >
        <template #button>
          <el-table-column
            label="操作"
            fixed="right"
            width="200px"
            align="center"
          >
            <template #header>
              <span>操作</span>
            </template>
            <!-- <template #default="scope">
                            <el-button type="primary" :disabled="disabled" size="small" @click="clickTableHandDel(scope)">删除</el-button>
                        </template> -->
            <template #default="scope">
              <template
                v-for="item in tableButton"
                :key="item.Resource.cAttributeName"
              >
                <template v-if="item.iIndex < 3">
                  <!-- v-if='scope.row.iStatus==0&&item.Resource.cAttributeName!="撤销排产" ||scope.row.iStatus==1&&item.Resource.cAttributeName!="排产"'  -->
                  <el-button
                    type="primary"
                    size="small"
                    @click="clickTableBut(scope, item)"
                  >
                    {{ item.Resource.cAttributeName }}
                  </el-button>
                </template>
              </template>
              <el-dropdown
                style="margin-left: 10px"
                v-if="tableButton.length > 3"
              >
                <el-button type="primary" size="small">
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item) in tableButton.filter((v: any) => [0, 1].indexOf(v.iIndex) == -1)"
                      :key="item.Resource.cAttributeName"
                    >
                      <el-button
                        type="primary"
                        size="small"
                        @click="clickTableBut(scope, item)"
                      >
                        {{ item.Resource.cAttributeName }}
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </myTable>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
        @pagination="changPage"
      />
      <pop-model
        :dialogFormVisible="dialogFormVisible"
        :title="modelTitle"
        :modelCIncludeModelCode="modelCIncludeModelCode"
        :modelGridType="modelGridType"
        :rowId="rowId"
        :selectData="selList"
        :modelGrid="modelGrid"
        @modelClose="modelClose"
        @clickHandAdd="clickHandAdd"
      ></pop-model>
    </el-card>
    <ProcessDialog
      ref="ProcessdiaRef"
      :obj="ProcessData"
      @CloseTC="CloseTC"
    ></ProcessDialog>
    <!-- 弹窗 -->
    <Odialog
      :dialogFormVisible="ZZdialogFormVisible"
      :title="title"
      :objData="objData"
      :modeCode="objModeCode"
      :disabled="Mdisabled"
      :row="Mrow"
      @FmodelClose="modelClose"
    ></Odialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onActivated, provide, onMounted } from 'vue';
import FilterForm from '@/components/Filter/index.vue';
import myTable from '@/components/MyFormTable/index.vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import { ElButton, ElCard, ElTableColumn } from 'element-plus';
import ProcessDialog from '@/components/ProgressDialog/index.vue';
import PopModel from '@/components/PopModel/model.vue';
import Odialog from '@/components/DialogModel/index.vue';
import {
  configApi,
  ParamsApi,
  DataApi,
  DataParamsApi,
  ExportApi
} from '@/api/configApi/index';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import useStore from '@/store';
import { loginApi } from '@/api/auth';
const { tagsView, permission } = useStore();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Filter = ref([]) as any;
const modelCode = ref();
const row = ref();
const TabRef = ref();
const rowId = ref('') as any;
const Route = useRoute();
const router = useRouter();
const ProcessdiaRef = ref();
const ProcessData = ref({}) as any;
const headRef = ref(null);
const filterRef = ref(null);
let But = ref([]) as any;
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const tableButton = ref([]) as any;
const modelGridType = ref(true);
const ZZdialogFormVisible = ref(false);
const title = ref('指定产线');
const Mrow = ref({}) as any;
const Mdisabled = ref(false);
const objModeCode = ref('');
const objData = ref({});
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 10
});
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: '',
  disabled: false,
  dialogFormVisible: false,
  modelTitle: '标题',
  modelCIncludeModelCode: ''
});
const {
  Conditions,
  OrderByFileds,
  disabled,
  dialogFormVisible,
  modelTitle,
  modelCIncludeModelCode
} = toRefs(data);
let head = ref([]) as any;
const initType = ref(true);

onActivated(() => {
  if (Route.name === 'ViewPatrolPlan') {
    modelCode.value = history.state.modelCode
      ? history.state.modelCode
      : Route.meta.ModelCode;
    Route.meta.ModelCode = history.state.modelCode
      ? history.state.modelCode
      : Route.meta.ModelCode;
    Route.meta.title = history.state.title
      ? history.state.title
      : Route.meta.title;
    tagsView.updateVisitedView(Route);
    if (rowId.value !== Route.params.rowId) {
      getAddUser(Route.meta.ModelCode);
      rowId.value = Route.params.rowId;
    }
    if (Route.meta.title.match(/详情/gi)) {
      disabled.value = true;
    }
  }
});
// 权限按钮
const RoleBut = (v: any) => {
  let ToolData = head.value.filter((BItem: any) => {
    return BItem.cAttributeCode == 'Tool';
  });
  if (ToolData.length) {
    let dataVal = {
      method: ToolData[0].Resource.cHttpTypeCode,
      url: ToolData[0].Resource.cServerIP + ToolData[0].Resource.cUrl,
      data: v
    };
    DataApi(dataVal).then((res: any) => {
      if (res.data.cPropertyClassTypeCode == 'ToolBut') {
        But.value = res.data[import.meta.env.VITE_APP_key].sort(
          compare('iIndex', false)
        );
      }
    });
  }
};
const getAddUser = async (code: any) => {
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await configApi(code);
    if (res.status == 200) {
      ElLoading.service().close();
      Filter.value = [];
      head.value = [];
      But.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', false)
          );
        }
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          head.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          But.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', false))
          );
        }
      });
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错了');
    ElLoading.service().close();
  }
};

// table 数据整合
const funTable = (arr: Array<any>) => {
  modelGrid.value = arr;
  tableButton.value = [];
  tableColumns.value = [];
  tableData.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: false,
        slot: ''
      };
      tableColumns.value.push(itemData);
      // tableColumns.value.push({ checkType: true, label: '操作', slotName: 'button' })
      // tableColumns.value = tableColumns.value.filter((item: { label: any; }, index: any, self: any[]) => {
      //     // 利用findIndex方法找到第一个与当前元素id相等的元素索引
      //     const i = self.findIndex((t: { label: any; }) => t.label === item.label);
      //     // 如果当前索引等于当前元素在self中的最初出现位置索引，则表示元素符合要求，不是重复元素，保留
      //     return i === index;
      // })
    }
    if (item.Resource.cAttributeTypeCode == 'method') {
      let itemData = { checkType: true, label: '操作', slotName: 'button' };
      tableButton.value.push(item);
      tableColumns.value.push(itemData);
      tableColumns.value = tableColumns.value.filter(
        (item: { label: any }, index: any, self: any[]) => {
          // 利用findIndex方法找到第一个与当前元素id相等的元素索引
          const i = self.findIndex(
            (t: { label: any }) => t.label === item.label
          );
          // 如果当前索引等于当前元素在self中的最初出现位置索引，则表示元素符合要求，不是重复元素，保留
          return i === index;
        }
      );
    }
    if (
      item.Resource.cAttributeTypeCode == 'binddata' ||
      item.Resource.cAttributeTypeCode == 'PageData' ||
      item.Resource.cAttributeTypeCode == 'pagedata'
    ) {
      AxiosData.value = item;
      tableAxios();
    }
  });
};
//按钮导出当前页
const ExportAll = async (obj: any) => {
  let conditions = filterModel(filterRef.value.FilterData);

  let url = obj.Resource.cServerIP + obj.Resource.cUrl;

  if (obj.cAttributeCode === 'DownloadLack') {
    url += `&cPreBatch=${Route.query.cPreBatch}`;
  } else {
    url += '&val=' + rowId.value;
  }

  let data = {
    method: obj.Resource.cHttpTypeCode,
    url,
    data: {
      PageIndex: 1,
      PageSize: 999999,
      OrderByFileds: OrderByFileds.value,
      Conditions: conditions
    }
  };

  ExportApi(data).then((res: any) => {
    if (res.status == '200') {
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      });
      const fileName =
        decodeURI(
          obj.cAttributeCode === 'DownloadLack' ? '未巡线详情' : '寻线运算'
        ) + '.xlsx';
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        navigator.msSaveBlob(blob, fileName);
      }
    } else {
      ElMessage.error('请求失败');
    }

    ElLoading.service().close();
  });
};

//表格数据查询
const tableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: 'cVouchCode,iOrderIndex,cCraftRouteName,iProcessIndex',
      Conditions: Conditions.value
    },
    params: {
      val: rowId.value
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  await DataApi(data).then((res: any) => {
    if (res.status == 200) {
      tableData.value = res.data.data || [];
      total.value = res.data.dataCount;
    } else {
      console.log('请求出错');
    }
    ElLoading.service().close();
  });
};
// 搜索
const ClickSearch = (val: any) => {
  let searchData = JSON.parse(JSON.stringify(val.value));

  Conditions.value = filterModel(searchData);
  tableAxios();
};
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 10;
  tableAxios();
  TabRef.value.clearFilter();
};
// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  console.log(scope, '--===scope');

  switch (event.cAttributeCode) {
    // case "View":
    //     clickView(scope, event)
    //     break;
    default:
      break;
  }
};
const Scheduling = (obj: any) => {
  if (obj.Resource.cServerIP || obj.Resource.cUrl) {
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      data: { UID: rowId.value }
    };
    ElMessageBox.confirm('寻线执行?', '寻线执行', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        ElLoading.service({ lock: true, text: '加载中.....' });
        DataApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '成功'
            });
            tableAxios();
          } else {
            ElMessage.error('失败');
          }
          ElLoading.service().close();
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消'
        });
      });
  }
};
const BarcodeMake = (obj: any) => {
  if (obj.Resource.cServerIP || obj.Resource.cUrl) {
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      data: { UID: rowId.value }
    };
    ElMessageBox.confirm('生码执行?', '生码执行', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        ElLoading.service({ lock: true, text: '加载中.....' });
        DataApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '成功'
            });
            tableAxios();
          } else {
            ElMessage.error('失败');
          }
          ElLoading.service().close();
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消'
        });
      });
  }
};
const Revoke = (obj: any) => {
  console.log(obj, rowId.value, '--11113');
  if (obj.Resource.cServerIP || obj.Resource.cUrl) {
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      params: { UID: rowId.value }
    };
    ElMessageBox.confirm('寻线撤销?', '寻线撤销', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        ElLoading.service({ lock: true, text: '加载中.....' });
        ParamsApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '成功'
            });
            tableAxios();
          } else {
            ElMessage.error('失败');
          }
          ElLoading.service().close();
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消'
        });
      });
  }
};
const BarcodeRevoke = (obj: any) => {
  if (obj.Resource.cServerIP || obj.Resource.cUrl) {
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      params: { UID: rowId.value }
    };
    ElMessageBox.confirm('生码撤销?', '生码撤销', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        ElLoading.service({ lock: true, text: '加载中.....' });
        ParamsApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '成功'
            });
            tableAxios();
          } else {
            ElMessage.error('失败');
          }
          ElLoading.service().close();
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消'
        });
      });
  }
};
//表格按钮停用
const Stop = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    // data: [senid]
    params: {}
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  // DataApi(data).then(res => {
  ParamsApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '停用成功'
      });
      tableAxios();
    } else {
      ElMessage.error('停用失败');
    }
    ElLoading.service().close();
  });
};
const timer = ref(); // 定时器
let count = ref(0); // 倒计时
const ProcObj = ref({}) as any;
//进度
const Schedule = (obj: any) => {
  // window.sessionStorage.setItem('load',true)
  ProcObj.value = obj;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: []
  };
  DataApi(data).then(res => {
    if (res.status == 200) {
      ProcessdiaRef.value.DiaOpen();
      // ElMessage({
      //     type: 'success',
      //     message: res.msg||'成功',
      // })
      ProcessData.value = res.data;
      count.value = 5; //倒计时
      if (res.data.iTotalStep === res.data.iNewStep) {
        return;
      }
      Verification(); //循环接口
    } else {
      ElMessage({
        type: 'error',
        message: res.msg || '失败'
      });
      console.log('出错了');
    }
  });
};
const BarcodeStatus = (obj: any) => {
  ProcObj.value = obj;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: []
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
    if (res.status == 200) {
      ProcessdiaRef.value.DiaOpen();
      // ElMessage({
      //     type: 'success',
      //     message: res.msg||'成功',
      // })
      ProcessData.value = res.data;
      count.value = 5; //倒计时
      Verification(); //循环接口
    } else {
      ElMessage({
        type: 'error',
        message: res.msg || '失败'
      });
      console.log('出错了');
    }
    ElLoading.service().close();
  });
};
const selList = ref([]) as any;
const handleSelectionChange = (val: any) => {
  console.log(val, '---===');
  selList.value = val;
};
const SetLine = (obj: any) => {
  // ZZdialogFormVisible.value=true
  if (!selList.value.length) {
    ElMessage({
      type: 'error',
      message: '请选择数据！'
    });
    return false;
  }
  dialogFormVisible.value = true;
  modelGridType.value = false;

  // objData.value = obj;
  modelTitle.value = '指定产线';
  modelCIncludeModelCode.value = obj.cIncludeModelCode;
};
//循环请求接口
const Verification = () => {
  timer.value = setInterval(() => {
    if (count.value > 0 && count.value <= 5) {
      count.value--;
    } else if (count.value === 0) {
      Schedule(ProcObj.value); // 请求数据
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
};
//关闭弹窗，关闭定时器
const CloseTC = (val: any) => {
  if (val == false) {
    clearInterval(timer.value);
    timer.value = null;
  }
  // window.sessionStorage.clear('load')
};
// table 按钮 集合
const clickTableHandDel = (val: any) => {
  tableData.value.splice(val.$index, 1);
  // total.value=total.value-1
};
const clickTableAdd = () => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
};
const clickHandAdd = (data: any) => {
  let itemData = JSON.parse(JSON.stringify(data.val));
  dialogFormVisible.value = data.type;
  tableData.value.push(itemData);
};

// 添加
const clickAddConvert = (val: any) => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
  modelCIncludeModelCode.value = val.cIncludeModelCode;
};
const modelClose = (val: any) => {
  dialogFormVisible.value = val.type;
  ZZdialogFormVisible.value = val.type;
  TabRef.value.handleRemoveSelectionChange();
};
//新增保存
const SaveAdd = (obj: any) => {
  obj.pathName = 'outputPlan';
  obj.tableData = tableData.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};

//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'outputPlan';
  obj.tableData = tableData.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 编辑
const clickEdit = (obj: any) => {
  getAddUser(obj.cIncludeModelCode);
  disabled.value = false;
  $bus.emit('TabTitleVal', { name: Route.name, title: '排产计划编辑' });
};
provide('tableAxios', { tableAxios });
</script>

<style scoped lang="scss">
.maintain {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;

  .maintain_card {
    width: 100%;
    margin-bottom: 20px;

    :deep(.el-card__body) {
      display: flex;
      justify-content: space-between;

      .search_main {
        flex: 1;

        :deep(.el-form) {
          width: 100%;
        }
      }

      .search_but {
        width: 180px;
      }
    }
  }

  .bot-btn {
    margin: 20px 0;
  }
}

.maintain .selectSty {
  width: 233px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
