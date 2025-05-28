<template>
  <!-- /编辑新增用户管理页面 -->
  <div class="maintain">
    <el-card>
      <!-- 搜索区域 -->
      <FHead :Head="head" ref="headRef" :row="row"> </FHead>
      <!-- 按钮区域 -->
      <div class="bot-btn">
        <!-- <el-card> -->
        <ButtonViem :ToolBut="FBut" @SaveAdd="SaveAdd" @SaveEdit="SaveEdit">
        </ButtonViem>
        <!-- </el-card> -->
      </div>
      <div class="two-Grid">
        <!-- 用户策略表格 -->
        <div class="LeftUser">
          <!-- 按钮区域 -->
          <div class="bot-btn">
            <ButtonViem
              :ToolBut="UserBut"
              @SaveAdd="SaveAdd"
              @SaveEdit="SaveEdit"
              @UserPolicyAdd="UserPolicyAdd"
              @UserPolicyDelete="UserPolicyDelete"
              @UserRoleDelete="UserRoleDelete"
            >
            </ButtonViem>
          </div>
          <div class="lettable">
            <myTable
              ref="TUref"
              v-if="tabType"
              :tableData="UsertableData"
              :tableColumns="UsertableColumns"
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
                    <myPopup
                      :list="UsertableColumns"
                      @newList="newList"
                    ></myPopup>
                  </template>
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      v-for="item in tableButton"
                      :key="item.Resource.cAttributeName"
                      @click="clickTableBut(scope)"
                      >{{ item.Resource.cAttributeName }}</el-button
                    >
                  </template>
                </el-table-column>
              </template>
            </myTable>
          </div>
          <div class="LeftUserPage">
            <pagination
              v-if="userPolicytotal > 0"
              :total="userPolicytotal"
              v-model:page="queryParams.PageIndex"
              v-model:limit="queryParams.PageSize"
              @pagination="UserPolicyChange"
            />
          </div>
        </div>
        <!-- 角色策略表格 -->
        <div class="RightRole">
          <!-- 按钮区域 -->
          <div class="bot-btn">
            <ButtonViem
              :ToolBut="RoleBut"
              @SaveAdd="SaveAdd"
              @SaveEdit="SaveEdit"
              @UserPolicyAdd="UserPolicyAdd"
              @UserPolicyDelete="UserPolicyDelete"
              @UserRoleDelete="UserRoleDelete"
              @UserRoleAdd="UserRoleAdd"
            >
            </ButtonViem>
          </div>
          <div class="righttable">
            <myTable
              ref="TrRef"
              v-if="tabType"
              :tableData="RoletableData"
              :tableColumns="RoletableColumns"
              :tableBorder="true"
              :selection="true"
              @handleSelectionChange="RhandleSelectionChange"
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
                    <myPopup
                      :list="RoletableColumns"
                      @newList="newList"
                    ></myPopup>
                  </template>
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      v-for="item in tableButton"
                      :key="item.Resource.cAttributeName"
                      @click="clickTableBut(scope)"
                      >{{ item.Resource.cAttributeName }}</el-button
                    >
                  </template>
                </el-table-column>
              </template>
            </myTable>
          </div>
          <div class="rolePage">
            <pagination
              v-if="roletotal > 0"
              :total="roletotal"
              v-model:page="queryParams.PageIndex"
              v-model:limit="queryParams.PageSize"
              @pagination="roleChange"
            />
          </div>
        </div>
      </div>
      <!-- 添加用户策略弹框 -->
      <div v-if="CLAdddialogFormVisible">
        <el-dialog v-model="CLAdddialogFormVisible" title="添加策略">
          <myTable
            ref="TUref"
            v-if="tabType"
            :tableData="TCUsertableData"
            :tableColumns="AddusertableColumns"
            :tableBorder="true"
            :selection="true"
            @handleSelectionChange="UThandleSelectionChange"
          >
          </myTable>
          <!-- <pagination v-if="total > 0" :total="total" v-model:page="queryParams.PageIndex"
                        v-model:limit="queryParams.PageSize" />  -->
          <div class="bot-btn">
            <ButtonViem
              :ToolBut="PolicBtn"
              @UserPolicySaveAdd="UserPolicySaveAdd"
            >
            </ButtonViem>
          </div>
        </el-dialog>
      </div>

      <!-- 添加用户角色弹窗 -->
      <div v-if="JSAdddialogFormVisible">
        <el-dialog v-model="JSAdddialogFormVisible" title="添加角色">
          <myTable
            ref="TRref"
            v-if="tabType"
            :tableData="TCroletableData"
            :tableColumns="AddroletableColumns"
            :tableBorder="true"
            :selection="true"
            @handleSelectionChange="RThandleSelectionChange"
          >
          </myTable>
          <pagination
            v-if="total > 0"
            :total="total"
            v-model:page="queryParams.PageIndex"
            v-model:limit="queryParams.PageSize"
            @pagination="RoleChange"
          />
          <div class="bot-btn">
            <ButtonViem :ToolBut="PolicBtn" @UserRoleSaveAdd="UserRoleSaveAdd">
            </ButtonViem>
          </div>
        </el-dialog>
      </div>
      <!-- 编辑 -->
      <model :dialogV="dialogV" :dialogTitle="dialogTitle"></model>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated, provide } from 'vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FHead from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import model from './components/userGModel.vue';
