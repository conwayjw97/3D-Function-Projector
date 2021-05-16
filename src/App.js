import { useState, useEffect } from 'react';
import Canvas from './components/canvas/Canvas.js';
import Controls from './components/controls/Controls.js';

import { evaluate } from 'mathjs'

function App() {
  const [updateCount, setUpdateCount] = useState(0);
  const [detail, setDetail] = useState(50);
  const [expression, setExpression] = useState("x^2 + y^2");
  const [ranges, setRanges] = useState([["-100", "100"], ["-100", "100"], ["0", "20000"]]);
  const [axes, setAxes] = useState(true);
  const [renderingMethod, setRenderingMethod] = useState("faces");

  useEffect(() => {
    document.title = "Function Projector"
  }, []);

  const handleDetailChange = (event) => {
    setDetail(event.target.value);
  }

  const handleExpressionChange = (event) => {
    setExpression(event.target.value);
  }

  const handleRangeChange = (event) => {
    const newRanges = [...ranges];
    switch(event.target.id){
      case "lowerXRange":
        newRanges[0][0] = event.target.value;
        break;
      case "upperXRange":
        newRanges[0][1] = event.target.value;
        break;
      case "lowerYRange":
        newRanges[1][0] = event.target.value;
        break;
      case "upperYRange":
        newRanges[1][1] = event.target.value;
        break;
      case "lowerZRange":
        newRanges[2][0] = event.target.value;
        break;
      case "upperZRange":
        newRanges[2][1] = event.target.value;
        break;
      default:
        break;
    }
    setRanges(newRanges);
  }

  const handleAxesChange = (event) => {
    setAxes(event.target.checked);
  }

  const handleRenderingMethodChange = (event) => {
    setRenderingMethod(event.target.value);
  }

  const handleUpdate = () => {
    try{
      const testExp = expression.replaceAll("x", "("+1+")").replaceAll("y", "("+1+")");
      const testEval = evaluate(testExp);
    } catch(e) {
      alert("Error when solving for Z: " + e);
    }

    if(isNaN(parseInt(ranges[0][0]))){
      alert("Lower X Range invalid");
      return;
    }
    if(isNaN(parseInt(ranges[0][1]))){
      alert("Upper X Range invalid");
      return;
    }
    if(isNaN(parseInt(ranges[1][0]))){
      alert("Lower Y Range invalid");
      return;
    }
    if(isNaN(parseInt(ranges[1][1]))){
      alert("Upper Y Range invalid");
      return;
    }
    if(isNaN(parseInt(ranges[2][0]))){
      alert("Lower Z Range invalid");
      return;
    }
    if(isNaN(parseInt(ranges[2][1]))){
      alert("Upper Z Range invalid");
      return;
    }

    if(parseInt(ranges[0][0]) > parseInt(ranges[0][1])){
      alert("Lower X Range must be less than Upper X Range.");
      return;
    }
    if(parseInt(ranges[1][0]) > parseInt(ranges[1][1])){
      alert("Lower Y Range must be less than Upper Y Range.");
      return;
    }
    if(parseInt(ranges[2][0]) > parseInt(ranges[2][1])){
      alert("Lower Z Range must be less than Upper Z Range.");
      return;
    }

    setUpdateCount(updateCount + 1);
  }

  // TODO: Make a reducer for all these states
  return (
    <div className="App">
      <Canvas
        detail={detail}
        expression={expression}
        ranges={ranges}
        axes={axes}
        renderingMethod={renderingMethod}
        updateCount={updateCount}
      />
      <Controls
        detail={detail}
        handleDetailChange={handleDetailChange}
        expression={expression}
        handleExpressionChange={handleExpressionChange}
        ranges={ranges}
        handleRangeChange={handleRangeChange}
        handleAxesChange={handleAxesChange}
        renderingMethod={renderingMethod}
        handleRenderingMethodChange={handleRenderingMethodChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;
