import { observable, action, useStrict, runInAction } from 'mobx';
import {PAGE_SIZE} from '@/config';
useStrict(true);

export default class InheritStore {
   constructor (baseStore) {
      this.baseStore = baseStore;
   }
   @observable page = {
      current: 1,
      total: 0,
      size: PAGE_SIZE
   }

   @action.bound
   assignBase (baseData) {
      Object.assign(this.base, baseData);
   }

   @action.bound
   assignPage (pageData) {
      Object.assign(this.page, pageData);
   }

   @action.bound
   assignForm (formData) {
      Object.assign(this.form, formData);
   }

   // componentWillUnmount中重置数据
   @action.bound
   reset () {
      const aIgnore = ['baseStore'];
      const newData = new this.constructor(this.baseStore);

      for (let k in this) {
         if (aIgnore.indexOf(k) === -1) {
            this[k] = newData[k];
         }
      }
   }

   // 简化loading相关的异步加载
   async requestWrapped (promise) {
      this.baseStore.loading = true;
      try {
         const result = await promise();
         return result;
      } catch (e) {
         throw e;
      } finally {
         runInAction(() => this.baseStore.loading = false);
      }
   }
}
