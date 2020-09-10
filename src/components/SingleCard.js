import React from "react";
import { Button, Card, Dialog, Alert } from "element-react";
import axios from "axios";

/* 
The DrawCard component shows a drawing in a card.
When the user click on the card, detailed information about the drawing is shown in an infor dialog
input: action button and related data modification functions 
*/


class DrawCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.input,
      dialogVisible: false,
    };
  }

  popUp() {
    if (this.props.popUp) {
      this.setState({ dialogVisible: true });
    }
  }

  render() {
    return (
      <Card
        className="single"
        key={this.state.item.filename}
        bodyStyle={{ padding: 5, width: '180px', height: '200px' }}
      >
        <PicLink
          popUp={this.popUp.bind(this)}
          valid={this.props.value}
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
        {this.props.children}
      </Card>
    );
  }
}

/*
The InvalidCard component allows users to label a drawing as invalid. After clicking on the invalid button, the card 
will either show a cancel button to change the validity of the current drawing or show an alert message.

- props.local: whether the card takes local images

Local Card 1: Practice Card
- props.hasAlert: whether the card shows an alert message after clicking on the invalid button
- props.handleAlertCard: callback of the parent to deal with actions after the alert shows up

Local Card 2: Check Card
- props.hasCancel: whether the card shows a cancel button after clicking on the invalid button
- props.handleCheck: the parent component's actions after the check card is labeled as invalid
- props.cancelCheck: the parent component's actions after the invalid state of the card is reverted

Non-Local Card/Real Trial Card
- props.handleInvalid
- props.cancelInvalid
*/
class InvalidCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.input,
      value: this.props.input.valid,
      invalidShow: true,
      cancelShow: false,
      alertShow: false,
    };
  }

  getInstanceInfo() {
    let data = {
      session_id: this.props.input.session_id,
      filename: this.props.input.filename,
      class: this.props.input.class,
      age: this.props.input.age,
      date: new Date(),
      worker_id: window.turk.PROLIFIC_PID
    }
    return data
  }

  markInvalid() {
    this.setState({
      value: -1,
      invalidShow: false,
      cancelShow: true
    });
    this.props.handleInvalid(this.getInstanceInfo());
  }

  cancelInvalid() {
    this.setState({
      invalidShow: true,
      cancelShow: false,
      value: 0
    })

    if (this.props.local) {
      this.props.cancelCheck();
    }else{
      this.props.cancelInvalid(this.getInstanceInfo());
    }
  }

  update() {
    if (!this.props.local) {
      this.markInvalid()

    } else {

      if (this.props.hasAlert) {
        if (this.props.alertType == "error"){
          this.props.handleAlertCard();
          this.setState({
            value: -1
          })
        }
        
        this.setState({
          alertShow: true,
          invalidShow: false
        })

      } 
      
      if (this.props.hasCancel){
        this.props.handleCheck();
        this.setState({
          cancelShow: true,
          invalidShow: false,
          value: -1
        });
      }
    }
  }

  render() {
    return (
      <DrawCard input={this.props.input} popUp={false} value={this.state.value}>
        <Alert
          title={this.props.invalidMsg || ""}
          type={this.props.alertType}
          closable={false}
          style={{ display: this.state.alertShow?"block":"none", lineHeight: 1, padding: '2px', marginTop: '10px' }}
        />
        <div style={{ padding: 14 }}>
          <p style={{ display: "inline" }}>{this.state.item.class}</p>
          <div style={{ marginTop: "10px" }}>
            <Button
              style={{ float: "left", display: this.state.cancelShow ? "block" : "none" }}
              size="small"
              plain={this.state.value !== 0}
              onClick={e => {
                this.cancelInvalid();
              }}
            >
              Cancel
                        </Button>

            <Button
              style={{ float: "right", display: this.state.invalidShow ? "block" : "none" }}
              size="small"
              type="danger"
              plain={this.state.value !== 0}
              onClick={e => {
                this.update();
              }}
            >
              Invalid
                        </Button>
          </div>
          <br />
        </div>
      </DrawCard>
    );
  }
}

class SingleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.input,
      value: this.props.input.valid,
    };
  }

  update(newValid) {
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
  }

  render() {
    return (
      <DrawCard input={this.props.input} popUp={false} value={this.state.value}>
        <div style={{ padding: 14 }}>
          <p style={{ display: "inline" }}>{this.state.item.class}</p>
          {/*
          <p style={{ display: "inline", marginLeft: "20px" }}>
            age: {this.state.item.age}
          </p>
                          */}
          <div style={{ marginTop: "10px" }}>
            <Button
              style={{ float: "left"}}
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
              style={{ float: "right"}}
              size="small"
              type="danger"
              plain={this.state.value !== 0}
              onClick={e => {
                this.update(-1);
              }}
            >
              Invalid
                        </Button>
          </div>
          <br />
        </div>
      </DrawCard>
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

export { SingleCard, InvalidCard};
