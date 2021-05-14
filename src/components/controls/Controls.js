import React, { useState, useRef } from "react";
import { slide as Menu } from 'react-burger-menu';
import "./Controls.css";

// TODO: Clean this up
function Controls(props) {
  const [detailSliderDisabled, setDetailSliderDisabled] = useState(true);

  const handleRenderingMethodChange = (event) => {
    props.handleRenderingMethodChange(event);
    if(event.target.value === "vertices"){
      setDetailSliderDisabled(false);
    } else {
      setDetailSliderDisabled(true);
    }
  }

  return (
    <Menu isOpen disableAutoFocus width={375}>
      <label className="centered large-print">
          Projection
      </label>
      <label className="centered">
          Z =
          <input type="text" id="expression" style={{marginLeft: "0.25em"}} value={props.expression} onChange={props.handleExpressionChange} />
      </label>
      <label className="centered">
        X Range:[
        <input type="text" id="lowerXRange" value={props.ranges[0][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ,
        <input type="text" id="upperXRange" value={props.ranges[0][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ]
      </label>
      <label className="centered">
        Y Range:[
        <input type="text" id="lowerYRange" value={props.ranges[1][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ,
        <input type="text" id="upperYRange" value={props.ranges[1][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ]
      </label>
      <label className="centered">
        Z Range:[
        <input type="text" id="lowerZRange" value={props.ranges[2][0]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ,
        <input type="text" id="upperZRange" value={props.ranges[2][1]} onChange={props.handleRangeChange} style={{width: "2.5em"}} />
        ]
      </label>
      <label className="centered large-print underlined" style={{padding: "1em 0"}}>
          <button onClick={props.handleUpdate}>Update</button>
      </label>

      <label className="centered large-print">
          Graphics
      </label>
      <label className="centered">
        Max Vertices:
        <input type="range" disabled={detailSliderDisabled} id="detail" name="detail" min="10" max="100" value={props.detail} onChange={props.handleDetailChange} />
        {props.detail * props.detail}
      </label>
      <label className="centered">
        Max Vertices slider can only be used with the Vertices rendering method.
      </label>
      <label className="centered underlined" style={{padding: "1em 0"}}>
          Render Method:
          <select id="render-method-dropdown" value={props.renderingMethod} style={{marginLeft: "0.25em"}} onChange={handleRenderingMethodChange}>
            <option value="vertices">Vertices</option>
            <option value="edges">Edges</option>
            <option value="faces">Faces</option>
          </select>
      </label>

      <label className="centered large-print">
          Camera
      </label>
      <label className="centered underlined" style={{padding: "1em 0"}}>
        Left click and hold to rotate the camera around the projection.
        Right click and hold to move the camera sideways.
        Scroll to move the camera forwards or backwards.
      </label>
    </Menu>
  );
}

export default Controls;
