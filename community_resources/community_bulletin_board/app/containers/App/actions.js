/*
 *
 * Global actions
 *
 */

import {
  GET_COMMUNITY_DATA_REQUEST,
  GET_COMMUNITY_DATA_SUCCESS,
  GET_COMMUNITY_DATA_FAILURE,
  SEARCH_RESOURCE_REQUEST,
  SEARCH_RESOURCE_SUCCESS,
  SEARCH_RESOURCE_FAILURE,
} from './constants';

export function getCommunityDataRequest(communityId) {
  return {
    type: GET_COMMUNITY_DATA_REQUEST,
    payload: { communityId },
  };
}

export function getCommunityDataSuccess(data) {
  return {
    type: GET_COMMUNITY_DATA_SUCCESS,
    payload: { data },
  };
}

export function getCommunityDataFailure(errorMsg) {
  return {
    type: GET_COMMUNITY_DATA_FAILURE,
    payload: { errorMsg },
  };
}

export function searchResourceRequest(text) {
  console.log('A', text)
  return {
    type: SEARCH_RESOURCE_REQUEST,
    payload: { text },
  };
}

export function searchResourceSuccess(data) {
  return {
    type: SEARCH_RESOURCE_SUCCESS,
    payload: { data },
  };
}

export function searchResourceFailure(errorMsg) {
  return {
    type: SEARCH_RESOURCE_FAILURE,
    payload: { errorMsg },
  };
}
