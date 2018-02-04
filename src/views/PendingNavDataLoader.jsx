import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import NProgress from 'nprogress';
import { matchRoutes } from 'react-router-config';
import stores from '@/store/createStore';

const loadBranchData = (routes, location) => {
   const branch = matchRoutes(routes, location.pathname);

   const promises = branch.map(({ route, match }) => {
      return route.component.loadData
         ? route.component.loadData(stores, match)
         : Promise.resolve(null);
   });

   return Promise.all(promises);
};

class PendingNavDataLoader extends React.Component {
   state = {
      previousLocation: null
   }

   componentWillReceiveProps (nextProps) {
      const navigated = nextProps.location !== this.props.location;
      const { routes } = this.props;
      if (navigated) {
         this.setState({
            previousLocation: this.props.location
         });

         NProgress.set(0.8);
         loadBranchData(routes, nextProps.location).then(results => {
            console.log(results);
            this.setState({
               previousLocation: null
            });
            NProgress.done();
         });
      }
   }

   render () {
      const { children, location } = this.props;
      const { previousLocation } = this.state;

      return (
         <Route
            location={previousLocation || location}
            render={() => children} />
      );
   }
}

export default withRouter(PendingNavDataLoader);
