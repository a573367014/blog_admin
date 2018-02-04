// import stores from '@/store/createStore';
import React from 'react';
import Layout from './views/Layout';
import Article from './views/Article';
import ArticleForm from './views/Article/form';
import Tag from './views/Tag';
import Comment from './views/Comment';
import Tourist from './views/Tourist';
import {renderRoutes} from 'react-router-config';
import NotFount from './views/NotFount';

const RenderChildRoute = ({route}) => renderRoutes(route.routes);
const notFout = {
   name: '404',
   component: NotFount
};
export default [
   {
      path: '/',
      name: '首页',
      component: Layout,
      routes: [
         {
            path: '/',
            exact: true,
            component: () => (<div>my is index</div>)
         },
         {
            name: '文章管理',
            path: '/article',
            component: RenderChildRoute,
            routes: [
               {
                  path: '/article',
                  exact: true,
                  component: Article
               },
               {
                  name: '添加文章',
                  path: '/article/add',
                  exact: true,
                  component: ArticleForm
               },
               {
                  name: '编辑文章',
                  path: '/article/:id',
                  exact: true,
                  component: ArticleForm
               },
               notFout
            ]
         },
         {
            name: '文章管理',
            path: '/article',
            exact: true,
            component: ArticleForm
         },
         {
            name: '标签管理',
            path: '/tag',
            exact: true,
            component: Tag
         },
         {
            name: '评论管理',
            path: '/comment',
            exact: true,
            component: Comment
         },
         {
            name: '游客管理',
            path: '/tourist',
            exact: true,
            component: Tourist
         },
         notFout
      ]
   }
];
