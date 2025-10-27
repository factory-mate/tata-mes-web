import axios from 'axios';
import { ElMessage } from 'element-plus';
const exportAnalysisHooks = (data: any, title: any) => {
  //   axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  axios.defaults.responseType = 'blob';
  console.log(data);
  axios
    .request({
      url: data.url,
      headers: {
        Authorization: JSON.parse(window.localStorage.getItem('token'))
      },
      method: data.method,
      data: data.method === 'post' ? data.data : undefined,
      params: data.method === 'get' ? data.data : undefined
    })
    .then(res => {
      console.log(res);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res.status == '401') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: 'OK',
          type: 'warning'
        }).then(() => {
          localStorage.clear();
          window.location.href = '/';
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      } else if (res.status == '200') {
        const blob = new Blob([res.data], {
          type: 'application/vnd.ms-excel'
        });
        const fileName = decodeURI(res.headers['content-disposition'] || title);
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          navigator.msSaveBlob(blob, fileName);
        }
      } else {
        ElMessage.error('请求失败');
      }
    })
    .catch(err => {
      console.log(err.response);
      ElMessage.error(err.response.data.message || '请求失败');
    });
};
export default exportAnalysisHooks;
