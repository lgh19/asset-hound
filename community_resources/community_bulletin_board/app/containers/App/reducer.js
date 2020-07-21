/*
 *
 * Global reducer
 *
 */
import produce from 'immer';
import {
  GET_COMMUNITY_DATA_FAILURE,
  GET_COMMUNITY_DATA_REQUEST,
  GET_COMMUNITY_DATA_SUCCESS,
} from './constants';

export const initialState = {
  community: undefined,
};

/* eslint-disable default-case, no-param-reassign */
const globalReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_COMMUNITY_DATA_REQUEST:
        draft.IsLoading = true;
        break;
      case GET_COMMUNITY_DATA_SUCCESS:
        draft.IsLoading = false;
        draft.community = action.payload.data;
        break;
      case GET_COMMUNITY_DATA_FAILURE:
        draft.IsLoading = false;
    }
  });

export default globalReducer;
