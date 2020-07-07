/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Typography from '../Typography';
import SearchBar from '../SearchBar';

const Wrapper = styled.header`
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid dimgray;
  box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, 0.3);
  width: 100%;

  display: inline-grid;
  grid-gap: 8px;
  grid-template-columns: 1fr;

  ${({ theme }) => css`
    @media (${theme.breakpoints.md}) {
      grid-template-columns: 1fr auto;
      text-align: left;
    }
  `}
`;

const TitleSection = styled.div`
`;

const MenuSection = styled.div`
`;

function Header({ title }) {
  return (
    <Wrapper>
      <TitleSection>
        <Typography variant="h5" component="h1">
          {title}
        </Typography>
      </TitleSection>
      <MenuSection>
        <SearchBar />
      </MenuSection>
    </Wrapper>
  );
}

Header.propTypes = {};

export default memo(Header);
