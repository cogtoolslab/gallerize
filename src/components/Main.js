import React from "react";
import { Select, Input, Button } from "element-react";
import { CardLayout } from "./CardLayout";
import "element-theme-default";
import {BrowserRouter as Router, Route, Link } from "react-router-dom"

/* This is the main class including the header */
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "Age (Young - Old) Group By Class",
      classes: ["tree", "airplane", "bike"],
      ageRange: [0, 100]
    };
  }
  handleOrderChange(newOrder) {
    console.log("in handleOrderChange");
    console.log("changed to " + newOrder);
    this.state.order = newOrder;
    //this.setState({option : newOrder});
  }

  handleClassChange(newClass) {
    console.log("in handleClassChange");

    if (newClass.length === 0) {
      console.log("changed to all classes");
      this.state.classes = this.allClasses;
    } else {
      console.log("changed to :", newClass);
      //this.setState({classes: newClass});
      this.state.classes = newClass;
    }
  }

  handleMax(newMax) {
    console.log("in handleMax");
    console.log("changed to " + newMax);
    this.state.ageRange = [this.state.ageRange[0], newMax];
    //this.setState({ageRange : this.state.ageRange});
  }

  handleMin(newMin) {
    console.log("in handleMin");
    console.log("changed to " + newMin);
    this.state.ageRange = [newMin, this.state.ageRange[1]];
    //this.setState({ageRange : this.state.ageRange});
  }

  submit() {
    console.log("in submit, the state is now: ", this.state);
    this.setState({
      order: this.state.order,
      classes: this.state.classes,
      ageRange: this.state.ageRange
    });
  }

  render() {
    console.log("in main render");
    return (
      <Router>
      <div>
        {console.log("Main Started Rendering")}
        <div className="header">
          <div style={{ float: "left", paddingLeft: "50px" }}>
            <div style={{ fontSize: "25px", fontWeight: "bold" }}>
              Cogitive Tools Lab
            </div>
          </div>
          <div style={{ display: "inline-block", padding: "10px 50px" }}>
            <SelectSort onSelectChange={this.handleOrderChange.bind(this)} />
            <Input
              onChange={this.handleMin.bind(this)}
              style={{
                marginLeft: "50px",
                display: "inline-block",
                width: "100px"
              }}
              type="number"
              placeholder="min age"
            />
            <p style={{ display: "inline" }}> TO </p>
            <Input
              onChange={this.handleMax.bind(this)}
              style={{
                marginRight: "50px",
                display: "inline-block",
                width: "100px"
              }}
              type="number"
              placeholder="max age"
            />
            <SelectClass onSelectChange={this.handleClassChange.bind(this)} />
            <Button type="primary" onClick={this.submit.bind(this)}>
              Submit
            </Button>
          </div>
        </div>
        <CardLayout
          order={this.state.order}
          classes={this.state.classes}
          ageRange={this.state.ageRange}
        />
      </div>
      <Route path = "/" exact component={TodosList} />
      <Route path = "/edit/:id" component={EditTodo} />
      <Route path = "/create" component={CreateTodo} />
      </Router>
    );
  }
}

/**
 * Selector Component in header.
 */
class SelectClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [
        {
          value: "airplane"
        },
        {
          value: "bike"
        },
        {
          value: "bear"
        },
        {
          value: "bird"
        },
        {
          value: "boat"
        }
      ],
      value: []
    };
  }

  render() {
    return (
      <Select
        multiple={true}
        onChange={this.handleChange.bind(this)}
        placeholder="class by ..."
        value={this.state.value}
      >
        {this.state.options.map(el => {
          return (
            <Select.Option key={el.value} label={el.label} value={el.value} />
          );
        })}
      </Select>
    );
  }

  handleChange(event) {
    console.log("class selection changed! ");
    console.log(event);
    this.props.onSelectChange(event);
  }
}

class SelectSort extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [
        {
          value: "Age (Young - Old) Group By Class"
        },
        {
          value: "Age (Old - Young) Group By Class"
        },
        {
          value: "Age (Young - Old) Group By Age"
        },
        {
          value: "Age (Old - Young) Group By Age"
        }
      ],
      value: ""
    };
  }

  render() {
    return (
      <Select
        style = {{width:'250px'}}
        onChange={this.handleChange.bind(this)}
        placeholder="sort by..."
        value={this.state.value}
      >
        {this.state.options.map(el => {
          return (
            <Select.Option key={el.value} label={el.label} value={el.value} />
          );
        })}
      </Select>
    );
  }

  handleChange(event) {
    console.log("order selection changed! ");
    console.log(event);
    this.props.onSelectChange(event);
  }
}

export { Main };
