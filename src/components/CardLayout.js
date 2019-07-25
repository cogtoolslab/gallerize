import React from "react";
import { SingleCard } from "./SingleCard";
import axios from "axios";


/**
 * The Layout Component. Did not use any async calls.
 * TODO: Need to add "render upon scrolling"
 * TODO: Need some better async control...
 * TODO: Need to Connect to MongoDB instead of doing csv loader
 */
export class CardLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      order: this.props.order,
      classes: this.props.classes,
      ageRange: this.props.ageRange,
      validToken: this.props.validToken,
      toRet: []
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("in will receive props:", nextProps);
    this.fetch(nextProps);
  }

  fetch(filter) {
    console.log("in fetch, filter is: ", filter);
    axios.post('http://localhost:7000/db/get-data', filter)
      .then(response => {
        if (response.data.length > 0) {
          let toRet = response.data.map(curDraw => {
            return <SingleCard input={curDraw} key={curDraw._id} />;
          });
          this.setState({
            toRet: toRet
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    console.log("in render, toRet is now: ", this.state.toRet);
    return (
      <div className="content">
        {console.log("started rendering Layout")}
        {this.state.toRet}

      </div>
    );
  }
}
