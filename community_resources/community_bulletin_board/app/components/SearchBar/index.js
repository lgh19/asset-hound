/**
 *
 * SearchBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { FormattedMessage } from 'react-intl';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles';
import * as _ from 'lodash';
import { Divider, Paper, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Search } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import searchIcon from '../../images/search.svg';
import Link from '../Link';
const Wrapper = styled.div`
  position: relative;
`;

const SearchWrapper = styled.div`
  ${({ theme }) => css`
    position: relative;
    border-radius: ${theme.shape.borderRadius}px;
    background-color: ${fade(theme.palette.common.white, 0.15)};
    &:hover {
      background-color: ${fade(theme.palette.common.white, 0.25)};
    }
    margin-left: 0;
    width: 100%;
    ${theme.breakpoints.up('sm')} {
      margin-left: ${theme.spacing(1)}px;
      width: 32ch;
    }
  `}
`;

const Adornment = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacing(0, 2)};
    height: 100%;
    position: absolute;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

function SearchBar({ onChange, results, isSearching }) {
  const [open, setOpen] = React.useState(false);
  function handleChange(event) {
    onChange(event.target.value);
  }

  const renderInput = params => (
    <TextField
      fullWidth
      {...params}
      margin="none"
      size="small"
      aria-label="Search"
      variant="outlined"
      placeholder="Search…"
      style={{ borderColor: 'rgba(0,0,0,0)' }}
      InputProps={{
        ...params.InputProps,
        style: { border: '0px', paddingLeft: '48px' },
        endAdornment: (
          <React.Fragment>
            {isSearching ? (
              <CircularProgress color="inherit" size={20} />
            ) : null}
            {params.InputProps.endAdornment}
          </React.Fragment>
        ),
      }}
      onChange={handleChange}
    />
  );

  function handleSelection(event, selection) {
    if (selection && selection.slug) {
      window.location.hash = selection.slug;
    }
  }

  return (
    <SearchWrapper>
      <Adornment>
        <SearchIcon />
      </Adornment>
      <Autocomplete
        fullWidth
        freeSolo
        id="asynchronous-demo"
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionSelected={(option, value) => option.slug === value.slug}
        getOptionLabel={option => option.name}
        options={results || []}
        loading={isSearching}
        renderInput={renderInput}
        onChange={handleSelection}
      />
    </SearchWrapper>
  );
}

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  results: PropTypes.array,
  isSearching: PropTypes.bool,
};

export default SearchBar;
