import request from '@/utils/request';
import { spellObj } from '@/utils';
// import { AxiosPromise } from 'axios';
// 公用配置管理
export function configApi(data: string) {
  return request({
    url:
      import.meta.env.VITE_APP_BASE_API +
      `/api/AuthHelper/GetFormParm?modelCode=${data}`,
    method: 'get'
  });
}
/**
 *axiosParams  get 方式
 *
 * @param
 */
export function ParamsApi(data: any) {
  return request({
    url: data.url,
    method: data.method,
    params: data.params
  });
}
/**
 * axiosData  post 方式
 *
 * @param data
 */
export function DataApi(data: any, config?: any) {
  return request({
    url: data.params ? data.url + '?' + spellObj(data.params) : data.url,
    method: data.method,
    data: data.data,
    ...config
  });
}
export function commonApi(config?: any) {
  return request({
    ...config
  });
}
export function DataParamsApi(data: any) {
  return request({
    url: data.params ? data.url + '?' + data.params : data.url,
    method: data.method,
    data: data.data
  });
}
//   /**
//  * delete 方式
//  *
//  * @param data
//  */
export function delApi(data: any) {
  return request({
    url: data.url,
    method: data.method,
    data: data.data
  });
}

/**
 * axiosData  post 方式  导出
 *
 * @param data
 */
export function ExportApi(data: any) {
  return request({
    responseType: 'blob',
    url: data.params ? data.url + '?' + spellObj(data.params) : data.url,
    method: data.method,
    data: data.data
  });
}

export function InventoryInfoGetForPage(cInvCode) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + `/api/Inentory_info/GetForPage`,
    method: 'POST',
    data: {
      conditions: `cInvCode = ${cInvCode}`
    }
  });
}

export function InventoryInfoGetForPageNoOrigin(cInvCode) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + `/api/Inentory_info/GetForPage`,
    method: 'POST',
    data: {
      conditions: `cInvCode = ${cInvCode}`
    },
    params: {
      cType: 1
    }
  });
}
