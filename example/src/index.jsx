import React from 'react'
import ReactDOM from 'react-dom'
import PDF from 'react-pdf'

const App = () => (
  <div>
    <PDF text="Hello World !" />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
