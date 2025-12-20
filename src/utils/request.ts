import axios, { Axios, AxiosResponse, AxiosRequestConfig } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { localStorage } from '@/utils/storage';
import useStore from '@/store';
import { ElLoading } from 'element-plus';
// import {load} from '@/utils/loading.js'
// ElLoading.service({lock: true,text: '加载中.....'})
// ElLoading.service().close()
// 创建 axios 实例
// 处理  类型“AxiosResponse<any, any>”上不存在属性“ XXXX ”。ts(2339) 脑壳疼。
// ！！！关键一步！！！
declare module 'axios' {
  interface AxiosResponse<T = any> {
    token: null;
    token_user: null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    msg: null;
    // 这里追加你的参数
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

const service = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  // timeout: 120000 //后端要定义2分钟
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // console.log(config.url,"--config--请求拦截器")
    // if(config.url!='http://117.158.105.83:10300/api/pick/proccess'){
    //   ElLoading.service({
    //     lock: true,
    //     text: '加载中.....',
    //     background: 'rgba(0, 0, 0, 0.7)',
    //   })
    // }
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    const { user } = useStore();
    if (user.token) {
      config.headers.Authorization = `${localStorage.get('token')}`;
    }
    // load.show()

    return config;
  },
  (error: any) => {
    // load.show()
    // ElLoading.service({
    //   lock: true,
    //   text: '加载中.....',
    //   background: 'rgba(0, 0, 0, 0.7)',
    // })
    return Promise.reject(error);
  }
);
const MESSAGE_LENGTH = 5;
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // load.hide();//在这关闭加载~~~~~~~
    // const loadingInstance = ElLoading.service()
    // loadingInstance.close()
    const { status, msg, errmsg } = response.data;
    let isLongMessage = false;
    let errorMsg = '';
    if (msg) {
      errorMsg = msg;
      if (msg.length > MESSAGE_LENGTH) {
        isLongMessage = true;
      }
    } else if (errmsg?.[0]?.Value) {
      try {
        const errormsgParsedJSON = JSON.parse(errmsg?.[0]?.Value);
        errorMsg = errormsgParsedJSON?.[0]?.name + errormsgParsedJSON?.[0]?.msg;
      } catch {
        errorMsg = errmsg?.[0]?.Value;
      }
      if (!errorMsg) {
        errorMsg = errmsg?.[0]?.Value;
      }
      if (errorMsg.length > MESSAGE_LENGTH) {
        isLongMessage = true;
      }
    }
    if (status == '500') {
      ElLoading.service().close();
      ElMessage({
        message: errorMsg?.substring(0, 5000) || '出错！！！',
        type: 'error',
        showClose: true,
        duration: isLongMessage ? 0 : 10000
      });
    } else if (status == '200') {
      return response.data;
    } else {
      if (status == '300') {
        return Promise.reject(response.data);
      }
      // 响应数据为二进制流处理(Excel导出)
      if (response.data instanceof ArrayBuffer) {
        return response;
      }

      if (response.config.responseType == 'blob') {
        return response;
      }
      // 异常报错处理
      if (response.data.errmsg === null) {
        ElMessage({
          message: errorMsg || '',
          type: 'error',
          showClose: true,
          duration: isLongMessage ? 0 : 10000
        });
        return Promise.reject(response.data);
      } else {
        ElMessage({
          message: response.data.errmsg?.[0].Value,
          type: 'error',
          showClose: true,
          duration: isLongMessage ? 0 : 10000
        });
        return Promise.reject(response.data);
      }
    }
  },
  (error: any) => {
    const loadingInstance = ElLoading.service();
    loadingInstance.close();
    console.log('error', error);
    // load.hide();//在这~~~~~~~
    console.log('errorinfo', error.response);
    const { status, msg } = error?.response?.data ?? {};
    let isLongMessage = false;
    let errorMsg = '';
    if (msg) {
      errorMsg = msg;
      if (msg.length > MESSAGE_LENGTH) {
        isLongMessage = true;
      }
    }
    if (error.response.data) {
      // token 过期,重新登录
      if (status == '401' || status == '403') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: 'OK',
          type: 'warning'
        }).then(() => {
          localStorage.clear();
          // window.location.href = '/';
          window.location.href = '';
        });
      } else if (status == '415' || status == '400' || status == '300') {
        console.log(status, 'status');
      } else {
        ElMessage({
          message: msg || '系统出错！！！',
          type: 'error',
          showClose: true,
          duration: isLongMessage ? 0 : 10000
        });
      }
    }
    return Promise.reject(error.msg);
    // return Promise.reject( ElMessage({
    //   message: msg ,
    //   type: 'error'
    // }));
  }
);

// 导出 axios 实例
export default service;
