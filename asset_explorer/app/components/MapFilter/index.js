/**
 *
 * MapFilter
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { FormattedMessage } from 'react-intl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { categorySchema } from '../../schemas';
import messages from './messages';

const Wrapper = styled(Paper)`
  ${({ theme }) => css`
    padding: ${theme.spacing(2, 2)};
  `}
`;

function MapFilter({ categories, filters, onChange }) {
  function handleChange(event) {
    const newFilters = {
      ...filters,
      [event.target.name]: event.target.checked,
    };
    onChange(newFilters);
  }

  function handleToggleAll() {
    const newFilters = Object.entries(filters).reduce(
      (newFilter, [cat, value]) => ({
        ...newFilter,
        [cat]: !value,
      }),
      {},
    );
    onChange(newFilters);
  }

  if (!categories || !filters) {
    return <div />;
  }

  // console.log(categories);
  // console.log(filters);

  return (
    <Wrapper>
      <Typography variant="subtitle1">Filter by Category</Typography>
      <FormGroup>
        <Button variant="outlined" onClick={handleToggleAll}>
          Toggle All
        </Button>
        {categories.map(({ name, title }) => (
          <FormControlLabel
            key={name}
            control={
              <Switch
                checked={filters[name]}
                onChange={handleChange}
                name={name}
              />
            }
            label={title}
          />
        ))}
      </FormGroup>
    </Wrapper>
  );
}

MapFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape(categorySchema)).isRequired,
  filters: PropTypes.object,
  onChange: PropTypes.func,
};

export default MapFilter;
