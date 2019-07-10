import React from "react";
import { Switch, Card ,Dialog} from "element-react";
import {BrowserRouter as Router, Route, Link } from "react-router-dom"


class SingleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.input,
      value: this.props.input.valid,
      dialogVisible: false
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ item: nextProps.input });
  }

  toggle(newValue) {
    //send query to database
    this.setState({ value: newValue });
  }
  popUp() {
    this.setState({ dialogVisible: true })
  }
  render() {
    return (
      <Card
        className="single"
        key={this.state.item.filename}
        bodyStyle={{ padding: 0 }}
      >

        <a onClick={this.popUp.bind(this)}>
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
        <Dialog
          title="Detailed Information"
          size="tiny"
          visible={this.state.dialogVisible}
          onCancel={() => this.setState({ dialogVisible: false })}
          lockScroll={false}
        >
          <Dialog.Body>
            <p> {"File name: " + this.state.item.filename} </p>
            <p> {"Age: " + this.state.item.age}</p>
            <img style = {{width : '100%', height : '100%'}}src={"/images/" + this.state.item.filename}/>
            <p> other info? </p>

          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
          <MySwitch
              value={this.state.value}
              onChange={this.toggle.bind(this)}
            />
            <br></br>
          </Dialog.Footer>
        </Dialog>
        <div style={{ padding: 14 }}>
          <span style = {{mariginRight:'10px'}}>{this.state.item.class}</span>
          <p>age: {this.state.item.age}</p> 
          <div className="bottom clearfix">
          
            <MySwitch
              value={this.state.value}
              onChange={this.toggle.bind(this)}
            />
          </div>
        </div>
      </Card>
    );
  }
}

class MySwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }

  render() {
    return (
      <Switch
        style={{ float: 'left'}}
        width = {75}
        value={this.state.value}
        onColor="#13ce66"
        offColor="#ff4949"
        onText = "valid"
        offText = "invalid"
        onValue={true}
        offValue={false}
        onChange={(value) => {
          this.setState({ value: value });
          this.props.onChange(value);
        }}
      >
      </Switch>
    )
  }
}
export { SingleCard };