<template>
  <!-- 角色授权 -->
  <div class="RoleAll">
    <div class="menBox">
      <!-- 左侧角色表格 -->
      <div class="menLeft">
        <el-card>
          <div class="Leftinput">
            <FilterForm
              :Filter="Filter"
              @ClickSearch="ClickSearch"
              @resetForm="resetForm"
            ></FilterForm>
          </div>
          <div class="card-box">
            <Table
              ref="Tref"
              v-if="tabType"
              :tableData="tableData"
              :tableColumns="tableColumns"
              :tableBorder="true"
              :selection="false"
              @handleSelectionChange="handleSelectionChange"
            >
            </Table>
            <pagination
              v-if="total > 0"
              :total="total"
              v-model:page="queryParams.PageIndex"
              v-model:limit="queryParams.PageSize"
              @pagination="changPage"
            />
          </div>
        </el-card>
      </div>
      <!-- 右侧树结构 -->
      <div class="menRight">
        <!-- 按钮区域 -->
        <el-card>
          <div v-for="item in Btn" :key="item.cAttributeCode" class="btn">
            <el-button @click="clickBtn(item)">{{
              item.Resource.cAttributeName
            }}</el-button>
          </div>
          <el-tree
            ref="treeRef"
            :data="Treedata"
            show-checkbox
            highlight-current
            :check-strictly="isCheck"
            node-key="cCode"
            :default-expand-all="false"
            :default-checked-keys="checkedData"
            :props="defaultProps"
            @check-change="getCheckedNodes"
            :render-content="renderContent"
            @node-expand="handleExpand"
          />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  nextTick,
  PropType,
  watch,
  toRefs,
  onActivated,
  reactive,
  onMounted
} from 'vue';
import Table from '@/components/MyFormTable/index.vue';
import { sessionStorage } from '@/utils/storage';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import FilterForm from '@/components/Filter/index.vue';
import { ElTree, ElMessage, ElLoading } from 'element-plus';
import { filterModel, compare } from '@/utils';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
const input = ref('');
const initType = ref(true);
onActivated(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let val = window.sessionStorage.getItem('clickSider')
    ? JSON.parse(window.sessionStorage.getItem('clickSider'))
    : '';
  if (val == Route.name) {
    initType.value = false;
    getData(Route.meta.ModelCode);
  }
  if (initType.value) {
    getData(Route.meta.ModelCode);
  }
  initType.value = false;
});
onMounted(() => {
  changeCss();
});
// 新增/编辑后的刷新
$bus.on('tableUpData', (v: any) => {
  setTimeout(() => {
    if (v.name == 'menuMangment') {
      tableAxios();
    }
  }, 300);
});
let Filter = ref([]) as any;
//表格配置数据
const Tref = ref();
const tabType = ref(true);
const tableColumns = ref([]) as any;
const tableData = ref([]) as any;
const AxiosData = ref({}) as any;
const ClickData = ref({}) as any;
const Btn = ref([]) as any;
const total = ref(0);
const data = reactive({
  Conditions: '',
  OrderByFileds: ''
});
const { Conditions, OrderByFileds } = toRefs(data);
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//树结构配置数据
const isCheck = ref(false);
const treeRef = ref<InstanceType<typeof ElTree>>();
const Treedata = ref([]) as any;
const defaultProps = {
  children: 'Childs',
  label: 'cName',
  // label: 'cCode',
  disabled: 'IsSelected'
};
//选中数据
const checkedData = ref([]) as any;
//保存需要数据
const RoleCode = ref([]) as any;
const AuthCode = ref([]) as any;
//调取菜单管理接口
const getData: any = async (val: string) => {
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await configApi(val);
    if (res.status == 200) {
      tableColumns.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Tree') {
          funTree(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          Btn.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
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
// table 数据处理
const funTable = (arr: Array<any>) => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: item.IsShow,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        lock: false,
        filters: [],
        cFormPropertyCode: item.cFormPropertyCode
      };
      tableColumns.value.push(itemData);
    }
    if (item.Resource.cAttributeTypeCode == 'binddata') {
      AxiosData.value = item;
      tableAxios();
    }
    if (item.Resource.cAttributeTypeCode == 'Click') {
      ClickData.value = item;
    }
  });
};
//获取table数据
const tableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await DataApi(data);
    if (res.status == 200) {
      tableData.value = res.data.data;
      total.value = res.data.dataCount;
      Tref.value.handleRemoveSelectionChange();
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
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};
//表格选中
const handleSelectionChange = (arr: any) => {
  treeRef.value!.setCheckedKeys([], false);
  // AuthCode.value=[]
  //选中的角色编码
  RoleCode.value = arr;
  console.log(RoleCode.value, '--999RoleCode.value');
  checkedData.value = [];
  if (arr.length == 0) {
    return;
  }
  //获取当前角色所拥有的权限
  let data = {
    method: ClickData.value.Resource.cHttpTypeCode,
    url: ClickData.value.Resource.cServerIP + ClickData.value.Resource.cUrl,
    params: { val: arr[0].cRoleCode }
    // params: { "Conditions": `cRoleCode=${arr[0].cRoleCode}` },
  };
  ParamsApi(data).then(res => {
    // isCheck.value = true
    if (res.status === 200) {
      if (res.data.length == 0) {
        checkedData.value = [];
      } else {
        checkedData.value = res.data || [];
        // checkedData.value=['权限管理']
        // res.data.forEach((item: { cAuthCode: any; }) =>
        //     //树结构选中的数据(数据回显)
        //     checkedData.value.push(item.cAuthCode)
        // )
      }
      nextTick(() => {
        treeRef.value!.setCheckedKeys(checkedData.value, false);
        isCheck.value = false;
      });
    }
  });
};

