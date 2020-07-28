/**
 *
 * SearchBox
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { SearchField, View } from '@adobe/react-spectrum';
function SearchBox({ onChange, term }) {
  function handleChange(value) {
    onChange(event.target.value);
  }

  return <View width="100%" />;
}

SearchBox.propTypes = {
  onChange: PropTypes.func,
  term: PropTypes.string,
};

export default SearchBox;
