/*
 * Map Utils
 *
 * Utility functions for use within the Map component
 *
 */

import { MAPS_API_ENDPOINT } from './settings';

export function cartoInstantiationParams(id, sql) {
  return {
    layers: [
      {
        id,
        options: {
          sql,
        },
      },
    ],
  };
}

export function extractCartoTileUrls(data) {
  return data.metadata.tilejson.vector.tiles;
}

/**
 * Fetches vector server CDN information and returns a `Promise` that resolves with a Mapbox source object.
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
 *
 * @param {string} id -
 * @param sql
 * @param type
 * @param minzoom
 * @param maxzoom
 * @returns {Promise<Object>}
 */
export function fetchCartoVectorSource(
  id,
  sql,
  type = 'vector',
  minzoom = 0,
  maxzoom = 22,
) {
  const config = encodeURIComponent(
    JSON.stringify(cartoInstantiationParams(id, sql)),
  );
  return new Promise((resolve, reject) => {
    fetch(`${MAPS_API_ENDPOINT}?config=${config}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json(), error => reject(error))
      .then(
        data => {
          resolve({
            id,
            type,
            tiles: extractCartoTileUrls(data),
            minzoom,
            maxzoom,
          });
        },
        error => reject(error),
      );
  });
}

export function extractFeatureFromEvent(event) {
  if (event && event.features && event.features.length) {
    return event.features[0];
  }
  return undefined;
}

/**
 * settings.js
 *
 * This is for defining settings that will apply across varying layers.
 * This primarily reserved for metadata, api, filtering concerns..
 *
 * */

const LSAD = {
  25: 'city',
  37: 'municipality',
  21: 'borough',
  44: 'township',
};

const geoLevelFromLSAD = `
CASE
    WHEN lsad = '25' THEN 'city'
    WHEN lsad = '37' THEN 'municipality'
    WHEN lsad = '21' THEN 'borough'
    WHEN lsad = '44' THEN 'township'
    ELSE 'whoops'
END`;

/*
 *
 * Geographic Extent
 *
 * These settings are used to filter which specific regions are displayed
 * from the full, state-wide geographic data source.
 * The default is only for regions within the following counties:
 */
export const censusFpsInExtent = [
  '003', // Allegheny county
  '019',
  '128',
  '007',
  '005',
  '063',
  '129',
  '051',
  '059',
  '125',
  '073',
]; // wrap them in quotes for easy use in sql queries

function objectToSqlConcat(fieldFromLevel) {
  const len = Object.keys(fieldFromLevel).length;
  const result = `${Object.keys(fieldFromLevel).reduce(
    (resultTillNow, level, i) =>
      `${resultTillNow} '${level}:' || ${fieldFromLevel[level]} ${
        i === len - 1 ? '' : "|| ' ' || "
      }`,
    '',
  )}`;
  return result;
}

// for right now, we'll use sql, but if this get's more complex, we'll need a different solution
// this get's put in the SQL queries sent to carto for menuLayers geograhries
export const censusFilter = `countyfp IN (${censusFpsInExtent
  .map(fp => `'${fp}'`)
  .join(',')})`;

/**
 * This little feller generates a chunk of SQL that will generate the required fields for
 * this app based on table information.
 *
 * @param geoLevel
 * @param idField
 * @param forFields
 * @param lsadLookup
 * @returns {string}
 */
export const apiGeoParams = (
  geoLevel,
  idField,
  forFields,
  lsadLookup = false,
) => {
  const geoLevelChunk = lsadLookup ? geoLevelFromLSAD : '';

  const apiFor = lsadLookup
    ? `(${geoLevelChunk} || ':' || ${idField})`
    : `('${geoLevel}' || ':' || ${idField})`;

  const apiIn = `(${objectToSqlConcat(forFields)})`;

  const result = ` ${apiFor} AS __api_for, ${apiIn} AS __api_in`.replace(
    /[\n\r]/g,
    '',
  );

  return result;
};
