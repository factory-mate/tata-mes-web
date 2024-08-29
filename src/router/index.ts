import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import useStore from '@/store';

export const Layout = () => import('@/layout/index.vue');

// 参数说明: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
// 静态路由
export const constantRoutes: Array<any> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: '/',
    meta: { title: '首页', hidden: false, icon: 'homepage' },
    children: [
      {
        path: 'home',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'home',
        meta: { title: '首页', hidden: false, affix: true }
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: { hidden: true }
      },

      // 工作台页面
      {
        path: 'work',
        component: () => import('@/views/WorkPage/index.vue'),
        meta: { hidden: true }
      }
    ]
  }
  // {
  //   path: '/demo',
  //   component: Layout,
  //   name:'demo',
  //   type:1,
  //   iIndex:1,
  //   meta: { title: '内嵌1',hidden: false, icon: '' },
  //   children: [
  //     {
  //       path: 'demo_a',
  //       component: () => import('@/views/demo/index.vue'),
  //       name: 'demo_a',
  //       type:1,
  //       iIndex:1,
  //       meta: { title: '内嵌2',hidden: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/text',
  //   component: Layout,
  //   name: 'text',
  //   meta: { title: '测试菜单', icon: 'nested' },
  //   redirect: '/text/text1',
  //   children: [
  //     {
  //       path: 'text1',
  //       component: () => import('@/views/text/text1/index.vue'),
  //       name: 'text1',
  //       meta: { title: '测试一' }
  //     },
  //     {
  //       path: 'text2',
  //       component: () => import('@/views/text/text2/index.vue'),
  //       name: 'text2',
  //       meta: { title: '测试二' }
  //     },
  //     {
  //       path: 'text3',
  //       component: () => import('@/views/text/text3/index.vue'),
  //       name: 'text3',
  //       meta: { title: '测试三' }
  //     },
  //     {
  //       path: 'text5',
  //       component: () => import('@/views/text/text5/index.vue'),
  //       name: 'text5',
  //       meta: { title: '测试五' }
  //     },
  //     {
  //       path: 'text4',
  //       component: () => import('@/views/text/text4/index.vue'),
  //       name: 'text4',
  //       meta: { title: '测试四' }
  //     },
  //     {
  //       path: 'text6',
  //       component: () => import('@/views/text/text6/index.vue'),
  //       name: 'text6',
  //       meta: { title: '测试六' }
  //     }
  //   ]
  // },

  // 外部链接
  // {
  //       path: '/external-link',
  //       component: Layout,
  //       children: [
  //           // {
  //           //     path: 'https://www.cnblogs.com/haoxianrui/',
  //           //     meta: { title: '外部链接', icon: 'link' }
  //           // }
  //       ]
  //   }
  // 多级嵌套路由
  //  {
  //        path: '/nested',
  //        component: Layout,
  //        redirect: '/nested/level1/level2',
  //        name: 'Nested',
  //        meta: {title: '多级菜单(用)', icon: 'nested'},
  //        children: [
  //            {
  //                path: 'level1',
  //                component: () => import('@/views/nested/level1/index.vue'),
  //                name: 'Level1',
  //                meta: {title: '菜单一级'},
  //                redirect: '/nested/level1/level2',
  //                children: [
  //                    {
  //                        path: 'level2',
  //                        component: () => import('@/views/nested/level1/level2/index.vue'),
  //                        name: 'Level2',
  //                        meta: {title: '菜单二级'},
  //                        redirect: '/nested/level1/level2/level3',
  //                        children: [
  //                            {
  //                                path: 'level3',
  //                                component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
  //                                name: 'Level3-1',
  //                                meta: {title: '菜单三级-1'}
  //                            },
  //                            {
  //                                path: 'level4',
  //                                component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
  //                                name: 'Level4',
  //                                meta: {title: '菜单三级-2'}
  //                            }
  //                        ]
  //                    }
  //                ]
  //            },
  //        ]
  //    }
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 重置路由
export function resetRouter() {
  const { permission } = useStore();
  permission.routes.forEach(route => {
    const name = route.name;
    if (name && router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
}

export default router;
