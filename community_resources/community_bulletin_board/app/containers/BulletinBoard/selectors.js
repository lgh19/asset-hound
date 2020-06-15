import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the bulletinBoard state domain
 */

const selectBulletinBoardDomain = state => state.bulletinBoard || initialState;

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

const makeSelectBulletinBoardAllLocationsGeoJSON = () =>
  createSelector(
    selectBulletinBoardDomain,
    substate => ({
      type: 'FeatureCollection',
      features: substate.community
        ? substate.community.resources.reduce(reduceResourcesIntoFeatures, [])
        : [],
    }),
  );

const makeSelectBulletinBoardCommunity = () =>
  createSelector(
    selectBulletinBoardDomain,
    substate => substate.community,
  );

export {
  makeSelectBulletinBoardCommunity,
  makeSelectBulletinBoardAllLocationsGeoJSON,
};
