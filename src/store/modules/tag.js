import { observable, action, runInAction, useStrict } from 'mobx';
import axios from '@/api';
import {message} from 'antd';
import InheritStore from '../inherit';
useStrict(true);

export default class TagStore extends InheritStore {
   @observable base = {
      tags: [],
      inputVisible: false
   }
   @observable form = {
      inputValue: ''
   }
   @action.bound
   resetTag (index) {
      this.base.tags.splice(index, 1, {...this.base.tags[index]});
   }
   @action.bound
   requestList () {
      this.requestWrapped(async () => {
         const result = await axios.get('/tags');
         runInAction(() => this.base.tags = result.data.rows);
      });
   }

   @action.bound
   async requestAdd () {
      const tags = this.base.tags;
      this.requestWrapped(async () => {
         let result = await axios.post(`/tags`, {
            name: this.form.inputValue
         });
         runInAction(() => tags.push(result.data.returnData));
         message.success('操作成功！');
      });
   }

   @action.bound
   async requestUpdate (newTag, index) {
      const tags = this.base.tags;
      this.requestWrapped(async () => {
         let result = await axios.patch(`/tags/${tags[index].id}`, {
            name: newTag
         });
         runInAction(() => tags.splice(index, 1, result.data.returnData));
         message.success('操作成功！');
      });
   }

   @action.bound
   requestDelete (index) {
      this.requestWrapped(async () => {
         await axios.delete(`/tags/${this.base.tags[index].id}`);
         runInAction(() => this.base.tags.splice(index, 1));
         message.success('操作成功！');
      });
   }
}
