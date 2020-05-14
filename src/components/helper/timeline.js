import React from "react"

class Timeline extends React.Component{
    //redirect to a different page
    constructor(props){
        super(props);
        this.state = {
            current_page: null,
            pages: null,
        };
    }

    nextPage(){
        // current page
        current_page = current_page + 1;
    }

    prevPage(){
        current_page = current_page - 1;
    }
}

export{ Timeline }