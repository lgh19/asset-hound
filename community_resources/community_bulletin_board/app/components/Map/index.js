/**
 *
 * Map
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import { DEFAULT_VIEWPORT } from './settings';
import { MAPBOX_API_TOKEN } from '../../settings';

function Map({
  mapStyle,
  onHover,
  onClick,
  startingViewport,
  children,
  ...others
}) {
  const [viewport, setViewport] = useState(
    Object.assign({}, startingViewport, DEFAULT_VIEWPORT),
  );
  return (
    <ReactMapGL
      mapboxApiAccessToken={MAPBOX_API_TOKEN}
      {...viewport}
      onViewportChange={v =>
        setViewport(Object.assign({}, v, { width: '100%', height: '100%' }))
      }
      mapStyle={mapStyle}
      onHover={onHover}
      onClick={onClick}
      {...others}
    >
      {children}
    </ReactMapGL>
  );
}

Map.propTypes = {
  mapStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node,
  startingViewport: PropTypes.object,
};

Map.defaultProps = {
  mapStyle: 'mapbox://styles/mapbox/light-v10',
  startingViewport: {},
};

export default Map;
