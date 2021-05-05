import React from "react";
import "./Controls.css";

function Controls(props) {
  return (
    <div className="controls">
      <div className="expression">
        <label>Z:</label>
        <input type="text" id="expression" name="expression" value="1-abs(x+y)-abs(y-x)" />
        <button>Update</button>
      </div>
    </div>
  );
}

export default Controls;
