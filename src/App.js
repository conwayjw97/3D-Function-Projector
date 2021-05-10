import { useState, useEffect } from 'react';
import Canvas from './components/canvas/Canvas.js';
import Controls from './components/controls/Controls.js';
import './App.css';

function App() {
  const [updateCount, setUpdateCount] = useState(0);
  const [detail, setDetail] = useState(100);
  const [expression, setExpression] = useState("1-abs(x+y)-abs(y-x)");

  const handleDetailChange = (event) => {
    setDetail(event.target.value);
  }

  const handleExpressionChange = (event) => {
    setExpression(event.target.value);
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
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;
