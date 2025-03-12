/*
 * @Author: yk 1586500126@qq.com
 * @Date: 2022-11-22 09:23:40
 * @LastEditors: yk 1586500126@qq.com
 * @LastEditTime: 2022-11-22 11:48:48
 * @FilePath: \vue3-element-admin-master\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

// @see: https://gitee.com/holysheng/vite2-config-description/blob/master/vite.config.ts
export default ({ mode }: ConfigEnv): UserConfig => {
  // 获取 .env 环境配置文件
  const env = loadEnv(mode, process.cwd());
  console.log(env);
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    // 本地反向代理解决浏览器跨域限制
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: false // 运行自动打开浏览器
      // proxy: {
      //   [env.VITE_APP_BASE_API]: {
      //     // 线上API地址
      //     // target: 'http://vapi.youlai.tech',
      //     // 本地API地址
      //     // target: 'http://192.168.3.26:8989',
      //     target: 'http://117.158.105.83:8888',
      //     // changeOrigin: true,
      //     rewrite: path =>
      //       path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
      //   }
      // }
    },
    resolve: {
      // Vite路径别名配置
      alias: {
        '@': path.resolve('./src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    build: {
      outDir: `dist/${mode}`,
      rollupOptions: {
        external: [],
        output: {
          // 优化 node_modules 打包
          manualChunks(id) {
            try {
              if (id.includes('node_modules')) {
                const name = id.split('node_modules/')[1].split('/');
                if (name[0] === '.pnpm') {
                  return name[1];
                }
                return name[0];
              }
              return undefined;
            } catch (e) {
              process.stdout.write(e);
              return undefined;
            }
          }
        }
      }
    }
  };
};
