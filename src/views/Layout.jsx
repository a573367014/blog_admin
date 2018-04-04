import React from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { Layout, Menu, Breadcrumb, Icon, Dropdown, Spin } from 'antd';
import {inject, observer} from 'mobx-react';
const { Sider } = Layout;

@withRouter @inject('baseStore') @observer
class Frame extends React.Component {
   constructor ({ route, location }) {
      super();
      this.state = {
         // 侧边导航伸缩按钮
         collapsed: false,
         // 当前路由层级链
         curRoutes: this.getMatchRoutes({ location, route })
      };
   }

   componentWillReceiveProps ({ location, route }) {
      this.setState({curRoutes: this.getMatchRoutes({ location, route })});
   }

   /**
    * [获取当前路由层级链]
    * @param  {Object} options.location [位置信息]
    * @param  {Object} options.route    [所有路由]
    * @return {Array}                   [当前路由层级链]
    */
   getMatchRoutes ({ location, route }) {
      const curRoutes = matchRoutes(route.routes, location.pathname);
      return [
         ...(route.name ? [route] : []),
         ...curRoutes.map(
            ({route, match}) => ({url: match.url, name: route.name, path: route.path})
         ).filter(item => item.name)
      ];
   }

   

   render () {
      const {baseStore, route} = this.props;
      const {curRoutes, collapsed} = this.state;
      const dropMenu = (
         <Menu >
            <Menu.Item key="0">
               <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
            </Menu.Item>
            <Menu.Item key="1">
               <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3" disabled>3rd menu item（disabled）</Menu.Item>
         </Menu>
      );
      return (
         <div className="l-app">
            <Sider
               className="l-aside"
               collapsible
               collapsed={collapsed}
               onCollapse={collapsed => this.setState({ collapsed })}>
               <Link className="l-logo" to="/">Blog management</Link>
               <Menu
                  theme="dark"
                  selectedKeys={curRoutes.map(item => item.path)}
                  mode="inline"
                  onClick={({item, key, selectedKeys}) => this.props.history.push(key)}>
                  <Menu.Item key="/article">
                     <Icon type="pie-chart" />
                     <span>文章管理</span>
                  </Menu.Item>
                  <Menu.Item key="/tag">
                     <Icon type="desktop" />
                     <span>标签管理</span>
                  </Menu.Item>
                  <Menu.Item key="/comment">
                     <Icon type="pie-chart" />
                     <span>评论管理</span>
                  </Menu.Item>
                  <Menu.Item key="/tourist">
                     <Icon type="desktop" />
                     <span>游客管理</span>
                  </Menu.Item>
               </Menu>
            </Sider>
            <div className="l-main">
               <div className="l-header">
                  <Breadcrumb className="u-fl">
                     {
                        curRoutes.map(
                           (route, index) => <Breadcrumb.Item key={route.url || '/'}>
                              {curRoutes.length - 1 !== index
                                 ? <Link to={route.url || '/'}>{route.name}</Link>
                                 : route.name}
                           </Breadcrumb.Item>
                        )
                     }
                  </Breadcrumb>
                  <Dropdown overlay={dropMenu}>
                     <a className="u-fr" href="#">
                        Hover me <Icon type="down" />
                     </a>
                  </Dropdown>
               </div>
               <div className="l-content" id="contentBody">
                  <_Spin size="large" spinning={baseStore.loading}>
                     <div className="l-inner">
                        {renderRoutes(route.routes)}
                     </div>
                  </_Spin>
               </div>
            </div>
         </div>
      );
   }
}

export default Frame;

const _Spin = styled(Spin)`
   min-height:auto;
   .ant-spin-dot{
      top:150px;
   }
`;
