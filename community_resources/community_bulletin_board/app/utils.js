/*
 *
 * Utils.js
 *
 * Utility functions and constants and such.  Includes custom proptypes for
 *
 */
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import React from 'react';

/**
 * *Enum of localizability types
 * @readonly
 * @enum {string}
 */
export const LocalizabilityTypes = {
  FIXED: 'FIX',
  MOBILE: 'MOB',
  VIRTUAL: 'VIR',
};

/**
 * *Enum of GeoJSON types
 * @readonly
 * @enum {string}
 */
export const GeoJSONTypes = {
  POINT: 'Point',
  LINESTRING: 'LineString',
  POLYGON: 'Polygon',
  MULTIPOINT: 'MultiPoint',
  MULTILINESTRING: 'MultiLineString',
  MULTIPOLYGON: 'MultiPolygon',
};

// Project Prop Types
const categoryShape = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
};

const populationShape = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  description: PropTypes.string,
};

const locationShape = {
  type: PropTypes.oneOf(['Feature']),
  geometry: PropTypes.shape({
    type: PropTypes.oneOf([
      'Point',
      'Line',
      'Polygon',
      'MultiPoint',
      'MultiPolygon',
    ]).isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
  properties: PropTypes.shape({
    name: PropTypes.string.isRequired,
    availableTransportation: PropTypes.string,
    parentLocation: PropTypes.shape(locationShape),
    fullAddress: PropTypes.string,
  }).isRequired,
};

const locationsShape = {
  type: PropTypes.oneOf(['FeatureCollection']),
  features: PropTypes.arrayOf(PropTypes.shape(locationShape)),
};

const organizationShape = {
  name: PropTypes.string.isRequired,
  location: PropTypes.shape(locationShape),
};

const assetTypeShape = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const assetCategoryShape = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const assetShape = {
  name: PropTypes.string.isRequired,
  assetTypes: PropTypes.arrayOf(PropTypes.shape(assetTypeShape)), // todo: define asset_type schema
  category: PropTypes.shape(assetCategoryShape), // todo: define asset_type schema
  organization: PropTypes.shape(organizationShape),
  email: PropTypes.string,
  phone: PropTypes.string,
  localizability: PropTypes.oneOf(Object.values(LocalizabilityTypes)),
  location: PropTypes.shape(locationShape),
  url: PropTypes.string,
  hoursOfOperation: PropTypes.string,
  holidayHoursOfOperation: PropTypes.string,
  childFriendly: PropTypes.bool,
  capacity: PropTypes.number,
  accessibilityFeatures: PropTypes.array, // todo: what is this an array of?
  internetAccess: PropTypes.bool,
  wifiNetwork: PropTypes.string,
  computersAvailable: PropTypes.bool,
  services: PropTypes.array, // todo: array of what?
  openToPublic: PropTypes.bool,
  hardToCountPopulation: PropTypes.array, // todo: array of what?
  sensitive: PropTypes.bool,
  dateEntered: PropTypes.string,
  lastUpdated: PropTypes.string,
  dataSource: PropTypes.object, // todo: what is it's shape
};

const resourceShape = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  description: PropTypes.string,
  website: PropTypes.string,
  phoneNumber: PropTypes.string,
  email: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.shape(categoryShape)),
  populationsServed: PropTypes.arrayOf(PropTypes.shape(populationShape)),
  assets: PropTypes.arrayOf(PropTypes.shape(assetShape)),
  locations: PropTypes.shape(locationsShape),
  virtualOnly: PropTypes.bool,
  recurrence: PropTypes.string,
  allDay: PropTypes.bool,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

const neighborhoodShape = {
  type: PropTypes.oneOf(['Feature']).isRequired,
  geometry: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(GeoJSONTypes)),
    coordinates: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    ]),
  }),
  properties: PropTypes.shape({
    name: PropTypes.string,
  }),
};

const neighborhoodsShape = {
  type: PropTypes.oneOf(['FeatureCollection']).isRequired,
  features: PropTypes.arrayOf(PropTypes.shape(neighborhoodShape)),
};

const communityShape = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  neighborhoods: PropTypes.shape(neighborhoodsShape),
  resources: PropTypes.arrayOf(PropTypes.shape(resourceShape)),
  resourceCategories: PropTypes.arrayOf(PropTypes.shape(categoryShape)),
  topSectionContent: PropTypes.string,
  alertContent: PropTypes.string,
};

export const localPropTypes = {
  resource: PropTypes.shape(resourceShape),
  community: PropTypes.shape(communityShape),
  category: PropTypes.shape(categoryShape),
  population: PropTypes.shape(populationShape),
  locations: PropTypes.shape(locationsShape),
};

/**
 * Returns an anchor element with `href` set as href which parses said href.
 * Makes it easy to  access parts of the url.
 * @param {string} href
 * @returns {HTMLAnchorElement}
 */
export function parseHref(href) {
  const parser = document.createElement('a');
  parser.href = href;
  return parser;
}

/**
 * Filters a list of resources based on a target category.
 *
 * Only resources that have the target category as one of their categories
 * @param resources
 * @param category
 * @returns {*}
 */
export function filterResourcesByCategory(resources, category) {
  return resources.filter(r =>
    r.categories.reduce(
      (inCategorySoFar, currentCategory) =>
        inCategorySoFar || currentCategory.slug === category.slug,
      false,
    ),
  );
}
