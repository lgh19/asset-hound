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
import ResourceMapFilter from './ResourceMapFilter';

const Wrapper = styled.div`
  height: 100px;
  border: 1px solid #1d3557ff;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
`;

function ResourceMap({ geojson, community, handleResourceSelection }) {
  const [popup, setPopup] = useState(undefined);
  const [hold, setHold] = useState(false);
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
    if (!feature && !hold) {
      setPopup(undefined);
      setPopupFeature(undefined);
    }
  }

  function handleClick(event) {
    const feature = extractFeatureFromEvent(event);
    if (feature && feature.properties.resource) {
      // use slug from featur properties to look up data in store for now
      // fixme don't use a list to transfer this data
      setHold(true);

      const goodResources = community.resources.filter(
        r => r.slug === feature.properties.slug,
      );
      if (goodResources && goodResources.length) {
        const [lng, lat] = event.lngLat;
        const resource = goodResources[0];
        setPopup(
          <PopUp
            lat={lat}
            lng={lng}
            onClose={closePopup}
            resource={resource}
            onDetailClick={() => handleResourceSelection(resource)}
          />,
        );
      }
    } else {
      setHold(false);
    }
  }

  // const handleDetailClick = (resource) = () =>

  return (
    <Map
      mapStyle="mapbox://styles/stevendsaylor/cka2g3m0h06np1iojseescv3k"
      onHover={handleHover}
      onClick={handleClick}
      interactiveLayerIds={['all-location/points']}
    >
      <Source id="all-locations" type="geojson" data={geojson} />
      <Layer
        source="all-locations"
        id="all-location/points"
        {...allLocationsLayer}
      />
      {popup}
    </Map>
  );
}

ResourceMap.propTypes = {
  geojson: localPropTypes.locations,
};

export default ResourceMap;
