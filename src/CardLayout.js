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
  }

  componentWillReceiveProps(nextProps) {
    console.log("In will receive props");
    this.setState({
      array: this.state.array,
      toRender: this.state.toRender,
      order: nextProps.order,
      classes: nextProps.classes,
      ageRange: nextProps.ageRange,
      toRet: this.state.toRet
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("In should update");
    return true;
  }

  render() {
    this.renderOrder();
    return (
      <div className="content">
        {console.log("started rendering Layout")}
        {this.state.toRet}
      </div>
    );
  }

  compare_age(a, b) {
    if (this.state.order === "Age (Young - Old)") {
      if (parseInt(a.age) - parseInt(b.age) !== 0)
        return parseInt(a.age) - parseInt(b.age);
      return a.class > b.class ? 1 : b.class > a.class ? -1 : 0;
    } else if (this.state.order === "Age (Old - Young)") {
      if (parseInt(b.age) - parseInt(a.age) !== 0)
        return parseInt(b.age) - parseInt(a.age);
      return a.class > b.class ? 1 : b.class > a.class ? -1 : 0;
    }
  }
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

  renderOrder() {
    console.log("in render order");
    let order = this.props.order;
    let classes = this.props.classes;
    let range = this.props.ageRange;
    this.state.toRender = [];

    /* Class check first */
    this.state.array.forEach(function(item) {
      if (classes.indexOf(item.class) !== -1) {
        this.state.toRender.push(item);
      }
    }, this);

    /* Age Range check second */
    this.state.toRender.forEach(function(item) {
      if (!(item.age <= range[1] && item.age >= range[0])) {
        var index = this.state.toRender.indexOf(item);
        this.state.toRender.splice(index, 1);
      }
    }, this);

    /* Ordering */
    if (order === "Age (Young - Old)" || order === "Age (Old - Young)") {
      this.state.array.sort(this.compare_age.bind(this));
    } else if (order === "Class (A - Z)" || order === "Class (Z - A)") {
      this.state.array.sort(this.compare_class.bind(this));
    }

    this.state.toRender.forEach(function(item) {
      if (item.filename) {
        this.state.toRender.push({
          filename: "" + item.filename,
          valid: item.valid
        });
      }
    }, this);

    this.state.toRet = [];

    this.state.array.forEach(function(item) {
      if (item.filename) {
        this.state.toRet.push(<SingleCard input={item} />);
      }
    }, this);
  }

  readCSV(filePath) {
    console.log("in read CSV");
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "/parser/parsed.csv", false);
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
              let va = row[5] === 1 ? true : false;
              let col = {
                class: row[0],
                age: row[1],
                expID: row[2],
                sessionID: row[3],
                filename: row[4],
                valid: va
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
