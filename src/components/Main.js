import React from "react";
import { Select, Input, Button, Radio} from "element-react";
import { CardLayout } from "./CardLayout";
import "element-theme-default";
import axios from "axios";

/* This is the main class including the header */
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "Age (Young - Old) Group By Class",
      allClasses: [],
      classes: [],
      ageRange: [0, 100],
      valid: 2
    };
    this.tempState = this.state;
  }

  componentDidMount(){
    axios.get('http://localhost:7001/db/get-classes')
    .then(response => {
      var classes = response.data;
      this.tempState.classes = classes;
      this.setState({allClasses: classes, classes: classes});
    }
    )
    .catch((error)=>{
      console.log(error);
    });
  }

  handleOrderChange(newOrder) {
    console.log("in handleOrderChange, changed to " + newOrder);
    this.tempState.order = newOrder;
  }

  handleClassChange(newClass) {
    console.log("in handleClassChange");
    if (newClass.length === 0) {
      console.log("changed to all classes");
      this.tempState.classes = this.state.allClasses;
    } else {
      console.log("changed to :", newClass);
      this.tempState.classes = newClass;
    }
  }
  handleValidChange(newValue) {
    console.log("in handleValidChange, changed to " + newValue);
    this.tempState.valid = newValue;
  }

  handleMax(newMax) {
    console.log("in handleMax, changed to " + newMax);
    this.tempState.ageRange = [this.tempState.ageRange[0], newMax];
  }

  handleMin(newMin) {
    console.log("in handleMin, changed to " + newMin);
    this.tempState.ageRange = [newMin, this.tempState.ageRange[1]];
  }
  submit(e) {
    e.preventDefault();
    console.log("in submit, the state is now: ", this.state);
    this.setState({
      order: this.tempState.order,
      classes: this.tempState.classes,
      ageRange: this.tempState.ageRange,
      valid: this.tempState.valid
    });
  }

  render() {
    return (
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
            <SelectClass allClasses = {this.state.allClasses} onSelectChange={this.handleClassChange.bind(this)}/>
            <SelectValid validChange = {this.handleValidChange.bind(this)}/>
            <Button style = {{marginLeft: '50px'}} type="primary" onClick={this.submit.bind(this)}>
              Submit
            </Button>
          </div>
        </div>
        <CardLayout
          order={this.state.order}
          classes={this.state.classes}
          ageRange={this.state.ageRange}
          validToken = {this.state.valid}
        />
      </div>

    );
  }
}

class SelectValid extends React.Component{
  constructor(props) {
    super(props);
  
    this.state = {
      value: 2
    }
  }
  
  onChange(value) {
    this.setState({ value });
    this.props.validChange(value);
  }
  
  render() {
    return (
      <Radio.Group style = {{marginLeft: '50px'}} value={this.state.value} onChange={this.onChange.bind(this)}>
        <Radio value="-1">Invalid</Radio>
        <Radio value="0">Unchecked</Radio>
        <Radio value="1">Valid</Radio>
        <Radio value="2">ALL</Radio>
      </Radio.Group>
    )
  }
}


/**
 * Selector Component in header.
 */
class SelectClass extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: [],
      value: []
    };
  }
  componentWillReceiveProps(nextprops){
    this.setState({options: nextprops.allClasses.map(each => {return {value: each}})});
  }

  render() {
    //console.log("render class picker");
    //console.log(this.state.options);
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
    //console.log("class selection changed! ");
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
    //console.log("order selection changed! ");
    console.log(event);
    this.props.onSelectChange(event);
  }
}

export { Main };