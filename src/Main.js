import React from 'react';
import {Select, Input, Checkbox} from 'element-react';
import {CardLayout} from './CardLayout'
import 'element-theme-default';

/* This is the main class including the header */
class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      order: "default",
      classes: ["tree", "airplane", "bike"],
      ageRange: "all"
    }
  }
  handleOrderChange(newOrder){
    console.log("in handleOrderChange");
    console.log("changed to "+newOrder);
    this.state.order = newOrder;
    this.setState({option : newOrder});
    //this.render();
  }

  handleClassChange(newClass){
    console.log("in handleClassChange");
    console.log("changed to "+newClass);
    this.state.class = newClass;
    //this.setState({class : newClass});
  }

  handleMax(newMax){
    console.log("in handleMax");
    console.log("changed to "+newMax);
    this.state.ageRange = [this.state.ageRange[0], newMax];
    //this.setState({ageRange : this.state.ageRange});
  }

  handleMin(newMin){
    console.log("in handleMin");
    console.log("changed to "+newMin);
    this.state.ageRange = [newMin, this.state.ageRange[1]];
    //this.setState({ageRange : this.state.ageRange});
  }

  render(){
    console.log("in main render");
    return (
      <div>
        {console.log("Main Started Rendering")}
        <div className="header">
          <div style = {{float: 'left',paddingLeft: '50px'}}>
          <div style={{fontSize: '25px',fontWeight: 'bold'}}>Cogitive Tools Lab</div>
          </div>
          <div style={{display :"inline-block", padding: '10px 50px'}} >
            <SelectSort onSelectChange = {this.handleOrderChange.bind(this)}> </SelectSort>
            <Input onChange = {this.handleMin.bind(this)} style = {{ marginLeft:"50px", display :"inline-block",width : "100px"}} type = "number" placeholder = "min age" /> 
            <p style = {{display: "inline"}}> TO </p>
            <Input onChange = {this.handleMax.bind(this)} style = {{marginRight: "50px", display :"inline-block",width : "100px"}}type = "number" placeholder = "max age"/>
            <SelectClass onSelectChange = {this.handleClassChange.bind(this)}> </SelectClass>
          </div>
        </div>
        <CardLayout order = {this.state.order} class = {this.state.class} ageRange = {this.state.ageRange}> </CardLayout>
      </div>
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
    options: [{
      value: 'Option1',
      label: 'Airplane'
    }, {
      value: 'Option2',
      label: 'Bike'
    }, {
      value: 'Option3',
      label: 'bear'
    }, {
      value: 'Option4',
      label: 'bird'
    }, {
      value: 'Option5',
      label: 'boat'
    }],
    value: []
    };
  }
  
  render() {
    return (
      <Select multiple = {true} onChange = {this.handleChange.bind(this)} placeholder = "class by ..." value={this.state.value}>
        {
          this.state.options.map(el => {
            return <Select.Option  key={el.value} label={el.label} value={el.value} />
          })
        }
      </Select>
    )
  }

  handleChange(event){
    console.log("class selection changed! ");
    console.log(event);
    this.props.onSelectChange(event);
  }
}

class SelectSort extends React.Component {
  constructor(props) { 
      super(props);
    
      this.state = {
        options: [{
          value: 'option1',
          label: 'Age (Young - Old)'
        }, {
          value: 'option2',
          label: 'Age (Old - Young)'
        }, {
          value: 'option3',
          label: 'Class (A - Z)'
        }, {
          value: 'option4',
          label: 'Class (Z - A)'
        }],
        value: ''
      };
    }
    
    render() {
      return (
        <Select onChange = {this.handleChange.bind(this)} placeholder = "sort by ..." value={this.state.value}>
          {
            this.state.options.map(el => {
              return <Select.Option  key={el.value} label={el.label} value={el.value} />
            })
          }
        </Select>
      )
    }
  
    handleChange(event){
      console.log("order selection changed! ");
      console.log(event);
      this.props.onSelectChange(event);
    }
  }

export {Main};
