/**
 *
 * Link
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { parseHref } from '../../utils';

import externalLinkBadge from '../../images/external-link.png';

const A = styled.a`
  ${({ external }) =>
    external
      ? css`
          &:after {
            content: url(${externalLinkBadge});
          }
        `
      : ''}
`;

A.propTypes = {
  external: PropTypes.bool,
};

function Link({ href, children, ...otherProps }) {
  const { hostname, protocol } = parseHref(href);
  const external =
    ['http:', 'https:'].includes(protocol) &&
    hostname !== window.location.hostname;

  return (
    <A
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...otherProps}
      href={href}
      external={external}
    >
      {children}
    </A>
  );
}

Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};

export default memo(Link);
