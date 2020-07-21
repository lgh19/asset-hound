import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'react-map-gl';

import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Card } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { localPropTypes } from '../../utils';
import ResourceListItem from '../ResourceList/ResourceListItem';

const Wrapper = styled(Paper)`
  ${({ theme }) => css`
    max-width: ${theme.spacing(50)}px;
  `}
`;

function PopUp({
  lat,
  lng,
  altitude,
  zIndex,
  onClose,
  children,
  ...otherProps
}) {
  return (
    <Popup
      sortByDepth
      latitude={lat}
      longitude={lng}
      altitude={altitude}
      closeOnClick={false}
      onClose={onClose}
      closeButton={false}
      tipSize={0}
      anchor="bottom"
      interactiveLayers={['asset-points']}
      style={{ padding: 0, zIndex }}
      captureScroll
      captureDrag
      offsetTop={-2}
      {...otherProps}
    >
      <Wrapper>{children}</Wrapper>
    </Popup>
  );
}

PopUp.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  altitude: PropTypes.number,
  zIndex: PropTypes.number,
  onClose: PropTypes.func,
  children: PropTypes.node,
  ...Popup.propTypes,
};

PopUp.defaultProps = {
  lat: 0,
  lng: 0,
  altitude: 0,
};

export default PopUp;
