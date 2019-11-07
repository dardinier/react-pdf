import React from 'react'
import PropTypes from 'prop-types'

const App = ({ text }) => (
  <div>
    {text}
  </div>
);

App.propTypes = {
  text: PropTypes.string,
};
