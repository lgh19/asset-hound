/**
 *
 * Footer
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Footer() {
  return (
    <div>
      <div>
        Icons made by{' '}
        <a
          href="https://www.flaticon.com/authors/photo3idea-studio"
          title="photo3idea_studio"
        >
          photo3idea_studio
        </a>
        from{' '}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      </div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Footer.propTypes = {};

export default memo(Footer);
