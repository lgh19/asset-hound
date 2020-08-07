/**
 *
 * Footer
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { FormattedMessage } from 'react-intl';
import { View, Divider } from '@adobe/react-spectrum';
import messages from './messages';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <View padding="size-50">
      <Divider size="S" />
      &#169; <FormattedMessage {...messages.copyright} values={{ year }} />
    </View>
  );
}

Footer.propTypes = {};

export default memo(Footer);
