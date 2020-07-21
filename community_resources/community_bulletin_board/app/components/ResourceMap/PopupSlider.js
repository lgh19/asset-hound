/**
 *
 * ResourceSummary
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Card from '@material-ui/core/Card';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { Toolbar, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import { localPropTypes, withMaxWidth } from '../../utils';
import Link from '../Link';
import Content from '../Content';
import ContactInfo from '../ResourceList/ResourceListItem/ContactInfo';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  padding: 16px 8px;
  background: white;
`;

function PopupSlider({ resource, handleClose }) {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(true);
  }, [resource]);

  const toggleDrawer = open => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const content = (
    <Paper>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6">{resource.name}</Typography>
        </Toolbar>
      </AppBar>
      <ContactInfo resource={resource} />
      <Content html={resource.description} />
    </Paper>
  );

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={drawerOpen}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      onOpen={toggleDrawer(true)}
      onClose={toggleDrawer(false)}
    >
      {content}
    </SwipeableDrawer>
  );
}

PopupSlider.propTypes = {
  resource: localPropTypes.resource,
};

export default PopupSlider;
