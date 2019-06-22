import React from 'react';
import './Layout.css';
import Draw from './Draw'

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  renderDraw(url) {
    return <Draw value={url} />;
  }

  readCSV(filePath){
    var reader = new FileReader();
    reader.readAsText(filePath);
    //reader.readAsBinaryString(fileInput.files[0]);
    reader.onload = loadHandler;
    reader.error  = errorHandler;
  }
  errorHandler(e){
    if(e.target.error.name == "NotReadableError"){
      alert('Cannot read File');
    }
  }

  loadHandler(event){
    let csv = event.target.result;
    processData(csv);
  }

  processData(csv){
    let allTextLines = csv.split('\n');
    for (let i  = 0; i < allTextLines.length; i ++){
      let row = allTextLines[i].split(';');
      let col = [];
      for (let j = 0; j < row.length; j++){
        col.push(row[j]);
      }

      attendeesArray.push(col);
    }
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export default Layout;
