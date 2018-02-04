import React from 'react';
import {getDisplayName} from './utils';
/**
 * 加载异步组件,提供占位
 * @param  {[promise]} promiseComponent [import(...)]
 * @return {[react component]}                  [高阶组件]
 */
export default promiseComponent => {
   class withAsyncComponent extends React.Component {
    state = {
       component: null
    };

    componentWillMount () {
       promiseComponent.then(result => {
          this.setState({ component: result.default() });
       });
    }

    render () {
       return this.state.component ? this.state.component : <div>loading...</div>;
    }
   };

   withAsyncComponent.displayName = `withAsyncComponent(${getDisplayName(promiseComponent)})`;

   return withAsyncComponent;
};
