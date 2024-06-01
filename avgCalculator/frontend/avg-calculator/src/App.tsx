import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [numberId, setNumberId] = useState<string>('e');
  const [response, setResponse] = useState<any>(null);

  const fetchAverage = async () => {
    try {
      const res = await axios.post(`http://localhost:9876/numbers/${numberId}`);
      setResponse(res.data);
    } catch (error) {
      console.error('Error fetching average:', error);
    }
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <select value={numberId} onChange={(e) => setNumberId(e.target.value)}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>
      <button onClick={fetchAverage}>Calculate</button>
      {response && (
        <div>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
