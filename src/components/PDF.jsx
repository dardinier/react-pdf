import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import PDFJS from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import debounce from 'lodash.debounce';
import elementResizeEvent, { unbind } from 'element-resize-event';

const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

const DEFAULT_ZOOM = 100;

class PDF extends Component {
  constructor(props) {
    super(props);
    /* Initial state declaration */
    this.state = {
      documentStatus: STATUS.LOADING,
      viewportWidth: null,
      zoom: DEFAULT_ZOOM,
    };
    /* Binding events */
    this.renderPDF = this.renderPDF.bind(this);
    this.updateDocumentSize = this.updateDocumentSize.bind(this);
    this.handleResize = debounce(this.updateDocumentSize, 400);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.zoomReset = this.zoomReset.bind(this);
    /* Declaring refs */
    this.viewerNode = React.createRef();
  }

  componentDidMount() {
    PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    this.pdfViewer = new PDFViewer({container: this.viewerNode.current});
    this.renderPDF();
    elementResizeEvent(this.viewerNode.current, this.handleResize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.pdfViewer.setDocument(null);
      this.setState({ documentStatus: STATUS.LOADING }, this.renderPDF);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.handleResize.cancel();
    unbind(this.viewerNode.current);
  }

  updateDocumentSize() {
    /* Rescale the PDF width according to the container width */
    this.pdfViewer.currentScale = ((this.viewerNode.current.clientWidth / this.state.viewportWidth) * 0.7) * (this.state.zoom / 100);
  }

  isAbleToZoomOut() {
    return (this.state.zoom - this.props.zoomStep) > 0;
  }

  zoomIn() {
    this.setState({zoom: this.state.zoom + this.props.zoomStep}, () => {
      this.updateDocumentSize();
    });
  }

  zoomOut() {
    if (this.isAbleToZoomOut()) {
      this.setState({zoom: this.state.zoom - this.props.zoomStep}, () => {
        this.updateDocumentSize();
      });
    }
  }

  zoomReset() {
    if (this.state.zoom !== DEFAULT_ZOOM) {
      this.setState({ zoom: DEFAULT_ZOOM }, () => {
        this.updateDocumentSize();
      });
    }
  }

  renderPDF() {
    const loadingTask = PDFJS.getDocument(this.props.url);
    loadingTask.promise
      .then((doc) => {
        this.setState({documentStatus: STATUS.SUCCESS}, () => {
          this.pdfViewer.setDocument(doc);
          if (null !== this.props.onPDFRender) {
            this.props.onPDFRender();
          }
        });
        doc.getPage(1).then((page) => {
          const viewport = page.getViewport(1);
          this.setState({viewportWidth: viewport.width}, () => {
            this.updateDocumentSize();
          });
        });
      })
      .catch(() => {
        if (this.props.poll) {
          setTimeout(this.renderPDF, this.props.pollTimeout);
        }
        else {
          this.setState({documentStatus: STATUS.ERROR});
        }
      });
  }

  render() {
    const zoomNodes = (
      <React.Fragment>
        {this.props.zoomOutNode && React.cloneElement( this.props.zoomOutNode, {onClick: this.zoomOut})}
        {this.props.zoomResetNode && React.cloneElement( this.props.zoomResetNode, {onClick: this.zoomReset})}
        {this.props.zoomInNode && React.cloneElement( this.props.zoomInNode, {onClick: this.zoomIn})}
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {this.props.zoomNodesWrapper
          ? this.props.zoomNodesWrapper(zoomNodes)
          : (
            <React.Fragment>
              {zoomNodes}
            </React.Fragment>
          )}
        <div className={this.props.className} ref={this.viewerNode}>
          <div className="pdfViewer"/>
          {STATUS.LOADING === this.state.documentStatus && this.props.loading}
          {STATUS.ERROR === this.state.documentStatus && this.props.error}
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

PDF.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.node,
  error: PropTypes.node,
  children: PropTypes.node,
  zoomStep: PropTypes.number,
  zoomInNode: PropTypes.node,
  zoomResetNode: PropTypes.node,
  zoomOutNode: PropTypes.node,
  zoomNodesWrapper: PropTypes.func,
  poll: PropTypes.bool,
  pollTimeout: PropTypes.number,
  onPDFRender: PropTypes.func,
};

PDF.defaultProps = {
  className: '',
  loading: 'Loading PDF ...',
  error: 'Failed to load PDF file.',
  children: null,
  zoomStep: 10,
  zoomInNode: null,
  zoomResetNode: null,
  zoomOutNode: null,
  zoomNodesWrapper: null,
  poll: false,
  pollTimeout: 1000,
  onPDFRender: null,
};

export default PDF;
