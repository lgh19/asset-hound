/**
 *
 * InfoSection
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
import { View } from '@adobe/react-spectrum';
import SectionHeader from '../SectionHeader';

function InfoSection({ title, subtitle, children }) {
  return (
    <View>
      <SectionHeader>{title}</SectionHeader>
      <View paddingStart="size-150">{children}</View>
    </View>
  );
}

InfoSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

export default memo(InfoSection);
