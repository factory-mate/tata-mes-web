/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { PermissionState } from './types';
import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import { listRoutes } from '@/api/menu';

const modules = import.meta.glob('../../views/**/**.vue');
export const Layout = () => import('@/layout/index.vue');

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    if (roles.includes('ROOT')) {
      return true;
    }
    return roles.some(role => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role);
      }
    });
  }
  return false;
};

export const filterAsyncRoutes = (routes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = [];

  routes.forEach(route => {
    const tmp = { ...route } as any;

    // if (hasPermission(roles, tmp)) {

    if (tmp.component == 'Layout') {
      tmp.component = Layout;
    } else {
      // if(route.cMenuName=='销售出库通知单'){
      //   console.log(tmp.component,"--==tmp.component");

      // }
      const component = modules[`../../views/${tmp.component}.vue`] as any;

      // tmp.path=tmp.component
      if (component) {
        tmp.component = component;
      } else {
        tmp.component = modules[`../../views/error-page/404.vue`];
      }
    }

    res.push(tmp);
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children);
    }
    // }
  });
  // console.log(res,"--res")
  return res;
};
// 重组router

export const RegroupRoutes = (router: Array<string>, type: any) => {
  const tree: any[] = [];
  if (router.length > 0) {
    router.map((item, i) => {
      const treeItem = {};
      // treeItem.path=item.cComponent=='Layout'?"/"+item.cPath:item.cPath+'/:rowId'
      if (item.cComponent == 'Layout') {
        treeItem.path = '/' + item.cPath;
        treeItem.type = type;
      } else {
        treeItem.type = type;
        if (item.IsHidden) {
          treeItem.path = item.cPath + '/:rowId/:t';
        } else {
          treeItem.path = item.cPath;
        }
      }
      if (item.cComponent == 'Layout') {
        treeItem.component = Layout;
      } else {
        const component = modules[`../../views/${item.cComponent}.vue`] as any;
        // tmp.path=tmp.component
        if (component) {
          treeItem.component = component;
        } else {
          treeItem.component = modules[`../../views/error-page/404.vue`];
        }
      }
      // treeItem.component=item.iIndex===0?'Layout':item.cComponent

      treeItem.name = item.cPath;
      treeItem.iIndex = item.iIndex;
      treeItem.meta = {
        title: item.cMenuName,
        icon: item.cIcon,
        hidden: item.IsHidden,
        ModelCode: item.cModelCode,
        cUrl: item.cUrl,
        keepAlive: true
      };
      treeItem.children = item.Child
        ? RegroupRoutes(item.Child, type + 1)
        : null;
      if (treeItem.name && treeItem.component && treeItem.path) {
        tree.push(treeItem);
      } else {
        console.error('存在未配置的路由', treeItem.meta.title);
      }
    });
  }
  return tree;
};