//第一次树结构数据处理(加全局禁用)
const funTree = (arr: Array<any>) => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'binddata') {
      let data = {
        method: item.Resource.cHttpTypeCode,
        url: item.Resource.cServerIP + item.Resource.cUrl,
        params: ''
      };
      ParamsApi(data).then(res => {
        if (res.status === 200) {
          filterList(res.data, null);
          res.data.forEach((item: { disabled: boolean; Child: any }) => {
            // item.disabled = true
            if (item.Child) {
              deePeEach(item.Child);
            }
          });
          Treedata.value = res.data;
        }
        console.log(Treedata.value, '遍历数据-----------');
        setTimeout(() => {
          changeCss();
        }, 10);
      });
    }
  });
};
const filterList = (myList: any, Code: any) => {
  return myList
    .filter((item: any) => {
      return item.code != Code; //过滤条件
    })
    .map((item: any) => {
      item = Object.assign({}, item);
      if (item.children) {
        item.children = filterList(item.children, Code);
      }
      return item;
    });
};
const deePeEach = (arr: any) => {
  arr.forEach((item: { disabled: boolean; Child: any }) => {
    // item.disabled = true
    if (item.Child) {
      deePeEach(item.Child);
    }
  });
};
//获取选中树结构数据
const getCheckedNodes = () => {
  AuthCode.value = treeRef.value!.getCheckedNodes(false, true);
  console.log(AuthCode.value, '权限数据----');
};
//按钮合集
const clickBtn = (event: any) => {
  console.log(event.cAttributeCode, '--Save');

  switch (event.cAttributeCode) {
    case 'Save':
      SaveInfo(event);
      break;
    case 'Edit':
      RoleEdit(event);
      break;
    default:
      break;
  }
};
//编辑按钮(重新获取数据,获取保存按钮)
const RoleEdit = async (item: any) => {
  ElLoading.service({ lock: true, text: '加载中.....' });
  const res = await configApi(item.cIncludeModelCode);
  if (res.status == 200) {
    tableColumns.value = [];
    res.data.forEach((item: any) => {
      if (item.cPropertyClassTypeCode == 'Tree') {
        funTrees(item[import.meta.env.VITE_APP_key]);
      }
      if (item.cPropertyClassTypeCode == 'Grid') {
        funTable(item[import.meta.env.VITE_APP_key]);
      }
      if (item.cPropertyClassTypeCode == 'ToolBut') {
        Btn.value = item[import.meta.env.VITE_APP_key];
      }
      if (item.cPropertyClassTypeCode == 'Filter') {
        Filter.value = item[import.meta.env.VITE_APP_key];
      }
    });
  } else {
    console.log('请求出错');
    ElLoading.service().close();
  }
};
//再处理树结构(取消全局禁用)
const funTrees = (arr: any) => {
  arr.forEach(
    (item: {
      Resource: {
        cAttributeTypeCode: string;
        cHttpTypeCode: any;
        cUrl: any;
        cServerIP: any;
      };
    }) => {
      if (item.Resource.cAttributeTypeCode == 'binddata') {
        let data = {
          method: item.Resource.cHttpTypeCode,
          url: item.Resource.cServerIP + item.Resource.cUrl,
          params: ''
        };
        ParamsApi(data).then(res => {
          if (res.status === 200) {
            Treedata.value = res.data;
          }
        });
      }
    }
  );
  setTimeout(() => {
    changeCss();
  }, 10);
};
//保存
const sendArr = ref([]) as any;
const SaveInfo = (item: any) => {
  console.log(AuthCode.value, '---AuthCode.value');
  console.log(RoleCode.value, '---RoleCode.value');
  // return false
  if (!RoleCode.value.length) {
    ElMessage.info('请选择角色');
    return false;
  }
  if (!AuthCode.value.length) {
    ElMessage.info('请选择权限');
    return false;
  }

  // return false
  sendArr.value = [];
  for (let item of RoleCode.value) {
    for (let i of AuthCode.value) {
      sendArr.value.push({
        cRoleCode: item.cRoleCode,
        // cAuthCode: i.cAuthCode
        cAuthCode: i.cCode
      });
    }
  }

  // AuthCode.value.forEach((i:any)=>{
  //         sendArr.value.push({
  //             cRoleCode: RoleCode.value[0].cRoleCode,
  //             // cAuthCode: i.cAuthCode
  //             cAuthCode: i.cCode
  //         })
  // })
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: { models: sendArr.value }
  };
  console.log(data, '---提交的数据');

  ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
    if (res.status == 200) {
      ElMessage.success('权限保存成功');
      Tref.value.handleRemoveSelectionChange();
      treeRef.value!.setCheckedKeys([], false);
    } else {
      console.log('失败');
      ElMessage.error(res.msg || '500');
    }
    ElLoading.service().close();
  });
};

