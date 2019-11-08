import React from 'react'
import ReactDOM from 'react-dom'
import PDF from 'react-pdf'
import 'react-pdf/dist/react-pdf.scss';

class App extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handlePDFRender = this.handlePDFRender.bind(this);
    this.container = React.createRef();
    this.state = {
      bool: true,
      fileName: 'document-1.pdf',
    }
  }

  handleClick() {
    this.setState({ fileName: (this.state.bool) ? 'document-2.pdf' : 'document-1.pdf', bool: !this.state.bool });
  }

  handlePDFRender() {
    console.log("PDF has been rendered !");
  }

  render() {
    return (
      <div className="App">
        <button type="button" onClick={this.handleClick}>Changer de fichier</button>
        <div ref={this.container} style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <PDF
            url={this.state.fileName}
            className="Test"
            poll={true}
            onPDFRender={this.handlePDFRender}
            zoomNodesWrapper={children => <div>{children}</div>}
            zoomInNode={<button>Zoom in</button>}
            zoomOutNode={<button>Zoom out</button>}
            zoomResetNode={<button>Reset zoom</button>}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
