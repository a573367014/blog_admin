import 'nprogress/nprogress.css';
import '@/assets/css/base.css';
import '@/assets/css/styles.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {createHashHistory as History} from 'history';
import App from './views/Test';
import {message} from 'antd';

const render = Component => {
   ReactDOM.render(
      <AppContainer>
         <Component />
      </AppContainer>,
      document.getElementById('app')
   );
};

render(App);

if (module.hot) {
   module.hot.accept('./views/Test', () => {
      render(App);
   });
}

// 监听路由滚动条重置
new History().listen(function () {
   try {
      document.querySelector('#contentBody').scrollTop = 0;
   } catch (e) {}
});
// 全局设置显示为1秒
message.config({
   duration: 1
});
