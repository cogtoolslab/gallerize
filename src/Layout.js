import React from 'react';
import { Select, Layout, Card} from 'element-react';
import 'element-theme-default';
import './Layout.css';


class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      option: "dummy"
    }
  }
  handleOptionChange(newOption){
    console.log("in Main, state changed! ");
    this.state.option = newOption;
    this.setState({option : newOption});
    console.log(this.state.option);
    this.render();
  }

  render(){
    let css1 = {
      float: 'left',
      paddingLeft: '50px'
    }
    let css2 = {
      fontSize: '25px',
      fontWeight: 'bold'
    }
    let css3 = {
      float:'right',
      padding: '10px 50px'
    }
    return (

      <div>
              {console.log("in main render")}
        <div className="header">
          <div style = {css1}>
            <a href="#" style={css2}>CogToolsLabLogo</a>
          </div>

          <div style={css3} >
            <SelectSort onSelectChange = {this.handleOptionChange.bind(this)}> </SelectSort>
          </div>
        </div>
        {console.log(this.state.option)}
        <CardLayout order = {this.state.option}> </CardLayout>
      </div>
    )
  }
}
/**
 * The Layout Component. Did not use any async calls
 * TODO: Need to add "render upon scrolling"
 * TODO: Need some better async control...
 */
class CardLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array:[],
      toRender: [],
      order: this.props.order,
      toRet: []
    };
    this.readCSV("/parser/parsed.csv");
  }

  render() {
    this.renderOrder();
    return (
      <div className="content">
        {console.log("started rendering")}
        {console.log(this.state.toRet)}
        {this.state.toRet}
      </div>
    )
  }

  compare_age(a,b){
    if(this.state.order === "option1"){
      if (parseInt(a.age) - parseInt(b.age) != 0)
          return (parseInt(a.age) - parseInt(b.age));
      return ((a.class) > (b.class) ? 1: (b.class) > (a.class)? -1: 0); 
    }
    else if (this.state.order === "option2"){
      if (parseInt(b.age) - parseInt(a.age) != 0)
          return (parseInt(b.age) - parseInt(a.age));
      return ((a.class) > (b.class) ? 1: (b.class) > (a.class)? -1: 0); 
    }
  }
  compare_class(a,b){
    if(this.state.order === "option3"){
      if (a.class !== b.class)
          return ((a.class) > (b.class) ? 1: (b.class) > (a.class)? -1: 0);
      return (parseInt(a.age) - parseInt(b.age));
    }
    else if (this.state.order === "option4"){
        if (a.class !== b.class)
            return ((a.class) < (b.class) ? 1: (b.class) < (a.class)? -1: 0);
        return (parseInt(a.age) - parseInt(b.age));
    }
  }

  renderOrder(){
    this.state.order = this.props.order;
    let option = this.props.order;
    console.log(option);
    //Sort toRender Array
    if (option === "option1" || option === "option2"){
      this.state.array.sort(this.compare_age.bind(this));
    }
    else if (option === "option3" || option === "option4"){
      this.state.array.sort(this.compare_class.bind(this));
    }
    this.state.toRender = []
    this.state.array.forEach(function (item){
      if(item.filename)
        this.state.toRender.push("" + item.filename);
    }, this);
    this.state.toRet = []
    /* create HTML nodes for render function */
    this.state.array.forEach(function (item){
      if(item.filename)
        this.state.toRet.push(
          <Card className="single" key={item.filename} bodyStyle={{ padding: 0 } }>
            <a href = "https://google.com">
            <img src= {"/images/"+item.filename} alt="Kid Draw"/>
            </a>
            <div style={{ padding: 14 }}>
              <span>{item.class}</span>
              <div className="bottom clearfix">
              <span>age: {item.age}</span>
              </div>
            </div>
          </Card>);
    }, this);
  }

  readCSV(filePath){
    console.log("in read CSV");
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "/parser/parsed.csv", false);
    rawFile.onreadystatechange = function(){
      if(rawFile.readyState === 4){
        if(rawFile.status === 200 || rawFile.status == 0){
          var allText = rawFile.responseText;
          //Process Data from text
          let allTextLines = allText.split('\n');
          allTextLines.forEach(function (item){
            let row = item.split(',');
            /* we want to skip the first row*/
            if (row[0] !=="class"){
              let col = {"class": row[0], "age": row[1], "expID": row[2], "sessionID": row[3], "filename": row[4], valid: row[5]};
              this.state.array.push(col);
            }
          }, this);
          console.log("done reading");
        }
      }
    }.bind(this);
    rawFile.send(null);
  }
}


/**
 * Sort Selector Component.
 * TODO: Need add some event listener
 */
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
    console.log("selection changed! ");
    console.log(event);
    this.props.onSelectChange(event);
  }
}

export {SelectSort, CardLayout, Main};
