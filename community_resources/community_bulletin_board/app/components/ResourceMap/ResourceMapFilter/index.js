/**
 *
 * ResourceMapFilter
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Button = styled.button`
  ${({ theme, on }) => css`
    background-color: ${on ? 'dimgray' : 'gray'};
    color: ${on ? theme.color.main : 'dimgray'};
  `}
`;

function ResourceMapFilter({ categories, handleClick }) {
  return (
    <div>
      {Object.entries(categories).map(([category, on]) => (
        <Button on={on} onClick={handleClick}>
          {category}
        </Button>
      ))}
    </div>
  );
}

ResourceMapFilter.propTypes = {
  categories: PropTypes.objectOf(PropTypes.string),
  handleClick: PropTypes.func,
};

export default ResourceMapFilter;
