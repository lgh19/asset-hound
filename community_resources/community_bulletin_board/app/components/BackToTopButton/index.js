/**
 *
 * BackToTopButton
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const Button = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  text-align: right;
  padding: 0 2px;

  &:hover {
    text-decoration: underline;
  }
`;

function BackToTopButton() {
  return (
    <Button
      onClick={() => window.scrollTo(0, 0)}
      aria-labelledby={messages.top.id}
      type="button"
    >
      <span role="img" aria-labelledby={messages.top.id}>
        ⬆
      </span>
      ️ <FormattedMessage {...messages.top} />
    </Button>
  );
}

BackToTopButton.propTypes = {};

export default memo(BackToTopButton);
