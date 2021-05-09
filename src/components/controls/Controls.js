import React from "react";
import "./Controls.css";

function Controls(props) {
  return (
    <div className="controls">
      <div className="expression">
        <input type="range" min="1" max="10" value={props.detail} onChange={props.handleDetailChange} />
        <label>Z:</label>
        <input type="text" id="expression" name="expression" value={props.expression} onChange={props.handleExpressionChange} />
        <button onClick={props.handleUpdate}>Update</button>
      </div>
    </div>
  );
}

export default Controls;
