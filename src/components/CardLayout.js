import React from "react";
import { SingleCard } from "./SingleCard";

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
      toRender: [],
      order: this.props.order,
      classes: this.props.classes,
      ageRange: this.props.ageRange,
      toRet: []
    };
    // We might want to change this to load from our MongoDB
    this.readCSV("/parser/parsed.csv");
    let nextProps = this.state;
    this.renderOrder(nextProps);
  }

  componentWillReceiveProps(nextProps) {
    console.log("In will receive props");
    this.renderOrder(nextProps);
  }
  

  componentWillUpdate(){
    return true;
  }

  render() {
    return (
      <div className="content">
        {console.log("started rendering Layout")}
        {this.state.toRet}
      </div>
    );
  }

  compare_age(a, b) {
    if (this.state.order === "Age (Young - Old) Group By Class") {
      if (parseInt(a.age) - parseInt(b.age) !== 0)
        return parseInt(a.age) - parseInt(b.age);
      return a.class > b.class ? 1 : b.class > a.class ? -1 : 0;
    } else if (this.state.order === "Age (Old - Young) Group By Class") {
      if (parseInt(b.age) - parseInt(a.age) !== 0)
        return parseInt(b.age) - parseInt(a.age);
      return a.class > b.class ? 1 : b.class > a.class ? -1 : 0;
    }
  }
  /* We might not need this any more*/
  compare_class(a, b) {
    if (this.state.order === "Class (A - Z)") {
      if (a.class !== b.class)
        return a.class > b.class ? 1 : b.class > a.class ? -1 : 0;
      return parseInt(a.age) - parseInt(b.age);
    } else if (this.state.order === "Class (Z - A)") {
      if (a.class !== b.class)
        return a.class < b.class ? 1 : b.class < a.class ? -1 : 0;
      return parseInt(a.age) - parseInt(b.age);
    }
  }

  renderOrder(nextProps) {
    console.log("in render order");
    let order =nextProps.order;
    let classes = nextProps.classes;
    let range = nextProps.ageRange;
    console.log(order, classes, range);
    this.state.toRender = [];

    let class_obj = {}
    this.state.array.forEach(function(item) {
      /* Class check */
      if (classes.indexOf(item.class) !== -1) {
        /* Age check */
        if(parseInt(item.age) <= parseInt(range[1]) && parseInt(item.age) >= parseInt(range[0])){
          var temp = item.class;
          if (temp in class_obj){
            class_obj[temp].push(item);
          }
          else{
            class_obj[temp] = [];
          }
        }
      }
    }, this);
    
    /* Ordering */
    Object.keys(class_obj).sort().forEach(function(key) {
      if (order === "Age (Young - Old) Group By Class" || order === "Age (Old - Young) Group By Class") {
        class_obj[key].sort(this.compare_age.bind(this));
      } else if (order === "Class (A - Z) Group By Age" || order === "Class (Z - A) Group By Age") {
        class_obj[key].sort(this.compare_class.bind(this));
      }
    }, this);

    /* add to the toRet array */
    this.state.toRet = [];
    Object.keys(class_obj).sort().forEach(function(key) {
      class_obj[key].forEach(function(item){
        if (item.filename) {
          this.state.toRet.push(<SingleCard input={item} />);
        }
      }, this);
    }, this);
    
    //this.setState({toRet: this.state.toRet});
  }

  readCSV(filePath) {
    //this.state.array = [];
    console.log("in read CSV");
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", filePath, false);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          //Process Data from text
          let allTextLines = allText.split("\n");
          allTextLines.forEach(function(item) {
            let row = item.split(",");
            /* we want to skip the first row*/
            if (row[0] !== "class") {
              let col = {
                class: row[0],
                age: row[1],
                expID: row[2],
                sessionID: row[3],
                filename: row[4],
                valid:  0//parseInt(row[5])
              };
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
