import { useState } from 'react';
import Canvas from './components/canvas/Canvas.js';
import Controls from './components/controls/Controls.js';
import './App.css';

function App() {
  const [updateCount, setUpdateCount] = useState(0);
  const [detail, setDetail] = useState(50);
  const [expression, setExpression] = useState("x^2+y^2");
  const [ranges, setRanges] = useState([["-100", "100"], ["-100", "100"], ["0", "20000"]]);
  const [renderingMethod, setRenderingMethod] = useState({"points":false, "squares":false, "planes":true});

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

  const handleRenderingMethodChange = (event) => {
    switch(event.target.value){
      case "vertices":
        setRenderingMethod({"points":true, "squares":false, "planes":false});
        break;
      case "edges":
        setRenderingMethod({"points":false, "squares":true, "planes":false});
        break;
      case "faces":
        setRenderingMethod({"points":false, "squares":false, "planes":true});
        break;
      default:
        break;
    }
  }

  const handleUpdate = () => {
    setUpdateCount(updateCount + 1);
  }

  // TODO: Make a reducer for all these states
  return (
    <div className="App">
      <Canvas
        detail={detail}
        expression={expression}
        ranges={ranges}
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
        handleRenderingMethodChange={handleRenderingMethodChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;
