import { useState, useEffect } from 'react';
import Canvas from './components/canvas/Canvas.js';
import Controls from './components/controls/Controls.js';
import './App.css';

function App() {
  const [updateCount, setUpdateCount] = useState(0);
  const [expression, setExpression] = useState("1-abs(x+y)-abs(y-x)");

  const handleExpressionChange = (event) => {
    const input = event.target.value;
    setExpression(input);
  }

  const handleUpdate = () => {
    setUpdateCount(updateCount + 1);
  }

  return (
    <div className="App">
      <Canvas
        updateCount={updateCount}
      />
      <Controls
        expression={expression}
        handleExpressionChange={handleExpressionChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;
