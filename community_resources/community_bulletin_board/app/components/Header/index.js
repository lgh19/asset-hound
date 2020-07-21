/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { PropTypes as MuiPropTypes } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import CloseIcon from '@material-ui/icons/Close';
import SearchBar from '../SearchBar';

const MenuButton = styled(IconButton)`
  ${({ theme }) => css`
    margin-right: ${theme.spacing(2)}px;
  `}
`;

const Title = styled(props => <Typography variant="h6" noWrap {...props} />)`
  ${({ theme }) => css`
  ${theme.breakpoints.up('sm')} {
    display: block;
  `}
`;

const TitleSection = styled.div`
  flex-grow: 1;
`;

const ActionSection = styled.div`
  flex-grow: 0;
`;

const SearchSection = styled.div``;

function Header({ title, color, onMenuClick, onClose }) {
  return (
    <AppBar color={color} position="static">
      <Toolbar>
        {onMenuClick && (
          <MenuButton edge="start" color="inherit" aria-label="open drawer">
            <MenuIcon />
          </MenuButton>
        )}
        <TitleSection>
          <Title>{title}</Title>
        </TitleSection>
        {onClose && (
          <ActionSection>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </ActionSection>
        )}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  title: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'secondary', 'default']),
  onMenuClick: PropTypes.func,
};

Header.defaultProps = {
  color: 'primary',
};

export default memo(Header);
