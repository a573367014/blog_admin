import { observable, action, useStrict } from 'mobx';
import CommentStore from './modules/comment';
import TagStore from './modules/tag';
import ArticleStore from './modules/article';
import TouristStore from './modules/tourist';
useStrict(true);

class BaseStore {
   @observable loading = false;

   @action.bound
   setLoading (bool) {
      this.loading = bool;
   }
};

const baseStore = new BaseStore();

export default {
   baseStore,
   commentStore: new CommentStore(baseStore),
   tagStore: new TagStore(baseStore),
   articleStore: new ArticleStore(baseStore),
   touristStore: new TouristStore(baseStore)
};
