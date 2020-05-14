/**
 *
 * Map
 *
 */

import React, { useEffect, useState } from 'react';
import InteractiveMap, {
  StaticMap,
  Source,
  Layer,
  NavigationControl,
} from 'react-map-gl';

import PropTypes from 'prop-types';

import styled from 'styled-components';
import { MAPBOX_API_TOKEN } from '../../settings';
import {
  DEFAULT_VIEWPORT,
  basemaps,
  CARTO_SQL,
  assetLayer,
  categoryColors,
} from './settings';
import { extractFeatureFromEvent, fetchCartoVectorSource } from './utils';
import { categorySchema } from '../../schemas';
import PopUp from './PopUp';
import Legend from './Legend';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

const ControlDiv = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

function Map({
  defaultViewport,
  sources,
  layers,
  isStatic,
  darkMode,
  children,
  onAssetClick,
  categories,
  filter,
  searchTerm,
}) {
  const ReactMapGL = isStatic ? StaticMap : InteractiveMap;

  const startingViewport = { ...DEFAULT_VIEWPORT, ...defaultViewport };
  const [assetSource, setAssetSource] = useState(undefined);
  const [viewport, setViewport] = useState(startingViewport);
  const mapStyle = darkMode ? basemaps.dark : basemaps.light;

  const [popup, setPopup] = useState(undefined);
  const [popupFeature, setPopupFeature] = useState(undefined);

  const [assetLayerFilter, setAssetLayerFilter] = useState(['has', 'name']);

  useEffect(() => {
    fetchCartoVectorSource(
      'assets',
      CARTO_SQL,
      // eslint-disable-next-line no-console
    ).then(setAssetSource, err => console.error('CARTO', err));
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setAssetLayerFilter(['all', filter, ['in', searchTerm, ['get', 'name']]]);
    } else {
      setAssetLayerFilter(filter);
    }
  }, [searchTerm, filter]);

  function closePopup() {
    setPopupFeature(undefined);
    setPopup(undefined);
  }

  function handleHover(event) {
    const feature = extractFeatureFromEvent(event);
    if (feature && feature.properties.id !== popupFeature) {
      setPopupFeature(feature.properties.id);
      const [lng, lat] = event.lngLat;
      setPopup(
        <PopUp
          name={feature.properties.name}
          type={feature.properties.asset_type_title}
          lat={lat}
          lng={lng}
          onClose={closePopup}
        />,
      );
    }
    if (!feature) {
      setPopup(undefined);
      setPopupFeature(undefined);
    }
  }

  function handleClick(event) {
    const feature = extractFeatureFromEvent(event);
    if (feature) {
      onAssetClick(feature.properties.id);
    }
  }

  return (
    <ReactMapGL
      mapboxApiAccessToken={MAPBOX_API_TOKEN}
      {...viewport}
      onViewportChange={v =>
        setViewport(Object.assign({}, v, { width: '100%', height: '100%' }))
      }
      mapStyle={mapStyle}
      onHover={handleHover}
      onClick={handleClick}
      interactiveLayerIds={['asset-points']}
    >
      {!!assetSource && (
        <Source {...assetSource}>
          <Layer {...assetLayer} filter={assetLayerFilter} />
        </Source>
      )}

      {sources.map(source => (
        <Source {...source} />
      ))}

      {layers.map(layer => (
        <Layer {...layer} />
      ))}

      {children /* todo: ¿tightly define what goes in the map? */}

      {popup}
      {!!categories && (
        <Legend colors={categoryColors} categories={categories} />
      )}
      <ControlDiv>
        <NavigationControl />
      </ControlDiv>
    </ReactMapGL>
  );
}

Map.propTypes = {
  defaultViewport: PropTypes.shape({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    zoom: PropTypes.number,
    pitch: PropTypes.number,
  }),
  sources: PropTypes.arrayOf(PropTypes.object),
  layers: PropTypes.arrayOf(PropTypes.object),
  isStatic: PropTypes.bool,
  darkMode: PropTypes.bool,
  children: PropTypes.node,
  onAssetClick: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.shape(categorySchema)),
  filter: PropTypes.array,
  searchTerm: PropTypes.string,
};

Map.defaultProps = {
  sources: [],
  layers: [],
};

export default Map;
