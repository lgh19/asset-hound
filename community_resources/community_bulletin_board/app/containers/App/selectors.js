import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectRouter = state => state.router;

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
  );

const reduceResourcesIntoFeatures = (features, resource) =>
  features.concat(
    resource.locations.features.map(({ properties, ...other }) => ({
      ...other,
      properties: {
        ...properties,
        resource: resource.name,
        slug: resource.slug,
      },
    })),
  );

/**
 * Selectors
 */

const selectGlobaldDomain = state => state.global || initialState;

const makeSelectAllLocationsGeoJSON = () =>
  createSelector(
    selectGlobaldDomain,
    substate => ({
      type: 'FeatureCollection',
      features: substate.community
        ? substate.community.resources.reduce(reduceResourcesIntoFeatures, [])
        : [],
    }),
  );

const makeSelectCommunity = () =>
  createSelector(
    selectGlobaldDomain,
    substate => substate.community,
  );

export {
  makeSelectLocation,
  makeSelectCommunity,
  makeSelectAllLocationsGeoJSON,
};
