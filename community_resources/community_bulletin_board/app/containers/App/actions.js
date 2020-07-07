/*
 *
 * Global actions
 *
 */

import {
  GET_COMMUNITY_DATA_REQUEST,
  GET_COMMUNITY_DATA_SUCCESS,
  GET_COMMUNITY_DATA_FAILURE,
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
