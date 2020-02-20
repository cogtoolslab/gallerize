import React from "react";
import { Button, Layout } from "element-react";

class Instruction extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const divStyle = {
            margin: '10px 66px',
            fontSize: '1.2em',
            wordWrap: 'break-word'
        };

        return (
            <div style={divStyle}>
                {this.props.content}
            </div>
        );
    }
}

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            prevDisable: true,
            nextDisable: false,
            nextText: 'Next Page',
            nextPage: 'Next Page',
            lastPage: this.props.pages[this.props.pages.length-1]
        };
        this.handleChildClick = this.handleChildClick.bind(this);
    }

    componentDidUpdate(){
        // if(this.lastPage.)
    }

    nextPage() {
        if (this.state.currentPage < this.props.pages.length - 1) {
            this.setState({ currentPage: this.state.currentPage + 1 })
            if (this.state.currentPage === 0){
                this.setState({prevDisable: false});
            }else if (this.state.currentPage === this.props.pages.length - 2){
                this.setState({nextText: this.props.finalText})
                this.setState({nextDisable: true})
            }
        }
    }

    prevPage() {
        if (this.state.currentPage > 0) {
            if (this.state.currentPage === 1){
                this.setState({prevDisable: true});
            }else if (this.state.currentPage === this.props.pages.length - 1){
                this.setState({nextText: this.state.nextPage})
                this.setState({nextDisable: false})
            }
            this.setState({ currentPage: this.state.currentPage - 1 })
        }
    }

    handleChildClick = function(){
        this.setState({
            nextDisable: false
        })
    }

    render() {
        return (
            <div>
                <Layout.Row type="flex" justify="center" style={{padding: '10px'}}>
                    <Button.Group>
                        <Button disabled={this.state.prevDisable} icon="arrow-left" onClick={() => this.prevPage()}>Previous Page</Button>
                        <Button disabled={this.state.nextDisable} onClick={() => this.nextPage()}>{this.state.nextText}<i className="el-icon-arrow-right el-icon-right"></i></Button>
                    </Button.Group>
                </Layout.Row>
                {this.props.pages[this.state.currentPage]}
            </div>
        );
    }
}

export { Instruction, Timeline}