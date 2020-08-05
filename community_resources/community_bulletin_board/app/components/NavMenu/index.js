/**
 *
 * NavMenu
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NavMenuItem from './NavMenuitem';
import { localPropTypes } from '../../utils';

import mapIcon from '../../images/png/021-maps.png';

const Nav = styled.nav`
  padding: 4px 8px;
`;

const MenuList = styled.ol`
  padding-left: 0;
`;

const MapButton = styled.a`
  display: inline-block;
  vertical-align: baseline;
  border: 1px solid #1d3557;
  width: 100%;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 2px 2px;
  text-align: center;
  padding: 8px;

  background-color: #00838f;
  color: #e0f7fa;
  text-decoration: none;

  &:hover,
  &:active {
    background-color: #00bcd4;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const Icon = styled.img`
  display: block;
  height: 48px;
  margin: 0 auto;
`;

function NavMenu({ sections, gotoPage }) {
  return (
    <Nav>
      <Typography variant="h5" component="h3" color="textSecondary">
        Browse by <b>category</b>...
      </Typography>
      <MenuList>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {sections.map(section => (
            <Grid item xs={6} sm={4} md={4} lg={3}>
              <NavMenuItem key={section.slug} section={section} />
            </Grid>
          ))}
        </Grid>
      </MenuList>
      <br />
      <Typography variant="h5" component="h3" color="textSecondary">
        ...or use <b>the map</b> to find what's closest to you.
      </Typography>
      <MapButton onClick={() => gotoPage('/map')}>
        <Icon src={mapIcon} alt="map" role="img" />
        <Typography variant="button" display="block">
          Take me to the map
        </Typography>
      </MapButton>
    </Nav>
  );
}

NavMenu.propTypes = {
  sections: PropTypes.arrayOf(localPropTypes.category),
  gotoPage: PropTypes.func,
};

export default memo(NavMenu);
