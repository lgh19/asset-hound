/**
 *
 * NavMenu
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import NavMenuItem from './NavMenuitem';
import { localPropTypes } from '../../utils';
import Typography from '../Typography';

const Wrapper = styled.div``;

const Nav = styled.nav`
  padding: 4px 8px;
`;

const MenuList = styled.ol`
  padding-left: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
`;

function NavMenu({ sections }) {
  return (
    <Wrapper>
      <Typography.H2>Find resources for a specific topic</Typography.H2>
      <Nav>
        <MenuList>
          {sections.map(section => (
            <NavMenuItem key={section.slug} section={section} />
          ))}
        </MenuList>
      </Nav>
    </Wrapper>
  );
}

NavMenu.propTypes = {
  sections: PropTypes.arrayOf(localPropTypes.category),
};

export default memo(NavMenu);
