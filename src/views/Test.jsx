import React from 'react';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'mobx-react';
import stores from '@/store/createStore';
import routes from '@/routes';
import {renderRoutes} from 'react-router-config';
import Login from './Login';
// import Layout from './Layout';
// const matchs = matchRoutes(routes, '/article');

class App extends React.Component {
   render () {
      console.log(this.props);
      return (
         <Switch>
            <Route path="/login" component={Login} />
            {!window.isLogin ? renderRoutes(routes) : <Login />}
         </Switch>
      );
   }
}

export default () => {
   return (
      <Provider {...stores}>
         <Router>
            <Route component={App} />
         </Router>
      </Provider>
   );
};
