import React from 'react';
import {Switch, Card} from 'element-react';
export class SingleCard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        item: this.props.input
      }
    }
  
    render() {
      return (
        <Card className="single" key={this.state.item.filename} bodyStyle={{ padding: 0 } }>
        <a href = "https://google.com">
          {
            this.state.item.valid?(
              <img src= {"/images/"+this.state.item.filename} alt="Kid Draw"/>
            ):
            (
              <img src= {"/images/"+this.state.item.filename} alt="Kid Draw" style = {{backgroundColor: 'rgba(255, 0, 0, 0.3)'}}/>
            )
          }
        </a>
        <div style={{ padding: 14 }}>
          <span>{this.state.item.class}</span>
          <div className="bottom clearfix">
          <span>age: {this.state.item.age}</span>
              <Switch style = {{float: 'right'}} value={this.state.item.valid? "valid":"invalid"} onColor="#13ce66" offColor="#ff4949" 
                onValue={100} offValue={0} onChange={(value)=>{ console.log(value); this.setState({value: value})}}>
              </Switch>
          }
          </div>
        </div>
      </Card>
      );
    }
  }
