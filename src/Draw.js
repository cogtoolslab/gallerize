import React from 'react';

/**
 * This is the class for each picture.
 * props.value is the url of the picture.
 * TODO need to know what happens after user clicked the picture. 
 */
class Draw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: this.props.value,
        };
      }

    render() {
      return (
        <a href = {this.props.value}>
        <img src = {this.state.value} style="width:42px;height:42px;border:0;">
        </img>
        </a>
      );
    }
  }

  export default Draw;