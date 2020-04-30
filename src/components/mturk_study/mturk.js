import React from "react";
import { Layout, Tag, Alert } from "element-react";
import { CardLayout } from "../CardLayout";
import { InvalidCard } from "../SingleCard";
import { Header } from "../helper/header"
import "element-theme-default";
import axios from "axios";
import { Instruction, Timeline } from "./instruction";
import { Trial } from "./Trial";

class MTurk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changeFinal: false,
            showIntro: false,
            showExp: false,
            allClasses: [],
            currentClass: '',
            trials: []
        };
        this.enableNextButton = this.enableNextButton.bind(this);
        this.redirect = this.redirect.bind(this);

        this.intro = React.createRef();
        this.exp = React.createRef();
    }

    componentWillMount(){
        this.fetchAllClasses();
    }

    fetchAllClasses() {
        // fetch all class names
        axios.get('https://138.68.25.178:8883/db/get-classes')
            .then(response => {
                let classes = response.data;
                classes.sort(() => Math.random() - 0.5); //shuffle the order
                this.setState({ allClasses: classes });
                console.log(this.state.allClasses)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    enableNextButton() {
        this.intro.current.enableNext();
    }

    redirect() {
        this.exp.current.showPage();
    }

    render() {

        let invalidTag = {
            padding: '0 10px',
            height: '40px',
            lineHeight: '40px',
            margin: '10px',
            fontSize: '1em'
        }

        let consent = <p>In this HIT, you will view some drawings on common categories, such as hats and lamps. Your task is to identify invalid drawings.
            <br />We expect this hit to take approximately 10-15 minutes to complete, including the time it takes to read instructions.
            <br />If you encounter a problem or error, send us an email (bria@stanford.edu) and we will make sure you're compensated for your time! Please pay attention and do your best! Thank you!
            <br />Note: We recommend using Chrome. We have not tested this HIT in other browsers.
            </p>

        let instruction = <div>
            <p> Here’s how the game will work: </p>
            <p> On each trial, you will see 50 drawings of a specific category. Your goal is to label all invalid drawings. Invalid drawings include random scribbles, word descriptions, drawings of irrelevant categories and no drawings</p>
            <p> Example invalid drawings of category <b>CATS</b>: </p>
            <Layout.Row>
                <Layout.Col span="8" style={{ textAlign: 'center' }}>
                    <Tag type="gray" style={invalidTag}>Random Scribbles</Tag>
                    <img className="invalid_img" src={require('./img/scribble.png')} />
                </Layout.Col>
                <Layout.Col span="8" style={{ textAlign: 'center' }}>
                    <Tag type="gray" style={invalidTag}>Word Descriptions</Tag>
                    <img className="invalid_img" src={require('./img/letter.png')} />
                </Layout.Col>
                <Layout.Col span="8" style={{ textAlign: 'center' }}>
                    <Tag type="gray" style={invalidTag}>Drawings of Irrelevant Categories</Tag>
                    <img className="invalid_img" src={require('./img/lamp.png')} />
                </Layout.Col>
            </Layout.Row>
            <p>When you finish, please click the submit button to finish the game. If a popup appears asking you if you are sure you want to leave the page, you must click YES to confirm that you want to leave the page. This will cause the HIT to submit. </p>
            <p>Let's try a practice trial!</p>
        </div>;

        let consentPage = <Instruction>{consent}</Instruction>
        let instructionPage = <Instruction>{instruction}</Instruction>
        let samplePage = <Practice onChildUpdate={this.enableNextButton} />
        let pages = [consentPage, instructionPage, samplePage];

        return (
            <div>
                <Header title="Drawing Validation Study" />
                <Timeline ref={this.intro} pages={pages} showPage={true} finalText="Start the Study" redirect={this.redirect} />
                <Trial ref={this.exp} allClasses={this.state.allClasses} showPage={false} finalText="Finish" num={23} />
            </div>
        );
    }
}

class Practice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invalid_count: 0,
            toRet: [],
            invalidMsg: "",
            alertType: "warning",
            message: <p>Please identify all invalid drawings of <b>CAMELS</b></p>,
        }
        this.handleChildClick = this.handleChildClick.bind(this);
    }

    componentWillMount() {
        let fnames = Array.from({length:19}, (x,i)=> i.toString() + '.png');
        let invalidF = Array.from({length:5}, (x,i) => "invalid" + i.toString() + ".png");
        fnames = fnames.concat(invalidF);
        fnames.sort(() => Math.random() - 0.5);
        let data = fnames.map((f, i) => {
            return { url: require('./example/' + f), valid: 0, _id: i, fname: f }
        });

        let toRet = data.map(curDraw => {
            let invalidMsg = '';
            let alertType = 'error';

            switch (curDraw.fname) {
                case 'invalid0.png':
                    invalidMsg = "Yes! Random scribbles are invalid";
                    break;
                case 'invalid1.png':
                    invalidMsg = "Yes! Word descriptions are invalid";
                    break;
                case 'invalid2.png':
                    invalidMsg = "Yes! Drawings of Irrelevant Categories are invalid";
                    break;
                case 'invalid3.png':
                    invalidMsg = "Yes! Drawings of irrelevant categories are invalid";
                    break;
                case 'invalid4.png':
                    invalidMsg = "Yes! Empty images are invalid";
                    break;
                default:
                    invalidMsg = "This is a valid drawing!";
                    alertType = 'warning';
            }

            return <InvalidCard
                input={curDraw}
                key={curDraw._id}
                local={true}
                invalidMsg={invalidMsg}
                hasAlert={true}
                alertType={alertType}
                handleAlertCard={this.handleChildClick} />;
        });

        this.setState({
            toRet: toRet
        });
    }

    handleChildClick = function () {
        this.setState({
            invalid_count: this.state.invalid_count + 1
        })
    }

    componentDidUpdate() {
        if (this.state.invalid_count === 5) {
            this.setState({
                message: "You have found all invalid drawings in this trial! Let's start the study!",
                invalid_count: -1
            })
            this.props.onChildUpdate();
        }
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: "center", top: "30px" }}> {this.state.message} </h3>
                {this.state.toRet}
            </div>)
    }
}

export { MTurk };
