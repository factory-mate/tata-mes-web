import { defineStore } from 'pinia';
import { UserState } from './types';

import { localStorage } from '@/utils/storage';
import { loginApi, logoutApi } from '@/api/auth';
import { getUserInfo } from '@/api/user';
import { resetRouter } from '@/router';
import { LoginForm } from '@/api/auth/types';

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: localStorage.get('token') || '',
    nickname: 'admin',
    avatar: 'https://img2.baidu.com/it/u=235910777,2705001288&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    roles: [],
    perms: []
  }),
  actions: {
    async RESET_STATE() {
      this.$reset();
    },
    /**
     * 登录
     */
    login(data: LoginForm) {
      const { cPassWord, cLoginName ,cSourceAppType} = data;
      
      
      return new Promise((resolve, reject) => {
        
        loginApi({
          cLoginName: cLoginName.trim(),
          cPassWord: cPassWord,
          cSourceAppType: cSourceAppType
        })
          .then(response => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const accessToken ='Bearer '+ response.data.token ;
            localStorage.set('token', accessToken);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            localStorage.set('user', response.data.token_user);
            this.token = accessToken;
            resolve(accessToken);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     *  获取用户信息（昵称、头像、角色集合、权限集合）
     */
    
    getUserInfo() {
      
      this.roles = ["ADMIN"];
      this.perms = ["sys:user:edit", "sys:user:delete", "sys:user:add"];
      // return new Promise((resolve, reject) => {
      //   getUserInfo().then(({ data }) => {     
      //       console.log(data,'---');
                   
      //       if (!data) {
      //         return reject('验证失败，请重新登录!');
      //       }
      //       // const { nickname, avatar, roles, perms } = data;
      //       // if (!roles || roles.length <= 0) {
      //       //   reject('getUserInfo: roles must be a non-null array!');
      //       // }
      //       this.nickname = '系统管理员';
      //       this.avatar = 'https://img2.baidu.com/it/u=235910777,2705001288&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500';
      //       this.roles = ["ADMIN"];
      //       this.perms = ["sys:user:edit", "sys:user:delete", "sys:user:add"];
      //       resolve(data);
      //     }).catch(error => {
      //       reject(error);
      //     });
      // });
    },

    /**
     *  注销
     */
    logout() {
      return new Promise((resolve, reject) => {
        logoutApi()
          .then(() => {
            localStorage.remove('token');
            localStorage.remove('user');
            window.location.href=''
            this.RESET_STATE();
            resetRouter();
            resolve(null);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    /**
     * 清除 Token
     */
    resetToken() {
      return new Promise(resolve => {
        localStorage.remove('token');
        this.RESET_STATE();
        resolve(null);
      });
    }
  }
});

export default useUserStore;
