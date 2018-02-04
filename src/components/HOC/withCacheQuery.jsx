import React from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import {getDisplayName} from './utils';
import autoBind from 'autobind-decorator';

const fReduction = (sKey, _oFm, anyValue, oCtx) => {
   let anyResult = null;
   const anyDefault = _oFm.hasOwnProperty('default') ? _oFm.default : '';
   const oFm = {
      type: _oFm.type || anyDefault.constructor,
      default: anyDefault,
      map: typeof _oFm.map !== 'object' ? [sKey] : _oFm.map
   };

   switch (oFm.type) {
   case String:
      anyResult = anyValue || oFm.default;
      break;
   case Number:
      anyResult = isNaN(anyValue - 0) ? oFm.default : anyValue - 0;
      break;
   case Array:
      try {
         anyResult = anyValue.map(sV => sV - 0 === parseFloat(sV) ? sV - 0 : sV);
      } catch (e) {
         anyResult = oFm.default;
      }
      break;
   default:
      throw new Error('不支持的类型');
   }

   let iLast = oFm.map.length - 1;
   let oTmp = oCtx;
   oFm.map.forEach((sName, iIndex) => {
      if (iIndex !== iLast) {
         oTmp = oTmp[sName] ? oTmp[sName] : (oTmp[sName] = {});
      } else {
         oTmp[sName] = anyResult;
      }
   });
};

/**
 * 将查询状态缓存到url
 * @param  {[react component]}
 * @return {[react component]}
 */
export default Component => {
   @withRouter
   class withCacheQuery extends React.Component {
      // 缓存数据到 url
      @autoBind
      setQuery (_oQuery, oOptions) {
         if (!(_oQuery instanceof Object)) throw new Error('query must object');

         const oQuery = Object.assign(
            queryString.parse(this.props.location.search),
            _oQuery,
            {__r__: Math.random()}
         );

         this.props.history[oOptions && oOptions.replace ? 'replace' : 'push']({
            search: '?' + queryString.stringify(oQuery)
         });
      }

      // 获取url get数据
      @autoBind
      getQuery (oQueryFormat, fCallback) {
         const oQuery = queryString.parse(this.props.location.search);
         const oResult = {};

         for (let sK in oQueryFormat) {
            let oFm = oQueryFormat[sK];
            if (oFm.hasOwnProperty('default') && (oFm.default === null || oFm.default === undefined)) {
               throw new Error('默认值不能是null或undefined');
            }
            fReduction(sK, oFm, oQuery[sK], oResult);
         }

         fCallback && fCallback(oResult);
      }

      render () {
         return <Component getQuery={this.getQuery} setQuery={this.setQuery} {...this.props} />;
      }
   }

   withCacheQuery.displayName = `withCacheQuery(${getDisplayName(Component)})`;

   return withCacheQuery;
};
