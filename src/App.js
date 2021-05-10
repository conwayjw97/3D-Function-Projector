import { useState, useEffect } from 'react';
import Canvas from './components/canvas/Canvas.js';
import Controls from './components/controls/Controls.js';
import './App.css';

function App() {
  const [updateCount, setUpdateCount] = useState(0);
  const [detail, setDetail] = useState(50);
  const [expression, setExpression] = useState("1-abs(x+y)-abs(y-x)");
  const [xRange, setXRange] = useState([-100, 100]);
  const [yRange, setYRange] = useState([-100, 100]);

  const handleDetailChange = (event) => {
    setDetail(event.target.value);
  }

  const handleExpressionChange = (event) => {
    setExpression(event.target.value);
  }

  const handleXrangeChange = (event) => {
    const range = event.target.value;
    console.log(range);
    if(!isNaN(parseInt(range[0])) && !isNaN(parseInt(range[1])) && parseInt(range[0])<parseInt(range[1])){
      console.log([range[0], range[1]]);
      console.log([parseInt(range[0]), parseInt(range[1])]);
      setXRange([parseInt(range[0]), parseInt(range[1])]);
    }
  }

  const handleYrangeChange = (event) => {
    const range = event.target.value.split(",");
    if(range.length=2 && !isNaN(range[0]) && !isNaN(range[1]) && range[0]<range[1]){
      setYRange([parseInt(range[0]), parseInt(range[1])]);
    }
  }

  const handleUpdate = () => {
    setUpdateCount(updateCount + 1);
  }

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
        xRange={xRange}
        handleXrangeChange={handleXrangeChange}
        yRange={yRange}
        handleYrangeChange={handleYrangeChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;
