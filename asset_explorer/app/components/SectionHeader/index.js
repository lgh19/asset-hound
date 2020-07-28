/**
 *
 * SectionHeader
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Heading } from '@adobe/react-spectrum';
function SectionHeader({ children, ...props }) {
  return (
    <Heading level={3} {...props}>
      {children}
    </Heading>
  );
}

SectionHeader.propTypes = {
  children: PropTypes.node,
};

export default memo(SectionHeader);
