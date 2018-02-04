import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon, Popconfirm } from 'antd';
import autoBind from 'autobind-decorator';

export default class EditableTag extends React.Component {
   constructor (props) {
      super(props);
      this.state = {
         editable: false,
         value: props.value
      };
   }
   @autoBind
   onChange (e) {
      this.setState({value: e.currentTarget.value});
   }
   @autoBind
   onInputConfirm (e) {
      // 如果是点击关闭触发的blur事件则不做处理
      if (this.isCloseTask) {
         this.isCloseTask = false;
         return;
      }

      if (e.keyCode && e.keyCode !== 13) return;
      let val = e.currentTarget.value;
      if (val) {
         this.setState({editable: false});
         this.props.onPressEnter(val);
      }
   }
   @autoBind
   onClose () {
      if (this.state.editable) {
         this.setState({editable: false, value: this.props.value});
      } else {
         this.props.onClose(this.props.value);
      }
   }
   @autoBind
   onEdit () {
      this.setState({editable: true}, () => {
         this.input.select();
      });
   }

   componentWillReceiveProps (nextProps) {
      this.setState({value: nextProps.value});
   }

   render () {
      let {editable, value} = this.state;
      let onMouseDown = () => this.isCloseTask = true;
      return (
         <Tag className={`u-relative ${this.props.className}`}>
            {value}
            {
               editable &&
               <input
                  style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', paddingLeft: '5px'}}
                  ref={input => this.input = input}
                  defaultValue={value}
                  onChange={this.onChange}
                  onKeyUp={this.onInputConfirm}
                  onBlur={this.onInputConfirm} />
            }
            <Icon type="form" className="l-ml10" onClick={this.onEdit} />
            {
               editable
                  ? <Icon type="close" onClick={this.onClose} onMouseDown={onMouseDown} className="u-relative" />
                  : <Popconfirm title="确定删除?" onConfirm={this.onClose} onMouseDown={onMouseDown}>
                     <Icon type="close" className="u-relative" />
                  </Popconfirm>
            }
         </Tag>
      );
   }
}

EditableTag.defaultProps = {
   className: '',
   value: '',
   onPressEnter: () => {},
   onClose: () => {}
};

EditableTag.propTypes = {
   className: PropTypes.string,
   value: PropTypes.string.isRequired,
   onPressEnter: PropTypes.func,
   onClose: PropTypes.func
};
