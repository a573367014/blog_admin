import { observable, action, runInAction, useStrict, toJS } from 'mobx';
import axios from '@/api';
import {message} from 'antd';
import InheritStore from '../inherit';
useStrict(true);

export default class TouristStore extends InheritStore {
   @observable base = {
      tableRows: []
   }
   @observable form = {
      name: '',
      email: '',
      createTimes: []
   }
   // 请求游客
   @action.bound
   requestSearch () {
      this.requestWrapped(async () => {
         const result = await axios.get('/tourists', {
            params: {...toJS(this.form), ...toJS(this.page)}
         });

         runInAction(() => {
            this.base.tableRows = result.data.rows;
            this.page.total = result.data.totalSize;
         });
      });
   }
   // 删除游客
   @action.bound
   requestDelete (id) {
      this.requestWrapped(async () => {
         await axios.delete(`/tourists/${id}`);
         this.requestSearch();
         message.success('操作成功！');
      });
   }
}
