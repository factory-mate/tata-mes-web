import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginForm, VerifyCode } from './types';

/**
 *
 * @param data {LoginForm}
 * @returns
 */
export function loginApi(data: LoginForm): AxiosPromise<string> {
  return request({
    // url: '/api/v1/auth/login',
    url: import.meta.env.VITE_APP_BASE_API+'/api/Login/LoginIn',
    method: 'post',
    data: data,
    headers: {
      Authorization: 'Basic dnVlMy1lbGVtZW50LWFkbWluOnNlY3JldA==' // 客户端信息Base64明文：vue3-element-admin:secret
    }
  });
}

/**
 * 注销
 */
export function logoutApi() {
  return request({
    // url: '/api/v1/auth/logout',
    url: import.meta.env.VITE_APP_BASE_API+'/api/Login/LoginOut',
    method: 'get'
  });
}

/**
 * 获取图片验证码
 */
export function getCaptcha(): AxiosPromise<VerifyCode> {
  return request({
    url: '/captcha?t=' + new Date().getTime().toString(),
    method: 'get'
  });
}

// table  排序
export function tableSort(data:any) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API+'/api/FormPropertyByUser/Add',
    method: 'post',
    data: data
  });
}