const routerData: RouteRecordRaw[] = [
  // {
  //   path: '/device',
  //   component: 'Layout',
  //   name: 'device',
  //   meta: { title: '设备管理', icon: 'rabbitmq', roles: ['ADMIN'] },
  //   redirect: '/device/statement',
  //   children: [
  //     {
  //       path: 'statement',
  //       component: 'device/statement/index',
  //       name: 'statement',
  //       meta: { title: '数据报表', type: true, roles: ['ADMIN'] },
  //       redirect: '/device/statement/maintain',
  //       children: [
  //         {
  //           path: 'maintain',
  //           component: 'device/statement/maintain/index',
  //           name: 'maintain',
  //           meta: { title: '保养用时统计', hidden: false, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'polling',
  //           component: 'device/statement/polling/index',
  //           name: 'polling',
  //           meta: { title: '巡检用时统计', hidden: false, roles: ['ADMIN'] }
  //         },
  //       ]
  //     },
  //     {
  //       path: 'record',
  //       component: 'device/record/index',
  //       name: 'record',
  //       meta: { title: '基础档案', hidden: false, roles: ['ADMIN'] },
  //       redirect: '/device/record/devicetype',
  //       children: [
  //         {
  //           path: 'devicetype',
  //           component: 'device/record/devicetype/index',
  //           name: 'devicetype',
  //           meta: { title: '设备类型', hidden: false, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'classify',
  //           component: 'device/record/classify/index',
  //           name: 'classify',
  //           meta: { title: '设备分类', hidden: false, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'parameter',
  //           component: 'device/record/parameter/index',
  //           name: 'parameter',
  //           meta: { title: '设备参数', hidden: false, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'patro',
  //           component: 'device/record/patro/index',
  //           name: 'patro',
  //           meta: { title: '巡保项目', hidden: false, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'devicelist',
  //           component: 'device/record/devicelist/index',
  //           name: 'devicelist',
  //           meta: { title: '设备列表', hidden: false, roles: ['ADMIN'] },
  //         },
  //         {
  //           path:'add',
  //           component:'device/record/devicelist/components/index',
  //           name:'deviceAdd',
  //           meta: { title: '设备列表详情', hidden: true,roles: ['ADMIN'] }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'docs',
  //       component: 'device/docs/index',
  //       name: 'docs',
  //       meta: { title: '业务单据', hidden: false, roles: ['ADMIN'] },
  //       redirect: '/device/docs/datadoc',
  //       children: [
  //         {
  //           path: 'datadoc',
  //           component: 'device/docs/datadoc/index',
  //           name: 'datadoc',
  //           meta: { title: '设备日历', hidden: false, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'polldoc',
  //           component: 'device/docs/polldoc/index',
  //           name: 'polldoc',
  //           meta: { title: '巡检单', hidden: false, roles: ['ADMIN'] },
  //         },
  //         {
  //           path: 'upkeep',
  //           component: 'device/docs/upkeep/index',
  //           name: 'upkeep',
  //           meta: { title: '保养单', hidden: false, roles: ['ADMIN'] }
  //         },

  //         {
  //           path: 'failure',
  //           component: 'device/docs/failure/index',
  //           name: 'failure',
  //           meta: { title: '故障申报单', hidden: false, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'repair',
  //           component: 'device/docs/repair/index',
  //           name: 'repair',
  //           meta: { title: '维修单', hidden: false, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'changepoll',
  //           component: 'device/docs/polldoc/components/change',
  //           name: 'changepoll',
  //           meta: {title: '修改巡检单', hidden: true,roles: ['ADMIN'] },
  //         },
  //         {
  //           path: 'detailpoll',
  //           component: 'device/docs/polldoc/components/detail',
  //           name: 'detailpoll',
  //           meta: { title: '巡检单详情', hidden: true,roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'changeupk',
  //           component: 'device/docs/upkeep/components/change',
  //           name: 'changeupk',
  //           meta: {  title: '修改保养单', hidden: true,roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'detailupk',
  //           component: 'device/docs/upkeep/components/detail',
  //           name: 'detailupk',
  //           meta: { title: '保养单详情', hidden: true, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'addfail',
  //           component: 'device/docs/failure/components/add',
  //           name: 'addfail',
  //           meta: { title: '添加故障申报', hidden: true, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'detailfail',
  //           component: 'device/docs/failure/components/detail',
  //           name: 'detailfail',
  //           meta: { title: '故障申报详情', hidden: true, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'addrep',
  //           component: 'device/docs/repair/components/add',
  //           name: 'addrep',
  //           meta: { title: '添加维修单', hidden: true, roles: ['ADMIN'] }
  //         },
  //         {
  //           path: 'detailrep',
  //           component: 'device/docs/repair/components/detail',
  //           name: 'detailrep',
  //           meta: { title: '维修单详情', hidden: true, roles: ['ADMIN'] }
  //         },
  //       ]
  //     },
  //   ]
  // },
  // {
  //   path:'/basematerial',
  //   component:'Layout',
  //   name:'basematerial',
  //   meta: { title: '基础资料', icon: 'dict', roles: ['ADMIN'] },
  //   redirect: '/basematerial/currency',
  //   children:[
  //     {
  //       path: 'currency',
  //       component: 'basematerial/currency/index',
  //       name: 'currency',
  //       meta: { title: '币别', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'unit',
  //       component: 'basematerial/unit/index',
  //       name: 'unit',
  //       meta: { title: '计量单位', hidden: false, roles: ['ADMIN'] },
  //     },
  //     //计量单位跳转页面
  //     {
  //       path: 'detailunit',
  //       component: 'basematerial/unit/components/detailunit/index',
  //       name: 'detailunit',
  //       meta: { title: '计量单位详情', hidden: true, roles: ['ADMIN'] }
  //     },
  //     {
  //       path: 'addunit',
  //       component: 'basematerial/unit/components/addunit/index',
  //       name: 'addunit',
  //       meta: { title: '添加计量单位', hidden: true, roles: ['ADMIN'] }
  //      },
  //     {
  //       path: 'supplier',
  //       component: 'basematerial/supplier/index',
  //       name: 'supplier',
  //       meta: { title: '供应商', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'client',
  //       component: 'basematerial/client/index',
  //       name: 'client',
  //       meta: { title: '客户', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'staff',
  //       component: 'basematerial/staff/index',
  //       name: 'staff',
  //       meta: { title: '职员', hidden: false, roles: ['ADMIN'] },
  //     },
  //     //职员跳转页面
  //     {
  //       path: 'addstaff',
  //       component: 'basematerial/staff/components/addstaff/index',
  //       name: 'addstaff',
  //       meta: { title: '添加职员', hidden: true, roles: ['ADMIN'] }
  //     },
  //     {
  //       path: 'detailstaff',
  //       component: 'basematerial/staff/components/detailstaff/index',
  //       name: 'detailstaff',
  //       meta: { title: '职员详情', hidden: true, roles: ['ADMIN'] }
  //      },
  //      {
  //       path: 'department',
  //       component: 'basematerial/department/index',
  //       name: 'department',
  //       meta: { title: '部门', hidden: false, roles: ['ADMIN'] },
  //     },
  //     //部门跳转页面
  //     {
  //       path: 'adddepartment',
  //       component: 'basematerial/department/components/adddepartment/index',
  //       name: 'adddepartment',
  //       meta: { title: '添加部门', hidden: true, roles: ['ADMIN'] }
  //     },
  //     {
  //       path: 'detaildepartment',
  //       component: 'basematerial/department/components/detaildepartment/index',
  //       name: 'detaildepartment',
  //       meta: { title: '部门详情', hidden: true, roles: ['ADMIN'] }
  //      },
  //      {
  //       path: 'material',
  //       component: 'basematerial/material/index',
  //       name: 'material',
  //       meta: { title: '物料', hidden: false, roles: ['ADMIN'] },
  //      },
  //      {
  //       path: 'materiallist',
  //       component: 'basematerial/materiallist/index',
  //       name: 'materiallist',
  //       meta: { title: '物料列表', hidden: false, roles: ['ADMIN'] },
  //      },
  //      //跳转页面
  //      {
  //       path: 'warehouse',
  //       component: 'basematerial/warehouselist/components/warehouse/index',
  //       name: 'warehouse',
  //       meta: { title: '仓库', hidden: true, roles: ['ADMIN'] },
  //      },
  //      {
  //       path: 'warehouselist',
  //       component: 'basematerial/warehouselist/index',
  //       name: 'warehouselist',
  //       meta: { title: '仓库列表', hidden: false, roles: ['ADMIN'] },
  //      },
  //      {
  //       path: 'space',
  //       component: 'basematerial/spacelist/components/space/index',
  //       name: 'space',
  //       meta: { title: '仓位', hidden: true, roles: ['ADMIN'] },
  //      },
  //      {
  //       path: 'spacelist',
  //       component: 'basematerial/spacelist/index',
  //       name: 'spacelist',
  //       meta: { title: '仓位列表', hidden: false, roles: ['ADMIN'] },
  //      },
  //      {
  //       path: 'helper',
  //       component: 'basematerial/helperlist/components/helper/index',
  //       name: 'helper',
  //       meta: { title: '辅助工具', hidden: true, roles: ['ADMIN'] },
  //      },
  //      {
  //       path: 'helperlist',
  //       component: 'basematerial/helperlist/index',
  //       name: 'helperlist',
  //       meta: { title: '辅助工具列表', hidden: false, roles: ['ADMIN'] },
  //      },
  //      {
  //       path:'resources',
  //       component: 'basematerial/resourceslist/components/resources/index',
  //       name: 'resources',
  //       meta: { title: '辅助资料', hidden: true, roles: ['ADMIN'] },
  //      },
  //      {
  //       path:'resourceslist',
  //       component: 'basematerial/resourceslist/index',
  //       name: 'resourceslist',
  //       meta: { title: '辅助资料列表', hidden: false, roles: ['ADMIN'] },
  //      }
  //   ]
  // },
  // {
  //   path:'/plantsize',
  //   component:'Layout',
  //   name:'plantsize',
  //   meta: { title: '工厂建模', icon: 'rabbitmq', roles: ['ADMIN'] },
  //   redirect: '/plantsize/station',
  //   children:[
  //     {
  //       path: 'relateProduct',
  //       component: 'plantsize/relateProduct/index',
  //       name: 'relateProduct',
  //       meta: { title: '关联产品对照表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'productClass',
  //       component: 'plantsize/productClass/index',
  //       name: 'productClass',
  //       meta: { title: '产品分类对照表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'station',
  //       component: 'plantsize/station/index',
  //       name: 'station',
  //       meta: { title: '工位', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'worklist',
  //       component: 'plantsize/worklist/index',
  //       name: 'worklist',
  //       meta: { title: '工位列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'productline',
  //       component: 'plantsize/productline/index',
  //       name: 'productline',
  //       meta: { title: '生产线', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'productlinelist',
  //       component: 'plantsize/productlinelist/index',
  //       name: 'productlinelist',
  //       meta: { title: '生产线列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'BOMlist',
  //       component: 'plantsize/BOMlist/index',
  //       name: 'BOMlist',
  //       meta: { title: 'BOM列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'processlist',
  //       component: 'plantsize/processlist/index',
  //       name: 'processlist',
  //       meta: { title: '工序列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'process',
  //       component: 'plantsize/processlist/components/process',
  //       name: 'process',
  //       meta: { title: '工序', hidden: true, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'craftlist',
  //       component: 'plantsize/craftlist/index',
  //       name: 'craftlist',
  //       meta: { title: '工艺流程列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'craftprocess',
  //       component: 'plantsize/craftlist/components/craftprocess',
  //       name: 'craftprocess',
  //       meta: { title: '工艺流程', hidden: true, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'teamGrop',
  //       component: 'plantsize/teamGrop/index',
  //       name: 'teamGrop',
  //       meta: { title: '班组', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'classes',
  //       component: 'plantsize/classes/index',
  //       name: 'classes',
  //       meta: { title: '班次', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'classeslist',
  //       component: 'plantsize/classeslist/index',
  //       name: 'classeslist',
  //       meta: { title: '班次列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'factClaendar',
  //       component: 'plantsize/factClaendar/index',
  //       name: 'factClaendar',
  //       meta: { title: '工厂日历', hidden: false, roles: ['ADMIN'] },
  //     },
  //   ]
  // },
  // {
  //   path:'/WorkOrder',
  //   component:'Layout',
  //   name:'WorkOrder',
  //   meta: { title: '工单管理', icon: 'order', roles: ['ADMIN'] },
  //   redirect: 'WorkOrder/ERPOrder',
  //   children:[
  //     {
  //       path: 'ERPOrder',
  //       component: 'WorkOrder/ERPOrder/index',
  //       name: 'ERPOrder',
  //       meta: { title: 'ERP生产订单管理', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'produceTask',
  //       component: 'WorkOrder/produceTask/index',
  //       name: 'produceTask',
  //       meta: { title: '生产任务管理', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'produceTaskEdit',
  //       component: 'WorkOrder/produceTaskEdit/index',
  //       name: 'produceTaskEdit',
  //       meta: { title: '生产任务编辑', hidden: false, roles: ['ADMIN'] },
  //     },
  //   ]
  // },
  // {
  //   path:'/yieldSchedule',
  //   component:'Layout',
  //   name:'yieldSchedule',
  //   meta: { title: '生产排程', icon: 'lab', roles: ['ADMIN'] },
  //   redirect: 'yieldSchedule/ETPcapacity',
  //   children:[
  //     {
  //       path: 'ETPcapacity',
  //       component: 'yieldSchedule/ETPcapacity/index',
  //       name: 'ETPcapacity',
  //       meta: { title: '产品产线产能', hidden: false, roles: ['ADMIN'] },
  //       redirect: 'yieldSchedule/ETPcapacity/ETPcapacityList',
  //       children:[
  //         {
  //           path: 'ETPcapacityList',
  //           component: 'yieldSchedule/ETPcapacity/ETPcapacityList/index',
  //           name: 'ETPcapacityList',
  //           meta: { title: '产品产线产能列表', hidden: false, roles: ['ADMIN'] },
  //         },
  //         {
  //           path: 'productionMes',
  //           component: 'yieldSchedule/ETPcapacity/productionMes/index',
  //           name: 'productionMes',
  //           meta: { title: '产品产线产能信息', hidden: false, roles: ['ADMIN'] },
  //         },
  //       ]
  //     },
  //     {
  //       path: 'productionPlan',
  //       component: 'yieldSchedule/productionPlan/index',
  //       name: 'productionPlan',
  //       meta: { title: '生产排程计划', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'capacityLoad',
  //       component: 'yieldSchedule/capacityLoad/index',
  //       name: 'capacityLoad',
  //       meta: { title: '资源产能负荷', hidden: false, roles: ['ADMIN'] },
  //     },
  //   ]
  // },
  // {
  //   path:'/productReport',
  //   component:'Layout',
  //   name:'productReport',
  //   meta: { title: '生产汇报', icon: 'skill', roles: ['ADMIN'] },
  //   redirect: 'productReport/report',
  //   children:[
  //     {
  //       path: 'report',
  //       component: 'productReport/report',
  //       name: 'report',
  //       meta: { title: '生产', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'check',
  //       component: 'productReport/check',
  //       name: 'check',
  //       meta: { title: '线边仓盘点', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'reportList',
  //       component: 'productReport/reportList',
  //       name: 'reportList',
  //       meta: { title: '线边仓盘点列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //   ]
  // },
  // {
  //   path:'/lighting',
  //   component:'Layout',
  //   name:'lighting',
  //   meta: { title: '安灯管理', icon: 'security', roles: ['ADMIN'] },
  //   redirect: 'lighting/lightClass',
  //   children:[
  //     {
  //       path: 'lightClass',
  //       component: 'lighting/lightClass',
  //       name: 'lightClass',
  //       meta: { title: '安灯呼叫类别', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'lightClassList',
  //       component: 'lighting/lightClassList',
  //       name: 'lightClassList',
  //       meta: { title: '安灯呼叫类别列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //   ]
  // },
  // {
  //   path:'/newSystem',
  //   component:'Layout',
  //   name:'newSystem',
  //   meta: { title: '系统设置', hidden: false,icon: 'system', roles: ['ADMIN'] },
  //   redirect: 'newSystem/systemParameter',
  //   children:[
  //     {
  //       path: 'systemParameter',
  //       component: 'newSystem/systemParameter',
  //       name: 'systemParameter',
  //       meta: { title: '系统参数', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'newSystemParameter',
  //       component: 'newSystem/newSystemParameter',
  //       name: 'newSystemParameter',
  //       meta: { title: '系统参数新增', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'codingRule',
  //       component: 'newSystem/codingRule',
  //       name: 'codingRule',
  //       meta: { title: '编码规则', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'extendFields',
  //       component: 'newSystem/extendFields',
  //       name: 'extendFields',
  //       meta: { title: '扩展字段', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'extendFieldsValue',
  //       component: 'newSystem/extendFieldsValue',
  //       name: 'extendFieldsValue',
  //       meta: { title: '扩展字段取值明显', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'messageList',
  //       component: 'newSystem/messageList',
  //       name: 'messageList',
  //       meta: { title: '通知消息列表', hidden: false, roles: ['ADMIN'] },
  //     },
  //     {
  //       path: 'systemRule',
  //       component: 'newSystem/systemRule/index',
  //       name: 'systemRule',
  //       meta: { title: '系统规则', hidden: false, roles: ['ADMIN'] },
  //       redirect: 'newSystem/systemRule/contrast/colourProcess',
  //       children:[

  //         {
  //           path: 'contrast',
  //           component: 'newSystem/systemRule/contrast/index',
  //           name: 'contrast',
  //           meta: { title: '对照表', hidden: false, roles: ['ADMIN'] },
  //           redirect: '/newSystem/systemRule/contrast/colourProcess',
  //           children:[
  //             {
  //               path: 'PADins',
  //               component: 'newSystem/systemRule/contrast/PADins',
  //               name: 'PADins',
  //               meta: { title: 'PAD安装方式对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'PADproduct',
  //               component: 'newSystem/systemRule/contrast/PADproduct',
  //               name: 'PADproduct',
  //               meta: { title: 'PAD产品对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'stockClassify',
  //               component: 'newSystem/systemRule/contrast/stockClassify',
  //               name: 'stockClassify',
  //               meta: { title: '存货与分类对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'productComp',
  //               component: 'newSystem/systemRule/contrast/productComp',
  //               name: 'productComp',
  //               meta: { title: '成品与子件对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'engineering',
  //               component: 'newSystem/systemRule/contrast/engineering',
  //               name: 'engineering',
  //               meta: { title: '工程单转换对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'HingeLock',
  //               component: 'newSystem/systemRule/contrast/HingeLock',
  //               name: 'HingeLock',
  //               meta: { title: '开向合页锁具安装方式对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'structureD',
  //               component: 'newSystem/systemRule/contrast/structureD',
  //               name: 'structureD',
  //               meta: { title: '结构对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'physicalCity',
  //               component: 'newSystem/systemRule/contrast/physicalCity',
  //               name: 'physicalCity',
  //               meta: { title: '物流城市对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'equipmentD',
  //               component: 'newSystem/systemRule/contrast/equipmentD',
  //               name: 'equipmentD',
  //               meta: { title: '工位设备对照', hidden: false, roles: ['ADMIN'] },
  //             },
  //             {
  //               path: 'colourProcess',
  //               component: 'newSystem/systemRule/contrast/colourProcess/index',
  //               name: 'colourProcess',
  //               meta: { title: '套色对照', hidden: false, roles: ['ADMIN'] },
  //               redirect: 'newSystem/systemRule/contrast/colourProcess/ColourProcessList',
  //               children:[
  //                 {
  //                   path: 'ColourProcessList',
  //                   component: 'newSystem/systemRule/contrast/colourProcess/ColourProcessList',
  //                   name: 'ColourProcessList',
  //                   meta: { title: '套色对照表', hidden: false, roles: ['ADMIN'] },
  //                 },
  //                 {
  //                   path: 'newColourProcess',
  //                   component: 'newSystem/systemRule/contrast/colourProcess/newColor',
  //                   name: 'newColourProcess',
  //                   meta: { title: '新增套色对照', hidden: false, roles: ['ADMIN'] },
  //                 },
  //                 {
  //                   path: 'newColorDetail',
  //                   component: 'newSystem/systemRule/contrast/colourProcess/ColorDetail',
  //                   name: 'newColorDetail',
  //                   meta: { title: '套色详情', hidden: false, roles: ['ADMIN'] },
  //                 }
  //               ]
  //             },
  //           ]
  //         },
  //         {
  //           path: 'ruleGather',
  //           component: 'newSystem/systemRule/ruleGather/index',
  //           name: 'ruleGather',
  //           meta: { title: '规则集', hidden: false, roles: ['ADMIN'] },
  //           redirect: '/newSystem/systemRule/ruleGather/auditBillsG',
  //           children:[
  //             {
  //               path: 'auditBillsG',
  //               component: 'newSystem/systemRule/ruleGather/auditBillsG/index',
  //               name: 'auditBillsG',
  //               meta: { title: '审单规则', hidden: false, roles: ['ADMIN'] },
  //               redirect: '/newSystem/systemRule/ruleGather/auditBillsG/auditBillsList',
  //               children:[
  //                 {
  //                   path: 'auditBillsList',
  //                   component: 'newSystem/systemRule/ruleGather/auditBillsG/auditBillsList',
  //                   name: 'auditBillsList',
  //                   meta: { title: '审单规则列表', hidden: false, roles: ['ADMIN'] },
  //                 },
  //                 {
  //                   path: 'newAuditBills',
  //                   component: 'newSystem/systemRule/ruleGather/auditBillsG/newAuditBills',
  //                   name: 'newAuditBills',
  //                   meta: { title: '添加审单规则', hidden: false, roles: ['ADMIN'] },
  //                 },
  //                 {
  //                   path: 'AuditBillsDetails',
  //                   component: 'newSystem/systemRule/ruleGather/auditBillsG/AuditBillsDetails',
  //                   name: 'AuditBillsDetails',
  //                   meta: { title: '审单规则详情', hidden: false, roles: ['ADMIN'] },
  //                 },
  //               ]
  //             },
  //             {
  //               path: 'subpackageG',
  //               component: 'newSystem/systemRule/ruleGather/subpackageG/index',
  //               name: 'subpackageG',
  //               meta: { title: '分包规则', hidden: false, roles: ['ADMIN'] },
  //               redirect: '/newSystem/systemRule/ruleGather/subpackageG/noSubpackageC',
  //               children:[
  //                 {
  //                   path: 'noSubpackageC',
  //                   component: 'newSystem/systemRule/ruleGather/subpackageG/noSubpackageC',
  //                   name: 'noSubpackageC',
  //                   meta: { title: '不分包产品', hidden: false, roles: ['ADMIN'] },
  //                 },
  //                 {
  //                   path: 'UnitedParcelC',
  //                   component: 'newSystem/systemRule/ruleGather/subpackageG/UnitedParcelC',
  //                   name: 'UnitedParcelC',
  //                   meta: { title: '合包类型', hidden: false, roles: ['ADMIN'] },
  //                 },
  //                 {
  //                   path: 'packRuleAllot',
  //                   component: 'newSystem/systemRule/ruleGather/subpackageG/packRuleAllot',
  //                   name: 'packRuleAllot',
  //                   meta: { title: '包装规则分配', hidden: false, roles: ['ADMIN'] },
  //                 },
  //                 {
  //                   path: 'PackingRule',
  //                   component: 'newSystem/systemRule/ruleGather/subpackageG/PackingRule/index',
  //                   name: 'PackingRule',
  //                   meta: { title: '包装规则', hidden: false, roles: ['ADMIN'] },
  //                   redirect: '/newSystem/systemRule/ruleGather/subpackageG/PackingRule/PackingRuleList',
  //                   children:[
  //                     {
  //                       path: 'PackingRuleList',
  //                       component: 'newSystem/systemRule/ruleGather/subpackageG/PackingRule/PackingRuleList',
  //                       name: 'PackingRuleList',
  //                       meta: { title: '包装规则列表', hidden: false, roles: ['ADMIN'] },
  //                     },
  //                     {
  //                       path: 'NewPackingRule',
  //                       component: 'newSystem/systemRule/ruleGather/subpackageG/PackingRule/NewPackingRule',
  //                       name: 'NewPackingRule',
  //                       meta: { title: '新增包装规则', hidden: false, roles: ['ADMIN'] },
  //                     },
  //                     {
  //                       path: 'PackingRuleDatails',
  //                       component: 'newSystem/systemRule/ruleGather/subpackageG/PackingRule/PackingRuleDatails',
  //                       name: 'PackingRuleDatails',
  //                       meta: { title: '包装规则详情', hidden: false, roles: ['ADMIN'] },
  //                     },
  //                   ]
  //                 },
  //               ]
  //             },
  //           ]
  //         }

  //       ]
  //     },
  //     {
  //       path: 'permissionRole',
  //       component: 'newSystem/permissionRole/index',
  //       name: 'permissionRole',
  //       meta: { title: '权限设置', hidden: false, roles: ['ADMIN'] },
  //       redirect: 'newSystem/permissionRole/organization',
  //       children:[
  //         {
  //           path: 'organization',
  //           component: 'newSystem/permissionRole/organization',
  //           name: 'organization',
  //           meta: { title: '组织（公司）管理', hidden: false, roles: ['ADMIN'] },
  //         },
  //         {
  //           path: 'usersG',
  //           component: 'newSystem/permissionRole/usersG',
  //           name: 'usersG',
  //           meta: { title: '用户管理', hidden: false, roles: ['ADMIN'] },
  //         },
  //         {
  //           path: 'rolesG',
  //           component: 'newSystem/permissionRole/rolesG',
  //           name: 'rolesG',
  //           meta: { title: '角色管理', hidden: false, roles: ['ADMIN'] },
  //         },
  //         {
  //           path: 'xx',
  //           component: 'newSystem/permissionRole/xx',
  //           name: 'xx',
  //           meta: { title: '菜单权限分配', hidden: false, roles: ['ADMIN'] },
  //         },
  //         {
  //           path: 'xx',
  //           component: 'newSystem/permissionRole/xx',
  //           name: 'xx',
  //           meta: { title: '角色权限分配', hidden: false, roles: ['ADMIN'] },
  //         },
  //         {
  //           path: 'xx',
  //           component: 'newSystem/permissionRole/xx',
  //           name: 'xx',
  //           meta: { title: '字段权限分配', hidden: false, roles: ['ADMIN'] },
  //         },
  //       ]
  //     }

  //   ]
  // },
  {
    path: '/permissionRole',
    component: 'Layout',
    name: 'permissionRole',
    meta: {
      title: '系统设置',
      hidden: false,
      icon: 'system',
      roles: ['ADMIN']
    },
    redirect: 'permissionRole/organization',
    children: [
      {
        path: 'organization',
        component: 'permissionRole/organization',
        name: 'organization',
        meta: { title: '组织管理', hidden: false, roles: ['ADMIN'] }
      },
      {
        path: 'rolesG',
        component: 'permissionRole/rolesG',
        name: 'rolesG',
        meta: { title: '角色管理', hidden: false, roles: ['ADMIN'] }
      },
      {
        path: 'usersG',
        component: 'permissionRole/usersG',
        name: 'usersG',
        meta: { title: '用户管理', hidden: false, roles: ['ADMIN'] }
      }
    ]
  }
];
const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routes: [],
    addRoutes: []
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    generateRoutes() {
      return new Promise((resolve, reject) => {
        listRoutes()
          .then(response => {
            // const accessedRoutes =asyncRoutes

            // 本地
            // const asyncRoutes = [...routerData, ...response.data];
            // const accessedRoutes = filterAsyncRoutes(asyncRoutes);

            const asyncRoutes = response.data;

            const accessedRoutes = RegroupRoutes(asyncRoutes, 1);

            this.setRoutes(accessedRoutes);
            resolve(accessedRoutes);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export default usePermissionStore;
