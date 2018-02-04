import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'mobx-react';
import stores from '@/store/createStore';
import Layout from './Layout';
import Login from './Login';
import Article from './Article';
import ArticleForm from './Article/form';
import Tag from './Tag';
import Comment from './Comment';
import Tourist from './Tourist';

export default () => {
   return (
      <Provider {...stores}>
         <Router>
            <Switch>
               <Route exact path="/login" component={Login} />
               <Route path="/" render={() => (
                  <Layout>
                     <Switch>
                        <Route exact path="/" render={() => <div>my is index</div>} />
                        <Route exact path="/article" component={Article} />
                        <Route exact path="/article/add" component={ArticleForm} />
                        <Route exact path="/article/:id" component={ArticleForm} />

                        <Route exact path="/tag" component={Tag} />

                        <Route exact path="/comment" component={Comment} />

                        <Route exact path="/tourist" component={Tourist} />
                     </Switch>
                  </Layout>
               )} />
            </Switch>
         </Router>
      </Provider>
   );
};
