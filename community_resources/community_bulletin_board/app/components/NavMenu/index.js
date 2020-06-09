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

const Wrapper = styled.nav``;

const MenuList = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
`;

function NavMenu({ sections }) {
  return (
    <Wrapper>
      <MenuList>
        {sections.map(section => (
          <NavMenuItem key={section.slug} section={section} />
        ))}
      </MenuList>
    </Wrapper>
  );
}

NavMenu.propTypes = {
  sections: PropTypes.arrayOf(localPropTypes.category),
};

export default memo(NavMenu);
