/**
 *
 * ShortenedText
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Wrapper = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${({ maxWidth }) =>
    css`
      max-width: ${maxWidth};
    `}
`;

Wrapper.propTypes = { maxWidth: PropTypes.string };

function ShortenedText({ maxWidth, title, children, ...otherProps }) {
  return (
    <Wrapper maxWidth={maxWidth} title={title} {...otherProps}>
      {children}
    </Wrapper>
  );
}

ShortenedText.propTypes = {
  maxWidth: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};

ShortenedText.defaultProps = {
  maxWidth: '20rem',
};

export default memo(ShortenedText);
