/**
 *
 * ResourceMap
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Layer, Source } from 'react-map-gl';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import styled, { css } from 'styled-components';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
import Map from '../Map';
import { allLocationsLayer } from '../../containers/BulletinBoard/layers';
import { localPropTypes } from '../../utils';
import PopUp from './PopUp';
import { extractFeatureFromEvent } from '../Map/utils';
import MapFilter from './MapFilter';
import ResourceSummary from '../ResourceSummary';
import ResourceDetails from '../ResourceDetails';

const MiniDrawer = styled(Drawer)`
  ${({ theme, small }) => css`
    height: 100%;
    ${!small &&
      css`
        height: ${theme.spacing(10)};
      `}
  `}
`;

function isSameResource(feature, resource) {
  if (
    !feature ||
    !feature.properties ||
    !feature.properties.slug ||
    !resource ||
    !resource.slug
  ) {
    return false;
  }
  return feature.properties.slug === resource.slug;
}

function ResourceMap({
  geojson,
  community,
  selectedResource,
  filter,
  onResourceSelection,
  onFilterChange,
  onOpenDetails,
  onCloseDetails,
}) {
  const theme = useTheme();
  const usePopUp = useMediaQuery(theme.breakpoints.up('md'));
  const [nameHover, setNameHover] = useState(undefined);

  const [filteredGeoJSON, setFilteredGeoJSON] = useState(['has', 'name']);

  const [inDetailMode, setInDetailMode] = useState(false);
  const [lngLat, setLngLat] = useState(undefined);
  const [resourceContent, setResourceContent] = useState(undefined);

  useEffect(() => {
    setFilteredGeoJSON(geojson);
  }, [geojson]);

  useEffect(() => {
    if (selectedResource)
      setResourceContent(
        <ResourceSummary
          map
          resource={selectedResource}
          handleClose={onCloseDetails}
          onMoreClick={() => setInDetailMode(true)}
        />,
      );
    else setResourceContent(undefined);
  }, [selectedResource]);

  function closeHover() {
    setNameHover(undefined);
  }

  function handleHover(event) {
    const feature = extractFeatureFromEvent(event);

    if (feature && !nameHover && !isSameResource(feature, selectedResource)) {
      const [lng, lat] = event.lngLat;
      setNameHover(
        <PopUp
          lat={lat}
          lng={lng}
          captureClick={false}
          captureDrag={false}
          captureDoubleClick={false}
          altitude={100}
          onClose={closeHover}
        >
          <Paper style={{ padding: '4px' }}>
            <Typography variant="body2" style={{ margin: 0, padding: 0 }}>
              {feature.properties.resource}
            </Typography>
          </Paper>
        </PopUp>,
      );
    }
    if (!feature && !!nameHover) {
      setNameHover(undefined);
    }
  }

  function handleClick(event) {
    const feature = extractFeatureFromEvent(event);

    if (feature && feature.properties.resource) {
      closeHover();
      const goodResources = community.resources.filter(
        r => r.slug === feature.properties.slug,
      );

      if (goodResources && goodResources.length) {
        const resource = goodResources[0];
        setLngLat(event.lngLat);
        onResourceSelection(
          resource,
          { lngLat: event.lngLat, mapRef: undefined },
          true,
        );
      }
    } else {
      handleContentClose();
    }
  }

  function getFilterGeoJSON(filters) {
    // get set of activty category strings
    const activeCategories = Object.entries(filters).reduce(
      (activeCats, [cat, on]) => {
        if (on) {
          return [...activeCats, cat];
        }
        return activeCats;
      },
      [],
    );
    // filter the features that have categories that intersect with that set
    const filteredFeatures = geojson.features.filter(
      feature =>
        !!feature.properties.categories.filter(c =>
          activeCategories.includes(c),
        ).length,
    );

    return {
      ...geojson,
      features: filteredFeatures,
    };
  }

  function handleFilterChange(newFilters) {
    onFilterChange(newFilters);
    setFilteredGeoJSON(getFilterGeoJSON(newFilters));
  }

  function handleContentClose() {
    setInDetailMode(false);
    onResourceSelection(null, null, null);
    setResourceContent(undefined);
  }

  return (
    <Map
      mapStyle="mapbox://styles/stevendsaylor/cka2g3m0h06np1iojseescv3k"
      onHover={handleHover}
      onClick={handleClick}
      clickRadius={5}
      interactiveLayerIds={['all-location/points']}
    >
      <Source id="all-locations" type="geojson" data={filteredGeoJSON} />
      <Layer
        source="all-locations"
        id="all-location/points"
        {...allLocationsLayer}
      />
      {nameHover}
      {!!resourceContent && usePopUp && lngLat && (
        <PopUp
          lat={lngLat[1]}
          lng={lngLat[0]}
          altitude={0}
          onClose={handleContentClose}
        >
          {resourceContent}
        </PopUp>
      )}
      {!!resourceContent && !usePopUp && (
        <MiniDrawer
          anchor="bottom"
          open={resourceContent}
          onClose={handleContentClose}
          onOpen={() => setInDetailMode(true)}
        >
          {resourceContent}
        </MiniDrawer>
      )}

      {!!selectedResource && inDetailMode && (
        <ResourceDetails
          resource={selectedResource}
          onClose={() => setInDetailMode(false)}
        />
      )}

      <MapFilter
        categories={community.resourceCategories}
        filter={filter}
        onChange={handleFilterChange}
      />
    </Map>
  );
}

ResourceMap.propTypes = {
  geojson: localPropTypes.locations,
  community: localPropTypes.community,
  selectedResource: localPropTypes.resource,
  filter: PropTypes.object,
  onResourceSelection: PropTypes.func,
  onFilterChange: PropTypes.func,
  onOpenDetails: PropTypes.func,
  onCloseDetails: PropTypes.func,
};

export default ResourceMap;
