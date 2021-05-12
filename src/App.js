import { useState, useEffect } from 'react';
import Canvas from './components/canvas/Canvas.js';
import Controls from './components/controls/Controls.js';
import './App.css';

function App() {
  const [updateCount, setUpdateCount] = useState(0);
  const [detail, setDetail] = useState(50);
  const [expression, setExpression] = useState("1-abs(x+y)-abs(y-x)");
  const [ranges, setRanges] = useState([[-100, 100], [-100, 100], [-100, 100]]);

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
        newRanges[0][0] = parseInt(event.target.value);
        break;
      case "upperXRange":
        newRanges[0][1] = parseInt(event.target.value);
        break;
      case "lowerYRange":
        newRanges[1][0] = parseInt(event.target.value);
        break;
      case "upperYRange":
        newRanges[1][1] = parseInt(event.target.value);
        break;
      case "lowerZRange":
        newRanges[2][0] = parseInt(event.target.value);
        break;
      case "upperZRange":
        newRanges[2][1] = parseInt(event.target.value);
        break;
    }
    setRanges(newRanges);
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
        updateCount={updateCount}
      />
      <Controls
        detail={detail}
        handleDetailChange={handleDetailChange}
        expression={expression}
        handleExpressionChange={handleExpressionChange}
        ranges={ranges}
        handleRangeChange={handleRangeChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;
