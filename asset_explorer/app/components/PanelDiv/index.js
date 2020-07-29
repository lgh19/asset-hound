/**
 *
 * PanelDiv
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { View } from '@adobe/react-spectrum';

function PanelDiv({ children, ...props }) {
  return <View {...props}>{children}</View>;
}

PanelDiv.propTypes = {
  children: PropTypes.node,
};

export default memo(PanelDiv);
