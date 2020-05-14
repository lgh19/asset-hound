/**
 *
 * SideSheet
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import MuiDrawer from '@material-ui/core/Drawer';
import useTheme from '@material-ui/core/styles/useTheme';

const Drawer = styled(MuiDrawer)`
  ${({ theme, drawerWidth }) => css`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    width: ${theme.spacing(drawerWidth)}px;
    & .MuiDrawer-paper {
      position: relative;
      width: ${theme.spacing(drawerWidth)}px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
    }
  `}
`;

const Content = styled.div`
  ${({ theme }) => css`
    flex: 1;
  `}
`;
function SideSheet({ open, children, anchor, variant }) {
  const theme = useTheme();

  const drawerWidth = {
    info: theme.drawerWidth,
    nav: theme.navWidth,
  }[variant];

  return (
    <Drawer open={open} anchor={anchor} drawerWidth={drawerWidth} variant="permanent">
      <Content>{children}</Content>
    </Drawer>
  );
}

SideSheet.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.node,
  anchor: PropTypes.oneOf(['right', 'left', 'bottom']),
  variant: PropTypes.oneOf(['info', 'nav']),
};

SideSheet.defaultProps = {
  anchor: 'right',
  variant: 'info',
};

export default SideSheet;
