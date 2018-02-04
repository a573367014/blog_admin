import React from 'react';
import { getDisplayName } from './utils';
import { withRouter } from 'react-router-dom';

/**
 * 改变路由,重置结构相同的组件 例如a?a=1跳转到a?b=2发生重置
 * @param  {[react component]}
 * @return {[react component]}
 */
export default (Component) => {
   let unlisten = null;

   @withRouter
   class withComponentRest extends React.Component {
      state = { rerender: false };
      componentDidMount () {
         unlisten = this.props.history.listen(location => {
            // unlisten用来避免componentWillUnmount发生之后最后一次触发
            // 重置组件，刷新所有状态
            unlisten && this.setState({rerender: true}, () => {
               this.setState({rerender: false});
            });
         });
      }
      componentWillUnmount () {
         unlisten();
         unlisten = null;
      }
      render () {
         return !this.state.rerender && <Component {...this.props} />;
      }
   };

   withComponentRest.displayName = `withComponentRest(${getDisplayName(Component)})`;

   return withComponentRest;
};
