/*
 * Map Settings
 *
 * Constants and other short expressions for use as settings.
 *
 */

/* Carto Settings */
export const CARTO_USER = 'wprdc';
export const MAPS_API_ENDPOINT = `https://${CARTO_USER}.carto.com/api/v1/map`;

/**
 * Enum of available basemaps.
 *
 * The value of each member is it's mapbox URL that can be passed to the `mapStyle` prop of a react-map-gl `StaticMap`
 *
 * @readonly
 * @type {{STREETS: string, LIGHT: string, DARK: string}}
 */
export const Basemaps = {
  DARK: 'mapbox://styles/mapbox/dark-v10',
  LIGHT: 'mapbox://styles/mapbox/light-v10',
  STREETS: 'mapbox://styles/mapbox/streets-v11',
};

/**
 * Default viewport settings.
 *
 * Each property of this object corresponds to  viewport-related prop of a react-map-gl `StaticMap
 * @type {{latitude: number, width: string, zoom: number, height: string, longitude: number}}
 */
export const DEFAULT_VIEWPORT = {
  width: '100%',
  height: '100%',
  latitude: 40.44653762202283,
  longitude: -79.97769139287226,
  zoom: 13.24866190262866,
};
