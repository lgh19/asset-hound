import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the bulletinBoard state domain
 */

const selectBulletinBoardDomain = state => state.bulletinBoard || initialState;

/**
 * Other specific selectors
 */
const makeSelectBulletinBoardCommunity = () =>
  createSelector(
    selectBulletinBoardDomain,
    substate => substate.community,
  );

/**
 * Default selector used by BulletinBoard
 */

// const makeSelectBulletinBoard = () =>
//   createSelector(
//     selectBulletinBoardDomain,
//     substate => substate,
//   );
//
// export default makeSelectBulletinBoard;
export { makeSelectBulletinBoardCommunity };
