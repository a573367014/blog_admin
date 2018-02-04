import { observable, action, runInAction, useStrict, toJS } from 'mobx';
import axios from '@/api';
import {message} from 'antd';
import InheritStore from '../inherit';
useStrict(true);

export default class ArtcileStore extends InheritStore {
   @observable base = {
      tagRows: [],
      tableRows: []
   }
   @observable form = {
      title: '',
      status: '',
      tags: [],
      actionTimes: []
   }
   // 搜索文章列表
   @action.bound
   requestSearch () {
      this.requestWrapped(async () => {
         const result = await axios.get('/articles', {
            params: {...toJS(this.form), ...toJS(this.page)}
         });

         runInAction(() => {
            this.base.tableRows = result.data.rows;
            this.page.total = result.data.totalSize;
         });
      });
   }
   // 删除文章
   @action.bound
   requestDelete (id) {
      this.requestWrapped(async () => {
         await axios.delete(`/articles/${id}`);
         this.requestSearch();
         message.success('操作成功！');
      });
   }
   // 获取文章详情
   @action.bound
   async requestDetail (id) {
      return this.requestWrapped(async () => {
         const result = await axios.get(`/articles/${id}`);
         return result;
      });
   }
   // 修改文章
   @action.bound
   requestUpdate (id, data) {
      return this.requestWrapped(async () => {
         const result = await axios.put(`/articles/${id}`, data);
         message.success('操作成功！');
         return result;
      });
   }
   // 添加文章
   @action.bound
   requestAdd (data) {
      return this.requestWrapped(async () => {
         const result = await axios.post(`/articles`, data);
         message.success('操作成功！');
         return result;
      });
   }
}