import { configApi, DataApi, delApi } from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import { localStorage } from '@/utils/storage';
import { compare } from '@/utils';
import useStore from '@/store';
const { tagsView, permission } = useStore();
const Tref = ref();
const TRref = ref();
const TrRef = ref();
const modelCode = ref();
const row = ref();
const Route = useRoute();
if (history.state.scope) {
  row.value = JSON.parse(history.state.scope as any);
}

const initType = ref(true);
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
  if (initType.value) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getAddUser(Route.meta.ModelCode);
  }
  initType.value = false;
});
const headRef = ref();
let But = ref([]) as any;
//新增保存/修改保存
let FBut = ref([]) as any;
//总条数
const total = ref(0);
const userPolicytotal = ref(0);
const roletotal = ref(0);
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
// 表格配置数据
const tableButton = ref([]) as any;
const tabType = ref(true);
// 用户策略表格配置
const UsertableColumns = ref([]) as any;
const UsertableData = ref([]) as any;
let UserBut = ref([]) as any;
const userAxiosData = ref({}) as any;
//传递的UID
const sendId = ref([]) as any;
//添加策略弹框
const CLAdddialogFormVisible = ref(false);
const AddusertableColumns = ref([]) as any;
const TCUsertableData = ref([]) as any;
const TCuserAxiosData = ref({}) as any;
const TUref = ref();
//添加角色弹窗
const JSAdddialogFormVisible = ref(false);
const AddroletableColumns = ref([]) as any;
const TCroletableData = ref([]) as any;
const TCroleAxiosData = ref({}) as any;
//用户角色表格配置
const RoletableColumns = ref([]) as any;
const RoletableData = ref([]) as any;
let RoleBut = ref([]) as any;
const roleAxiosData = ref({}) as any;
const rSendId = ref([]) as any;
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: ''
});
const { dialogV, dialogTitle, Conditions, OrderByFileds } = toRefs(data);
let head = ref([]) as any;
const getAddUser = async () => {
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await configApi(modelCode.value);
    if (res.status == 200) {
      res.data.forEach((item: any) => {
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
          funBtn(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
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
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错了');
    ElLoading.service().close();
  }
};
//新增时保存的用户名
const LoginName = ref();
LoginName.value = localStorage.get('LoginName');
// 分表格/Table 数据整合
const funTable = (arr: Array<any>) => {
  arr.forEach(item => {
    if (
      (item.cFormPropertyCode == 'ManageCenter.User.M.Add.Policy.Grid' &&
        item.Resource.cAttributeTypeCode == 'property' &&
        item.IsShow) ||
      (item.cFormPropertyCode == 'ManageCenter.User.M.Edit.Policy.Grid' &&
        item.Resource.cAttributeTypeCode == 'property' &&
        item.IsShow)
    ) {
      let itemDatas = {
        checkType: item.IsShow,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        lock: false,
        filters: [],
        cFormPropertyCode: item.cFormPropertyCode
      };
      UsertableColumns.value.push(itemDatas);
    }
    if (
      (item.cFormPropertyCode === 'ManageCenter.User.M.Add.Role.Grid' &&
        item.Resource.cAttributeTypeCode == 'property' &&
        item.IsShow) ||
      (item.cFormPropertyCode === 'ManageCenter.User.M.Edit.Role.Grid' &&
        item.Resource.cAttributeTypeCode == 'property' &&
        item.IsShow)
    ) {
      let itemData = {
        checkType: item.IsShow,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        lock: false,
        filters: [],
        cFormPropertyCode: item.cFormPropertyCode
      };
      RoletableColumns.value.push(itemData);
    }
    if (item.Resource.cAttributeTypeCode === 'binddata') {
      if (item.cAttributeCode == 'GetUserPolicy') {
        userAxiosData.value = item;
        usertableAxios();
      } else {
        roleAxiosData.value = item;
        roletableAxios();
      }
    }
  });
};
//分按钮数据处理
const funBtn = (arr: Array<any>) => {
  arr.forEach(item => {
    if (
      item.cFormPropertyCode === 'ManageCenter.User.M.Edit.ToolBut' ||
      item.cFormPropertyCode === 'ManageCenter.User.M.Add.ToolBut'
    ) {
      FBut.value.push(item);
    }
    if (
      item.cFormPropertyCode === 'ManageCenter.User.M.Edit.Policy.ToolBut' ||
      item.cFormPropertyCode === 'ManageCenter.User.M.Add.Policy.ToolBut'
    ) {
      UserBut.value.push(item);
    }
    if (
      item.cFormPropertyCode === 'ManageCenter.User.M.Edit.Role.ToolBut' ||
      item.cFormPropertyCode === 'ManageCenter.User.M.Add.Role.ToolBut'
    ) {
      RoleBut.value.push(item);
    }
  });
};
// 用户策略table filters
const usertablefilter = () => {
  UsertableColumns.value.forEach((aItem: any) => {
    let filData = [] as any;
    UsertableData.value.forEach((bItem: any) => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter(
        (item: { text: any }, index: any, self: any[]) => {
          const i = self.findIndex((t: { text: any }) => t.text === item.text);
          return i === index;
        }
      );
    }
  });
};
// 角色策略table filters
const roletablefilter = () => {
  RoletableColumns.value.forEach((aItem: any) => {
    let filData = [] as any;
    RoletableData.value.forEach((bItem: any) => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter(
        (item: { text: any }, index: any, self: any[]) => {
          const i = self.findIndex((t: { text: any }) => t.text === item.text);
          return i === index;
        }
      );
    }
  });
};
//表格数据查询
//策略数据
const usertableAxios = async () => {
  let data = {
    method: userAxiosData.value.Resource.cHttpTypeCode,
    url:
      userAxiosData.value.Resource.cServerIP +
      userAxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: row.value
        ? `cLoginName=${row.value.cLoginName}`
        : `cLoginName=''`
    }
  };
  try {
    // ElLoading.service({lock: true,text: '加载中.....'})
    const res = await DataApi(data);
    if (res.status == 200) {
      UsertableData.value = res.data.data;
      userPolicytotal.value = res.data.dataCount;
      usertablefilter();
      TUref.value.handleRemoveSelectionChange();
      // ElLoading.service().close()
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错');
    ElLoading.service().close();
  }
};
//策略分页
const UserPolicyChange = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  usertableAxios();
};
//角色数据
const roletableAxios = async () => {
  let data = {
    method: roleAxiosData.value.Resource.cHttpTypeCode,
    url:
      roleAxiosData.value.Resource.cServerIP +
      roleAxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: row.value
        ? `cLoginName=${row.value.cLoginName}`
        : `cLoginName=''`
    }
  };
  try {
    // ElLoading.service({lock: true,text: '加载中.....'})
    const res = await DataApi(data);
    if (res.status == 200) {
      RoletableData.value = res.data.data;
      roletotal.value = res.data.dataCount;
      roletablefilter();
      TrRef.value.handleRemoveSelectionChange();
      ElLoading.service().close();
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错');
    ElLoading.service().close();
  }
};
//角色分页
const roleChange = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  roletableAxios();
};
// table 按钮 集合
const clickTableBut = (val: string) => {
  switch (val) {
    // case "View":
    //     clickView()
    //     break;
    default:
      break;
  }
};

//新增保存
const SaveAdd = async (obj: any) => {
  obj.pathName = 'usersG';
  headRef.value.validate(obj);
};
const PolicBtn = ref([]) as any;
const objModelCode = ref('') as any;
//用户策略添加
const UserPolicyAdd = (obj: any) => {
  ElLoading.service({ lock: true, text: '加载中.....' });
  CLAdddialogFormVisible.value = true;
  objModelCode.value = obj.cIncludeModelCode;
  configApi(objModelCode.value).then(res => {
    if (res.status == 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          PolicBtn.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          AdduserfunTable(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
        }
      });
    }
  });
};
// 弹窗用户策略table filters
const Trtablefilter = () => {
  AddusertableColumns.value.forEach((aItem: any) => {
    let filData = [] as any;
    TCUsertableData.value.forEach((bItem: any) => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter(
        (item: { text: any }, index: any, self: any[]) => {
          const i = self.findIndex((t: { text: any }) => t.text === item.text);
          return i === index;
        }
      );
    }
  });
};
// 弹窗添加用户策略table数据
const AdduserfunTable = (arr: Array<any>) => {
  AddusertableColumns.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: item.IsShow,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        filters: [],
        cFormPropertyCode: item.cFormPropertyCode
      };
      AddusertableColumns.value.push(itemData);
    }
    // if (item.Resource.cAttributeTypeCode == 'method') {
    //     let itemData = { checkType: true, label: '操作', slotName: 'button' }
    //     AddusertableColumns.value.push(itemData)
    //     AddusertableColumns.value = AddusertableColumns.value.filter((item: { label: any; }, index: any, self: any[]) => {
    //         const i = self.findIndex((t: { label: any; }) => t.label === item.label);
    //         return i === index;
    //     })
    // }
    if (item.Resource.cAttributeCode == 'GetPolicy') {
      TCuserAxiosData.value = item;
      TCtableAxios();
    }
  });
};
//策略窗表格数据
const TCtableAxios = async () => {
  let data = {
    method: TCuserAxiosData.value.Resource.cHttpTypeCode,
    url:
      TCuserAxiosData.value.Resource.cServerIP +
      TCuserAxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      TCUsertableData.value = res.data.data;
      // total.value = res.data.dataCount
      Trtablefilter();
      TUref.value.handleRemoveSelectionChange();
      ElLoading.service().close();
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错');
    ElLoading.service().close();
  }
};
const code = ref();
//用户策略弹窗表格多选
const SelectPolicyList = ref([]) as any;
const UThandleSelectionChange = (arr: any) => {
  SelectPolicyList.value = arr;
  ElMessage.info('新用户未保存，不能添加策略');
  CLAdddialogFormVisible.value = false;
};

