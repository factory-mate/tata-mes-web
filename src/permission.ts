import router from '@/router';
import { ElMessage } from 'element-plus';
import useStore from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏

// 白名单路由
const whiteList = ['/login'];
let routeFlag = false; //初始的时候。roter没有挂在上
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const { user, permission } = useStore();

  const hasToken = user.token;
  if (hasToken) {
    if (routeFlag) {
      next();
    } else {
      // 登录成功，跳转到首页
      if (to.path === '/login') {
        next({ path: '/' });
        NProgress.done();
      } else {
        const hasGetUserInfo = user.roles.length > 0;

        if (hasGetUserInfo) {
          if (to.matched.length === 0) {
            from.name ? next({ name: from.name as any }) : next('/401');
          } else {
            next();
          }
        } else {
          try {
            // await user.getUserInfo();
            // const roles = user.roles;

            const accessRoutes: any = await permission.generateRoutes();
            routeFlag = true;
            // 过滤
            accessRoutes.forEach((route: any) => {
              if (route.path) {
                router.addRoute(route);
              }
            });
            next({ ...to, replace: true });
          } catch (error) {
            // 移除 token 并跳转登录页
            console.log(error, 'error');
            await user.resetToken();
            ElMessage.error((error as any) || '请重新登陆！');
            next(`/login?redirect=${to.path}`);
            NProgress.done();
          }
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
