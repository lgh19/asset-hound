/**
 *
 * SearchBox
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { debounce } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import messages from './messages';

const Wrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacing(1, 1)};
  `}
`;

function SearchBox({ onChange, onClear, term }) {
  function handleChange(event) {
    onChange(event.target.value);
  }

  return (
    <Wrapper>
      <TextField
        value={term}
        id="search-input"
        // label="Search for assets"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
        onChange={handleChange}
        placeholder="Search for assets..."
      />
    </Wrapper>
  );
}

SearchBox.propTypes = {
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  term: PropTypes.string,
};

export default SearchBox;
