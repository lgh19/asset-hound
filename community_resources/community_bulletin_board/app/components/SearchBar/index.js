/**
 *
 * SearchBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { FormattedMessage } from 'react-intl';
import searchIcon from '../../images/search.svg';
import messages from './messages';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding-left: 3rem;
  height: 2rem;
  border-radius: 4px;
  border: 1px solid rgb(29, 53, 87);
  &:focus {
    border: 2px solid rgb(29, 53, 87);
  }

  ${({ theme }) => css`
    @media (${theme.breakpoints.md}) {
      min-width: 20rem;
    }
  `}
`;

const Adornment = styled.div`
  ${({ theme }) => css`
    background-image: url("${searchIcon}"),
      linear-gradient(transparent, transparent);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 1rem;
    height: 1.8rem;
    width: 3rem;
    display: inline-block;
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
  `}
`;

function SearchBar({ onChange }) {
  return (
    <Wrapper>
      <form role="search">
        <label htmlFor="resource-search-field">
          <span className="sr-only">Search</span>
          <Adornment aria-hidden="true" />
        </label>
        <Input id="resource-search-field" type="search" />
        <button type="button" className="sr-only">
          <span className="sr-only">Search</span>
        </button>
      </form>
    </Wrapper>
  );
}

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
