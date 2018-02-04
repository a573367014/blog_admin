import React from 'react';
import { Form, Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
/**
 * 搜索表单布局
 */
const SearchFormWrp = ({formItems, form, onSubmit}) => {
   const getFieldDecorator = form.getFieldDecorator;
   return (
      <Form
         className="l-search-form"
         onSubmit={onSubmit}>
         <Row gutter={24}>
            {
               formItems.map(
                  item => <Col span={8} key={item.dataIndex}>
                     <FormItem label={item.label}>
                        {getFieldDecorator(item.dataIndex, item.config)(item.node)}
                     </FormItem>
                  </Col>
               )
            }
         </Row>
         <Row>
            <Col span={24}>
               <Button type="primary" htmlType="submit">查询</Button>
               <Button
                  className="l-ml10"
                  onClick={() => {
                     form.resetFields();
                     onSubmit();
                  }}>重置</Button>
            </Col>
         </Row>
      </Form>
   );
};

SearchFormWrp.propTypes = {
   formItems: PropTypes.array.isRequired,
   form: PropTypes.object.isRequired,
   onSubmit: PropTypes.func.isRequired
};
export default SearchFormWrp;
