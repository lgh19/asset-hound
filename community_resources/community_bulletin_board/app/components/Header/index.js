/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const Wrapper = styled.header`
  height: 200px;
`;

const Title = styled.h1``;

function Header({ title }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
    </Wrapper>
  );
}

Header.propTypes = {};

export default memo(Header);
