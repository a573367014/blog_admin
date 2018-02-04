import '@/assets/css/markdown.css';
import 'highlightjs/styles/github.css';
import React from 'react';
import autoBind from 'autobind-decorator';
import withHljs from '@/components/HOC/withHljs';
import ReactMarkdown from 'react-markdown';
import withComponentRest from '@/components/HOC/withComponentRest';
import { Form, Input, Button, Select, Switch, Row, Col } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

// markdown代码高亮
const ReactMarkdown_ = withHljs(ReactMarkdown);
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
   labelCol: {
      xs: { span: 24 },
      sm: { span: 2 }
   },
   wrapperCol: {
      xs: { span: 24 },
      sm: { span: 22 }
   }
};

@Form.create()
@withComponentRest
@inject('articleStore', 'tagStore')
@observer
class ArticleForm extends React.Component {
   state = {
      content: ''
   }

   @autoBind
   onSubmit (e) {
      const { articleStore, match, history } = this.props;
      const id = match.params.id;
      e.preventDefault();
      this.props.form.validateFieldsAndScroll(async (err, values) => {
         if (err) return;
         id
            ? await articleStore.requestUpdate(id, values)
            : await articleStore.requestAdd(values);
         history.goBack();
      });
   }

   async componentWillMount () {
      const { articleStore, tagStore, match } = this.props;
      const { id } = match.params;
      const results = await Promise.all([
         tagStore.requestList(),
         id && articleStore.requestDetail(id)
      ]);
      if (id) {
         this.setState({
            content: results[1].data.content
         });
         this.props.form.setFieldsValue(results[1].data);
      }
   }

   @autoBind
   onValChange (key, newVal) {
      this.setState({ content: newVal });
   }
   componentWillUnmount () {
      this.props.tagStore.reset();
      this.props.articleStore.reset();
   }
   render () {
      const { articleStore, tagStore, form } = this.props;
      const getFieldDecorator = form.getFieldDecorator;
      const rule = { required: true, message: '不能为空!' };
      const aFormItem = [
         {
            label: '是否发布',
            dataIndex: 'is_disabled',
            config: { valuePropName: 'checked', initialValue: true },
            node: <Switch />
         }, {
            label: '文章标题',
            dataIndex: 'title',
            config: {
               rules: [rule]
            },
            node: <Input className="l-max-w400" />
         }, {
            label: '文章标签',
            dataIndex: 'tag',
            config: {
               rules: [Object.assign({type: 'array'}, rule)]
            },
            node: (
               <Select placeholder="请选择文章标签" mode="multiple" className="l-max-w400">
                  {
                     toJS(tagStore.base.tags).map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
               </Select>
            )
         }, {
            label: '文章简要',
            dataIndex: 'info',
            config: {
               rules: [rule]
            },
            node: <Input.TextArea rows={4} className="l-max-w400" />
         }
      ];

      return (
         <Form onSubmit={this.onSubmit}>
            {
               aFormItem.map(item => <FormItem key={item.dataIndex} label={item.label} {...formItemLayout}>
                  {getFieldDecorator(item.dataIndex, item.config)(item.node)}
               </FormItem>)
            }
            <FormItem {...formItemLayout} label="文章内容">
               <Row gutter={10}>
                  <Col span={10}>
                     <FormItem >
                        {getFieldDecorator('content', {
                           rules: [rule]
                        })(
                           <Input.TextArea
                              style={{minHeight: 200}}
                              onInput={(e) => this.onValChange('content', e.target.value)} />
                        )}
                     </FormItem>
                  </Col>
                  <Col span={14}>
                     <ReactMarkdown_ source={this.state.content} className="markdown-body" />
                  </Col>
               </Row>
            </FormItem>

            <FormItem
               className="l-mt40"
               wrapperCol={{
                  xs: {
                     span: 24,
                     offset: 0
                  },
                  sm: {
                     span: 22,
                     offset: 2
                  }
               }}>
               <Button type="primary" htmlType="submit" disabled={articleStore.baseStore.loading}>提 交</Button>
            </FormItem>
         </Form>
      );
   }
}

export default ArticleForm;
