import React from "react";
import { slide as Menu } from 'react-burger-menu';
import "./Controls.css";

// TODO: Clean this up
function Controls(props) {
  return (
    <Menu isOpen width={375}>
      <label className="centered large-print">
          Expression
      </label>
      <label className="centered large-print">
          Z =
          <input type="text" id="expression" style={{marginLeft: "0.25em"}} value={props.expression} onChange={props.handleExpressionChange} />
      </label>
      <label className="centered large-print underlined" style={{padding: "1em 0"}}>
          <button onClick={props.handleUpdate}>Update</button>
      </label>

      <label className="centered large-print">
          Axis Ranges
      </label>
      <label className="centered">
        X Range: [
        <input type="text" id="lowerXRange" value={props.ranges[0][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ,
        <input type="text" id="upperXRange" value={props.ranges[0][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ]
      </label>
      <label className="centered">
        Y Range: [
        <input type="text" id="lowerYRange" value={props.ranges[1][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ,
        <input type="text" id="upperYRange" value={props.ranges[1][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ]
      </label>
      <label className="centered underlined" style={{padding: "1em 0"}}>
        Z Range: [
        <input type="text" id="lowerZRange" value={props.ranges[2][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ,
        <input type="text" id="upperZRange" value={props.ranges[2][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ]
      </label>

      <label className="centered large-print">
          Detail
      </label>
      <label className="centered underlined" style={{padding: "1em 0"}}>
        <input type="range" id="detail" name="detail" min="10" max="100" value={props.detail} onChange={props.handleDetailChange} />
      </label>

      <label className="centered large-print">
          Render Features
      </label>
      <label className="centered">
        Points:
        <input id="pointsToggle" type="checkbox" defaultChecked onChange={props.handleRenderingFeatureChange} />
      </label>
      <label className="centered">
        Squares:
        <input id="squaresToggle" type="checkbox" defaultChecked onChange={props.handleRenderingFeatureChange} />
      </label>
      <label className="centered underlined" style={{padding: "1em 0"}}>
        Planes:
        <input id="planesToggle" type="checkbox" defaultChecked onChange={props.handleRenderingFeatureChange} />
      </label>
    </Menu>
  );
}

export default Controls;
