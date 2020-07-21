import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the explorer state domain
 */

const selectExplorerDomain = state => state.explorer || initialState;

/**
 * Other specific selectors
 */

const makeSelectSelectedResource = () =>
  createSelector(
    selectExplorerDomain,
    substate => substate.selectedResource,
  );

const makeSelectCategoryFilter = () =>
  createSelector(
    selectExplorerDomain,
    substate => substate.categoryFilter,
  );

const makeSelectPopupData = () =>
  createSelector(
    selectExplorerDomain,
    substate => substate.popupData,
  );

const makeSelectInSmallMode = () =>
  createSelector(
    selectExplorerDomain,
    substate => substate.inSmallMode,
  );

/**
 * Default selector used by Explorer
 */

const makeSelectExplorer = () =>
  createSelector(
    selectExplorerDomain,
    substate => substate,
  );

export default makeSelectExplorer;
export {
  selectExplorerDomain,
  makeSelectSelectedResource,
  makeSelectCategoryFilter,
  makeSelectPopupData,
  makeSelectInSmallMode,
};
