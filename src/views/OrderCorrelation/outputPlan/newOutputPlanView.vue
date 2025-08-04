<template>
  <!-- 排产计划编辑新增页面 -->
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
          ButtonViem
          :ToolBut="But"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @clickAddConvert="clickAddConvert"
          @Stop="Stop"
          @Schedule="Schedule"
          @DistributeStatus="DistributeStatus"
          @RollBack="RollBack"
          @DistributeRollBack="DistributeRollBack"
          @clickStart="clickStart"
          @clickDistribute="clickDistribute"
          @Again="Again"
          @AdjustLine="AdjustLine"
          @ExportAll="ExportAll"
          @BarcodeRevoke="BarcodeRevoke"
          @BarcodeStatus="BarcodeStatus"
          @BarcodeMake="BarcodeMake"
        ></ButtonViem>
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

      <DetailTable
        ref="tableRef"
        :tableColumns="tableColumns"
        :tableData="tableData"
        :loading="loading"
        @handleSelectionChange="handleSelectionChange"
      />
      <ProcessDialog
        ref="ProcessdiaRef"
        :obj="ProcessData"
        @CloseTC="CloseTC"
      ></ProcessDialog>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
        @pagination="changPage"
        :page-sizes="[100, 500, 3000]"
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
      <Modal
        ref="modalRef"
        @refetch-list="handleRefetchList"
        :selected-ids="selList"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onActivated, h } from 'vue';
import FilterForm from '@/components/Filter/index.vue';
import myTable from '@/components/MyFormTable/index.vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import { ElButton, ElCard, ElTableColumn, ElTooltip } from 'element-plus';
import ProcessDialog from '@/components/ProgressDialog/index.vue';
import PopModel from '@/components/PopModel/model.vue';
import Modal from './components/Modal.vue';
import DetailTable from './components/DetailTable.vue';
import {
  configApi,
  ParamsApi,
  DataApi,
  DataParamsApi,
  ExportApi
} from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import useStore from '@/store';
const { tagsView, permission } = useStore();
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const modalRef = ref(null);
let Filter = ref([]) as any;
const filterRef = ref(null);
const modelCode = ref();
const row = ref();
const ProcessdiaRef = ref();
const tableRef = ref();
const rowId = ref('') as any;
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
const ProcessData = ref({}) as any;
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const modelGridType = ref(true);
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 200
});
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: 'IsValid = true',
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

const loading = ref(false);

onActivated(() => {
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
  // if(initType.value){
  //     getAddUser(Route.meta.ModelCode)
  // }
  if (rowId.value != Route.params.rowId) {
    getAddUser(Route.meta.ModelCode);
  }
  rowId.value = Route.params.rowId;
  initType.value = false;
  if (Route.params.rowId) {
    rowId.value = Route.params.rowId;
  }
  if (history.state.row) {
    row.value = JSON.parse(history.state.row);
    rowId.value = JSON.parse(history.state.row).UID;
  }
  if (Route.meta.title.match(/详情/gi)) {
    // disabled.value=true
  }
  firstEnter.value = true;
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
          compare('iIndex', true)
        );
      }
    });
  }
};

const getAddUser = async (code: any) => {
  const loadingService = ElLoading.service({ lock: true, text: '加载中.....' });
  try {
    const res = await configApi(code);
    if (res.status == 200) {
      Filter.value = [];
      head.value = [];
      But.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
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
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
        }
      });
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错了');
  }
  loadingService.close();
};

