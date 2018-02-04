import axios from 'axios';
import { notification } from 'antd';

// 拦截器
axios.interceptors.response.use(response => {
   const result = response.data;
   if (result.code !== 200) {
      notification.warning({
         message: '请求失败',
         description: result.msg
      });
      return Promise.reject(result);
   } else {
      return result;
   }
}, error => {
   notification.error({
      message: '请求错误',
      description: error.message
   });
   return Promise.reject(error);
});

axios.defaults.baseURL = 'https://www.easy-mock.com/mock/5a6197d7eeb2b709db35b865';
axios.defaults.headers.common['Authorization'] = 'token';
// axios.defaults.params = {}

axios.defaults.transformResponse = [function (response) {
   // 对 data 进行任意转换处理
   return JSON.parse(response);
}];

export default axios;
