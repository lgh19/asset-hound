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
import searchIcon from '../../images/search.svg';

const Wrapper = styled.div`
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
      width: auto;
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

const SearchInput = styled(InputBase)`
  color: inherit;
`;

const Input = styled.input`
  ${({ theme }) => css`
    padding: ${theme.spacing(1, 1, 1, 0)};
    padding-left: calc(1em + ${theme.spacing(4)}px);
    transition: ${theme.transitions.create('width')};
    width: 100%;
    ${theme.breakpoints.up('sm')} {
      width: 12ch;
      '&:focus': {
        width: 20ch;
      }
    }
  `}
`;

function SearchBar({ onChange }) {
  return (
    <Wrapper>
      <Adornment>
        <SearchIcon />
      </Adornment>
      <SearchInput
        placeholder="Search…"
        inputComponent={Input}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Wrapper>
  );
}

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
