import React from 'react';
import { Form, Input, Table, DatePicker, Popconfirm, Divider } from 'antd';
import autoBind from 'autobind-decorator';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import withCacheQuery from '@/components/HOC/withCacheQuery';
import SearchFormWrp from '@/components/SearchFormWrp';
import moment from 'moment';
import {PAGE_SIZE} from '@/config';
const RangePicker = DatePicker.RangePicker;

// 包装组件
@Form.create()
@withCacheQuery
@inject('commentStore')
@observer
export default class Comment extends React.Component {
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
      articleTitle: {
         map: ['form', 'articleTitle']
      },
      touristName: {
         map: ['form', 'touristName']
      },
      content: {
         map: ['form', 'content']
      },
      createTimes: {
         default: [],
         map: ['form', 'createTimes']
      }
   };
   // query自定义映射
   @autoBind
   mapData (result) {
      if (result.form.createTimes) {
         result.form.createTimes = result.form.createTimes.map(datestr => moment(datestr, 'YYYY-MM-DD'));
      }

      this.props.commentStore.assignForm(result.form);
      this.props.commentStore.assignPage(result.page);
      this.props.form.setFieldsValue(result.form);
   }
   // 表单点击查询
   @autoBind
   onSubmit (e) {
      const { form, setQuery } = this.props;
      e && e.preventDefault();

      form.validateFields((err, values) => {
         if (err) return;
         const { createTimes } = values;
         values.createTimes = createTimes ? createTimes.map(date => date.format('YYYY-MM-DD')) : [];
         setQuery({current: 1, ...values});
      });
   }
   // 获取query参数并搜索
   componentWillReceiveProps ({location: nextLocation}) {
      const { location, commentStore, getQuery } = this.props;
      // 相当于history.listen的效果
      if (JSON.stringify(nextLocation) !== JSON.stringify(location)) {
         getQuery(this.queryFormat, this.mapData);
         commentStore.requestSearch();
      }
   }
   // 获取初始query参数并搜索
   componentDidMount () {
      const { commentStore, getQuery } = this.props;
      getQuery(this.queryFormat, this.mapData);
      commentStore.requestSearch();
   }
   componentWillUnmount () {
      this.props.commentStore.reset();
   }
   render () {
      const { commentStore, form } = this.props;
      const { requestDelete, requestUpdate } = commentStore;
      // 表格列表配置
      const aColConfig = [
         {
            title: '内容',
            dataIndex: 'content',
            width: '32%',
            render: (id, row) => {
               return (
                  <Input.TextArea defaultValue={row.content} onBlur={e => row.content = e.currentTarget.value} />
               );
            }
         }, {
            title: '所属文章',
            dataIndex: 'articleTitle',
            width: '25%'
         }, {
            title: '所属游客',
            width: '15%',
            dataIndex: 'touristName'
         }, {
            title: '创建时间',
            dataIndex: 'createTime',
            width: '15%'
         }, {
            title: '操作',
            dataIndex: 'id',
            width: '13%',
            render: (id, row) => {
               return (
                  <span>
                     <Popconfirm title="确定删除?" onConfirm={() => requestDelete(id)}>
                        <a href="javascript:;">删除</a>
                     </Popconfirm>
                     <Divider type="vertical" />
                     <a href="javascript:;" onClick={() => requestUpdate(id, row.content)}>确认修改</a>
                  </span>
               );
            }
         }
      ];
      // 表格分页配置
      const oPageConfig = {
         current: commentStore.page.current,
         total: commentStore.page.total,
         pageSize: commentStore.page.size,
         showSizeChanger: true,
         showQuickJumper: true,
         onChange: current => this.props.setQuery({current}),
         onShowSizeChange: (current, size) => this.props.setQuery({current: 1, size})
      };
      // 表单项配置
      const aFormItem = [
         {
            label: '文章标题',
            dataIndex: 'articleTitle',
            config: {initialValue: ''},
            node: <Input />
         }, {
            label: '游客名称',
            dataIndex: 'touristName',
            config: {initialValue: ''},
            node: <Input />
         }, {
            label: '内容关键字',
            dataIndex: 'content',
            config: {initialValue: ''},
            node: <Input />
         }, {
            label: '创建时间',
            dataIndex: 'createTimes',
            config: {initialValue: ''},
            node: <RangePicker />
         }
      ];
      return (
         <div>
            <SearchFormWrp
               form={form}
               onSubmit={this.onSubmit}
               formItems={aFormItem} />
            <Table
               className="l-search-result"
               pagination={oPageConfig}
               rowKey="id"
               dataSource={toJS(commentStore.base.tableRows)}
               size="middle"
               columns={aColConfig} />
         </div>
      );
   }
}
