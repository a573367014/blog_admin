import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Table, Button, DatePicker, Select, Popconfirm, Divider } from 'antd';
import autoBind from 'autobind-decorator';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import withCacheQuery from '@/components/HOC/withCacheQuery';
import SearchFormWrp from '@/components/SearchFormWrp';
import moment from 'moment';
import {PAGE_SIZE} from '@/config';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

// 包含组件
@Form.create()
@withCacheQuery
@inject('articleStore', 'tagStore')
@observer
class Article extends React.Component {
   // query映射格式
   queryFormat = {
      current: {
         default: 1,
         map: ['page', 'current']
      },
      size: {
         default: PAGE_SIZE,
         map: ['page', 'size']
      },
      status: {
         map: ['form', 'status']
      },
      title: {
         map: ['form', 'title']
      },
      actionTimes: {
         default: [],
         map: ['form', 'actionTimes']
      },
      tags: {
         default: [],
         map: ['form', 'tags']
      }
   };
   // query自定义映射
   @autoBind
   mapData (result) {
      const {articleStore} = this.props;
      if (result.form.actionTimes) {
         result.form.actionTimes = result.form.actionTimes.map(datestr => moment(datestr, 'YYYY-MM-DD'));
      }

      articleStore.assignForm(result.form);
      articleStore.assignPage(result.page);
      this.props.form.setFieldsValue(result.form);
   }
   // 表单点击查询
   @autoBind
   onSubmit (e) {
      const { form, setQuery } = this.props;
      e && e.preventDefault();

      form.validateFields((err, values) => {
         if (err) return;
         const { actionTimes } = values;
         values.actionTimes = actionTimes ? actionTimes.map(date => date.format('YYYY-MM-DD')) : [];
         setQuery({current: 1, ...values});
      });
   }
   // 获取query参数并搜索
   componentWillReceiveProps ({location: nextLocation}) {
      const { location, articleStore } = this.props;

      if (JSON.stringify(nextLocation) !== JSON.stringify(location)) {
         this.props.getQuery(this.queryFormat, this.mapData);
         articleStore.requestSearch();
      }
   }
   // 获取初始query参数并搜索
   componentDidMount () {
      const { articleStore, tagStore } = this.props;
      tagStore.requestList();
      // 转换query的格式
      this.props.getQuery(this.queryFormat, this.mapData);
      articleStore.requestSearch();
   }
   componentWillUnmount () {
      this.props.tagStore.reset();
      this.props.articleStore.reset();
   }
   render () {
      const {articleStore, tagStore, form} = this.props;
      // 表格列表配置
      const aColConfig = [
         {
            title: '文章标题',
            dataIndex: 'title'
         }, {
            title: '文章标签',
            dataIndex: 'tag'
         }, {
            title: '创建时间',
            dataIndex: 'create_time'
         }, {
            title: '更新时间',
            dataIndex: 'update_time'
         }, {
            title: '发布状态',
            dataIndex: 'is_disabled'
         }, {
            title: '操作',
            width: '140px',
            dataIndex: 'id',
            render: (id, row) => {
               return (
                  <span>
                     <Popconfirm title="确定删除?" onConfirm={() => articleStore.requestDelete(id)}>
                        <a href="#">删除</a>
                     </Popconfirm>
                     <Divider type="vertical" />
                     <Link to={`/article/${id}`}>编辑</Link>
                  </span>
               );
            }
         }
      ];

      // 表格分页配置
      const oPageConfig = {
         current: articleStore.page.current,
         total: articleStore.page.total,
         pageSize: articleStore.page.size,
         showSizeChanger: true,
         showQuickJumper: true,
         onChange: current => this.props.setQuery({current}),
         onShowSizeChange: (current, size) => this.props.setQuery({current: 1, size})
      };
      // 表单项配置
      const aFormItem = [
         {
            label: '文章标题',
            dataIndex: 'title',
            config: {initialValue: ''},
            node: <Input />
         }, {
            label: '发布状态',
            dataIndex: 'status',
            config: {initialValue: ''},
            node: (
               <Select className="l-w172">
                  <Option value="">全部</Option>
                  <Option value="0">允许</Option>
                  <Option value="1">禁止</Option>
               </Select>
            )
         }, {
            label: '操作时间',
            dataIndex: 'actionTimes',
            config: {initialValue: ''},
            node: <RangePicker />
         }, {
            label: '文章标签',
            dataIndex: 'tags',
            config: {initialValue: []},
            node: (
               <Select placeholder="全部" mode="multiple" className="l-w300">
                  {toJS(tagStore.base.tags).map(
                     item => <Option key={item.id} value={item.id}>{item.name}</Option>
                  )}
               </Select>
            )
         }
      ];
      return (
         <div>
            <div className="l-mb10">
               <Link to="/article/add">
                  <Button icon="plus-circle" type="primary">新建文章</Button>
               </Link>
            </div>
            <SearchFormWrp
               form={form}
               onSubmit={this.onSubmit}
               formItems={aFormItem} />
            <Table
               className="l-search-result"
               pagination={oPageConfig}
               rowKey="id"
               dataSource={toJS(articleStore.base.tableRows)}
               size="middle"
               columns={aColConfig} />
         </div>
      );
   }
}

export default Article;
