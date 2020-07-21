/*
 *
 * Explorer actions
 *
 */

import { SET_RESOURCE_FILTER, SET_SELECTED_RESOURCE } from './constants';

export function setSelectedResource(resource, popupData, inSmallMode) {
  return {
    type: SET_SELECTED_RESOURCE,
    payload: { resource, popupData, inSmallMode },
  };
}

export function setResourceFilter(filter) {
  return {
    type: SET_RESOURCE_FILTER,
    payload: { filter },
  };
}
