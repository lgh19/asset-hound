/**
 *
 * ResourceMap
 *
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMapGL, { Layer, Source } from 'react-map-gl';
import Map from '../Map';
import { allLocationsLayer } from '../../containers/BulletinBoard/layers';
import { localPropTypes } from '../../utils';
import PopUp from './PopUp';
import { extractFeatureFromEvent } from '../Map/utils';

const Wrapper = styled.div`
  height: 400px;
  border: 1px solid #1d3557ff;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
`;

function ResourceMap({ data }) {
  const [popup, setPopup] = useState(undefined);
  const [popupFeature, setPopupFeature] = useState(undefined);

  function closePopup() {
    setPopupFeature(undefined);
    setPopup(undefined);
  }

  function handleHover(event) {
    const feature = extractFeatureFromEvent(event);
    if (feature && feature.properties.resource !== popupFeature) {
      setPopupFeature(feature.properties.resource);
      const [lng, lat] = event.lngLat;
      setPopup(
        <PopUp
          name={feature.properties.resource}
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
      window.location.hash = `#${feature.properties.slug}`;
    }
  }

  return (
    <Wrapper>
      <Map
        mapStyle="mapbox://styles/stevendsaylor/cka2g3m0h06np1iojseescv3k"
        onHover={handleHover}
        onClick={handleClick}
        interactiveLayerIds={['all-location/points']}
      >
        <Source id="all-locations" type="geojson" data={data} />
        <Layer
          source="all-locations"
          id="all-location/points"
          {...allLocationsLayer}
        />
        {popup}
      </Map>
    </Wrapper>
  );
}

ResourceMap.propTypes = {
  data: localPropTypes.locations,
};

export default ResourceMap;
