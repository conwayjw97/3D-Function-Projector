import React from "react";
import "./Controls.css";

function Controls(props) {
  return (
    <div className="controls">
      <div className="expression">
        <label>Detail: </label>
        <input type="range" id="detail" name="detail" min="10" max="200" value={props.detail} onChange={props.handleDetailChange} />
        <label> Z = </label>
        <input type="text" id="expression" name="expression" value={props.expression} onChange={props.handleExpressionChange} />
        <button onClick={props.handleUpdate}>Update</button>
        <label> X Range: </label>
        <input type="text" id="xRange" name="xRange" value={props.xRange} onChange={props.handleXrangeChange} style={{width: "5em"}} />
        <label>Y Range: </label>
        <input type="text" id="yRange" name="yRange" value={props.yRange} onChange={props.handleYrangeChange} style={{width: "5em"}} />
      </div>
    </div>
  );
}

export default Controls;
