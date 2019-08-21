import React from "react";
import { Button, Card, Dialog } from "element-react";
import axios from "axios";

class SingleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.input,
      value: this.props.input.valid,
      dialogVisible: false
    };
  }
  update(newValid) {
    axios
      .put("http://cogtoolslab.org:8882/db/update-data", {
        //.put("http://localhost:8882/db/update-data", {
        valid: newValid,
        filename: this.state.item.filename
      })
      .then(response => {
        if (response.status === 200) {
          console.log("updated to ", newValid);
          this.setState({
            value: newValid
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  popUp() {
    this.setState({ dialogVisible: true });
  }

  render() {
    return (
      <Card
        className="single"
        key={this.state.item.filename}
        bodyStyle={{ padding: 0 }}
      >
        <PicLink
          popUp={this.popUp.bind(this)}
          valid={this.state.value}
          url={this.state.item.url}
        />

        <Dialog
          title="Detailed Information"
          
          visible={this.state.dialogVisible}
          onCancel={() => this.setState({ dialogVisible: false })}
          lockScroll={false}
        >
          <Dialog.Body>
            <p> {"File name: " + this.state.item.filename} </p>
            <p> {"Age: " + this.state.item.age}</p>
            <p> {"GameID: " + this.state.item.gameID} </p>
            <p> {"Class: " + this.state.item.class}</p>
            <p> {"repetition: " + this.state.item.repetition}</p>
            <p> {"trialNUm: " + this.state.item.trialNum}</p>
            <p> {"Condition: " + this.state.item.condition}</p>
            <img
              style={{ display:"block", width: "50%", height: "50%", margin:"auto"}}
              src={this.state.item.url}
              alt={"img"}
            />
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer" />
        </Dialog>
        <div style={{ padding: 14 }}>
          <p style={{ display: "inline" }}>{this.state.item.class}</p>
          <p style={{ display: "inline", marginLeft: "20px" }}>
            age: {this.state.item.age}
          </p>
          <div style={{ marginTop: "10px" }}>
            <Button
              style={{ float: "left" }}
              size="small"
              type="success"
              disabled={this.state.value === 1}
              onClick={e => {
                this.update(1);
              }}
            >
              valid
            </Button>
            <Button
              style={{ float: "right" }}
              size="small"
              type="danger"
              disabled={this.state.value === -1}
              onClick={e => {
                this.update(-1);
              }}
            >
              invalid
            </Button>
          </div>
          <br />
        </div>
      </Card>
    );
  }
}

class PicLink extends React.Component {
  render() {
    //Unchecked images
    if (this.props.valid === 0) {
      return (
        <div>
          <img
            onClick={() => {
              this.props.popUp();
            }}
            src={this.props.url}
            alt="Kid Draw"
          />
        </div>
      );
    }
    //Those have been marked as valid
    if (this.props.valid === 1) {
      return (
        <div>
          <img
          className = "valid"
            onClick={() => {
              this.props.popUp();
            }}
            src={this.props.url}
            alt="Kid Draw"
          />
        </div>
      );
    }

    //Those have been marked as invalid
    return (
      <div>
        <img
          className = "invalid"
          onClick={() => {
            this.props.popUp();
          }}
          src={this.props.url}
          alt="Kid Draw"
        />
      </div>
    );
  }
}

export { SingleCard };
