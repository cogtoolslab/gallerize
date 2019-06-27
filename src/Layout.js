import React from 'react';
import { Select, Layout} from 'element-react';
import 'element-theme-default';
import './Layout.css';
import { resolve, reject, async } from 'q';
import {txt} from './parsed.csv';
/**
 * The Layout Component.
 * TODO: Need to test the csv loader.
 * TODO: Need algorithm to keep rendering the correct order for rendering
 */
class CardLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      array:[],
      toRender: [],
      order: "option1",
      toRet: []
    };

    this.readCSV("/parser/parsed.csv");
    this.renderOrder("option1");
  }

  render() {
    return (
      <div className="content">
        {console.log("started rendering")}
        {console.log(this.state.toRet)}
        {this.state.toRet}
      </div>
    )
  }

  renderOrder(option){
    console.log("in renderOrder");
    //Sort toRender Array
    if (option === "option1"){
      this.state.array.sort((a, b) => (parseInt(a.age) > parseInt(b.age)) ? 1 : -1);
    }

    this.state.array.forEach(function (item){
      if(item.filename)
        this.state.toRender.push("/images/" + item.filename);
    }, this);
    /* create HTML nodes for render function */
    this.state.toRender.forEach(function (item){
      this.state.toRet.push(
      <div className="single" key={item}>
        <a href = "https://google.com">
          <img src= {item} alt="Kid Draw"/>
        </a>
      </div>);
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
            let col = {"class": row[0], "age": row[1], "expID": row[2], "sessionID": row[3], "filename": row[4], valid: row[5]};
            this.state.array.push(col);
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
        value: 'Option1',
        label: 'Age (Young - Old)'
      }, {
        value: 'Option2',
        label: 'Age (Old - Young)'
      }, {
        value: 'Option3',
        label: 'Date'
      }, {
        value: 'Option4',
        label: 'Class'
      }],
      value: ''
    };
  }
  
  render() {
    return (
      <Select placeholder = "sort by ..." value={this.state.value}>
        {
          this.state.options.map(el => {
            return <Select.Option  key={el.value} label={el.label} value={el.value} />
          })
        }
      </Select>
    )
  }
}

export {SelectSort, CardLayout};
