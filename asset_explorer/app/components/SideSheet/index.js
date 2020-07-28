/**
 *
 * SideSheet
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { View } from '@adobe/react-spectrum';

function SideSheet({ children }) {
  return <View>{children}</View>;
}

SideSheet.propTypes = {};

export default SideSheet;
