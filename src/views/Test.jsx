import React from 'react';

export default class MyComponent extends React.Component {
   constructor (props) {
      super(props);
      this.myRef = React.createRef();
   }
   componentDidMount () {
      console.log(this.myRef);
   }
   render () {
      return (<React.Fragment>
         Some text.
         <h2>A heading</h2>
         <div ref={this.myRef}>123</div>
      </React.Fragment>);
   }
}
