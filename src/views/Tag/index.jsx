import React from 'react';
import { Tag, Input, Icon, message } from 'antd';
import autoBind from 'autobind-decorator';
import EditableTag from '@/components/EditableTag';
import {inject, observer} from 'mobx-react';

@inject('tagStore')
@observer
export default class Tags extends React.Component {
   // 点击新建按钮
   @autoBind
   onClickNewTag () {
      const {tagStore} = this.props;
      tagStore.assignBase({inputVisible: true});
      setTimeout(() => {
         this.input.focus();
      });
   }
   // 同步value
   @autoBind
   onValueChange (e) {
      this.props.tagStore.assignForm({ inputValue: e.target.value });
   }
   // 重命名
   @autoBind
   onRename (newTag, index) {
      const {tagStore} = this.props;
      const tags = tagStore.base.tags;

      if (newTag === tags[index].name) return;
      if (!tags.some(tag => tag.name === newTag)) {
         tagStore.requestUpdate(newTag, index);
      } else {
         tagStore.resetTag(index);
         message.warning('标签已存在！');
      }
   }
   // 新建标签
   @autoBind
   async onNewTag () {
      const {tagStore} = this.props;
      const inputValue = tagStore.form.inputValue;

      if (inputValue && tagStore.base.tags.indexOf(inputValue) === -1) {
         tagStore.requestAdd(inputValue);
      } else if (inputValue) {
         message.warning('标签已存在！');
      }

      tagStore.assignBase({inputVisible: false});
      tagStore.assignForm({inputValue: ''});
   }

   componentWillMount () {
      const {tagStore} = this.props;
      tagStore.requestList();
   }

   componentWillUnmount () {
      this.props.tagStore.reset();
   }

   render () {
      const {tagStore} = this.props;
      const {tags, inputVisible} = tagStore.base;
      const {inputValue} = tagStore.form;

      return (
         <div>
            {tags.map((tag, i) =>
               <EditableTag
                  className="l-mb10"
                  value={tag.name}
                  key={tag.id}
                  onClose={() => tagStore.requestDelete(i)}
                  onPressEnter={newTag => this.onRename(newTag, i)} />
            )}
            {inputVisible && (
               <Input
                  ref={input => this.input = input}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.onValueChange}
                  onBlur={this.onNewTag}
                  onPressEnter={this.onNewTag}
               />
            )}
            {!inputVisible && (
               <Tag
                  onClick={this.onClickNewTag}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
               >
                  <Icon type="plus" /> 新建标签
               </Tag>
            )}
         </div>
      );
   }
}
