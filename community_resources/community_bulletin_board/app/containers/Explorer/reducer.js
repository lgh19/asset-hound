/*
 *
 * Explorer reducer
 *
 */
import produce from 'immer';
import { SET_RESOURCE_FILTER, SET_SELECTED_RESOURCE } from './constants';

export const initialState = {
  selectedResource: undefined,
  categoryFilter: undefined,
  popupData: undefined,
  inSmallMode: undefined,
};

/* eslint-disable default-case, no-param-reassign */
const explorerReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_SELECTED_RESOURCE:
        draft.selectedResource = action.payload.resource;
        draft.popupData = action.payload.popupData;
        draft.inSmallMode = action.payload.inSmallMode;
        break;
      case SET_RESOURCE_FILTER:
        draft.categoryFilter = action.payload.filter;
        break;
    }
  });

export default explorerReducer;
