/**
 *
 * MapFilter
 *
 * Provides users a way to filter objects on the map.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Hidden from '@material-ui/core/Hidden';
import ToolTip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import FilterIcon from '@material-ui/icons/FilterList';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import FilterMenu from './FilterMenu';
import { localPropTypes } from '../../../utils';

const Wrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacing(2, 2)};
    position: absolute;
    bottom: ${theme.spacing(2)}px;
    right: ${theme.spacing(2)}px;
  `}
`;

function MapFilter({ categories, filter, onChange }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [menuOpen, setMenuOpen] = useState(false);
  function handleChange(event) {
    const newFilters = {
      ...filter,
      [event.target.name]: event.target.checked,
    };
    onChange(newFilters);
  }

  function handleOpenMenu() {
    setMenuOpen(true);
  }

  function handleCloseMenu() {
    setMenuOpen(false);
  }

  if (!categories || !filter) {
    return <div />;
  }

  return (
    <Wrapper>
      <Hidden smDown implementation="css">
        <FilterMenu
          categories={categories}
          filter={filter}
          handleChange={handleChange}
        />
      </Hidden>
      <Hidden mdUp implementation="css">
        <ToolTip title="Filter">
          <Fab color="primary" onClick={handleOpenMenu}>
            <FilterIcon />
          </Fab>
        </ToolTip>
        <Dialog
          open={menuOpen}
          onClose={handleCloseMenu}
          fullScreen={fullScreen}
        >
          <FilterMenu
            categories={categories}
            filter={filter}
            handleChange={handleChange}
          />
        </Dialog>
      </Hidden>
    </Wrapper>
  );
}

MapFilter.propTypes = {
  categories: PropTypes.arrayOf(localPropTypes.category),
  filter: PropTypes.object,
  onChange: PropTypes.func,
};

export default MapFilter;
