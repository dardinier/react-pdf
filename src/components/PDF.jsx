import PropTypes from 'prop-types'
import React from 'react'

const PDF = ({ text }) => (
  <h1>
    {text}
  </h1>
);

PDF.propTypes = {
  text: PropTypes.string,
};

export default PDF;