// 搜索
const ClickSearch = (val: any) => {
  queryParams.PageIndex = 1;
  Conditions.value = filterModel(val.value);
  tableAxios();
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  tableAxios();
  Tref.value.clearFilter();
};
const handleExpand = () => {
  setTimeout(() => {
    changeCss();
  }, 10);
};
const changeCss = () => {
  var levelName = document.getElementsByClassName('foo'); // levelname是上面的最底层节点的名字
  for (var i = 0; i < levelName.length; i++) {
    // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    levelName[i].parentNode.style.cssFloat = 'left'; // 最底层的节点，包括多选框和名字都让他左浮动
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    levelName[i].parentNode.style.styleFloat = 'left';
    // levelName[i].parentNode.onmouseover = function() {
    //     style.backgroundColor = "red";
    // };
  }
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const renderContent = (h: any, { node, data, store }) => {
  //树节点的内容区的渲染 Function
  // console.log(node,"--==node");
  // console.log(data,"--==data");
  // console.log(store,"--==store");

  let classname = '';
  // 由于项目中有三级菜单也有四级级菜单，就要在此做出判断
  if (!data.Childs) {
    classname = 'foo';
  }
  // if (node.level === 2) {
  //     classname = "foo_p";
  // }
  // if (node.level === 4) {
  //     classname = "foo";
  // }
  // if (node.level === 3 && node.childNodes.length === 0) {
  //     classname = "foo";
  // }
  return h(
    'p',
    {
      class: classname
    },
    node.label
    // node.label+node.level
  );
};
</script>

<style lang="scss" setup>
.RoleAll {
  height: 100%;

  .menBox {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 100%;

    .menLeft {
      width: 40%;
      margin: 0 10px;
      height: 120%;
    }

    .menRight {
      width: 60%;
      margin: 0 10px;

      // .el-tree-node__children .el-tree-node__children .el-tree-node {
      //     float: left;
      // }
    }
  }

  .el-card__body {
    margin: 10px;

    .btn {
      // margin: 0 50%;
      padding-bottom: 20px;
    }
  }
}
// /* 控制树形节点横向显示 */
// .el-tree-node.is-expanded>.el-tree-node__children{
//     display:flex;
//     flex-wrap: wrap; /* flex横向布局换行显示 */
// }

// /* 去除点击收缩图标时：横向显示的数据会先晃动成纵向显示的再收缩的现象*/
// .collapse-transition{
//     transition:none !important;
// }
</style>
