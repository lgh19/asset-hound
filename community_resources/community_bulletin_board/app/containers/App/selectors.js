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
        name: resource.name,
        id: resource.slug,
        resource: resource.name,
        slug: resource.slug,
        categories: resource.categories.map(c => c.slug),
      },
    })),
  );

/**
 * Selectors
 */

const selectGlobalDomain = state => state.global || initialState;

const makeSelectAllLocationsGeoJSON = () =>
  createSelector(
    selectGlobalDomain,
    substate => ({
      type: 'FeatureCollection',
      features: substate.community
        ? substate.community.resources.reduce(reduceResourcesIntoFeatures, [])
        : [],
    }),
  );

const makeSelectCommunity = () =>
  createSelector(
    selectGlobalDomain,
    substate => substate.community,
  );

const makeSelectSearchResults = () =>
  createSelector(
    selectGlobalDomain,
    substate => substate.searchResults,
  );

const makeSelectIsSearching = () =>
  createSelector(
    selectGlobalDomain,
    substate => substate.isSearching,
  );

export {
  makeSelectLocation,
  makeSelectCommunity,
  makeSelectSearchResults,
  makeSelectIsSearching,
  makeSelectAllLocationsGeoJSON,
};
