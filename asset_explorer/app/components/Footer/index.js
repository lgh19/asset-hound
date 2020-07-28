/**
 *
 * Footer
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <div>
      &#169; <FormattedMessage {...messages.copyright} values={{ year }} />
    </div>
  );
}

Footer.propTypes = {};

export default memo(Footer);