//弹窗用户添加策略保存
const UserPolicySaveAdd = async (obj: any) => {
  code.value = '';
  SelectPolicyList.value.forEach((item: any) => {
    code.value = item.cPolicyCode;
  });
  if (row.value) {
    //编辑页面下，添加策略
    let dd: any = [];

    if (SelectPolicyList.value.length) {
      SelectPolicyList.value.forEach((item: any) => {
        dd.push({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          cLoginName: row.value.cLoginName || '',
          cPolicyCode: item.cPolicyCode
        });
      });
    }

    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      data: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // "cLoginName": row.value.cLoginName,
        // "cPolicyCode": code.value
        Items: dd
      }
    };
    try {
      const res = await DataApi(data);
      if (res.status == 200) {
        ElMessage.success('新增策略成功');
        usertableAxios();
        CLAdddialogFormVisible.value = false;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ElMessage.error(res.msg);
      }
    } catch (error) {
      console.log(error, '程序出错');
    }
  } else {
    //新增页面下，添加策略
    // if(!LoginName.value) {
    //     ElMessage.info('请先新增用户')
    //     return
    // }
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      data: {
        cLoginName: LoginName.value,
        cPolicyCode: code.value
      }
    };
    try {
      const res = await DataApi(data);
      ElLoading.service({ lock: true, text: '加载中.....' });
      if (res.status == 200) {
        ElMessage.success('新增策略成功');
        usertableAxios();
        CLAdddialogFormVisible.value = false;
        ElLoading.service().close();
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ElMessage.error(res.msg);
        ElLoading.service().close();
      }
    } catch (error) {
      console.log(error, '程序出错');
      ElLoading.service().close();
    }
  }
};
//用户策略多选
const UserID = ref([]) as any;
const handleSelectionChange = (arr: any) => {
  // arr.forEach((item: { UID: any; }) =>
  //     sendId.value.push(item.UID)
  // )
  UserID.value = arr;
};
//删除用户策略
const UserPolicyDelete = (obj: any) => {
  sendId.value = [];
  UserID.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
  if (sendId.value.length <= 0) {
    ElMessage.info('请勾选要删除的数据');
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };
  ElMessageBox.confirm('确定删除数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage.success('删除数据成功');
          usertableAxios();
          TUref.value.handleRemoveSelectionChange();
          sendId.value = [];
        } else {
          console.log('删除失败');
          sendId.value = [];
        }
      });
    })
    .catch(() => {
      ElMessage.info('取消删除');
      sendId.value = [];
    });
};
//添加用户角色
const UserRoleAdd = (obj: any) => {
  ElLoading.service({ lock: true, text: '加载中.....' });
  JSAdddialogFormVisible.value = true;
  configApi(obj.cIncludeModelCode).then(res => {
    res.data.forEach((item: any) => {
      if (item.cPropertyClassTypeCode == 'ToolBut') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        PolicBtn.value = item[import.meta.env.VITE_APP_key].sort(
          compare('iIndex', true)
        );
      }
      if (item.cPropertyClassTypeCode == 'Grid') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        AddrolefunTable(
          item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
        );
      }
    });
  });
};
// 弹窗添加角色table数据
const AddrolefunTable = (arr: Array<any>) => {
  AddroletableColumns.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: item.IsShow,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        filters: [],
        cFormPropertyCode: item.cFormPropertyCode
      };
      AddroletableColumns.value.push(itemData);
    }
    if (item.Resource.cAttributeTypeCode == 'method') {
      let itemData = { checkType: true, label: '操作', slotName: 'button' };
      // AddtableButton.value.push(item)
      AddroletableColumns.value.push(itemData);
      AddroletableColumns.value = AddroletableColumns.value.filter(
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
    if (item.Resource.cAttributeCode == 'GetRole') {
      TCroleAxiosData.value = item;
      TCRtableAxios();
    }
  });
};
// 弹窗用户策略table filters
const TRoletablefilter = () => {
  AddroletableColumns.value.forEach((aItem: any) => {
    let filData = [] as any;
    TCroletableData.value.forEach((bItem: any) => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter(
        (item: { text: any }, index: any, self: any[]) => {
          const i = self.findIndex((t: { text: any }) => t.text === item.text);
          return i === index;
        }
      );
    }
  });
};
//角色弹窗表格数据
const TCRtableAxios = async () => {
  let data = {
    method: TCroleAxiosData.value.Resource.cHttpTypeCode,
    url:
      TCroleAxiosData.value.Resource.cServerIP +
      TCroleAxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      TCroletableData.value = res.data.data;
      total.value = res.data.dataCount;
      TRoletablefilter();
      TRref.value.handleRemoveSelectionChange();
      ElLoading.service().close();
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错');
    ElLoading.service().close();
  }
};
//角色弹窗数据分页
//页码变化
const RoleChange = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  TCRtableAxios();
};
//角色多选
const Rid = ref([]) as any;
const RhandleSelectionChange = (arr: any) => {
  // arr.forEach((item: { UID: any; }) =>
  //     rSendId.value.push(item.UID)
  // )
  Rid.value = arr;
};
//删除用户角色
const UserRoleDelete = (obj: any) => {
  rSendId.value = [];
  Rid.value.forEach((item: { UID: any }) => rSendId.value.push(item.UID));
  if (rSendId.value.length <= 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ElMessage.info('请勾选要删除的数据');
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: rSendId.value
  };
  ElMessageBox.confirm('确定删除数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage.success('删除数据成功');
          roletableAxios();
          TrRef.value.handleRemoveSelectionChange();
          rSendId.value = [];
        } else {
          rSendId.value = [];
          console.log('删除失败');
        }
      });
    })
    .catch(() => {
      rSendId.value = [];
      ElMessage.info('取消删除');
    });
};
const rcode = ref('');
//弹窗角色多选
const SelectRoleList = ref([]) as any;
const RThandleSelectionChange = (arr: any) => {
  SelectRoleList.value = arr;
  ElMessage.info('新用户未保存，不能添加角色');
  JSAdddialogFormVisible.value = false;
};
//弹窗用户角色添加保存
const UserRoleSaveAdd = async (obj: any) => {
  rcode.value = '';
  SelectRoleList.value.forEach(
    (item: any) => (rcode.value = item.cRoleCode)
    // rcode.value.push(item.cRoleCode)
  );
  if (rcode.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选数据'
    });
    return;
  }

  //编辑页面下添加角色
  if (row.value) {
    let dd: any = [];

    if (SelectRoleList.value.length) {
      SelectRoleList.value.forEach((item: any) => {
        dd.push({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          cLoginName: row.value.cLoginName || '',
          cRoleCode: item.cRoleCode
        });
      });
    }

    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      data: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // "cLoginName": row.value.cLoginName,
        // "cRoleCode": rcode.value
        Items: dd
      }
    };
    try {
      const res = await DataApi(data);
      if (res.status == 200) {
        ElMessage.success('新增角色成功');
        roletableAxios();
        JSAdddialogFormVisible.value = false;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ElMessage.error(res.msg);
      }
    } catch (error) {
      console.log(error, '程序出错');
    }
  } else {
    //新增页面下添加角色
    // if(!LoginName.value) {
    //     ElMessage.info('请先新增用户')
    //     return
    // }
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      data: {
        cLoginName: LoginName.value,
        cRoleCode: rcode.value
      }
    };
    try {
      const res = await DataApi(data);
      ElLoading.service({ lock: true, text: '加载中.....' });
      if (res.status == 200) {
        ElMessage.success('新增角色成功');
        roletableAxios();
        JSAdddialogFormVisible.value = false;
        ElLoading.service().close();
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ElMessage.error(res.msg);
        ElLoading.service().close();
      }
    } catch (error) {
      console.log(error, '程序出错');
      ElLoading.service().close();
    }
  }
};
//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'usersG';
  headRef.value.validate(obj);
};
// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    // tableColumns.value = val.list
    tabType.value = true;
  });
};
</script>

<style scoped lang="scss">
.maintain {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .bot-btn {
    margin: 20px 0;
  }
  .two-Grid {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-around;
    .LeftUser {
      width: 100%;
      margin-right: 20px;
      .LeftUserPage {
        display: block;
      }
      .lettable {
        :deep(.el-card__body) {
          display: flex;
          justify-content: space-between;
          .myTable {
            width: 100%;
          }
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
    }
    .RightRole {
      width: 100%;
      .righttable {
        :deep(.el-card__body) {
          display: flex;
          justify-content: space-between;
          .myTable {
            width: 100%;
          }
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
    }
  }
}
.maintain .selectSty {
  width: 233px;
}
:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
