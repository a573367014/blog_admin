import hljs from 'highlightjs';
import React from 'react';
import {getDisplayName} from './utils';
/**
 * 代码高亮
 * @param  {react component} Component [react markdown]
 * @return {react component}           [高阶组件]
 */
export default Component => {
   class withHljs extends React.PureComponent {
      componentDidUpdate () {
         var els = this.divDom.querySelectorAll('pre code');

         for (var i = 0; i < els.length; i++) {
            hljs.highlightBlock(els[i]);
         }
      }

      render () {
         return <div ref={divDom => { this.divDom = divDom; }}><Component {...this.props} /></div>;
      }
   };

   withHljs.displayName = `withHljs(${getDisplayName(Component)})`;

   return withHljs;
};
