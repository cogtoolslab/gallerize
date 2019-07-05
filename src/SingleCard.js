import React from "react";
import { Switch, Card } from "element-react";

export class SingleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.input,
      value: this.props.input.valid
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ item: nextProps.input });
  }
  toggle(newValue){
    //send query to database
    this.setState({value: newValue});
  }
  render() {
    console.log(" in single Card");
    return (
      <Card
        className="single"
        key={this.state.item.filename}
        bodyStyle={{ padding: 0 }}
      >
        <a href="https://google.com">
          {this.state.value ? (
            <img src={"/images/" + this.state.item.filename} alt="Kid Draw" />
          ) : (
            <img
              src={"/images/" + this.state.item.filename}
              alt="Kid Draw"
              style={{ backgroundColor: "rgba(255, 0, 0, 0.3)" }}
            />
          )}
        </a>
        <div style={{ padding: 14 }}>
          <span>{this.state.item.class}</span>
          <div className="bottom clearfix">
            <span>age: {this.state.item.age}</span>
            <Switch
              style={{ float: "right" }}
              onColor="#13ce66"
              offColor="#ff4949"
              onValue={true}
              offValue={false}
              onChange={(value) => {
                this.toggle(value);
              }}
            />
          </div>
        </div>
      </Card>
    );
  }
}
