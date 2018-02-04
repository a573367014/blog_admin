import React from 'react';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'mobx-react';
import stores from '@/store/createStore';
import routes from '@/routes';
import {renderRoutes} from 'react-router-config';
import Login from './Login';

export default () => {
   return (
      <Provider {...stores}>
         <Router>
            <Switch>
               <Route path="/login" component={Login} />
               {!window.isLogin ? renderRoutes(routes) : <Redirect to="/login" />}
            </Switch>
         </Router>
      </Provider>
   );
};
