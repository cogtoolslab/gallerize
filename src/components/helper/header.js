import React from "react";

class Header extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-light" >
                <div style={{ float: "left", padding: "10px 50px" }}>
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>
                        {this.props.title}
                    </div>
                </div>
            </nav>
        );
    }
}

export { Header };