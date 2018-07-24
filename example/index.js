import './arrayFromPoly'
import React from "react";
import ReactDOM from "react-dom";
import ReactToPrint from "../src/";

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={"relativeCSS"}>
        <div className={"flash"}></div>
        <img src="example/test_image.png" border="0" />
        <table className="testclass">
          <thead>
            <tr>
              <th style={{ color: "#FF0000"}}>Column One</th>
              <th className="testth">Column Two</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
            </tr>
            <tr>
              <td>3</td>
              <td>4</td>
            </tr>
            <tr>
              <td>5</td>
              <td><img src="http://placeholder.qiniudn.com/272x92" width="50" /></td>
            </tr>
          </tbody>
        </table>
        <div className="PageBreak"/>
        <table className="testclass">
          <thead>
          <tr>
            <th style={{ color: "#FF0000"}}>Column One</th>
            <th className="testth">Column Two</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
          </tr>
          <tr>
            <td>3</td>
            <td>4</td>
          </tr>
          <tr>
            <td>5</td>
            <td><img src="http://placeholder.qiniudn.com/272x92" width="50" /></td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class Example extends React.Component {

  render() {
    return (
      <div >
         <ReactToPrint
          trigger={() => (
            <a href="#">Print this out!</a>
          )}
          printButton={
            <div className="printButton">打印</div>
          }
          cancelButton={
            <div className="cancelButton">取消</div>
          }
          showPreview={true}
          content={() => this.componentRef}
          onBeforePrint={() => {
            console.log("before print!");
          }}
          onAfterPrint={() => {
            console.log("after print!");
          }}
          debug={false}
         />
        <ComponentToPrint ref={(el) => this.componentRef = el} />
      </div>
    );

  }
}

export default Example;

ReactDOM.render(<Example />, document.getElementById("app-root"));
