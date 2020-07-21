/**
 * FilterMenu
 *
 * The menu used by the MapFilter.  For large screens, it appears on the map
 * for small screens it appears in a modal.
 */

import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import React from 'react';
import { localPropTypes } from '../../../utils';
import styled, { css } from 'styled-components';
import { Paper } from '@material-ui/core';


const Wrapper = styled(Paper)`
  ${({ theme }) => css`
    padding: ${theme.spacing(2, 2)};
    bottom: ${theme.spacing(2)}px;
    right: ${theme.spacing(2)}px;
  `}
`;

function FilterMenu({ categories, filter, handleChange }) {
  return (
    <Wrapper>
      <Typography variant="subtitle2">Filter by Category</Typography>
      <FormGroup>
        {categories.map(({ slug, name }) => (
          <FormControlLabel
            key={slug}
            control={
              <Switch
                checked={filter[slug]}
                onChange={handleChange}
                name={slug}
              />
            }
            label={name}
          />
        ))}
      </FormGroup>
    </Wrapper>
  );
}

FilterMenu.propTypes = {
  categories: PropTypes.arrayOf(localPropTypes.category),
  filter: PropTypes.object,
  handleChange: PropTypes.func,
};

export default FilterMenu;
