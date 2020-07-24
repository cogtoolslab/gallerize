import React from "react";
import { InvalidCard } from "../SingleCard";
import { Button, Layout, Notification} from "element-react";
import axios from "axios";

/*
A Trial contains props.num images from a single category and a check image
*/
export class Trial extends React.Component {
    constructor(props) {
        super(props);
        this.addInvalid = this.addInvalid.bind(this);
        this.removeInvalid = this.removeInvalid.bind(this);

        this.findCheck = this.findCheck.bind(this);
        this.cancelCheck = this.cancelCheck.bind(this);

        let checkFiles = Array.from({length: 11}, (x,i) => i.toString() + '.png');
        checkFiles.sort(() => Math.random() - 0.5);

        this.state = {
            showPage: props.showPage,
            buttonText: 'Next Category',
            classIdx: -1,
            toRet: [],
            nextDisable: false,
            invalidDrawings: [],
            curClass: '',
            checkList: checkFiles,
        }
    }

    findCheck() {
        this.setState({
            nextDisable: false
        })
    }

    cancelCheck() {
        this.setState({
            nextDisable: true
        })
    }

    addInvalid(drawing) {
        this.state.invalidDrawings.push(drawing);
        console.log(this.state.invalidDrawings)
    }

    removeInvalid(drawing) {
        console.log(drawing)
        let index = this.state.invalidDrawings.findIndex(x => { return x.session_id === drawing.session_id });
        console.log(index)
        if (index !== -1) {
            this.state.invalidDrawings.splice(index, 1);
        }
        console.log(this.state.invalidDrawings)
    }

    nextPage() {
        if (this.state.nextDisable){
            Notification({
                title: 'Warning',
                message: 'There are missing invalid drawings. Please check again!',
                type: 'warning',
              });
            return;
        }

        // for the last trial, change the button text to "Submit the HIT"
        if (this.state.classIdx === this.props.allClasses.length - 1) {

            this.submit_data = []    
            this.submit_data = {
                completed: true,
                workerId: window.turk.workerId,    
            }
            window.turk.submit(this.submit_data, true)
            return;
        }
        if (this.state.classIdx === this.props.allClasses.length - 2) {
            this.setState({
                buttonText: 'Submit the HIT'
            })
        }

        //submit data on the current category
        if (this.state.invalidDrawings.length > 0) {
            axios.post("https://stanford-cogsci.org:8883/db/post-response", this.state.invalidDrawings)
                .then(() => {
                    this.setState({
                        invalidDrawings: []
                    })
                })
                .catch(error => {
                    console.log(error);
                });
        }

        // change category and fetch new data
        let nextIdx = this.state.classIdx + 1;
        let curClass = this.props.allClasses[nextIdx];
        let filter = {
            class: curClass,
            num: this.props.num
        };
        this.fetch(filter);
        this.setState({
            classIdx: nextIdx,
            nextDisable: true,
        });
    }

    showPage() {
        this.setState({ showPage: true });
        this.nextPage();
    }

    enableNext() {
        this.setState({ nextDisable: false });
    }

    fetch(filter) {
        axios.post("https://stanford-cogsci.org:8883/db/get-single-class", filter)
            .then(response => {
                if (response.data.length > 0) {
                    let toRet = response.data.map(curDraw => {
                        curDraw['valid'] = 0
                        return <InvalidCard
                            input={curDraw}
                            key={curDraw._id}
                            popUp={false}
                            validShow={false}
                            handleInvalid={this.addInvalid}
                            cancelInvalid={this.removeInvalid}
                        />;
                    });

                    let fn = this.state.checkList[this.state.classIdx];
                    let checkData = { url: require('./check/' + fn), valid: 0, _id: this.state.classIdx, fname: fn, class: filter.class }
                    let checkCard = <InvalidCard
                            input={checkData}
                            key={checkData._id}
                            local={true}
                            hasCancel={true}
                            handleCheck={this.findCheck}
                            cancelCheck={this.cancelCheck} />;

                    toRet.push(checkCard);
                    toRet.sort(() => Math.random() - 0.5);

                    this.setState({
                        toRet: toRet,
                        curClass: filter.class
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        let refImg = "";
        if (['this square', 'square'].includes(this.state.curClass)) {
            refImg = require('./reference/square_ref.png');
        } else if (this.state.curClass === 'shape') {
            refImg = require('./reference/shape_ref.png');
        } else {
            refImg = "";
        }

        return (
            <div style={{ display: this.state.showPage ? "block" : "none" }}>
                <div>
                    <Layout.Row type="flex" justify="center" style={{ padding: '10px' }}>
                        <Button.Group>
                            <Button onClick={() => this.nextPage()}>{this.state.buttonText}<i className="el-icon-arrow-right el-icon-right"></i></Button>
                        </Button.Group>
                        <div style={{ paddingLeft: '20px' }}> {this.state.classIdx + 1}/{this.props.allClasses.length} </div>
                    </Layout.Row>

                    <Layout.Row type="flex" justify="center" style={{ padding: '10px', textAlign: "center" }}>
                        <Layout.Col span="12"><h3 style={{ textAlign: "center", top: "30px" }}> <p>Please identify all invalid drawings of <b>{this.props.allClasses[this.state.classIdx]}</b></p> </h3></Layout.Col>
                        <Layout.Col span="1"><img src={refImg} style={{ width: '60px' }} /></Layout.Col>
                    </Layout.Row>
                    {this.state.toRet}
                </div>

            </div>
        )
    }

    // allDone() {
    //     refImg = "";
       

    //     return (
    //         <div style={{ display: this.state.showPage ? "block" : "none" }}>
    //             <div>
    //                 <Layout.Row type="flex" justify="center" style={{ padding: '10px' }}>
    //                     <Button.Group>
    //                         <Button onClick={() => this.nextPage()}>{this.state.buttonText}<i className="el-icon-arrow-right el-icon-right"></i></Button>
    //                     </Button.Group>
    //                     <div style={{ paddingLeft: '20px' }}> {this.state.classIdx + 1}/{this.props.allClasses.length} </div>
    //                 </Layout.Row>

    //                 <Layout.Row type="flex" justify="center" style={{ padding: '10px', textAlign: "center" }}>
    //                     <Layout.Col span="12"><h3 style={{ textAlign: "center", top: "30px" }}> <p>THANK YOU</b></p> </h3></Layout.Col>
    //                     <Layout.Col span="1"><img src={refImg} style={{ width: '60px' }} /></Layout.Col>
    //                 </Layout.Row>
    //                 {this.state.toRet}
    //             </div>

    //         </div>
    //     )
    // }
}

