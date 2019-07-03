import React from 'react';
import {SingleCard} from './SingleCard'

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
        array:[],
        toRender: [],
        order: this.props.order,
        toRet: []
      };
      // We might want to change this to load from our MongoDB
      this.readCSV("/parser/parsed.csv");
    }
  
    render() {
      this.renderOrder();
      return (
        <div className="content">
          {console.log("started rendering Layout")}
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
          this.state.toRender.push({filename: "" + item.filename, valid: item.valid});
      }, this);
      this.state.toRet = []
      /* create HTML nodes for render function */
      this.state.array.forEach(function (item){
        if(item.filename){
          this.state.toRet.push(
            <SingleCard input = {item}></SingleCard>
          );
        }
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
                let va = row[5] === 1? true:false; 
                let col = {"class": row[0], "age": row[1], "expID": row[2], "sessionID": row[3], "filename": row[4], valid: va};
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