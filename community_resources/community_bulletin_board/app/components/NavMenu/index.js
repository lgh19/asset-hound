/**
 *
 * NavMenu
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import NavMenuItem from './NavMenuitem';
import { localPropTypes } from '../../utils';

const Nav = styled.nav`
  padding: 4px 8px;
`;

const MenuList = styled.ol`
  padding-left: 0;
`;

function NavMenu({ sections }) {
  return (
    <Nav>
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
    </Nav>
  );
}

NavMenu.propTypes = {
  sections: PropTypes.arrayOf(localPropTypes.category),
};

export default memo(NavMenu);