// table 数据整合
const funTable = (arr: Array<any>) => {
  modelGrid.value = arr;
  tableColumns.value = [];
  tableData.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      const itemData = {
        title: item.Resource.cAttributeName,
        key: item.Resource.cAttributeCode,
        width: 120,
        ellipsis: {
          tooltip: [
            '产品名称',
            '产品分类',
            '加工码',
            '门扇名称',
            '寻线批次号',
            '排产规则依据',
            '排产排序值'
          ].includes(item.Resource.cAttributeName)
        },
        fixed: ['cSetFactoryUnitName', 'cSetFactoryUnitCode'].includes(
          item.Resource.cAttributeCode
        )
          ? 'left'
          : undefined
      };
      tableColumns.value.push(itemData);
    }
    if (item.Resource.cAttributeTypeCode == 'binddata') {
      AxiosData.value = item;
      tableAxios();
    }
  });
};
const firstEnter = ref(true);
//表格数据查询
const tableAxios = async () => {
  if (firstEnter.value) {
    firstEnter.value = false;
    return;
  }
  let params = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value + ' cFactoryUnitCode,S_S_S_iIndexs',
      Conditions: Conditions.value
    },
    params: {
      val: rowId.value
    }
  };
  loading.value = true;
  try {
    const { status, data } = await DataApi(params);
    if (status == 200) {
      tableData.value =
        data.data.map((i, idx) => {
          let obj = { ...i };
          // tableColumns.value.forEach(j => {
          //   obj[j.key] = i[j.key];
          // });
          // obj['UID'] = i.UID;
          // obj.ID = i.ID;
          obj.idx = idx;
          return obj;
        }) || [];
      total.value = data.dataCount;
    } else {
      console.log('请求出错');
    }
  } catch {
    //
  }
  queryParams.pageSize += 1;
  loading.value = false;
};
// 搜索
const ClickSearch = (val: any) => {
  let searchData = JSON.parse(JSON.stringify(val.value));
  Conditions.value = filterModel(searchData)
    ? `${filterModel(searchData)} && IsValid = true`
    : 'IsValid = true';
  tableAxios();
};
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
const RollBack = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    params: { UID: rowId.value }
  };
  ElMessageBox.confirm('排产撤销?', '排产撤销', {
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
            message: '撤销成功'
          });
          tableAxios();
        } else {
          ElMessage.error('撤销失败');
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
};
const DistributeRollBack = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    params: { UID: rowId.value }
  };
  ElMessageBox.confirm('下发撤销?', '下发撤销', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // ElLoading.service({ lock: true, text: '加载中.....' });
      ParamsApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '撤销成功'
          });
          // tableAxios();
        } else {
          ElMessage.error('撤销失败');
        }
        // ElLoading.service().close();
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      });
    });
};
const clickStart = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: { UID: rowId.value }
  };

  ElMessageBox.confirm('排产执行?', '排产执行', {
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
            message: '执行成功'
          });
          tableAxios();
        } else {
          ElMessage.error('执行失败');
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
};
const clickDistribute = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: { UID: rowId.value }
  };
  ElMessageBox.confirm('下发执行?', '下发执行', {
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
            message: '执行成功'
          });
          tableAxios();
        } else {
          ElMessage.error('执行失败');
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
};
const Again = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: { UID: rowId.value }
  };
  let loadingService;
  ElMessageBox.confirm('二次排产?', '二次排产', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      loadingService = ElLoading.service({ lock: true, text: '加载中.....' });
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
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      });
    })
    .finally(() => {
      loadingService.close();
    });
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
        // ElLoading.service({ lock: true, text: '加载中.....' });
        ParamsApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '成功'
            });
            // tableAxios();
          } else {
            ElMessage.error('失败');
          }
          // ElLoading.service().close();
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

const selList = ref([]) as any;
const handleSelectionChange = (val: any) => {
  selList.value = val;
};

//按钮导出当前页
const ExportAll = async (obj: any) => {
  let conditions = filterModel(filterRef.value.FilterData);

  if (obj.cAttributeCode === 'Download_DZJ') {
    if (conditions) {
      conditions += ' && cFactoryUnitCode=FM01020101';
    } else {
      conditions = 'cFactoryUnitCode=FM01020101';
    }
  }
  let orderByFileds = '';

  if (obj.cAttributeCode === 'Download') {
    orderByFileds = 'SourceIndex asc';
  }

  let url = obj.Resource.cServerIP + obj.Resource.cUrl + '&val=' + rowId.value;

  if (obj.cAttributeCode === 'DownloadLX_45') {
    url += '&cBatch=' + Route.query.cBatch;
  }

  let data = {
    method: obj.Resource.cHttpTypeCode,
    url,
    data: {
      PageIndex: 1,
      PageSize: 999999,
      OrderByFileds: orderByFileds,
      Conditions: conditions
    }
  };

  let excelTitle = '';
  switch (obj.cAttributeCode) {
    case 'DownloadLX_45':
      excelTitle = '45°精裁1任务';
      break;
    case 'Download_DZJ':
      excelTitle = '电子锯详情';
      break;
    default:
      excelTitle = '排产详情';
      break;
  }

  ExportApi(data).then((res: any) => {
    if (res.status == '200') {
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      });
      const fileName = decodeURI(excelTitle) + '.xlsx';
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
const AdjustLine = (obj: any) => {
  if (!selList.value.length) {
    ElMessage({
      type: 'error',
      message: '请选择数据！'
    });
    return false;
  }
  modalRef.value.showModal();
  modalRef.value.modelCode = obj.cIncludeModelCode;
};
//关闭弹窗，关闭定时器
const CloseTC = (val: any) => {
  if (val == false) {
    clearInterval(timer.value);
    timer.value = null;
  }
  // window.sessionStorage.clear('load')
};
const timer = ref(); // 定时器
let count = ref(0); // 倒计时
const ProcObj = ref({}) as any;
//进度
const Schedule = (obj: any) => {
  ProcessdiaRef.value.DiaOpen();
  // window.sessionStorage.setItem('load',true)
  ProcObj.value = obj;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: []
  };
  // ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
    if (res.status == 200) {
      if (!ProcessdiaRef.value.isDialogOpen()) {
        return;
      }
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
    // ElLoading.service().close();
  });
};
const DistributeStatus = (obj: any) => {
  // window.sessionStorage.setItem('load',true)
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
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
  tableRef.value.clearSelectedRowKeys();
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = 'IsValid = true';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 200;
  tableAxios();
};
// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    // case "View":
    //     clickView(scope, event)
    //     break;
    // case "Edit":
    //     clickEditTable(scope, event)
    //     break;
    // case "Stop":
    //     clickStop(scope, event)
    //     break;
    // case "Revoke":
    //     clickRevoke(scope, event)
    //     break;
    // case "Scheduling":
    //     clickScheduling(scope, event)
    //     break;
    default:
      break;
  }
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
  tableRef.value.clearSelectedRowKeys();
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

const handleRefetchList = () => {
  tableAxios();
  tableRef.value.clearSelectedRowKeys();
};
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
