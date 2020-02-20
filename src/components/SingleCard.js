import React from "react";
import { Button, Card, Dialog, Alert } from "element-react";
import axios from "axios";

class SingleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.input,
      value: this.props.input.valid,
      dialogVisible: false,
      popUp: this.props.popUp,
      validShow: this.props.validShow,
      invalidShow: 'auto',
      alertShow: 'none',
      alertType: this.props.alertType,
      local: this.props.local,
      invalidMsg: this.props.msg,
      onChildClick: this.props.onChildClick
    };
  }

  getValid(token) {
    if (this.state.value !== 0) return "info";
    if (this.token === "valid") return "success";
    if (this.token === "invalid") return "danger";
  }

  update(newValid) {
    if (!this.state.local) {
      axios
        .put("http://cogtoolslab.org:8887/db/update-data", {
          //.put("http://localhost:8882/db/update-data", {
          valid: newValid,
          filename: this.state.item.filename
        })
        .then(response => {
          if (response.status === 200) {
            this.setState({
              value: newValid
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      if (newValid === -1) {
        this.setState({
          invalidShow: 'none',
          alertShow: 'block'
        });

        if (this.state.alertType === 'error') {
          this.handleClick();
          this.setState({
            value: newValid
          });
        }
      }
    }
  }

  popUp() {
    if (this.state.popUp) {
      this.setState({ dialogVisible: true });
    }
  }

  handleClick() {
    this.state.onChildClick();
  }

  render() {
    let token = this.getValid("valid");
    let token2 = this.getValid("invalid");
    return (
      <Card
        className="single"
        key={this.state.item.filename}
        bodyStyle={{ padding: 0, width: '200px', height: '200px' }}
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
              style={{ display: "block", width: "50%", height: "50%", margin: "auto" }}
              src={this.state.item.url}
              alt={"img"}
            />
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer" />
        </Dialog>
        <Alert
          title={this.state.invalidMsg}
          type={this.state.alertType}
          closable={false}
          style={{ display: this.state.alertShow, lineHeight: 1, padding: '2px', marginTop:'10px' }}
        />
        <div style={{ padding: 14 }}>
          <p style={{ display: "inline" }}>{this.state.item.class}</p>
          {/*
          <p style={{ display: "inline", marginLeft: "20px" }}>
            age: {this.state.item.age}
          </p>
                          */}
          <div style={{ marginTop: "10px" }}>
            <Button
              style={{ float: "left", display: this.state.validShow }}
              size="small"
              type="success"
              plain={this.state.value !== 0}
              onClick={e => {
                this.update(1);
              }}
            >
              valid
                        </Button>

            <Button
              style={{ float: "right", display: this.state.invalidShow }}
              size="small"
              type="danger"
              plain={this.state.value !== 0}
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
        <div className="valid">
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

    //Those have been marked as invalid
    return (
      <div className="invalid">
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
}

export { SingleCard };
