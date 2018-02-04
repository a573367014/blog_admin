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
         collapsed: false,
         branch: this.getMatchRoutes({ location, route })
      };
   }

   onCollapse = (collapsed) => {
      this.setState({ collapsed });
   }

   onMenuItemClick = ({item, key, selectedKeys}) => {
      this.props.history.push(key);
   }

   getMatchRoutes ({ location, route }) {
      const branch = matchRoutes(route.routes, location.pathname);
      return [
         ...(route.name ? [route] : []),
         ...branch.map(
            ({route, match}) => ({url: match.url, name: route.name, path: route.path})
         ).filter(item => item.name)
      ];
   }

   componentWillReceiveProps ({ location, route }) {
      this.setState({branch: this.getMatchRoutes({ location, route })});
   }

   render () {
      const {baseStore, route} = this.props;
      const {branch, collapsed} = this.state;
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
               onCollapse={this.onCollapse}>
               <Link className="l-logo" to="/">Blog management</Link>
               <Menu
                  theme="dark"
                  selectedKeys={branch.map(item => item.path)}
                  mode="inline"
                  onClick={this.onMenuItemClick}>
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
                        branch.map(
                           (route, index) => <Breadcrumb.Item key={route.url || '/'}>
                              {branch.length - 1 !== index
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
