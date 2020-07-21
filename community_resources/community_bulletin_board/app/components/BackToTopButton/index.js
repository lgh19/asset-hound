/**
 *
 * BackToTopButton
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Fab from '@material-ui/core/Fab';
import UpIcon from '@material-ui/icons/ArrowUpward';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';

const Button = styled(Fab)`
  position: absolute;
  ${({ theme }) => css`
    bottom: ${theme.spacing(2)}px;
    right: ${theme.spacing(2)}px;
  `}
`;

Button.propTypes = Fab.propTypes;

function BackToTopButton({ scroller, label, hidden }) {
  const target = scroller || window;
  function handleClick() {
    target.scrollTo(0, 0);
  }

  return (
    <Zoom in={!hidden}>
      <Tooltip title={label}>
        <Button color="primary" onClick={handleClick} aria-label={label}>
          <UpIcon />
        </Button>
      </Tooltip>
    </Zoom>
  );
}

BackToTopButton.propTypes = {
  scroller: PropTypes.element,
  hidden: PropTypes.bool,
  label: PropTypes.string,
};

BackToTopButton.defaultProps = {
  hidden: true,
  label: 'Back to top',
};

export default memo(BackToTopButton);
