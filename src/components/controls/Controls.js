import React from "react";
import "./Controls.css";

// TODO: Clean this up
function Controls(props) {
  return (
    <div className="controls">
      <div className="expression">
        <label>Detail: </label>
        <input type="range" id="detail" name="detail" min="10" max="200" value={props.detail} onChange={props.handleDetailChange} />

        <label> Z = </label>
        <input type="text" id="expression" name="expression" value={props.expression} onChange={props.handleExpressionChange} />
        <button onClick={props.handleUpdate}>Update</button>

        <label> X Range: [</label>
        <input type="text" id="lowerXRange" value={props.ranges[0][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        <label>,</label>
        <input type="text" id="upperXRange" value={props.ranges[0][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        <label>]</label>

        <label> Y Range: [</label>
        <input type="text" id="lowerYRange" value={props.ranges[1][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        <label>,</label>
        <input type="text" id="upperYRange" value={props.ranges[1][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        <label>]</label>

        <label> Z Range: [</label>
        <input type="text" id="lowerZRange" value={props.ranges[2][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        <label>,</label>
        <input type="text" id="upperZRange" value={props.ranges[2][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        <label>]</label>
      </div>
    </div>
  );
}

export default Controls;
