import React from 'react';
import { Form, Input, Table, DatePicker, Popconfirm } from 'antd';
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
@inject('touristStore')
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
      name: {
         map: ['form', 'name']
      },
      email: {
         map: ['form', 'email']
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

      this.props.touristStore.assignForm(result.form);
      this.props.touristStore.assignPage(result.page);
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
      const { location, touristStore, getQuery } = this.props;
      // 相当于history.listen的效果
      if (JSON.stringify(nextLocation) !== JSON.stringify(location)) {
         getQuery(this.queryFormat, this.mapData);
         touristStore.requestSearch();
      }
   }
   // 获取初始query参数并搜索
   componentDidMount () {
      const { touristStore, getQuery } = this.props;
      getQuery(this.queryFormat, this.mapData);
      touristStore.requestSearch();
   }
   componentWillUnmount () {
      this.props.touristStore.reset();
   }
   render () {
      const { touristStore, form } = this.props;
      const { requestDelete } = touristStore;
      // 表格列表配置
      const aColConfig = [
         {
            title: '游客',
            dataIndex: 'name'
         }, {
            title: '游客邮箱',
            dataIndex: 'email'
         }, {
            title: '创建时间',
            dataIndex: 'createTime'
         }, {
            title: '操作',
            dataIndex: 'id',
            render: (id, row) => {
               return (
                  <span>
                     <Popconfirm title="确定删除?" onConfirm={() => requestDelete(id)}>
                        <a href="javascript:;">删除</a>
                     </Popconfirm>
                  </span>
               );
            }
         }
      ];
      // 表格分页配置
      const oPageConfig = {
         current: touristStore.page.current,
         total: touristStore.page.total,
         pageSize: touristStore.page.size,
         showSizeChanger: true,
         showQuickJumper: true,
         onChange: current => this.props.setQuery({current}),
         onShowSizeChange: (current, size) => this.props.setQuery({current: 1, size})
      };
      // 表单项配置
      const aFormItem = [
         {
            label: '游客',
            dataIndex: 'name',
            config: {initialValue: ''},
            node: <Input />
         }, {
            label: '游客邮箱',
            dataIndex: 'email',
            config: {
               initialValue: '',
               rules: [{type: 'email', message: '邮箱格式错误'}]
            },
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
               dataSource={toJS(touristStore.base.tableRows)}
               size="middle"
               columns={aColConfig} />
         </div>
      );
   }
}
