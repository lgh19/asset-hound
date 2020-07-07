/*
 *
 * Explorer actions
 *
 */

import { SET_SELECTED_RESOURCE } from './constants';

export function setSelectedResource(resource) {
  return {
    type: SET_SELECTED_RESOURCE,
    payload: { resource },
  };
}
