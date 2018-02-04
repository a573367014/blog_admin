import { observable, action, runInAction, useStrict, toJS } from 'mobx';
import axios from '@/api';
import {message} from 'antd';
import InheritStore from '../inherit';
useStrict(true);

export default class CommentStore extends InheritStore {
   @observable base = {
      tableRows: []
   }
   @observable form = {
      articleTitle: '',
      touristName: '',
      content: '',
      createTimes: []
   }
   // 请求文章评论
   @action.bound
   requestSearch () {
      this.requestWrapped(async () => {
         const result = await axios.get('/comments', {
            params: {...toJS(this.form), ...toJS(this.page)}
         });

         runInAction(() => {
            this.base.tableRows = result.data.rows;
            this.page.total = result.data.totalSize;
         });
      });
   }
   // 删除评论
   @action.bound
   requestDelete (id) {
      this.requestWrapped(async () => {
         await axios.delete(`/comments/${id}`);
         this.requestSearch();
         message.success('操作成功！');
      });
   }
   // 修改评论
   @action.bound
   async requestUpdate (id, content) {
      this.requestWrapped(async () => {
         await axios.patch(`/comments/${id}`, {content});
         message.success('操作成功！');
      });
   }
}
